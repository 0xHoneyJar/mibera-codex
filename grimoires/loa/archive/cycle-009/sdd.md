# SDD: NOBUTTERZONE — Agent Navigation Surface

**Cycle**: 009
**Created**: 2026-02-18
**Updated**: 2026-02-18 (extended with gap resolution)
**PRD**: `grimoires/loa/prd.md`

---

## 1. Executive Summary

**Phase 1 (COMPLETED)**: Agent-navigable boundaries — scope declarations, gap tracking, contract registry, completeness markers, Grails visibility, Loa development history on GitHub. ~9 files.

**Phase 2 (this sprint)**: Resolve 6 of 7 documented gaps by extracting contract documentation from `mibera-contracts` repo and on-chain data. Creates 5 documentation files + ABI directory. Closes GAP-002 through GAP-007.

---

## 2. Data Architecture

### 2.1 `_codex/data/scope.json`

Machine-readable scope declaration. Agents read this to determine if a query is answerable.

```json
{
  "version": "1.0.0",
  "generated": "2026-02-18",
  "tracks": [
    {
      "entity_type": "mibera",
      "count": 10000,
      "completeness": "COMPLETE",
      "note": "All 10,000 generative Miberas from the Mibera Maker contract"
    },
    {
      "entity_type": "grail",
      "count": 42,
      "completeness": "COMPLETE",
      "note": "All 42 hand-drawn 1/1 art pieces. These are specific token IDs within the same contract."
    },
    {
      "entity_type": "trait",
      "count": 1257,
      "completeness": "COMPLETE",
      "note": "All visual traits across 18 subcategories"
    },
    {
      "entity_type": "drug",
      "count": 78,
      "completeness": "COMPLETE",
      "note": "All 78 drugs in the drug-tarot system"
    },
    {
      "entity_type": "tarot_card",
      "count": 78,
      "completeness": "COMPLETE",
      "note": "All 78 tarot cards mapped 1:1 to drugs"
    },
    {
      "entity_type": "ancestor",
      "count": 33,
      "completeness": "COMPLETE",
      "note": "All 33 cultural ancestors"
    },
    {
      "entity_type": "special_collection",
      "count": 32,
      "completeness": "PARTIAL",
      "note": "Known partner collaborations. New partners may not be immediately documented."
    },
    {
      "entity_type": "birthday_era",
      "count": 11,
      "completeness": "COMPLETE",
      "note": "All era classifications for 15,000 years of birthdays"
    }
  ],
  "does_not_track": [
    {
      "category": "ownership",
      "reason": "Codex documents lore and metadata, not wallet balances or transfers. Use on-chain indexer."
    },
    {
      "category": "custom_commissions",
      "reason": "Only the 42 canonical Grails are documented. Custom 1/1 commissions are not tracked."
    },
    {
      "category": "on_chain_state",
      "reason": "Codex is static documentation. Token transfers, marketplace activity, and balances are not tracked."
    },
    {
      "category": "social_identities",
      "reason": "No mapping between wallets, usernames, or real-world identities and tokens."
    },
    {
      "category": "price_data",
      "reason": "No market prices, sales history, or floor price tracking."
    }
  ],
  "stop_conditions": [
    "If searching for a named entity in a COMPLETE entity type and it's not in the index, it does not exist in the codex.",
    "If the question involves wallet addresses or ownership, the codex cannot answer — use an on-chain indexer.",
    "If the question involves a person or community member, the codex has no social identity data.",
    "If the question involves price or market data, the codex has no financial data."
  ]
}
```

### 2.2 `_codex/data/gaps.json`

Known unknowns. Each gap has a severity, status, and resolution path.

