#!/usr/bin/env node
/**
 * Add YAML Front-Matter to Mibera Files
 *
 * This script parses existing mibera markdown files and adds structured
 * YAML front-matter for better automation, validation, and search.
 *
 * Usage:
 *   node scripts/add-frontmatter.js                    # Process all miberas
 *   node scripts/add-frontmatter.js --dry-run          # Preview changes without writing
 *   node scripts/add-frontmatter.js --file 0001.md     # Process single file
 */

const fs = require('fs');
const path = require('path');

const MIBERAS_DIR = path.join(__dirname, '..', 'miberas');

// Extract trait value and link from table row
function parseTraitRow(row) {
  // Match: | Trait Name | [Value](link) | or | Trait Name | Value |
  const linkMatch = row.match(/\|\s*([^|]+)\s*\|\s*\[([^\]]+)\]\(([^)]+)\)\s*\|/);
  if (linkMatch) {
    return {
      trait: linkMatch[1].trim(),
      value: linkMatch[2].trim(),
      link: linkMatch[3].trim()
    };
  }

  // Plain value (no link)
  const plainMatch = row.match(/\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/);
  if (plainMatch) {
    return {
      trait: plainMatch[1].trim(),
      value: plainMatch[2].trim(),
      link: null
    };
  }

  return null;
}

