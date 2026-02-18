# Candies Marketplace Mechanics

> ERC-1155 collectible candies with a 0.1% seizure mechanic and up to 42% Mibera holder discounts.

## Overview

The Candies system consists of two contracts: **Candies** (ERC-1155 token) and **CandiesMarket** (marketplace). The market sells candy tokens at set prices with supply limits. Two distinctive mechanics make it unique: a random seizure event and a Mibera-holder discount system.

## Contracts

| Name | Address | Chain | Standard |
|------|---------|-------|----------|
| Candies | `0xecA03517c5195F1edD634DA6D690D6c72407c40c` | Berachain | ERC-1155 |
| CandiesMarket | `0x80283fbF2b8E50f6Ddf9bfc4a90A8336Bc90E38F` | Berachain | Custom (UUPS Proxy) |

## Candies Token (ERC-1155)

A standard ERC-1155 with one constraint: **only the market contract can mint**. The `mint` function reverts with `NotMarket()` if called by anyone else.

Each candy type is identified by a numeric ID. Metadata served via `baseURI + tokenId`.

## CandiesMarket Mechanics

### Candy Configuration

Each candy has a struct:

```solidity
struct Candy {
    uint128 price;       // Price in wei per unit
    uint64  currentSupply; // How many have been minted
    uint64  maxSupply;     // Cap (0 = unlimited)
}
```

Owner can set prices and max supplies. The reserved ID `69420` cannot be configured — it's reserved for the seizure mechanic.

### The Checkout Flow

```
function checkout(uint256[] calldata ids, uint64[] calldata amounts) public payable
```

1. Calculate total cost across all items
2. Roll the seizure check (0.1% chance)
3. If seized: buyer receives SEIZED_ID candy instead of their order, supply not incremented
4. If normal: mint all requested candies, calculate Mibera holder discount, refund excess + discount

### The Seizure Mechanic (SEIZED_ID = 69420)

On every purchase, `_shouldSeize()` runs:

```solidity
uint256 rand = uint256(keccak256(abi.encodePacked(
    block.timestamp, block.prevrandao, msg.sender
))) % 1000;
if (rand == 0) return true; // 0.1% chance
```

If seized:
- Buyer pays full price but receives **nothing they ordered**
- Instead they get 1x token ID `69420` (the seized candy)
- Supply counters for the original items are NOT incremented
- `BuyerGotLucky(buyer)` event emitted (ironic naming)

### Mibera Holder Discount

After checkout (non-seized), the contract checks how many Mibera NFTs the buyer holds:

```solidity
uint256 maxDiscountBps = 4200; // 42% maximum
uint256 discountBps = miberaBalance >= 42 ? maxDiscountBps : miberaBalance * 42;
discount = (toPay * discountBps) / 10000;
```

| Miberas Held | Discount |
|-------------|----------|
| 0 | 0% |
| 1 | 0.42% |
| 5 | 2.1% |
| 10 | 4.2% |
| 20 | 8.4% |
| 42+ | 42% (max) |

The discount is refunded in native BERA after the purchase.

### V1 → V2 Changes

V2 adds a `treasury` address and changes `collect()` to send funds to treasury instead of owner. Also adds `setTreasury()`. All marketplace logic is identical.

## Key Constants

| Constant | Value | Context |
|----------|-------|---------|
| `SEIZED_ID` | 69420 | Reserved candy ID for seizure events |
| Seizure probability | 0.1% (1/1000) | Per checkout transaction |
| `maxDiscountBps` | 4200 | 42% maximum discount |
| Discount per Mibera | 42 bps (0.42%) | Linear scaling |
| Max Miberas for discount | 42 | Holding 42+ Miberas = max discount |

## Source

- Candies token: `honey-road/src/Candies.sol` in [mibera-contracts](https://github.com/0xHoneyJar/mibera-contracts)
- Market V1: `honey-road/src/CandiesMarket.sol`
- Market V2: `honey-road/src/CandiesMarketV2.sol`
- Chain: Berachain (80094)
