#!/usr/bin/env node
/**
 * Link Validation Script for Mibera Codex
 *
 * Scans all markdown files and validates:
 * - Relative file links exist
 * - Anchor targets (#heading) exist in target files
 * - Image files exist
 *
 * Usage:
 *   node scripts/validate-links.js                  # Validate all files
 *   node scripts/validate-links.js --verbose        # Show all links checked
 *   node scripts/validate-links.js --dir miberas    # Validate specific directory
 *   node scripts/validate-links.js --fix            # Suggest fixes for common issues
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');

// Configuration
const EXCLUDED_DIRS = ['.git', 'node_modules', 'scripts'];
const MARKDOWN_EXTENSIONS = ['.md', '.markdown'];

// Statistics
const stats = {
  filesScanned: 0,
  linksChecked: 0,
  brokenLinks: [],
  brokenAnchors: [],
  missingImages: [],
  validLinks: 0
};

// Cache for parsed files (to avoid re-reading for anchor validation)
const fileCache = new Map();
const anchorCache = new Map();

// Get all markdown files recursively
function getMarkdownFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.includes(entry.name)) {
        getMarkdownFiles(fullPath, files);
      }
    } else if (MARKDOWN_EXTENSIONS.includes(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files;
}

// Extract all links from markdown content
function extractLinks(content) {
  const links = [];

  // Standard markdown links: [text](url)
  const linkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    links.push({
      text: match[1],
      url: match[2],
      type: 'link'
    });
  }

  // Image references: ![alt](url)
  const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;

  while ((match = imgRegex.exec(content)) !== null) {
    links.push({
      text: match[1],
      url: match[2],
      type: 'image'
    });
  }

  return links;
}

// Get file content with caching
function getFileContent(filePath) {
  if (fileCache.has(filePath)) {
    return fileCache.get(filePath);
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    fileCache.set(filePath, content);
    return content;
  } catch {
    return null;
  }
}

// Extract anchors (headings) from markdown content
function extractAnchors(content) {
  const anchors = new Set();

  // Match markdown headings: # Heading, ## Heading, etc.
  const headingRegex = /^#{1,6}\s+(.+)$/gm;
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    // Convert heading to anchor format (lowercase, spaces to hyphens, remove special chars)
    const anchor = match[1]
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    anchors.add(anchor);

    // Also add original with common variations
    const altAnchor = match[1]
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/['"]/g, '');

    anchors.add(altAnchor);
  }

  return anchors;
}

// Get anchors for a file with caching
function getFileAnchors(filePath) {
  if (anchorCache.has(filePath)) {
    return anchorCache.get(filePath);
  }

  const content = getFileContent(filePath);
  if (!content) {
    anchorCache.set(filePath, new Set());
    return new Set();
  }

  const anchors = extractAnchors(content);
  anchorCache.set(filePath, anchors);
  return anchors;
}

// Validate a single link
function validateLink(link, sourceFile, verbose) {
  stats.linksChecked++;

  const url = link.url;

  // Skip external links
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:')) {
    if (verbose) console.log(`  [EXTERNAL] ${url}`);
    stats.validLinks++;
    return;
  }

  // Parse URL and anchor
  const [filePart, anchor] = url.split('#');
  const sourceDir = path.dirname(sourceFile);

  // Handle anchor-only links (same file)
  if (!filePart && anchor) {
    const anchors = getFileAnchors(sourceFile);
    if (!anchors.has(anchor)) {
      stats.brokenAnchors.push({
        source: sourceFile,
        anchor: anchor,
        text: link.text
      });
      if (verbose) console.log(`  [BROKEN ANCHOR] #${anchor}`);
    } else {
      stats.validLinks++;
      if (verbose) console.log(`  [OK] #${anchor}`);
    }
    return;
  }

  // Resolve relative path
  const targetPath = path.resolve(sourceDir, decodeURIComponent(filePart));

  // Check if file exists
  if (!fs.existsSync(targetPath)) {
    if (link.type === 'image') {
      stats.missingImages.push({
        source: sourceFile,
        target: filePart,
        text: link.text
      });
      if (verbose) console.log(`  [MISSING IMAGE] ${filePart}`);
    } else {
      stats.brokenLinks.push({
        source: sourceFile,
        target: filePart,
        text: link.text
      });
      if (verbose) console.log(`  [BROKEN] ${filePart}`);
    }
    return;
  }

  // If there's an anchor, validate it
  if (anchor) {
    const anchors = getFileAnchors(targetPath);
    if (!anchors.has(anchor)) {
      stats.brokenAnchors.push({
        source: sourceFile,
        target: filePart,
        anchor: anchor,
        text: link.text
      });
      if (verbose) console.log(`  [BROKEN ANCHOR] ${filePart}#${anchor}`);
      return;
    }
  }

  stats.validLinks++;
  if (verbose) console.log(`  [OK] ${url}`);
}

// Validate all links in a file
function validateFile(filePath, verbose) {
  stats.filesScanned++;

  const content = getFileContent(filePath);
  if (!content) {
    console.error(`Could not read: ${filePath}`);
    return;
  }

  const links = extractLinks(content);

  if (verbose && links.length > 0) {
    console.log(`\n${path.relative(ROOT_DIR, filePath)} (${links.length} links)`);
  }

  for (const link of links) {
    validateLink(link, filePath, verbose);
  }
}

// Format relative path for display
function relativePath(filePath) {
  return path.relative(ROOT_DIR, filePath);
}

// Print results
function printResults(showFix) {
  console.log('\n========================================');
  console.log('LINK VALIDATION RESULTS');
  console.log('========================================\n');

  console.log(`Files scanned:    ${stats.filesScanned}`);
  console.log(`Links checked:    ${stats.linksChecked}`);
  console.log(`Valid links:      ${stats.validLinks}`);
  console.log(`Broken links:     ${stats.brokenLinks.length}`);
  console.log(`Broken anchors:   ${stats.brokenAnchors.length}`);
  console.log(`Missing images:   ${stats.missingImages.length}`);

  if (stats.brokenLinks.length > 0) {
    console.log('\n----------------------------------------');
    console.log('BROKEN LINKS');
    console.log('----------------------------------------');

    // Group by source file
    const bySource = {};
    for (const item of stats.brokenLinks) {
      const src = relativePath(item.source);
      if (!bySource[src]) bySource[src] = [];
      bySource[src].push(item);
    }

    for (const [src, items] of Object.entries(bySource)) {
      console.log(`\n${src}:`);
      for (const item of items) {
        console.log(`  → ${item.target}`);
        if (item.text) console.log(`    text: "${item.text}"`);
      }
    }
  }

  if (stats.brokenAnchors.length > 0) {
    console.log('\n----------------------------------------');
    console.log('BROKEN ANCHORS');
    console.log('----------------------------------------');

    // Group by source file
    const bySource = {};
    for (const item of stats.brokenAnchors) {
      const src = relativePath(item.source);
      if (!bySource[src]) bySource[src] = [];
      bySource[src].push(item);
    }

    // Limit output for large results
    const entries = Object.entries(bySource);
    const displayLimit = 50;

    if (entries.length > displayLimit) {
      console.log(`\nShowing first ${displayLimit} of ${entries.length} files with broken anchors...\n`);
    }

    for (const [src, items] of entries.slice(0, displayLimit)) {
      console.log(`\n${src}:`);
      for (const item of items.slice(0, 5)) {
        const target = item.target ? `${item.target}#${item.anchor}` : `#${item.anchor}`;
        console.log(`  → ${target}`);
      }
      if (items.length > 5) {
        console.log(`  ... and ${items.length - 5} more`);
      }
    }

    if (entries.length > displayLimit) {
      console.log(`\n... and ${entries.length - displayLimit} more files with broken anchors`);
    }
  }

  if (stats.missingImages.length > 0) {
    console.log('\n----------------------------------------');
    console.log('MISSING IMAGES');
    console.log('----------------------------------------');

    // Group by source file
    const bySource = {};
    for (const item of stats.missingImages) {
      const src = relativePath(item.source);
      if (!bySource[src]) bySource[src] = [];
      bySource[src].push(item);
    }

    // Limit output
    const entries = Object.entries(bySource);
    const displayLimit = 20;

    if (entries.length > displayLimit) {
      console.log(`\nShowing first ${displayLimit} of ${entries.length} files with missing images...\n`);
    }

    for (const [src, items] of entries.slice(0, displayLimit)) {
      console.log(`\n${src}:`);
      for (const item of items.slice(0, 3)) {
        console.log(`  → ${item.target}`);
      }
      if (items.length > 3) {
        console.log(`  ... and ${items.length - 3} more`);
      }
    }
  }

  // Summary
  const totalIssues = stats.brokenLinks.length + stats.brokenAnchors.length + stats.missingImages.length;

  console.log('\n========================================');
  if (totalIssues === 0) {
    console.log('✓ All links are valid!');
  } else {
    console.log(`✗ Found ${totalIssues} issue(s) to fix`);
  }
  console.log('========================================\n');

  // Export to JSON for further processing
  if (totalIssues > 0) {
    const reportPath = path.join(__dirname, 'link-validation-report.json');
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        filesScanned: stats.filesScanned,
        linksChecked: stats.linksChecked,
        validLinks: stats.validLinks,
        brokenLinks: stats.brokenLinks.length,
        brokenAnchors: stats.brokenAnchors.length,
        missingImages: stats.missingImages.length
      },
      brokenLinks: stats.brokenLinks.map(l => ({
        source: relativePath(l.source),
        target: l.target,
        text: l.text
      })),
      brokenAnchors: stats.brokenAnchors.map(a => ({
        source: relativePath(a.source),
        target: a.target,
        anchor: a.anchor,
        text: a.text
      })),
      missingImages: stats.missingImages.map(i => ({
        source: relativePath(i.source),
        target: i.target,
        text: i.text
      }))
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`Detailed report saved to: scripts/link-validation-report.json\n`);
  }
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const verbose = args.includes('--verbose') || args.includes('-v');
  const showFix = args.includes('--fix');
  const dirIndex = args.indexOf('--dir');
  const targetDir = dirIndex !== -1 ? args[dirIndex + 1] : null;

  console.log('Mibera Codex Link Validator');
  console.log('===========================\n');

  const searchDir = targetDir ? path.join(ROOT_DIR, targetDir) : ROOT_DIR;

  if (!fs.existsSync(searchDir)) {
    console.error(`Directory not found: ${searchDir}`);
    process.exit(1);
  }

  console.log(`Scanning: ${path.relative(ROOT_DIR, searchDir) || '.'}`);
  if (verbose) console.log('Verbose mode enabled\n');

  const files = getMarkdownFiles(searchDir);
  console.log(`Found ${files.length} markdown files\n`);

  if (files.length === 0) {
    console.log('No markdown files found.');
    return;
  }

  // Progress indicator for large scans
  let lastProgress = 0;
  for (let i = 0; i < files.length; i++) {
    validateFile(files[i], verbose);

    const progress = Math.floor((i / files.length) * 100);
    if (!verbose && progress >= lastProgress + 10) {
      process.stdout.write(`\rProgress: ${progress}%`);
      lastProgress = progress;
    }
  }

  if (!verbose) {
    process.stdout.write('\rProgress: 100%\n');
  }

  printResults(showFix);
}

main();
