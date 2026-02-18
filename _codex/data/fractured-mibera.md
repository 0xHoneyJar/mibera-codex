# FracturedMibera — Soulbound Companion Collections

> 10 non-transferable ERC-721 collections tied to main Mibera token IDs.

## Overview

FracturedMibera is a set of 10 soulbound (non-transferable) NFT collections on Berachain. Each collection is an independent ERC-721 contract where token IDs mirror the main Mibera collection — if you own Mibera #42, you can mint FracturedMibera #42 in each of the 10 collections.

Tokens cannot be transferred, approved, or burned after minting. They are permanently bound to the minting wallet.

## Contracts

| # | Address | Chain |
|---|---------|-------|
| 1 | `0x6956dae88C00372B1A0b2dfBfE5Eed19F85b0D4B` | Berachain |
| 2 | `0x8D4972bd5D2df474e71da6676a365fB549853991` | Berachain |
| 3 | `0x77ec6B83495974a5B2C5BEf943b0f2e5aCd8Fc26` | Berachain |
| 4 | `0xc557Bf6C7d21BA98A40dDfE2BEAbA682C49D17A9` | Berachain |
| 5 | `0xbcb082bB41E892f29d9c600eaadEA698d5f712Ef` | Berachain |
| 6 | `0x2030f226Bf9a0c88687e83AcCdcEfb7Dae260094` | Berachain |
| 7 | `0xcc426F9375c5edcef5CA6bDb0449c07113348cF7` | Berachain |
| 8 | `0xF68f40230E39067Ee7c98Fe9A8641fC124c5BE60` | Berachain |
| 9 | `0xFc79B1BcCa172FF5a8F74205C82F5CBB0125Dd10` | Berachain |
| 10 | `0xa3d3EF45712631A6Fb50c677762b8653f932cf71` | Berachain |

All contracts reference the main Mibera collection at `0x6666397DFe9a8c469BF65dc744CB1C733416c420`.

## Mechanics

### Soulbound Enforcement

The `_update` function is overridden to only allow minting (transfers from `address(0)`). Any transfer between addresses or burning reverts with `SoulboundTokensCannotBeTransferred()`. The `approve` and `setApprovalForAll` functions also revert.

### Minting

```
function mint(uint256[] calldata tokenIds) external payable
```

- Caller must own the corresponding Mibera token ID for each requested mint
- Batch minting supported — pass multiple token IDs in one transaction
- Payment: `mintPrice * tokenIds.length` in native BERA
- Ownership verified via `_mibera.ownerOf(tokenIds[i]) != msg.sender`

### Configuration

- `mintPrice` — configurable by owner
- `__baseURI` — metadata base URI, configurable by owner
- `withdraw()` — owner can withdraw collected mint fees

## Deployment

All 10 collections were deployed from a single script (`DeployFractured.s.sol`) that reads configuration from `fracturedData.json`:
- Collection names and symbols
- Shared mint price
- Reference to main Mibera contract address

## Relationship to Main Collection

- Token IDs are 1:1 with main Mibera collection (token #42 mints FracturedMibera #42)
- Ownership of the main Mibera NFT is required at mint time
- After minting, the Fractured token is independent (selling the main Mibera does not affect the Fractured token, but it cannot be transferred anyway)

## Source

- Contract: `mibera/src/FracturedMibera.sol` in [mibera-contracts](https://github.com/0xHoneyJar/mibera-contracts)
- Deploy script: `mibera/script/DeployFractured.s.sol`
- Standard: ERC-721 (soulbound — transfer restricted)
- Chain: Berachain (80094)