```json
{
  "version": "1.0.0",
  "generated": "2026-02-18",
  "gaps": [
    {
      "id": "GAP-001",
      "description": "Custom 1/1 commissions beyond the 42 canonical Grails",
      "severity": "structural",
      "entity_type": "grail",
      "resolution_path": "Only the artist (cfang/Gumi) knows the full list. Must be manually provided.",
      "status": "open"
    },
    {
      "id": "GAP-002",
      "description": "FracturedMibera — 10 soulbound companion collections tied to main Mibera token IDs",
      "severity": "recoverable",
      "entity_type": null,
      "resolution_path": "Extract from mibera-contracts repo. 10 contract addresses with token-level mappings.",
      "status": "open"
    },
    {
      "id": "GAP-003",
      "description": "Mibera Sets — 12 tiered ERC-1155 tokens on Optimism with Arweave metadata",
      "severity": "recoverable",
      "entity_type": null,
      "resolution_path": "Contract 0x886d... on Optimism. Metadata on Arweave.",
      "status": "open"
    },
    {
      "id": "GAP-004",
      "description": "Shadow Traits / VendingMachine — on-chain trait uniqueness via keccak256 hashes",
      "severity": "recoverable",
      "entity_type": "trait",
      "resolution_path": "Extract from Shadows/VM contract 0x0483...",
      "status": "open"
    },
    {
      "id": "GAP-005",
      "description": "Contract ABIs not stored in codex",
      "severity": "recoverable",
      "entity_type": null,
      "resolution_path": "Import from mibera-contracts repo or verify on-chain.",
      "status": "open"
    },
    {
      "id": "GAP-006",
      "description": "Candies marketplace mechanics (0.1% seizure, holder discounts up to 42%)",
      "severity": "recoverable",
      "entity_type": null,
      "resolution_path": "Document from CandiesMarket contract logic.",
      "status": "open"
    },
    {
      "id": "GAP-007",
      "description": "The '42' motif on-chain — 42% max discount, 4.2 BERA mint, 4.20% royalties, ID 69420 seizure",
      "severity": "recoverable",
      "entity_type": null,
      "resolution_path": "Document as lore cross-reference with contract verification.",
      "status": "open"
    }
  ]
}
```

**Severity definitions**:
- `structural` — by-design scope limit. Only the project creator can resolve.
- `recoverable` — data exists elsewhere and could be imported.

**Status values**: `open`, `wont-fix`, `closed`

### 2.3 `_codex/data/contracts.json`

Canonical contract registry. The bridge between codex documentation and on-chain truth.

```json
{
  "version": "1.0.0",
  "generated": "2026-02-18",
  "note": "There is NO on-chain distinction between generative Miberas and hand-drawn Grails. The codex is the only layer that knows which token IDs are 1/1s.",
  "contracts": [
    {
      "name": "Mibera Maker",
      "address": "0x6666397DFe9a8c469BF65dc744CB1C733416c420",
      "chain": "berachain",
      "chain_id": 80094,
      "standard": "ERC-721C",
      "token_count": 10000,
      "notes": "Main collection. Includes both generative and Grail tokens."
    },
    {
      "name": "Mibera Shadows (VendingMachine)",
      "address": "0x048327A187b944ddac61c6e202BfccD20d17c008",
      "chain": "berachain",
      "chain_id": 80094,
      "standard": "custom",
      "notes": "On-chain trait uniqueness via keccak256 hashes"
    },
    {
      "name": "Candies",
      "address": "0xecA03517c5195F1edD634DA6D690D6c72407c40c",
      "chain": "berachain",
      "chain_id": 80094,
      "standard": "ERC-1155",
      "notes": "Collectible candies with marketplace mechanics"
    },
    {
      "name": "CandiesMarket",
      "address": "0x80283fbF2b8E50f6Ddf9bfc4a90A8336Bc90E38F",
      "chain": "berachain",
      "chain_id": 80094,
      "standard": "custom",
      "notes": "Marketplace with 0.1% seizure and Mibera holder discounts"
    },
    {
      "name": "Mibera Tarot",
      "address": "0x4B08a069381EfbB9f08C73D6B2e975C9BE3c4684",
      "chain": "berachain",
      "chain_id": 80094,
      "standard": "custom",
      "notes": "Archetype/Tarot quiz system with soulbound minting"
    },
    {
      "name": "Treasury",
      "address": "0xaa04F13994A7fCd86F3BbbF4054d239b88F2744d",
      "chain": "berachain",
      "chain_id": 80094,
      "standard": "custom",
      "notes": "Ungovernable Autonomous Rave Treasury — no admin keys"
    },
    {
      "name": "MiberaTrade",
      "address": "0x90485B61C9dA51A3c79fca1277899d9CD5D350c2",
      "chain": "berachain",
      "chain_id": 80094,
      "standard": "custom",
      "notes": "Trading contract"
    },
    {
      "name": "Accounts",
      "address": "0xC0a78722889c7De7E6eF4B7dB1FeD5b4B97d6dA1",
      "chain": "berachain",
      "chain_id": 80094,
      "standard": "custom",
      "notes": "Account management contract"
    },
    {
      "name": "MiberaSets",
      "address": "0x886d2176d899796cd1affa07eff07b9b2b80f1be",
      "chain": "optimism",
      "chain_id": 10,
      "standard": "ERC-1155",
      "notes": "12 tiered tokens with Arweave metadata. Cross-chain deployment."
    }
  ]
}
```

