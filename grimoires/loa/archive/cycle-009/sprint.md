# Sprint Plan: NOBUTTERZONE — Agent Navigation Surface

**Cycle**: 009
**PRD**: `grimoires/loa/prd.md`
**SDD**: `grimoires/loa/sdd.md`

---

## Overview

Three sprints. Sprint 1 (COMPLETED): scope boundaries, gap tracking, contract registry, completeness markers. Sprint 2 (COMPLETED): resolve GAP-002 through GAP-007 by extracting contract documentation from `mibera-contracts` repo. Sprint 3: close remaining issue #15 items — grail nodes in graph.json and archetype/tarot quiz documentation.

---

## Sprint 1: NOBUTTERZONE

**Goal**: Add scope boundaries, gap tracking, contract registry, and completeness markers. Fix Grails visibility. Make Loa development history visible on GitHub.

### Task 1.1: Create NOBUTTERZONE data files

**Description**: Create the 4 new data files that form the agent navigation surface:
- `_codex/data/scope.json` — what the codex tracks, doesn't track, stop conditions (per SDD 2.1)
- `_codex/data/gaps.json` — 7 known unknowns with severity and resolution paths (per SDD 2.2)
- `_codex/data/contracts.json` — 9 contract addresses with chain IDs (per SDD 2.3)
- `_codex/data/timeline.json` — 6 project milestones, dates null where unknown (per SDD 2.4)

**Acceptance criteria**:
- [ ] All 4 JSON files created and parse correctly
- [ ] `scope.json` has 8 tracked entities with completeness, 5 exclusions, 4 stop conditions
- [ ] `gaps.json` has 7 gaps with id, severity, resolution_path, status
- [ ] `contracts.json` has 9 contracts with address, chain, chain_id, standard
- [ ] `timeline.json` has 6 events with date (null ok) and verified flag
- [ ] All contract addresses are valid hex (0x + 40 chars)

**Dependencies**: None (first task)

### Task 1.2: Update navigation files

**Description**: Add Grails to `llms.txt` and `README.md` where they're currently missing. Add scope block to `llms.txt`. Update `manifest.json` with completeness markers and new data exports.

**`llms.txt`**:
- Add Grails row to Content Types table (after Special Collection)
- Add `## Scope & Boundaries` section at end of file (per SDD 3.1)

**`README.md`**:
- Add `| Hand-Drawn Grails | 42 |` to Quick Stats table
- Add Grails link under "V. The Collection"
- Add "IX. On-Chain" section after "VIII. Behind the Scenes"

**`manifest.json`**:
- Add `completeness`, `completeness_note`, `last_verified` to every entity type
- Add `scope`, `gaps`, `contracts`, `timeline` to data_exports

**Acceptance criteria**:
- [ ] `llms.txt` Content Types table includes Grails row
- [ ] `llms.txt` has Scope & Boundaries section with tracks/doesn't-track/stop-conditions
- [ ] `README.md` Quick Stats mentions Grails (42)
- [ ] `README.md` has Grails in Codex Structure and On-Chain section
- [ ] `manifest.json` every entity_type has `completeness` field
- [ ] `manifest.json` data_exports has scope, gaps, contracts, timeline
- [ ] `python3 -c "import json; json.load(open('manifest.json'))"` passes

**Dependencies**: Task 1.1 (data files must exist for manifest references)

### Task 1.3: Enable Loa visibility on GitHub

**Description**: Remove `grimoires/loa/` from `.gitignore` so development history is visible on GitHub. Add selective exclusions for temporary state. Create a README explaining the grimoires directory.

**`.gitignore`**:
- Remove `grimoires/loa/` line
- Add: `grimoires/loa/NOTES.md.tmp`, `grimoires/loa/analytics/`, `grimoires/loa/a2a/trajectory/`

**`grimoires/loa/README.md`**: Create index explaining directory contents (per SDD 3.5)

**Acceptance criteria**:
- [ ] `.gitignore` no longer contains `grimoires/loa/`
- [ ] `.gitignore` excludes `NOTES.md.tmp`, `analytics/`, `a2a/trajectory/`
- [ ] `grimoires/loa/README.md` exists with directory explanation
- [ ] `git status` shows grimoires/loa/ files as untracked (ready to be committed)

