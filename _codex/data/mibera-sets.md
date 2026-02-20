# MiberaSets — Honey Road Artifact Collection

> 12 tiered ERC-1155 tokens on Optimism representing artifacts from the ancient Honey Road trade routes.

## Overview

MiberaSets is an ERC-1155 collection deployed on Optimism under the name "Mibera Sets" (symbol: MS). It contains 12 distinct token IDs representing themed artifacts from the "Honey Road" -- a lore concept within the Mibera ecosystem. The collection is described as "mysterious artifacts from the ancient Honey Road trade routes" and framed as "the great artifact of Mibera Lore." Holders who collect pieces from the set are told they "might get rewarded generously."

MiberaSets is the only Mibera ecosystem contract deployed on Optimism (chain ID 10), making it a cross-chain extension of the primarily Berachain-based Mibera project. The minting frontend is hosted at [mibera.0xhoneyjar.xyz](https://mibera.0xhoneyjar.xyz/).

## Contract

| Field | Value |
|-------|-------|
| Name | Mibera Sets |
| Symbol | MS |
| Address | `0x886D2176D899796cD1AfFA07Eff07B9b2B80f1be` |
| Chain | Optimism (10) |
| Standard | ERC-1155 |
| Total Supply | 481 tokens (across all 12 IDs) |
| Unique Holders | 309 |
| Total Transfers | 732 |
| Creator | `0x4A8c9a29b23c4eAC0D235729d5e0D035258CDFA7` |
| Creation Tx | `0xa85e00a64e68e3aaece1565f88728389ccceb3e914566c91be3468f820ea412b` |
| Created | 2024-09-06 (block 125031052) |
| Verified Source | No (not verified on Blockscout or Etherscan) |

**Note on address discrepancy**: The address `0x9cda1e04005ee4a44cb2e4e1579c37e1f82e4907` was initially considered but is NOT a contract on Optimism (Blockscout reports `is_contract: false`). The correct contract address is `0x886D2176D899796cD1AfFA07Eff07B9b2B80f1be`, confirmed via Blockscout with token name "Mibera Sets", type ERC-1155.

## Token Tiers

The 12 token IDs divide into two categories: **numbered sets** (IDs 1-7) and **media-themed tokens** (IDs 8-11), plus a **completionist token** (ID 12).

| Token ID | Name | Supply | Holders | Category |
|----------|------|--------|---------|----------|
| 1 | [Honey Road Set One](../../mibera-sets/honey-road-set-one.md) | 65 | 62 | Numbered Set |
| 2 | [Honey Road Set Two](../../mibera-sets/honey-road-set-two.md) | ~57 | 50+ | Numbered Set |
| 3 | [Honey Road Set Three](../../mibera-sets/honey-road-set-three.md) | ~54 | 50+ | Numbered Set |
| 4 | [Honey Road Set Four](../../mibera-sets/honey-road-set-four.md) | ~58 | 50+ | Numbered Set |
| 5 | [Honey Road Set Five](../../mibera-sets/honey-road-set-five.md) | 48 | 43 | Numbered Set |
| 6 | [Honey Road Set Six](../../mibera-sets/honey-road-set-six.md) | 3 | 3 | Numbered Set |
| 7 | [Honey Road Set Seven](../../mibera-sets/honey-road-set-seven.md) | 1 | 1 | Numbered Set (unique) |
| 8 | [Honey Road Articles](../../mibera-sets/honey-road-articles.md) | 18 | 16 | Media |
| 9 | [Honey Road Music](../../mibera-sets/honey-road-music.md) | 19 | 18 | Media |
| 10 | [Honey Road Posters](../../mibera-sets/honey-road-posters.md) | 19 | 19 | Media |
| 11 | [Honey Road Video](../../mibera-sets/honey-road-video.md) | 20 | 20 | Media |
| 12 | [Honey Road Supersetooor](../../mibera-sets/honey-road-supersetooor.md) | ~54 | 50+ | Completionist |

*Supply and holder counts sourced from Blockscout on-chain data (2026-02-18). For IDs 2, 3, 4, and 12 the counts are approximate because the Blockscout API paginates at 50 holders; the true totals are slightly higher than shown. ID 1 was verified via pagination to have exactly 65 supply and 62 holders.*

### Tier Structure

The supply distribution reveals a clear tiering:

- **Common tiers** (IDs 1-5, 12): 48-65 supply each. These appear to have been distributed to Mibera community members and holders.
- **Rare tiers** (IDs 8-11): 18-20 supply each. Media-themed tokens with significantly lower supply.
- **Ultra-rare** (ID 6): Only 3 exist.
- **Unique** (ID 7): A true 1-of-1. Blockscout marks this as `is_unique: true`. Sole holder: `0x40495A781095932e2FC8dccA69F5e358711Fdd41`.

## Mechanics

### Distribution

The contract source is not verified and no Solidity source for MiberaSets was found in the [mibera-contracts](https://github.com/0xHoneyJar/mibera-contracts) repository. Based on observed on-chain activity:

- Tokens were minted by the creator address and distributed to holders
- The contract supports standard ERC-1155 operations: `safeTransferFrom`, `setApprovalForAll`
- Tokens have been traded on secondary markets via Seaport (`fulfillAdvancedOrder`, `matchAdvancedOrders`)

### Allowlists

The mibera-contracts repo contains allowlist files that likely correspond to MiberaSets distribution:

| File | Entries | Quantity | Likely Purpose |
|------|---------|----------|----------------|
| `mibera/jsons/set.json` | 338 addresses | 1 each | Set tier allowlist |
| `mibera/jsons/superset.json` | 2,349 entries (87 unique) | 27 each | Supersetooor allowlist |
| `mibera/lists/set.csv` | 337 rows | 1 per address | Set allowlist (CSV format) |
| `mibera/lists/superset.csv` | 86 rows | 27 per address | Superset allowlist (CSV format) |

<!-- GAP: The exact mapping between these allowlists and specific token IDs is unknown. The set.json/set.csv lists may correspond to numbered set tiers while superset may correspond to the Supersetooor (ID 12). -->

Additional JSON files in the repo that may relate to media-tier distribution:

| File | Address Count | Possible Tier |
|------|---------------|---------------|
| `mibera/jsons/article.json` | 234 | Honey Road Articles (ID 8)? |
| `mibera/jsons/music.json` | 152 | Honey Road Music (ID 9)? |
| `mibera/jsons/poster.json` | 76 | Honey Road Posters (ID 10)? |
| `mibera/jsons/video.json` | 100 | Honey Road Video (ID 11)? |

<!-- GAP: These JSON files contain many more addresses than the on-chain token supplies (e.g., article.json has 234 addresses but ID 8 only has 18 supply). These may be broader Mibera community allowlists used for multiple purposes, not solely MiberaSets. The exact relationship is unconfirmed. -->

## Metadata

Metadata is stored on Arweave. The `uri(uint256)` function returns per-token URIs following the pattern:

```
ar://uH9kbQ3egPRlI34MEoIIe1zHr49_Aqy3xixW-gtib58/{id}.json
```

Each token's JSON metadata contains: `name`, `description`, `image` (Arweave URI), and `attributes` (Origin, Set Type).

- **Description** (all tokens): "A mysterious artifact from the ancient Honey Road trade routes."
- **Set Types** vary by token: Base (numbered 1-5), Strong (media 8-11), Super (completionist 12), and unique values for 6 and 7
- **Images**: Each token has a unique Arweave-hosted image

Full metadata for all 12 tokens: [`_codex/data/mibera-sets-meta.json`](mibera-sets-meta.json)
Individual token entries: [`mibera-sets/`](../../mibera-sets/README.md)

## Lore Context

The "Honey Road" is a narrative concept within the Mibera ecosystem -- a fictional ancient trade route. The MiberaSets tokens represent artifacts discovered along this route. The collection appears to serve as a cross-chain engagement mechanism, rewarding Mibera community participants on Optimism while the main collection lives on Berachain.

The naming pattern ("Set One" through "Set Seven" plus media types) suggests a collector mechanic where completing a set of related artifacts may unlock rewards, consistent with the tagline "if you own a piece, you might get rewarded generously."

## On-Chain Activity

| Metric | Value |
|--------|-------|
| First activity | 2024-09-06 (contract creation) |
| Most recent transfer | 2026-02-17 (token ID 2, Seaport trade) |
| Primary marketplace | Seaport (OpenSea) |
| Secondary listings | OKX NFT Marketplace |
| Collection URL | [opensea.io/collection/mibera-sets](https://opensea.io/collection/mibera-sets) |

## Known Unknowns

<!-- GAP: Contract source code not found in mibera-contracts repo or any public 0xHoneyJar repo. The MiberaSets Solidity source may be in a private repository or deployed from a local environment. -->

<!-- GAP: The exact minting mechanism is unknown -- whether tokens were minted via Merkle proof claims, direct airdrops, or a custom mint function. -->

<!-- GAP: The relationship between the set.json/superset.json allowlists and specific token ID distribution is unconfirmed. -->

## Source

- Contract: Not found in any public 0xHoneyJar repository
- Allowlists: `mibera/jsons/set.json`, `mibera/jsons/superset.json` in [mibera-contracts](https://github.com/0xHoneyJar/mibera-contracts)
- Chain: Optimism (10)
- Block explorer: [Blockscout](https://optimism.blockscout.com/address/0x886D2176D899796cD1AfFA07Eff07B9b2B80f1be)
- Marketplace: [OpenSea](https://opensea.io/collection/mibera-sets)
- Mint site: [mibera.0xhoneyjar.xyz](https://mibera.0xhoneyjar.xyz/)