### 2.4 `_codex/data/timeline.json`

Project milestones. Dates are `null` when unknown — documenting the unknown is the point.

```json
{
  "version": "1.0.0",
  "generated": "2026-02-18",
  "events": [
    {
      "id": "EVT-001",
      "name": "Mibera Maker contract deployment",
      "date": null,
      "chain": "berachain",
      "notes": "ERC-721C deployment of 10,000 tokens",
      "verified": false
    },
    {
      "id": "EVT-002",
      "name": "Mibera mint",
      "date": null,
      "chain": "berachain",
      "notes": "4.2 BERA mint price",
      "verified": false
    },
    {
      "id": "EVT-003",
      "name": "Grails creation",
      "date": null,
      "notes": "42 hand-drawn 1/1 pieces by cfang",
      "verified": false
    },
    {
      "id": "EVT-004",
      "name": "MiberaSets deployment",
      "date": null,
      "chain": "optimism",
      "notes": "12 tiered ERC-1155 tokens",
      "verified": false
    },
    {
      "id": "EVT-005",
      "name": "Codex repository created",
      "date": null,
      "notes": "GitHub repository 0xHoneyJar/mibera-codex",
      "verified": false
    },
    {
      "id": "EVT-006",
      "name": "Candies launch",
      "date": null,
      "chain": "berachain",
      "notes": "ERC-1155 collectible candies",
      "verified": false
    }
  ]
}
```

---

## 3. Component Design

### 3.1 llms.txt Updates

**Add Grails to Content Types table** (line ~22, after Special Collection row):
```
| Grail | grails/{slug}.md | 42 | YAML frontmatter |
```

**Add Scope & Boundaries section** at the end of the file:
```markdown
## Scope & Boundaries

### What This Codex Tracks
- 10,000 generative Miberas (COMPLETE)
- 42 hand-drawn Grails / 1/1s (COMPLETE)
- 1,257 visual traits across 18 subcategories (COMPLETE)
- 78 drugs, 78 tarot cards, 33 ancestors (COMPLETE)
- 32 special/partner collections (PARTIAL)

### What This Codex Does NOT Track
- Ownership / wallet balances / transfers
- Custom commissioned art beyond the 42 canonical Grails
- On-chain state (marketplace activity, token transfers)
- Community member identities
- Price or market data

### When to Stop Searching
- Name not in index + entity type is COMPLETE → it does not exist here
- Question involves wallets/ownership → codex cannot answer, use on-chain indexer
- Question involves a person → no social identity data here
- Question involves price/market → no financial data here

### Machine-Readable Scope
- _codex/data/scope.json — programmatic scope boundaries
- _codex/data/gaps.json — known unknowns with resolution paths
- _codex/data/contracts.json — canonical contract addresses
```

### 3.2 README.md Updates

**Quick Stats table** — add Grails row:
```markdown
| Hand-Drawn Grails | 42 |
```

**Codex Structure** — add Grails entry under "V. The Collection":
```markdown
- [Grails](grails/README.md) — 42 hand-drawn 1/1 art pieces
```

**New section** — add "IX. On-Chain" after "VIII. Behind the Scenes":
```markdown
### IX. On-Chain
Contract addresses and ecosystem contracts.
- [Contract Registry](_codex/data/contracts.json) — All Mibera contract addresses
```

### 3.3 manifest.json Updates

**Add completeness to each entity type**:
```json
"mibera": {
  ...existing fields...,
  "completeness": "COMPLETE",
  "completeness_note": "All 10,000 generative Miberas",
  "last_verified": "2026-02-18"
}
```

**Add new data_exports entries**:
```json
"data_exports": {
  ...existing entries...,
  "scope": "_codex/data/scope.json",
  "gaps": "_codex/data/gaps.json",
  "contracts": "_codex/data/contracts.json",
  "timeline": "_codex/data/timeline.json"
}
```

