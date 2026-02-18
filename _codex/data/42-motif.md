# The "42" Motif — On-Chain Numerology

> The number 42 is woven through every layer of the Mibera ecosystem, from contract constants to lore.

## Overview

The number 42 appears across the Mibera ecosystem as a recurring design motif. Every major contract contains at least one reference to 42 or its derivatives (4.2, 420, 4200, 69420). This is intentional — a signature that connects the on-chain mechanics to the project's identity.

## On-Chain References

| Instance | Value | Contract | Source Reference |
|----------|-------|----------|-----------------|
| Mint price | 4.2 BERA | Mibera.sol | Deployment configuration |
| Interest rate | 4.20% (420 bps) | Treasury.sol | `INTEREST_RATE` constant |
| Term limit | 4.2 months | Treasury.sol | Deployment parameter |
| NoFloat value | 42 WETH | Treasury.sol | Deployment parameter |
| Royalty percent | 4% | Treasury.sol | `ROYALTY_PERCENT` |
| Creator percent | 4% | Treasury.sol | `CREATOR_PERCENT` |
| Max holder discount | 42% (4200 bps) | CandiesMarket.sol | `maxDiscountBps = 4200` |
| Discount per Mibera | 0.42% (42 bps) | CandiesMarket.sol | `miberaBalance * 42` |
| Miberas for max discount | 42 | CandiesMarket.sol | `miberaBalance >= 42` |
| Seized candy ID | 69420 | CandiesMarket.sol | `SEIZED_ID = 69420` |

## Lore References

| Instance | Value | Source |
|----------|-------|--------|
| Hand-drawn Grails | 42 | Codex canon — 42 unique 1/1 art pieces |
| Contract address prefix | 0x6666... | Mibera Maker — repeating 6s |
| WETH address | 0x6969...6969 | Berachain standard — all 6s and 9s |

## The Treasury "42" System

The Treasury contract is the densest concentration of the motif:

- **4.20% annual interest** on backing loans — the rate at which collateralized NFTs accrue debt
- **4.2 month term limit** — maximum loan duration before liquidation
- **42 WETH NoFloat** — the floor value threshold
- **4% royalty + 4% creator** fee split — approximating 4.2% on each side

These aren't arbitrary numbers. They create a self-referential system where the economic parameters echo the project's numerological identity.

## The CandiesMarket "42" System

The discount mechanic is built entirely around 42:

- Each Mibera NFT held gives **42 basis points** (0.42%) discount
- Holding **42 or more** Miberas gives the maximum **42%** discount (4200 bps)
- The seized candy has ID **69420** — combining 69 (internet culture) with 420

## The Deeper Pattern

42 is the "Answer to the Ultimate Question of Life, the Universe, and Everything" (Douglas Adams, *The Hitchhiker's Guide to the Galaxy*). For Mibera — a project about time-travelling Beras carrying the eternal flame of the Rave — embedding this number into every economic parameter is both a cultural reference and a design signature.

It also serves a practical purpose: any ecosystem participant who sees 4.2, 42, or 420 in a contract parameter immediately knows it's part of the Mibera ecosystem.

## Source

- Treasury constants: `mibera/src/Treasury.sol` in [mibera-contracts](https://github.com/0xHoneyJar/mibera-contracts)
- CandiesMarket constants: `honey-road/src/CandiesMarket.sol`
- Deployment parameters: `mibera/deployments.txt`
- Lore: Mibera Codex (`grails/README.md`, `README.md`)