// Extract anchor from link (e.g., "../overlays/astrology.md#cancer" -> "cancer")
function extractAnchor(link) {
  if (!link) return null;
  const match = link.match(/#([^#]+)$/);
  return match ? match[1] : null;
}

// Parse a mibera markdown file and extract trait data
function parseMiberaFile(content) {
  const lines = content.split('\n');
  const traits = {};

  let inTraitsTable = false;

  for (const line of lines) {
    // Detect traits table start
    if (line.includes('| Trait | Value |')) {
      inTraitsTable = true;
      continue;
    }

    // Skip table header separator
    if (inTraitsTable && line.match(/^\|[-\s|]+\|$/)) {
      continue;
    }

    // End of table
    if (inTraitsTable && !line.startsWith('|')) {
      break;
    }

    if (inTraitsTable) {
      const parsed = parseTraitRow(line);
      if (parsed && parsed.trait !== 'Trait') {
        const key = parsed.trait.toLowerCase().replace(/\s+/g, '_');
        traits[key] = {
          value: parsed.value,
          link: parsed.link
        };
      }
    }
  }

  return traits;
}

// Convert traits to YAML front-matter
function generateFrontMatter(miberaNumber, traits) {
  const yaml = ['---'];

  // Basic info
  yaml.push(`id: ${miberaNumber}`);
  yaml.push(`type: mibera`);

  // Core traits
  if (traits.archetype) yaml.push(`archetype: "${traits.archetype.value}"`);
  if (traits.ancestor) yaml.push(`ancestor: "${traits.ancestor.value}"`);
  if (traits.time_period) yaml.push(`time_period: "${traits.time_period.value}"`);

  // Birthday
  if (traits.birthday) yaml.push(`birthday: "${traits.birthday.value}"`);
  if (traits.birth_coordinates) yaml.push(`birth_coordinates: "${traits.birth_coordinates.value}"`);

  // Astrology
  yaml.push(`astrology:`);
  if (traits.sun_sign) yaml.push(`  sun: "${traits.sun_sign.value}"`);
  if (traits.moon_sign) yaml.push(`  moon: "${traits.moon_sign.value}"`);
  if (traits.ascending_sign) yaml.push(`  rising: "${traits.ascending_sign.value}"`);

  // Element and ranking
  if (traits.element) yaml.push(`element: "${traits.element.value}"`);
  if (traits.swag_rank) yaml.push(`swag_rank: "${traits.swag_rank.value}"`);
  if (traits.swag_score) yaml.push(`swag_score: ${traits.swag_score.value}`);

  // Visual traits
  yaml.push(`appearance:`);
  if (traits.background) yaml.push(`  background: "${traits.background.value}"`);
  if (traits.body) yaml.push(`  body: "${traits.body.value}"`);
  if (traits.hair) yaml.push(`  hair: "${traits.hair.value}"`);
  if (traits.eyes) yaml.push(`  eyes: "${traits.eyes.value}"`);
  if (traits.eyebrows) yaml.push(`  eyebrows: "${traits.eyebrows.value}"`);
  if (traits.mouth) yaml.push(`  mouth: "${traits.mouth.value}"`);
  if (traits.tattoo && traits.tattoo.value !== 'None') yaml.push(`  tattoo: "${traits.tattoo.value}"`);

  // Clothing
  if (traits.shirt && traits.shirt.value !== 'None') yaml.push(`shirt: "${traits.shirt.value}"`);

  // Accessories
  const accessories = [];
  if (traits.hat && traits.hat.value !== 'None') accessories.push(`hat: "${traits.hat.value}"`);
  if (traits.glasses && traits.glasses.value !== 'None') accessories.push(`glasses: "${traits.glasses.value}"`);
  if (traits.mask && traits.mask.value !== 'None') accessories.push(`mask: "${traits.mask.value}"`);
  if (traits.earrings && traits.earrings.value !== 'None') accessories.push(`earrings: "${traits.earrings.value}"`);
  if (traits.face_accessory && traits.face_accessory.value !== 'None') accessories.push(`face: "${traits.face_accessory.value}"`);

  if (accessories.length > 0) {
    yaml.push(`accessories:`);
    accessories.forEach(a => yaml.push(`  ${a}`));
  }

  // Item and drug
  if (traits.item && traits.item.value !== 'None') yaml.push(`item: "${traits.item.value}"`);
  if (traits.drug) yaml.push(`drug: "${traits.drug.value}"`);

  yaml.push('---');
  yaml.push('');

  return yaml.join('\n');
}

// Check if file already has front-matter
function hasFrontMatter(content) {
  return content.trimStart().startsWith('---');
}

// Process a single mibera file
function processMiberaFile(filePath, dryRun = false) {
  const content = fs.readFileSync(filePath, 'utf8');

  // Skip if already has front-matter
  if (hasFrontMatter(content)) {
    return { status: 'skipped', reason: 'already has front-matter' };
  }

  // Extract mibera number from filename
  const filename = path.basename(filePath, '.md');
  const miberaNumber = parseInt(filename, 10);

  if (isNaN(miberaNumber)) {
    return { status: 'skipped', reason: 'invalid filename' };
  }

  // Parse traits
  const traits = parseMiberaFile(content);

  if (Object.keys(traits).length === 0) {
    return { status: 'skipped', reason: 'no traits found' };
  }

  // Generate front-matter
  const frontMatter = generateFrontMatter(miberaNumber, traits);
  const newContent = frontMatter + content;

  if (!dryRun) {
    fs.writeFileSync(filePath, newContent, 'utf8');
  }

  return {
    status: 'processed',
    traits: Object.keys(traits).length,
    frontMatter: frontMatter
  };
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const singleFileIndex = args.indexOf('--file');
  const singleFile = singleFileIndex !== -1 ? args[singleFileIndex + 1] : null;

  console.log('Mibera Front-Matter Generator');
  console.log('=============================');
  if (dryRun) console.log('Mode: DRY RUN (no files will be modified)\n');

  let files;
  if (singleFile) {
    files = [path.join(MIBERAS_DIR, singleFile)];
  } else {
    files = fs.readdirSync(MIBERAS_DIR)
      .filter(f => f.match(/^\d{4}\.md$/))
      .sort()
      .map(f => path.join(MIBERAS_DIR, f));
  }

  let processed = 0;
  let skipped = 0;
  let errors = 0;

  for (const filePath of files) {
    try {
      const result = processMiberaFile(filePath, dryRun);
      const filename = path.basename(filePath);

      if (result.status === 'processed') {
        processed++;
        if (singleFile || dryRun) {
          console.log(`\n${filename}:`);
          console.log(result.frontMatter);
        } else if (processed % 500 === 0) {
          console.log(`Processed ${processed} files...`);
        }
      } else {
        skipped++;
        if (singleFile) {
          console.log(`${filename}: skipped (${result.reason})`);
        }
      }
    } catch (err) {
      errors++;
      console.error(`Error processing ${path.basename(filePath)}: ${err.message}`);
    }
  }

  console.log('\n=============================');
  console.log(`Total: ${files.length} files`);
  console.log(`Processed: ${processed}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Errors: ${errors}`);

  if (dryRun) {
    console.log('\nThis was a dry run. Run without --dry-run to apply changes.');
  }
}

main();