### 3.4 .gitignore Update (Loa Visibility)

**Remove** the `grimoires/loa/` line from `.gitignore`.

**Add selective exclusions** for temporary state:
```
# Loa temporary state (not worth tracking)
grimoires/loa/NOTES.md.tmp
grimoires/loa/analytics/
grimoires/loa/a2a/trajectory/
```

This preserves:
- `ledger.json` — 9-cycle development history
- `archive/` — all PRDs, SDDs, sprint plans
- `a2a/sprint-*/reviewer.md` — implementation reports
- `context/` — research documents
- `NOTES.md` — cross-session learnings
- Current cycle artifacts (`prd.md`, `sdd.md`, `sprint.md`)

### 3.5 grimoires/loa/README.md

New file explaining the grimoires directory:

```markdown
# Development History (Loa Framework)

This directory contains the structured development history of the Mibera Codex,
managed by the [Loa Framework](https://github.com/thehoneyjar/loa).

## Current Cycle
- `prd.md` — Product Requirements Document
- `sdd.md` — Software Design Document
- `sprint.md` — Sprint plan
- `ledger.json` — Development history across all cycles

## Archive
Past cycle artifacts in `archive/cycle-NNN/`.

## Sprint Reports
Implementation reports in `a2a/sprint-N/reviewer.md`.
```

---

## 4. Implementation Order

Strict phase order to minimize risk:

### Phase 1: New data files (independent, can be parallel)
1. Create `_codex/data/scope.json`
2. Create `_codex/data/gaps.json`
3. Create `_codex/data/contracts.json`
4. Create `_codex/data/timeline.json`

### Phase 2: Navigation updates (depends on Phase 1 files existing)
5. Update `llms.txt` — add Grails row + scope block
6. Update `README.md` — add Grails + on-chain section
7. Update `manifest.json` — completeness markers + new data exports

### Phase 3: Loa visibility (independent)
8. Update `.gitignore` — remove `grimoires/loa/`, add selective exclusions
9. Create `grimoires/loa/README.md`

### Phase 4: Validate
10. Run `audit-links.sh` — verify 0 new broken links
11. Validate all new JSON files parse correctly

---

## 5. Validation Checklist

- [ ] `python3 -c "import json; json.load(open('_codex/data/scope.json'))"` passes
- [ ] `python3 -c "import json; json.load(open('_codex/data/gaps.json'))"` passes
- [ ] `python3 -c "import json; json.load(open('_codex/data/contracts.json'))"` passes
- [ ] `python3 -c "import json; json.load(open('_codex/data/timeline.json'))"` passes
- [ ] `python3 -c "import json; json.load(open('manifest.json'))"` passes
- [ ] `audit-links.sh` — 0 new broken links
- [ ] `llms.txt` contains "Grail" in Content Types table
- [ ] `llms.txt` contains "Scope & Boundaries" section
- [ ] `README.md` contains "Grails" in Quick Stats
- [ ] `manifest.json` has `completeness` field on every entity type
- [ ] `manifest.json` has `scope`, `gaps`, `contracts`, `timeline` in data_exports
- [ ] `.gitignore` no longer contains `grimoires/loa/`
- [ ] `grimoires/loa/README.md` exists
- [ ] All contract addresses in `contracts.json` are valid hex (0x prefix, 40 hex chars)

---

## 6. Files Modified Summary

| File | Action | FR |
|------|--------|-----|
| `_codex/data/scope.json` | CREATE | FR-1 |
| `_codex/data/gaps.json` | CREATE | FR-2 |
| `_codex/data/contracts.json` | CREATE | FR-3 |
| `_codex/data/timeline.json` | CREATE | FR-7 |
| `llms.txt` | EDIT (add Grails row + scope block) | FR-1, FR-4 |
| `README.md` | EDIT (add Grails + on-chain section) | FR-4 |
| `manifest.json` | EDIT (completeness + data exports) | FR-5 |
| `.gitignore` | EDIT (un-gitignore grimoires/loa/) | FR-6 |
| `grimoires/loa/README.md` | CREATE | FR-6 |

---

## 7. Gap Resolution Architecture (Phase 2)

### 7.1 Data Sources

