# Ranking System

*The grading system used in Mibera.*

---

## How Swag Score is Calculated

The Swag Score determines a Mibera's rank and is calculated using multiple layers of scoring logic:

### Layer 1: Global Rarity

Each trait has an inherent rarity value based on its scarcity across the entire 10,000 Mibera collection. Rarer traits contribute more to the overall Swag Score. This follows similar logic to Milady's rarity system.

### Layer 2: Archetype Coherence (Tribe Alignment)

A Mibera's score is influenced by how many of its visible traits belong to the same Rave Tribe (Archetype). The key trait categories evaluated for tribe alignment are:

- Icon
- Hat
- Item
- Shirt
- Molecules Background

Higher percentage of traits from the same tribe = higher coherence bonus.

### Layer 3: Ancestor Trait Threshold

Miberas that pass a certain threshold of Ancestor-aligned traits receive additional scoring consideration. This reflects the time-travelling nature of Miberas across cultural lineages.

### Trait Naming Convention

Traits follow a systematic naming convention for programmatic scoring:

```
<rave_tribe>_<trait_type>_<trait_name>
```

Example: `freetekno_hat_pilot_cap`

This allows the scoring algorithm to automatically calculate tribe coherence percentages.

---

## Rank Tiers

| Rank | Rarity | Description |
|------|--------|-------------|
| SSS | Ultra Rare | Peak swag, bear-shaped perfection |
| SS | Very Rare | Heart-shaped excellence |
| S | Rare | Star quality |
| A | Uncommon | Solid, hexagonal reliability |
| B | Common | The everyday pill (most common) |
| C | Below Average | Showing wear |
| D | Low | Nearly crushed |
| F | Special | The laughing panda — a different kind of rare |

---


## All Entries

- [A](a.md)
- [B](b.md)
- [C](c.md)
- [D](d.md)
- [F](f.md)
- [S](s.md)
- [SS](ss.md)
- [SSS](sss.md)

