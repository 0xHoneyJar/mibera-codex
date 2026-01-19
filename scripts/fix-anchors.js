#!/usr/bin/env node
/**
 * Fix Broken Anchors in Mibera Codex
 *
 * This script fixes anchor mismatches by:
 * 1. Fixing typos in target file headings
 * 2. Updating incorrect anchor references in mibera files
 *
 * Usage:
 *   node scripts/fix-anchors.js --dry-run    # Preview changes
 *   node scripts/fix-anchors.js              # Apply fixes
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const MIBERAS_DIR = path.join(ROOT_DIR, 'miberas');

// ============================================
// HEADING FIXES (typos in target files)
// ============================================
const HEADING_FIXES = {
  'drugs/modern-drugs.md': {
    '## Tobacoo': '## Tobacco',
    '## Kwoa Krua': '## Kwao Krua',
    '## Psychotaria Viridis': '## Psychotria Viridis'
  },
  'accessories/hats.md': {
    '## Midsommmar': '## Midsommar',
    '## Bear Headband': '## Bera Headband',
    '## Straw Farmer': '## Straw Farmers'
  },
  'backgrounds/backgrounds.md': {
    '## Road Side': '## Roadside',
    '## Simple Backgrounds': '## Simple Background'
  },
  'core-lore/ancestors.md': {
    '## Rastafarian': '## Rastafarians'
  }
};

// ============================================
// LINK FIXES (incorrect anchors in miberas)
// ============================================
const LINK_FIXES = {
  // Archetypes - the heading "Chicago Detroit" becomes "chicago-detroit"
  // but miberas link to "chicagodetroit"
  '../core-lore/archetypes.md#chicagodetroit': '../core-lore/archetypes.md#chicago-detroit',

  // Backgrounds - after heading fixes, these will work
  '../backgrounds/backgrounds.md#peyote-desert': '../backgrounds/backgrounds.md#peyote',
};

// ============================================
// REGEX-BASED LINK FIXES (for patterns)
// ============================================
const REGEX_LINK_FIXES = [
  // Bong Bears should link to bong-bears.md, not general-items.md
  {
    pattern: /\(\.\.\/items\/general-items\.md#(bong-bear-\d+)\)/g,
    replacement: '(../items/bong-bears.md#$1)'
  },
  // Bearmo, Beartull, Bearyphus also in bong-bears.md
  {
    pattern: /\(\.\.\/items\/general-items\.md#(bearmo|beartull|bearyphus)\)/g,
    replacement: '(../items/bong-bears.md#$1)'
  }
];

// ============================================
// APPLY HEADING FIXES
// ============================================
function applyHeadingFixes(dryRun) {
  console.log('\n=== HEADING FIXES ===\n');
  let totalFixed = 0;

  for (const [relPath, fixes] of Object.entries(HEADING_FIXES)) {
    const filePath = path.join(ROOT_DIR, relPath);

    if (!fs.existsSync(filePath)) {
      console.log(`  [SKIP] ${relPath} - file not found`);
      continue;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let fileFixed = 0;

    for (const [oldHeading, newHeading] of Object.entries(fixes)) {
      if (content.includes(oldHeading)) {
        content = content.replace(oldHeading, newHeading);
        console.log(`  [FIX] ${relPath}: "${oldHeading}" → "${newHeading}"`);
        fileFixed++;
        totalFixed++;
      } else {
        console.log(`  [SKIP] ${relPath}: "${oldHeading}" not found`);
      }
    }

    if (fileFixed > 0 && !dryRun) {
      fs.writeFileSync(filePath, content, 'utf8');
    }
  }

  console.log(`\nHeading fixes: ${totalFixed}`);
  return totalFixed;
}

// ============================================
// APPLY LINK FIXES IN MIBERA FILES
// ============================================
function applyLinkFixes(dryRun) {
  console.log('\n=== LINK FIXES ===\n');

  const files = fs.readdirSync(MIBERAS_DIR)
    .filter(f => f.match(/^\d{4}\.md$/))
    .map(f => path.join(MIBERAS_DIR, f));

  let totalFixed = 0;
  let regexFixed = 0;
  let filesModified = 0;

  for (const filePath of files) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Apply exact string replacements
    for (const [oldLink, newLink] of Object.entries(LINK_FIXES)) {
      if (content.includes(oldLink)) {
        content = content.split(oldLink).join(newLink);
        modified = true;
        totalFixed++;
      }
    }

    // Apply regex-based replacements
    for (const { pattern, replacement } of REGEX_LINK_FIXES) {
      const matches = content.match(pattern);
      if (matches) {
        content = content.replace(pattern, replacement);
        modified = true;
        regexFixed += matches.length;
      }
    }

    if (modified) {
      filesModified++;
      if (!dryRun) {
        fs.writeFileSync(filePath, content, 'utf8');
      }
    }
  }

  console.log(`  Fixed ${totalFixed} exact link occurrences`);
  console.log(`  Fixed ${regexFixed} pattern-based link occurrences`);
  console.log(`  Modified ${filesModified} files total`);
  return totalFixed + regexFixed;
}

// ============================================
// ADD MISSING ENTRIES TO TARGET FILES
// ============================================

// Template for missing entries
function createMissingEntry(name, type) {
  const templates = {
    drug: `
## ${name}

### Visual Properties

**Name:** ${name}

**Image Files:**

**Trait Category:**

**Visual Description:**

**Dominant Colors:**

---

### Cultural Context

**Source Type:**

**Cultural Origin:**

**Era:**

**Scene Association:**

**Geographic Roots:**

**Why This Matters:**

**Notable Figures:**

---

### Mibera Integration

**Archetype:**

**Archetype Alignment:**

**Vibe Tags:**

**Swag Score:**

---

### Connections

**Ancestor:**

**Trait Synergies:**

**Trait Conflicts:**

---

### Attribution & Sources

**Date Added:** Auto-generated

**Introduced By:**

**Team Notes:** Entry auto-generated to fix broken anchor

**Sources:**

**Summary:**

---
`,
    trait: `
## ${name}

### Visual Properties

**Name:** ${name}

**Image Files:**

**Trait Category:**

**Visual Description:**

**Dominant Colors:**

---

### Cultural Context

**Source Type:**

**Cultural Origin:**

**Era:**

**Scene Association:**

**Geographic Roots:**

**Why This Matters:**

**Notable Figures:**

---

### Mibera Integration

**Archetype:**

**Archetype Alignment:**

**Vibe Tags:**

**Swag Score:**

---

### Connections

**Ancestor:**

**Trait Synergies:**

**Trait Conflicts:**

---

### Attribution & Sources

**Date Added:** Auto-generated

**Introduced By:**

**Team Notes:** Entry auto-generated to fix broken anchor

**Sources:**

**Summary:**

---
`
  };

  return templates[type] || templates.trait;
}

// Missing entries that need to be added
const MISSING_ENTRIES = {
  'drugs/modern-drugs.md': [
    { name: 'Sakae Naa', type: 'drug' }
  ],
  'accessories/hats.md': [
    { name: 'Peyote Hat', type: 'trait' },
    { name: 'Workin Like A Dog', type: 'trait' },
    { name: 'Fruits Remilia Hat', type: 'trait' },
    { name: 'Trucker Oasis', type: 'trait' },
    { name: 'Dubai Hat', type: 'trait' }
  ],
  'accessories/glasses.md': [
    { name: 'Colorful', type: 'trait' }
  ],
  'accessories/face-accessories.md': [
    { name: 'Hearts', type: 'trait' },
    { name: 'Milady 5930 Crescent And Dots', type: 'trait' }
  ],
  'accessories/earrings.md': [
    { name: 'Bera Heart', type: 'trait' },
    { name: 'Blue Beads', type: 'trait' }
  ],
  'accessories/masks.md': [
    { name: 'Hiberanation Eye Mask', type: 'trait' },
    { name: 'Chulym Beekeeper Hat', type: 'trait' },
    { name: 'Singapore Jani 1', type: 'trait' },
    { name: 'Singapore Jani 2', type: 'trait' }
  ],
  'character-traits/eyes.md': [
    { name: 'Ecstasy Brown', type: 'trait' },
    { name: 'Crying Ocean', type: 'trait' }
  ],
  'character-traits/hair.md': [
    { name: 'Relaxed Blue', type: 'trait' },
    { name: 'Faye Blue', type: 'trait' },
    { name: 'Wavy Magenta', type: 'trait' },
    { name: 'Bowl Slate', type: 'trait' },
    { name: 'Og Blonde', type: 'trait' }
  ],
  'character-traits/eyebrows.md': [
    { name: 'Raised', type: 'trait' }
  ],
  'character-traits/mouth.md': [
    { name: 'Line', type: 'trait' }
  ],
  'character-traits/tattoos.md': [
    { name: 'Geez Love', type: 'trait' },
    { name: 'Triskele Hand', type: 'trait' },
    { name: 'Castle Neck', type: 'trait' }
  ],
  'clothing/short-sleeves.md': [
    { name: 'Criminal Records Vest', type: 'trait' },
    { name: 'Overalls', type: 'trait' },
    { name: 'Mother Shirt', type: 'trait' },
    { name: 'Babybera Jacket', type: 'trait' }
  ],
  'clothing/long-sleeves.md': [
    { name: '80s Chicago Jersey', type: 'trait' }
  ],
  'items/general-items.md': [
    { name: 'Blue Meanie', type: 'trait' },
    { name: 'Mad Scientists', type: 'trait' },
    { name: 'Band Bear 1', type: 'trait' },
    { name: 'Sakae Naa Plant', type: 'trait' },
    { name: 'Grateful Dead Tarot', type: 'trait' },
    { name: 'Weed Nug', type: 'trait' },
    // Cypherpunk figures
    { name: 'Adam Back', type: 'trait' },
    { name: 'David Chaum', type: 'trait' },
    { name: 'Hal Finney', type: 'trait' },
    { name: 'Julian Assange', type: 'trait' },
    { name: 'John Gilmore', type: 'trait' },
    { name: 'Nick Szabo', type: 'trait' },
    { name: 'Phil Zimmermann', type: 'trait' },
    { name: 'Satoshi Nakamoto', type: 'trait' },
    { name: 'Tim C May', type: 'trait' },
    { name: 'Wei Dai', type: 'trait' },
    // Other items
    { name: 'Zeus', type: 'trait' },
    { name: 'Icebeargy', type: 'trait' },
    { name: 'Dcf', type: 'trait' }
  ]
};

function addMissingEntries(dryRun) {
  console.log('\n=== ADDING MISSING ENTRIES ===\n');
  let totalAdded = 0;

  for (const [relPath, entries] of Object.entries(MISSING_ENTRIES)) {
    const filePath = path.join(ROOT_DIR, relPath);

    if (!fs.existsSync(filePath)) {
      console.log(`  [SKIP] ${relPath} - file not found`);
      continue;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let fileAdded = 0;

    for (const entry of entries) {
      // Check if entry already exists (case-insensitive)
      const headingRegex = new RegExp(`^## ${entry.name}$`, 'mi');
      if (headingRegex.test(content)) {
        console.log(`  [EXISTS] ${relPath}: "${entry.name}"`);
        continue;
      }

      // Add entry at the end
      const newEntry = createMissingEntry(entry.name, entry.type);
      content = content.trimEnd() + '\n' + newEntry;
      console.log(`  [ADD] ${relPath}: "${entry.name}"`);
      fileAdded++;
      totalAdded++;
    }

    if (fileAdded > 0 && !dryRun) {
      fs.writeFileSync(filePath, content, 'utf8');
    }
  }

  console.log(`\nEntries added: ${totalAdded}`);
  return totalAdded;
}

// ============================================
// MAIN
// ============================================
function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  console.log('Mibera Codex Anchor Fixer');
  console.log('=========================');
  if (dryRun) console.log('Mode: DRY RUN (no files will be modified)');

  const headingsFix = applyHeadingFixes(dryRun);
  const linksFix = applyLinkFixes(dryRun);
  const entriesAdded = addMissingEntries(dryRun);

  console.log('\n=========================');
  console.log('SUMMARY');
  console.log('=========================');
  console.log(`Heading typos fixed: ${headingsFix}`);
  console.log(`Link references fixed: ${linksFix}`);
  console.log(`Missing entries added: ${entriesAdded}`);

  if (dryRun) {
    console.log('\nThis was a dry run. Run without --dry-run to apply changes.');
  } else {
    console.log('\nChanges applied. Run validate-links.js to verify fixes.');
  }
}

main();