| Source | Access Method | Contracts Covered |
|--------|--------------|-------------------|
| `mibera-contracts` repo | `gh api` to read files from `0xHoneyJar/mibera-contracts` | All — Solidity source + deployments.txt |
| Routescan API | `https://api.routescan.io/v2/network/mainnet/evm/80094/etherscan/api` | Berachain verified contracts (ABIs) |
| Optimism Etherscan | `https://api-optimistic.etherscan.io/api` | MiberaSets (ABIs, metadata URIs) |

### 7.2 Documentation File Format

All gap resolution docs follow the same Markdown structure:

```markdown
# {Title}

> One-line summary

## Overview
What this system does, why it exists.

## Contracts
| Name | Address | Chain | Standard |
...

## Mechanics
How it works — extracted from Solidity source with contract references.

## Key Constants
Named constants from source code with values and context.

## Relationship to Main Collection
How this system connects to the 10,000 Mibera tokens.

## Source
- Contract source: `mibera-contracts/{path}`
- Deployed: {address}
- Verified: {yes/no on explorer}
```

### 7.3 `_codex/data/fractured-mibera.md` (FR-8 / GAP-002)

**Source**: `mibera/src/FracturedMibera.sol` + `mibera/deployments.txt`

10 soulbound (non-transferable) ERC-721 companion collections:

```
0x6956dae88C00372B1A0b2dfBfE5Eed19F85b0D4B
0x8D4972bd5D2df474e71da6676a365fB549853991
0x77ec6B83495974a5B2C5BEf943b0f2e5aCd8Fc26
0xc557Bf6C7d21BA98A40dDfE2BEAbA682C49D17A9
0xbcb082bB41E892f29d9c600eaadEA698d5f712Ef
0x2030f226Bf9a0c88687e83AcCdcEfb7Dae260094
0xcc426F9375c5edcef5CA6bDb0449c07113348cF7
0xF68f40230E39067Ee7c98Fe9A8641fC124c5BE60
0xFc79B1BcCa172FF5a8F74205C82F5CBB0125Dd10
0xa3d3EF45712631A6Fb50c677762b8653f932cf71
```

Document: soulbound mechanics, Merkle eligibility, mint pricing, relationship to main Mibera holdings.

**Also**: Add all 10 addresses to `contracts.json` as FracturedMibera entries. Add `fractured_mibera` to `scope.json` tracks.

### 7.4 `_codex/data/shadow-traits.md` (FR-10 / GAP-004)

**Source**: `honey-road/src/VendingMachine.sol`, `honey-road/src/VendingMachineV2.sol`

Document:
- ERC-721 "Mibera Shadow Traits" (MST) token
- keccak256 trait hash for uniqueness enforcement
- UUPS proxy upgrade pattern
- Treasury integration (proceeds flow)
- Minting flow

### 7.5 `_codex/data/candies-mechanics.md` (FR-12 / GAP-006)

**Source**: `honey-road/src/CandiesMarket.sol`, `honey-road/src/CandiesMarketV2.sol`, `honey-road/src/Candies.sol`

Document:
- ERC-1155 candy tokens
- `Candy` struct: `{ price: uint128, currentSupply: uint64, maxSupply: uint64 }`
- `SEIZED_ID = 69420` mechanic
- Mibera holder discount tiers
- V2 treasury integration
- Vendor/candy ID system

### 7.6 `_codex/data/mibera-sets.md` (FR-9 / GAP-003)

**Source**: MiberaSets contract on Optimism (`0x886d...`)

Document:
- 12 tiered ERC-1155 tokens
- Arweave metadata URIs (fetch from contract if possible)
- Tier structure and naming
- Cross-chain relationship to Berachain ecosystem

### 7.7 `_codex/data/42-motif.md` (FR-13 / GAP-007)

**Source**: Cross-contract compilation

| Motif | Contract | Constant/Value | Source File |
|-------|----------|---------------|-------------|
| Mint price | Mibera.sol | 4.2 BERA | Constructor/config |
| Interest rate | Treasury.sol | 420 bps (4.20%) | `INTEREST_RATE` |
| Term limit | Treasury.sol | 4.2 months | `TERM_LIMIT` |
| Max discount | CandiesMarket.sol | 42% | Discount logic |
| Seizure ID | CandiesMarketV2.sol | 69420 | `SEIZED_ID` |
| Royalty | Mibera.sol | 4% | ERC2981 config |
| Grails count | Codex | 42 | Canonical lore |
| Creator share | BeraMarketMinter.sol | 4% | Fee distribution |
| BeraMarket fee | BeraMarketMinter.sol | 10% | Fee distribution |

