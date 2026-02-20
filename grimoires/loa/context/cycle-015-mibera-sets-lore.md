# Cycle-015 Context: Mibera Sets Token Entries

## Goal

Create individual lore entries for each of the 12 Mibera Set ERC-1155 tokens on Optimism.

## Scope

- **DO**: Create one entry per token ID (1-12), sourced from on-chain/Arweave metadata
- **DO**: RPC call to contract `0x886D2176D899796cD1AfFA07Eff07B9b2B80f1be` on Optimism to fetch Arweave metadata URIs via `uri()` function
- **DO**: Fetch Arweave metadata (name, description, image, attributes) for each token
- **DO NOT**: Flesh out Honey Road narrative beyond what the metadata says
- **DO NOT**: Expand on collector mechanic lore

## Existing State

- `_codex/data/mibera-sets.md` — contract data, tier structure, on-chain activity (already exists)
- Arweave metadata URIs are currently unknown (GAP in existing file)
- Contract is NOT verified on any explorer, so `uri()` must be called via RPC

## Technical Notes

- Optimism RPC: `https://mainnet.optimism.io` (public)
- ERC-1155 `uri(uint256)` function selector: `0x0e89341c`
- Token IDs: 1 through 12
- Metadata likely on Arweave (`ar://` URIs)

## Integration Points

- New entries should follow codex entity conventions (YAML frontmatter, backlinks markers)
- Update `_codex/data/mibera-sets.md` with resolved metadata URIs
- Update navigation/browse indices if applicable
- Update `manifest.json` if new file paths are added