**Dependencies**: None (independent of Tasks 1.1-1.2)

### Task 1.4: Validate

**Description**: Run validation checks to confirm everything works.

**Acceptance criteria**:
- [ ] All 4 new JSON files pass `json.load()` validation
- [ ] `manifest.json` passes `json.load()` validation
- [ ] `audit-links.sh` — 0 new broken links (4 pre-existing in PROCESS.md ok)
- [ ] `llms.txt` contains "Grail" and "Scope & Boundaries"
- [ ] `README.md` contains "Grails" and "On-Chain"
- [ ] All contract addresses in contracts.json match `^0x[0-9a-fA-F]{40}$`

**Dependencies**: Tasks 1.1, 1.2, 1.3

---

## Sprint 2: Gap Resolution

**Goal**: Close GAP-002 through GAP-007 by extracting documentation from `mibera-contracts` repo and on-chain data. Create 5 documentation files + ABI directory.

### Task 2.1: Extract contract documentation (FR-8, FR-10, FR-12, FR-13)

**Description**: Read Solidity source files from `0xHoneyJar/mibera-contracts` via GitHub API. Create 4 documentation files:

1. `_codex/data/fractured-mibera.md` — Read `mibera/src/FracturedMibera.sol` + `mibera/deployments.txt`. Document 10 soulbound companion collections: addresses, mechanics (non-transferable ERC-721, Merkle eligibility), relationship to main collection.

2. `_codex/data/shadow-traits.md` — Read `honey-road/src/VendingMachine.sol` + `VendingMachineV2.sol`. Document keccak256 trait hashing, uniqueness enforcement, UUPS proxy, treasury integration.

3. `_codex/data/candies-mechanics.md` — Read `honey-road/src/CandiesMarket.sol` + `CandiesMarketV2.sol` + `honey-road/src/Candies.sol`. Document Candy struct, SEIZED_ID=69420, holder discount tiers, V2 treasury.

4. `_codex/data/42-motif.md` — Compile all "42" references across contracts: 4.2 BERA mint, 420 bps interest, 42% max discount, 69420 seizure, 42 Grails, 4% royalty.

**Acceptance criteria**:
- [x] All 4 documentation files created with contract source references
- [x] `fractured-mibera.md` lists all 10 deployed addresses
- [x] `shadow-traits.md` explains keccak256 trait hashing
- [x] `candies-mechanics.md` documents Candy struct and SEIZED_ID
- [x] `42-motif.md` has ≥7 cross-contract "42" references with source files

**Dependencies**: None

### Task 2.2: Fetch and store ABIs (FR-11)

**Description**: Fetch ABIs for all ecosystem contracts via Routescan API (Berachain) and Optimism Etherscan. Store in `_codex/data/abis/` with a README index.

**API endpoints**:
- Berachain: `https://api.routescan.io/v2/network/mainnet/evm/80094/etherscan/api?module=contract&action=getabi&address={ADDRESS}`
- Optimism: `https://api-optimistic.etherscan.io/api?module=contract&action=getabi&address={ADDRESS}`

**Acceptance criteria**:
- [x] `_codex/data/abis/` directory exists
- [x] `_codex/data/abis/README.md` lists all ABIs with source (verified/compiled)
- [x] At least core contract ABIs present (Mibera Maker, VendingMachine, Candies, CandiesMarket)
- [x] All ABI files are valid JSON

**Dependencies**: None (parallel with 2.1)

### Task 2.3: MiberaSets documentation (FR-9)

**Description**: Document the 12 tiered ERC-1155 tokens on Optimism. Fetch Arweave metadata URIs if accessible. Create `_codex/data/mibera-sets.md`.

**Acceptance criteria**:
- [x] `_codex/data/mibera-sets.md` exists with tier structure
- [x] Documents cross-chain relationship (Optimism ↔ Berachain ecosystem)
- [x] Arweave metadata URIs included if fetchable

**Dependencies**: Task 2.2 (MiberaSets ABI needed for metadata query)

### Task 2.4: Update existing files + validate

**Description**: Update contracts.json, gaps.json, scope.json, manifest.json. Run validation.

