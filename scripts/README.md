# Mibera Codex Scripts

Utility scripts for maintaining and enhancing the Mibera Codex.

## Prerequisites

- Node.js 14+ installed

## Available Scripts

### Link Validation (`validate-links.js`)

Scans all markdown files and validates that relative links and anchors point to valid targets.

```bash
# Validate all markdown files
node scripts/validate-links.js

# Verbose output (shows every link checked)
node scripts/validate-links.js --verbose

# Validate specific directory only
node scripts/validate-links.js --dir miberas

# Validate specific directory
node scripts/validate-links.js --dir accessories
```

**What it checks:**
- Relative file links exist
- Anchor targets (`#heading`) exist in target files
- Image files referenced in markdown exist

**Output:**
- Console summary of issues found
- `scripts/link-validation-report.json` with full details for programmatic use

---

### Front-Matter Generator (`add-frontmatter.js`)

Adds structured YAML front-matter to mibera files, enabling automation, validation, and search capabilities.

```bash
# Preview changes without modifying files
node scripts/add-frontmatter.js --dry-run

# Process a single file (with preview)
node scripts/add-frontmatter.js --file 0001.md --dry-run

# Process all mibera files
node scripts/add-frontmatter.js
```

**Front-matter schema:**
```yaml
---
id: 1
type: mibera
archetype: "Freetekno"
ancestor: "Greek"
time_period: "Modern"
birthday: "07/21/1352 Ce 19:47"
birth_coordinates: "72.866033, -40.860343"
astrology:
  sun: "Cancer"
  moon: "Leo"
  rising: "Scorpio"
element: "Earth"
swag_rank: "B"
swag_score: 41
appearance:
  background: "Fyre Festival"
  body: "Umber"
  hair: "Afro"
  eyes: "Normal Grey"
  eyebrows: "Anxious Thick"
  mouth: "Cig"
shirt: "Htrk Night Faces"
accessories:
  glasses: "Red Sunglasses"
  face: "Fluoro Pink"
item: "Beads"
drug: "St. John'S Wort"
---
```

**Benefits of front-matter:**
- Enables JSON/API generation from markdown
- Supports automated validation
- Allows filtering and advanced search
- Compatible with static site generators (GitBook, Docusaurus, etc.)

---

## Recommended Workflow

1. **Before making changes:** Run link validation to establish baseline
   ```bash
   node scripts/validate-links.js
   ```

2. **After adding content:** Re-run validation to catch broken links
   ```bash
   node scripts/validate-links.js --dir [changed-directory]
   ```

3. **Adding front-matter:** Test on single file first
   ```bash
   node scripts/add-frontmatter.js --file 0001.md --dry-run
   ```
