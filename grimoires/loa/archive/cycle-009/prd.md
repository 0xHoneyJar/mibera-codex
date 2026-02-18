# PRD: NOBUTTERZONE — Agent Navigation Surface

**Cycle**: 009
**Created**: 2026-02-18
**Status**: Active (Sprint 1 COMPLETED, extending with gap resolution)
**Source**: [GitHub Issue #15](https://github.com/0xHoneyJar/mibera-codex/issues/15)

---

## 1. Problem Statement

The Mibera Codex is the **only layer in the entire ecosystem** that distinguishes Grails (hand-drawn 1/1s) from regular generative Miberas. On-chain, all 10,000 tokens in `0x6666397DFe9a8c469BF65dc744CB1C733416c420` are identical. But no downstream consumer reads the codex data, and agents navigating the codex have no way to know its boundaries.

**The Mijedi incident**: A community member asked if "Mijedi" (a custom 1/1) existed. 7 agents searched 8 repos to arrive at: "It's not in the codex, and the codex doesn't track custom commissions." The codex could have told an agent this in 2 file reads — if it declared its scope and known gaps.

**The Loa invisibility problem**: The Loa framework is mounted to the codex (driving 8 cycles of structured development) but entirely gitignored. From GitHub's perspective, there's no evidence of the development process, architectural decisions, or quality gates that shaped the codex.

> Sources: GitHub Issue #15, conversation analysis of Loa gitignore state

---

## 2. Goals & Success Metrics

### Goals

1. **Agents know the codex's boundaries** — what it tracks, what it doesn't, and when to stop searching
2. **Known unknowns are explicit** — gaps are first-class citizens, not silent absences
3. **On-chain truth is reachable** — contract addresses link the codex to the chain
4. **Grails are fully visible** — present in every navigation surface (llms.txt, README, llms-full.txt)
5. **Loa integration is visible on GitHub** — grimoires tracked in git, development history preserved

### Success Metrics

| Metric | Target |
|--------|--------|
| Agent reads to determine "is X in scope?" | ≤ 2 file reads |
| Grail mentions in llms.txt | ≥ 1 (currently 0) |
| Grail mentions in README.md Quick Stats | ≥ 1 (currently 0) |
| Contract addresses documented | ≥ 8 core contracts |
| Known gaps documented | ≥ 5 explicit entries |
| `grimoires/loa/` visible on GitHub | Yes (currently gitignored) |

---

## 3. Users & Stakeholders

### Primary: AI Agents
Agents dropped into the codex via `llms.txt` or `manifest.json`. Need to quickly determine scope, resolve queries, and identify gaps without exhaustive search.

### Secondary: Downstream Apps
`score-api`, `midi-interface`, `mibera-interface` — need to consume codex data (especially Grail status) and contract addresses.

### Tertiary: Human Developers
Contributors and ecosystem builders who clone the repo and need to understand what the codex knows, how it was built, and where to contribute.

---

## 4. Functional Requirements

### FR-1: Scope & Boundaries (P0)

**Add scope block to `llms.txt`** — After existing content, add a `## Scope & Boundaries` section declaring:
- What the codex tracks (with completeness: COMPLETE / PARTIAL)
- What the codex does NOT track (explicit exclusions)
- Stop conditions (when to stop searching)

**Create `_codex/data/scope.json`** — Machine-readable version with:
- `tracks[]` — entity types with completeness status
- `does_not_track[]` — explicit exclusions with reason
- `stop_conditions[]` — rules for when absence means non-existence

### FR-2: Gap Tracker (P0)

**Create `_codex/data/gaps.json`** — Known unknowns with:
- `id`, `description`, `severity` (structural / recoverable)
- `entity_type` affected
- `resolution_path` — what would close the gap
- `status` (open / wont-fix / closed)

Initial gaps to document:
1. Custom 1/1s beyond 42 canonical Grails (structural — only Gumi knows)
2. Ownership / wallet data (structural — not in scope by design)
3. On-chain state (structural — codex is static documentation)
4. Contract ABIs (recoverable — could be added from mibera-contracts)
5. FracturedMibera metadata (recoverable — 10 soulbound collections undocumented)
6. Mibera Sets metadata (recoverable — 12 ERC-1155s on Optimism)
7. Shadow Traits / VendingMachine mechanics (recoverable)

### FR-3: Contract Registry (P0)

**Create `_codex/data/contracts.json`** — Canonical contract addresses with:
- `name`, `address`, `chain`, `standard` (ERC-721C, ERC-1155, etc.)
- `notes` — including the critical note: "NO on-chain distinction between generative and 1/1 tokens"

Contracts to document (from issue #15):

| Contract | Address | Chain |
|----------|---------|-------|
| Mibera Main (ERC-721C) | `0x6666397DFe9a8c469BF65dc744CB1C733416c420` | Berachain |
| Mibera Shadows/VM | `0x048327A187b944ddac61c6e202BfccD20d17c008` | Berachain |
| Candies (ERC-1155) | `0xecA03517c5195F1edD634DA6D690D6c72407c40c` | Berachain |
| CandiesMarket | `0x80283fbF2b8E50f6Ddf9bfc4a90A8336Bc90E38F` | Berachain |
| Mibera Tarot | `0x4B08a069381EfbB9f08C73D6B2e975C9BE3c4684` | Berachain |
| Treasury | `0xaa04F13994A7fCd86F3BbbF4054d239b88F2744d` | Berachain |
| MiberaTrade | `0x90485B61C9dA51A3c79fca1277899d9CD5D350c2` | Berachain |
| Accounts | `0xC0a78722889c7De7E6eF4B7dB1FeD5b4B97d6dA1` | Berachain |
| MiberaSets (ERC-1155) | `0x886d2176d899796cd1affa07eff07b9b2b80f1be` | Optimism |

### FR-4: Grails Visibility Fix (P0)

**`llms.txt`**: Add Grails row to Content Types table:
```
| Grail | grails/{slug}.md | 42 | YAML frontmatter |
```

**`README.md`**: Add Grails to Quick Stats table and Codex Structure section.

### FR-5: Manifest Enrichment (P1)

**Update `manifest.json`**: Add to each entity type:
- `completeness`: "COMPLETE" / "PARTIAL" / "GAP"
- `completeness_note`: human-readable explanation
- `last_verified`: date

Add new data exports:
- `scope`, `gaps`, `contracts` pointing to the new JSON files

### FR-6: Loa Visibility (P1)

**Stop gitignoring `grimoires/loa/`** — Remove the `grimoires/loa/` line from `.gitignore` so:
- PRDs, SDDs, sprint plans, and cycle archives are visible on GitHub
- The ledger (development history across 9 cycles) becomes browseable
- Architectural decisions are preserved and traceable

**Add `grimoires/loa/README.md`** — Index explaining what the grimoires directory contains and how to read the development history.

### FR-7: Timeline (P1)

**Create `_codex/data/timeline.json`** — Concrete project milestones:
- Contract deployment dates
- Mint date
- Grails creation
- Key ecosystem events
- Many dates will be `null` — documenting unknowns is part of the value

---

## 4b. Gap Resolution Requirements (P2 → promoted to active)

*Source: `mibera-contracts` repo ([0xHoneyJar/mibera-contracts](https://github.com/0xHoneyJar/mibera-contracts)) + Berachain block explorer via Routescan API*

### FR-8: FracturedMibera Documentation (GAP-002)

**Document the 10 soulbound companion collections** from `FracturedMibera.sol`:

| Data | Source |
|------|--------|
| 10 contract addresses | `mibera/deployments.txt` |
| Soulbound mechanics (non-transferable ERC-721) | `mibera/src/FracturedMibera.sol` |
| Merkle-based eligibility | Contract source |
| Relationship to main Mibera tokens | Contract logic |

**Deliverables**:
- Add 10 FracturedMibera addresses to `contracts.json`
- Create `_codex/data/fractured-mibera.md` documenting mechanics and addresses
- Update `gaps.json` — set GAP-002 status to `closed`
- Update `scope.json` — add `fractured_mibera` entity type

### FR-9: MiberaSets Documentation (GAP-003)

**Document the 12 tiered ERC-1155 tokens on Optimism** from MiberaSets contract:

| Data | Source |
|------|--------|
| 12 tier structure | Contract on Optimism |
| Token metadata | Arweave URIs from contract |
| Tier names/descriptions | Metadata JSON |

**Deliverables**:
- Create `_codex/data/mibera-sets.md` documenting tiers and metadata
- Fetch Arweave metadata URIs via Optimism explorer
- Update `gaps.json` — set GAP-003 status to `closed`

### FR-10: Shadow Traits / VendingMachine Documentation (GAP-004)

**Document the on-chain trait uniqueness system** from `VendingMachine.sol` / `VendingMachineV2.sol`:

| Data | Source |
|------|--------|
| keccak256 trait hashing mechanics | `honey-road/src/VendingMachine.sol` |
| UUPS proxy upgrade pattern | Contract source |
| Trait uniqueness enforcement | Contract logic |
| Minting flow and treasury integration | Contract source |

**Deliverables**:
- Create `_codex/data/shadow-traits.md` documenting the VendingMachine system
- Document how trait hashes map to visual traits
- Update `gaps.json` — set GAP-004 status to `closed`

### FR-11: Contract ABIs (GAP-005)

**Store canonical ABIs for all ecosystem contracts**:

| Data | Source |
|------|--------|
| ABIs for verified contracts | Routescan API (`api.routescan.io`) |
| ABIs for unverified contracts | Compile from `mibera-contracts` via `forge build` |

**Deliverables**:
- Create `_codex/data/abis/` directory with JSON ABI files per contract
- Document which ABIs are verified on-chain vs compiled from source
- Update `gaps.json` — set GAP-005 status to `closed`
- Update `manifest.json` data_exports with abis path

### FR-12: Candies Marketplace Mechanics (GAP-006)

**Document the CandiesMarket system** from `CandiesMarket.sol` / `CandiesMarketV2.sol` + `Candies.sol`:

| Data | Source |
|------|--------|
| `SEIZED_ID = 69420` seizure mechanic | `CandiesMarketV2.sol` |
| Candy struct (price, currentSupply, maxSupply) | Contract source |
| Mibera holder discount logic | Contract source |
| V2 treasury integration | Contract source |
| ERC-1155 candy token mechanics | `Candies.sol` |

**Deliverables**:
- Create `_codex/data/candies-mechanics.md` documenting full marketplace system
- Document the seizure mechanic and discount tiers
- Update `gaps.json` — set GAP-006 status to `closed`

### FR-13: The "42" Motif On-Chain (GAP-007)

**Document all instances of the "42" motif across contracts** as a lore cross-reference:

| Instance | Source | Value |
|----------|--------|-------|
| Mint price | `Mibera.sol` | 4.2 BERA |
| Interest rate | `Treasury.sol` | 4.20% (420 basis points) |
| Term limit | `Treasury.sol` | 4.2 months |
| Max holder discount | `CandiesMarket.sol` | 42% |
| Seized candy ID | `CandiesMarketV2.sol` | 69420 |
| Royalty rate | `Mibera.sol` | 4% (confirmed from source) |
| Hand-drawn Grails | Codex | 42 |

**Deliverables**:
- Create `_codex/data/42-motif.md` documenting all on-chain "42" references with contract verification
- Cross-reference with existing lore documentation
- Update `gaps.json` — set GAP-007 status to `closed`

---

## 5. Non-Functional Requirements

- All new JSON files must be valid JSON
- `scope.json` and `gaps.json` should be parseable without a schema (self-documenting keys)
- Contract addresses must be checksummed (EIP-55)
- Zero broken links after changes (validated by `audit-links.sh`)
- All new data files added to `manifest.json`

---

## 6. Scope & Prioritization

### P0 — Do First (define the walls)
- FR-1: Scope block in llms.txt + scope.json
- FR-2: gaps.json
- FR-3: contracts.json
- FR-4: Grails visibility in llms.txt + README.md

### P1 — Next (enrich structure)
- FR-5: Manifest completeness markers
- FR-6: Loa visibility (gitignore change + grimoires README)
- FR-7: timeline.json

### P2 — Gap Resolution (promoted from Out of Scope)
- FR-8: FracturedMibera documentation
- FR-9: MiberaSets documentation
- FR-10: Shadow Traits / VendingMachine documentation
- FR-11: Contract ABIs
- FR-12: Candies marketplace mechanics
- FR-13: The "42" motif lore reference

### Out of Scope (future cycle)
- Per-entity confidence tags (`[CONFIRMED]`, `[CLAIMED]`, `[UNKNOWN]`)
- Schema `meta` blocks with `last_updated` and `source_authority`
- Completeness HTML comments in README files
- Intake pipeline (`_intake/` → graduated lifecycle)

---

## 7. Risks & Dependencies

| Risk | Impact | Mitigation |
|------|--------|------------|
| Contract addresses may be incomplete | Medium | Document what we know, mark others as gaps |
| Some timeline dates are unknown | Low | Use `null` — documenting unknowns is the point |
| grimoires/loa/ may contain session-specific state | Low | Review contents before un-gitignoring, exclude temp files |
| `scope.json` may need iteration | Low | Start minimal, extend in future cycles |
| Routescan API rate limits (2 req/s free tier) | Low | Sequential fetches with delay, cache responses |
| Arweave metadata may be slow/unavailable | Medium | Document what we can reach, mark inaccessible as sub-gaps |
| Contract source may differ from deployed bytecode | Medium | Note source vs verified status per contract |
| `mibera-contracts` repo may have uncommitted deployments | Low | Cross-reference deployments.txt with on-chain state |

---

## 8. Blast Radius

### Sprint 1 (COMPLETED)

| Category | Files |
|----------|-------|
| New data files | 4 (`scope.json`, `gaps.json`, `contracts.json`, `timeline.json`) |
| Modified navigation | 3 (`llms.txt`, `README.md`, `manifest.json`) |
| Modified config | 1 (`.gitignore`) |
| New documentation | 1 (`grimoires/loa/README.md`) |
| **Subtotal** | **~9 files** |

### Sprint 2+ (Gap Resolution)

| Category | Files |
|----------|-------|
| New documentation | 5 (`fractured-mibera.md`, `mibera-sets.md`, `shadow-traits.md`, `candies-mechanics.md`, `42-motif.md`) |
| New ABIs directory | `_codex/data/abis/*.json` (up to 19 contracts) |
| Modified data | 3 (`contracts.json`, `gaps.json`, `scope.json`) |
| Modified navigation | 2 (`manifest.json`, `llms.txt`) |
| **Subtotal** | **~10+ files** |

| **Cycle Total** | **~19+ files** |
