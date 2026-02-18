# Archetype Quiz — MiberaArchetypeAlignment (miChainMirror)

> Soulbound archetype assignment via on-chain quiz. One token per wallet, permanently bound.

## Overview

The Archetype Quiz is a soulbound NFT system on Berachain that assigns each participant an archetype. Users take an off-chain quiz (the "Tarot Quiz") that determines their archetype alignment, then mint a non-transferable token recording that result on-chain. The contract is named `MiberaArchetypeAlignment` with token name "miChainMirror" and symbol "MIRA".

The contract itself does not contain quiz logic or archetype assignment — it is a pure soulbound minting contract. The quiz happens off-chain (likely via the Mibera frontend), and the resulting archetype is encoded in the token's metadata served through the `baseURI`.

## Contract

| Field | Value |
|-------|-------|
| Contract name | `MiberaArchetypeAlignment` |
| Token name | miChainMirror |
| Token symbol | MIRA |
| Address | `0x4B08a069381EfbB9f08C73D6B2e975C9BE3c4684` |
| Chain | Berachain (80094) |
| Standard | ERC-721 Enumerable (soulbound) |
| Compiler | Solidity 0.8.26 |

## Mechanics

### Soulbound Enforcement

The `_update` function is overridden to only allow minting (transfers from `address(0)`). Any transfer between addresses or burning reverts with `SoulboundTokensCannotBeTransferred()`. The `approve` and `setApprovalForAll` functions also revert unconditionally.

### Minting

```
function mint() external
```

1. Reverts with `MintingPaused()` if paused
2. Reverts with `AddressAlreadyHasToken()` if caller already holds a token (enforced in `_update` via `balanceOf(to) > 0`)
3. Token ID is assigned sequentially from `totalSupply()`
4. Emits `Minted(address to, uint256 tokenId)`

Minting is free (no payment required). One token per address, permanently.

### Token Lookup

```
function getTokenIdOfOwner(address owner) external view returns (uint256)
```

Returns the token ID for a given address, or `type(uint256).max` if the address holds no token. Since each address can hold at most one token, this is a direct lookup via `tokenOfOwnerByIndex(owner, 0)`.

### Metadata

Token metadata is served via `baseURI + tokenId`. The base URI is set by the contract owner via `setBaseURI(string)`. A `triggerBatchMetadataUpdate()` function emits `BatchMetadataUpdate(0, type(uint256).max)` to signal indexers that all token metadata has changed.

<!-- GAP: The actual baseURI value and metadata JSON schema are unknown. The metadata likely encodes the quiz result (archetype assignment, tarot card, or alignment details), but the structure has not been inspected on-chain. -->

### Owner Functions

| Function | Purpose |
|----------|---------|
| `setBaseURI(string)` | Update metadata endpoint |
| `setPaused(bool)` | Enable/disable minting |
| `triggerBatchMetadataUpdate()` | Signal metadata refresh to indexers |
| `transferOwnership(address)` | Transfer contract ownership |
| `renounceOwnership()` | Remove contract owner |

## Quiz-to-Chain Flow

The archetype assignment happens in two layers:

1. **Off-chain quiz**: Users answer questions on the Mibera frontend (the "Tarot Quiz" or "Archetype Quiz"). The quiz determines which of the four archetypes the user aligns with.
2. **On-chain mint**: The user calls `mint()` to create their soulbound token. The token ID is sequential and carries no on-chain archetype data — the archetype result is encoded in the off-chain metadata served at the token URI.

<!-- GAP: The exact quiz questions, scoring algorithm, and how quiz results map to metadata tokenIDs are unknown. It is unclear whether the frontend enforces that a user must complete the quiz before minting, or whether any wallet can mint freely and the metadata is assigned server-side based on quiz completion records. -->

<!-- GAP: It is unknown whether the quiz assigns one of the 4 primary archetypes (Freetekno, Milady, Chicago Detroit, Acidhouse) or a more granular result involving tarot cards, elements, or ancestors. The contract name "ArchetypeAlignment" and the token name "miChainMirror" suggest the result is an archetype alignment that "mirrors" the user's identity on-chain. -->

## Relationship to the 10 Archetypes

The Mibera universe defines four primary archetypes tied to zodiac signs and rave eras:

| Archetype | Zodiac Signs | Season | Era |
|-----------|--------------|--------|-----|
| **Freetekno** | Cancer, Leo, Virgo | Summer | Early-Late 90s |
| **Milady** | Capricorn, Aquarius, Pisces | Winter | Current |
| **Chicago Detroit** | Aries, Taurus, Gemini | Spring | Early 80s |
| **Acidhouse** | Libra, Scorpio, Sagittarius | Fall | Late 90s / 2000s |

In the main Mibera collection (10,000 NFTs), archetypes are assigned based on astrological birth data. The Archetype Quiz likely offers an alternative path — rather than birth chart data, users answer personality/preference questions that map to the same archetype framework.

<!-- GAP: The sprint plan references "10 archetypes" but the codex documents only 4 primary archetypes. It is possible the quiz uses a finer-grained classification (e.g., sub-archetypes or archetype + ancestor combinations), or the "10" may refer to a different categorization system. The exact mapping between quiz outcomes and the documented archetypes has not been confirmed. -->

## Relationship to the Drug-Tarot System

The Mibera codex maps 78 tarot cards to 78 drugs across four suits (Wands/Fire, Cups/Water, Swords/Air, Pentacles/Earth). Each archetype has natural affinities with certain drug categories. The "Tarot Quiz" name suggests the quiz may incorporate tarot card symbolism in its question framing or result presentation.

<!-- GAP: It is unknown whether the quiz result includes a specific tarot card assignment alongside the archetype, or whether "Tarot Quiz" is simply the colloquial name for the archetype alignment quiz. The contract and ABI contain no tarot-specific data structures. -->

## Key Errors

| Error | Trigger |
|-------|---------|
| `SoulboundTokensCannotBeTransferred()` | Any transfer, approval, or burn attempt |
| `AddressAlreadyHasToken()` | Minting when caller already holds a token |
| `MintingPaused()` | Minting when contract is paused |

## Key Events

| Event | Emitted When |
|-------|-------------|
| `Minted(address to, uint256 tokenId)` | Successful mint |
| `BatchMetadataUpdate(uint256, uint256)` | Owner triggers metadata refresh or updates base URI |

## Comparison with Other Soulbound Contracts

| Feature | ArchetypeAlignment (MIRA) | FracturedMibera | Shadow Traits (MST) |
|---------|--------------------------|-----------------|---------------------|
| Soulbound | Yes | Yes | No (standard ERC-721) |
| One per wallet | Yes | One per Mibera ID | No limit |
| Mint cost | Free | Paid (BERA) | Paid (BERA) |
| Requires main Mibera | No | Yes (ownership check) | No |
| On-chain trait data | None (metadata only) | None (metadata only) | Trait string hashed on-chain |
| Upgradeable | No | No | Yes (UUPS Proxy) |

## Source

- Verified source: `src/MiberaArchetypeAlignment.sol` (retrieved from Routescan verified contract)
- GitHub repo: [mibera-contracts](https://github.com/0xHoneyJar/mibera-contracts) (private — source not accessible via public GitHub API)
- Dependencies: OpenZeppelin Contracts v5.x (`ERC721`, `ERC721Enumerable`, `Ownable`), Solady (`LibString`)
- Chain: Berachain (80094)