### 7.8 `_codex/data/abis/` (FR-11 / GAP-005)

Directory structure:
```
_codex/data/abis/
├── README.md                  # Index explaining source and verification status
├── mibera-maker.json          # ERC-721C main collection
├── fractured-mibera.json      # Soulbound companion
├── treasury.json              # RFV treasury
├── vending-machine.json       # Shadow traits
├── candies.json               # ERC-1155 candies
├── candies-market.json        # Marketplace
├── mibera-trade.json          # P2P trading
├── accounts.json              # Account management
├── mibera-tarot.json          # Tarot quiz
└── mibera-sets.json           # Optimism ERC-1155
```

**Source priority**: Routescan API for verified contracts → compile from `mibera-contracts` source as fallback.

### 7.9 Updates to Existing Files

**`contracts.json`**: Add 10 FracturedMibera addresses + BeraMarketMinter address.

**`gaps.json`**: Set GAP-002 through GAP-007 status to `closed`, add `closed_date` and `closed_by` fields.

**`scope.json`**: Add `fractured_mibera` entity type to tracks. Update notes on `trait` to mention Shadow Traits.

**`manifest.json`**: Add `abis` to data_exports.

**`llms.txt`**: Add FracturedMibera and Shadow Traits to content summary if significant.

---

## 8. Implementation Order (Phase 2)

### Step 1: Clone contract source
Read key Solidity files from `mibera-contracts` via GitHub API.

### Step 2: Extract & document (parallel)
- `fractured-mibera.md` from FracturedMibera.sol + deployments.txt
- `shadow-traits.md` from VendingMachine.sol
- `candies-mechanics.md` from CandiesMarket.sol + Candies.sol
- `42-motif.md` from cross-contract constants

### Step 3: Fetch ABIs
- Routescan API for Berachain contracts
- Optimism Etherscan for MiberaSets
- Store in `_codex/data/abis/`

### Step 4: MiberaSets metadata
- Query Optimism contract for Arweave URIs
- Fetch and document tier metadata

### Step 5: Update existing files
- `contracts.json` — add FracturedMibera addresses
- `gaps.json` — close GAP-002 through GAP-007
- `scope.json` — add new entity types
- `manifest.json` — add abis export

### Step 6: Validate
- All new JSON/Markdown files parseable
- `audit-links.sh` — 0 new broken links
- Contract addresses valid hex

---

## 9. Validation Checklist (Phase 2)

- [ ] `_codex/data/fractured-mibera.md` exists with 10 addresses
- [ ] `_codex/data/shadow-traits.md` exists with VendingMachine mechanics
- [ ] `_codex/data/candies-mechanics.md` exists with marketplace documentation
- [ ] `_codex/data/mibera-sets.md` exists with tier structure
- [ ] `_codex/data/42-motif.md` exists with cross-contract references
- [ ] `_codex/data/abis/` contains ABI files for core contracts
- [ ] `contracts.json` has 10 FracturedMibera addresses (19+ total)
- [ ] `gaps.json` GAP-002 through GAP-007 status = "closed"
- [ ] `scope.json` includes `fractured_mibera` entity type
- [ ] `manifest.json` data_exports includes `abis`
- [ ] All new contract addresses are valid hex
- [ ] `audit-links.sh` — 0 new broken links
- [ ] All JSON files pass `json.load()` validation

---

## 10. Files Modified Summary (Phase 2)

| File | Action | FR |
|------|--------|-----|
| `_codex/data/fractured-mibera.md` | CREATE | FR-8 |
| `_codex/data/shadow-traits.md` | CREATE | FR-10 |
| `_codex/data/candies-mechanics.md` | CREATE | FR-12 |
| `_codex/data/mibera-sets.md` | CREATE | FR-9 |
| `_codex/data/42-motif.md` | CREATE | FR-13 |
| `_codex/data/abis/*.json` | CREATE | FR-11 |
| `_codex/data/abis/README.md` | CREATE | FR-11 |
| `_codex/data/contracts.json` | EDIT | FR-8 |
| `_codex/data/gaps.json` | EDIT | FR-8–13 |
| `_codex/data/scope.json` | EDIT | FR-8 |
| `manifest.json` | EDIT | FR-11 |