**`contracts.json`**:
- Add 10 FracturedMibera addresses
- Add BeraMarketMinter address (`0x9e1D441285F098d598F4d0C226d9c7F3b224682F`)

**`gaps.json`**:
- Set GAP-002 through GAP-007 status to `closed`

**`scope.json`**:
- Add `fractured_mibera` entity type (count: 10, completeness: COMPLETE)

**`manifest.json`**:
- Add `abis` to data_exports

**Acceptance criteria**:
- [x] `contracts.json` has 19+ contracts (9 original + 10 FracturedMibera + BeraMarketMinter)
- [x] `gaps.json` GAP-002 through GAP-007 all have status "closed"
- [x] `scope.json` includes fractured_mibera entity type
- [x] `manifest.json` data_exports includes abis path
- [x] All JSON files pass `json.load()` validation
- [x] All contract addresses match `^0x[0-9a-fA-F]{40}$`
- [x] `audit-links.sh` — 0 new broken links

**Dependencies**: Tasks 2.1, 2.2, 2.3

---

## Sprint 3: Final Issue #15 Closure

**Goal**: Close the last two items from GitHub issue #15 — add Grail nodes to `graph.json` and document the Archetype/Tarot quiz system from the MiberaTarot contract.

### Task 3.1: Add Grail nodes and edges to graph.json

**Description**: The graph currently has 10,237 nodes across 9 types (mibera, drug, tarot_card, ancestor, zodiac, swag_rank, archetype, element, era) but zero grail nodes. Add 42 grail nodes and `is_grail` edges connecting each grail's mibera node to its grail node.

**Graph structure** (matching existing conventions):
- Node format: `{"id": "grail:{slug}", "type": "grail", "label": "{Name}"}`
- Edge format: `{"source": "mibera:{token_id}", "target": "grail:{slug}", "type": "is_grail"}`

**Data source**: `_codex/data/grails.jsonl` — 42 entries with `id` (token ID), `name`, `slug`, `category`.

**Acceptance criteria**:
- [x] `graph.json` contains 42 nodes with `"type": "grail"`
- [x] `graph.json` contains 42 edges with `"type": "is_grail"`
- [x] Each grail node id follows pattern `grail:{slug}`
- [x] Each `is_grail` edge connects `mibera:{token_id}` → `grail:{slug}`
- [x] Total node count = 10,279 (10,237 + 42)
- [x] Total edge count = 70,344 (70,302 + 42)
- [x] `graph.json` passes `json.load()` validation

**Dependencies**: None

### Task 3.2: Document Archetype/Tarot quiz system

**Description**: The Mibera Tarot contract (`0x4B08a069381EfbB9f08C73D6B2e975C9BE3c4684`) implements an Archetype/Tarot quiz system with soulbound minting. This is item 5 in the "Undocumented Ecosystem Elements" list in issue #15. Read the contract source from `0xHoneyJar/mibera-contracts` via GitHub API and create documentation.

**Expected contract location**: Search for `MiberaTarot`, `Tarot`, or `Archetype` in the mibera-contracts repo.

**Documentation should cover**:
- How the quiz assigns archetypes
- Soulbound minting mechanics (if similar to FracturedMibera)
- Relationship to the 10 archetypes in the codex
- Integration with Supabase (if visible in contract)

**Deliverable**: `_codex/data/tarot-quiz.md`

**Acceptance criteria**:
- [x] `_codex/data/tarot-quiz.md` exists
- [x] Documents the quiz/minting mechanics from contract source
- [x] References the Mibera Tarot contract address
- [x] Describes relationship to codex archetypes

**Dependencies**: None (parallel with 3.1)

### Task 3.3: Update files + validate

**Description**: Update manifest.json and validate all changes.

**`manifest.json`**:
- Add `tarot_quiz` to data_exports pointing to `_codex/data/tarot-quiz.md`

**Validation**:
- `graph.json` passes `json.load()`
- `manifest.json` passes `json.load()`
- `audit-links.sh` — 0 new broken links

**Acceptance criteria**:
- [x] `manifest.json` data_exports includes `tarot_quiz` path
- [x] All JSON files pass `json.load()` validation
- [x] `audit-links.sh` — 0 new broken links

**Dependencies**: Tasks 3.1, 3.2
