# Shadow Traits — VendingMachine System

> On-chain trait uniqueness via keccak256 hashing. Each Shadow Trait combination can only exist once.

## Overview

The VendingMachine is an upgradeable ERC-721 contract that mints "Mibera Shadow Traits" (MST). It enforces that every trait combination is globally unique — if someone mints a specific set of traits, no one else can ever mint the same combination.

This is the on-chain layer that makes Shadow Traits scarce. The codex documents the visual traits; the VendingMachine enforces their on-chain uniqueness.

## Contract

| Name | Address | Chain | Standard |
|------|---------|-------|----------|
| Mibera Shadows (VendingMachine) | `0x048327A187b944ddac61c6e202BfccD20d17c008` | Berachain | ERC-721 (UUPS Proxy) |

## Mechanics

### Trait Hashing

When a user mints, they pass a `_traits` string. The contract hashes it:

```
bytes32 hashedTraits = keccak256(abi.encodePacked(_traits))
```

The hash is stored in `traitsUsed[hash] = true`. If that hash already exists, the transaction reverts with `AlreadyExists()`. This guarantees every Shadow Trait combination is a 1-of-1.

### Minting (the `shop` function)

```
function shop(string calldata _traits) external payable
```

1. Caller pays exactly `price` in native BERA (reverts with `WrongMoney()` if not exact)
2. Trait string is hashed via keccak256
3. If hash exists in `traitsUsed`, revert `AlreadyExists()`
4. Mark hash as used
5. Mint sequential token ID to caller
6. Transfer full payment to treasury
7. Emit `Minted(user, tokenId, traits)` event — the trait string is logged on-chain

### Checking Uniqueness

```
function areTraitsUsed(string calldata _traits) external view returns (bool)
```

Anyone can check if a specific trait combination has already been claimed.

### UUPS Proxy Pattern

The contract uses OpenZeppelin's UUPS upgradeable pattern:
- Implementation can be upgraded by the owner
- V2 added `setTreasury()` to allow changing the treasury address post-deployment
- Storage layout preserved via `uint256[45] __gap`

## Key Constants

| Parameter | Value | Notes |
|-----------|-------|-------|
| Token name | "Mibera Shadow Traits" | |
| Token symbol | "MST" | |
| Initial price | `type(uint256).max` | Effectively disabled until owner sets real price |
| Treasury | Receives 100% of mint proceeds | |

## V1 → V2 Changes

The only addition in V2 is `setTreasury(address)` — allows the owner to redirect mint proceeds to a new treasury address. All other logic is identical.

## Relationship to Main Collection

Shadow Traits are independent tokens — they don't require ownership of a main Mibera NFT. They represent custom trait combinations that anyone can mint (as long as the combination hasn't been claimed). The "shadow" aspect is that these traits exist alongside the generative Mibera traits but on a separate contract.

## Source

- Contract V1: `honey-road/src/VendingMachine.sol` in [mibera-contracts](https://github.com/0xHoneyJar/mibera-contracts)
- Contract V2: `honey-road/src/VendingMachineV2.sol`
- Deployed proxy: `0x048327A187b944ddac61c6e202BfccD20d17c008`
- Standard: ERC-721 Upgradeable (UUPS)
- Chain: Berachain (80094)
