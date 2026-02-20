# Swag Scoring

*How every Mibera's swag score is calculated, and why.*

---

## What Swag Scores Measure

Swag scores give a numerical ranking to the overall visual swag of any one Mibera in the collection. Swag scores do not necessarily correlate to rarity, but generally speaking Miberas with higher swag scores will be of higher overall rarity in the collection.

Glasses, face accessories, earrings, masks, and hats were added to the scoring algorithm because those layers contributed meaningfully to the true visual swag of a Mibera — not including them made the swag scores appear to have no correlation to the true visual swag.

---

## The Formula

```
total_ss = (item × shirt × drug) + (2 × earrings) + hat + mask + face_acc + glasses
```

The multiplicative core (**item × shirt × drug**) means those three layers have outsized influence on the total score. Accessories are additive modifiers. Earrings are doubled.

If a Mibera doesn't have a particular accessory (null), that slot contributes 0.

### Worked Examples

**Mibera #6239** — Rank SSS, Score 103:

```
item:  Remilia Gun       = 5    shirt: Tonka             = 4
drug:  CBD               = 5    face_acc: Fluoro Pink    = 3

(5 × 4 × 5) + 0 + 0 + 0 + 3 + 0 = 100 + 3 = 103 ✓
```

**Mibera #435** — Rank S, Score 63:

```
item:  Bhang Cup         = 3    shirt: Dark Suit         = 5
drug:  St. John's Wort   = 4    glasses: Mottega Yellow  = 3

(3 × 5 × 4) + 0 + 0 + 0 + 0 + 3 = 60 + 3 = 63 ✓
```

**Mibera #7797** — Rank D, Score 13 (Singapore Jani 1 mask):

```
item:  Ayahuasca Dose    = 2    shirt: Reborn            = 2
drug:  Kykeon            = 2    mask:  Singapore Jani 1   = 5

(2 × 2 × 2) + 0 + 0 + 5 + 0 + 0 = 8 + 5 = 13 ✓
```

Even with the mask at 5 (max), a low multiplicative core (2 × 2 × 2 = 8) keeps the total low. That's what "bad luck" looks like.

---

## Scoring Methods

Each trait's 1–5 score was determined using one of two methods.

### Method 1: Visual Swag Assessment

**Applied to:** item, hat, mask, shirt, face accessory

Gumi and Zergucci (along with other team members early on) evaluated every individual layer in these categories on a scale of 1 to 5 — 1 being the least swag, 5 being the most swag. While "swag" is subjective to the evaluator, the general rule was: a plain colored t-shirt should be considered low swag, but something really out there/unique and hard to pull off should be given a higher swag rank.

For these categories, the swag score also influences the actual **rarity** of layers in the collection via a bell curve system:

| Swag Score | Relative Rarity |
|------------|----------------|
| 1 | Rarest |
| 2 | 2× as common as 1 |
| 3 | 3× as common as 1 |
| 4 | 2× as common as 1 |
| 5 | Rarest |

This makes items at either end of the swag spectrum rarer in the total collection.

**Important:** Not all layers with identical swag scores have the same rarity in the entire collection due to different total build numbers for different types of Miberas. For example, there are 7,569 "normal" Miberas but only 1,000 Miberas with long sleeves — a long sleeve with swag score 3 is still rarer in the overall collection than a normal shirt with swag score 5 or 1.

### Method 2: Rarity-Based Assessment

**Applied to:** glasses, drugs

For these categories, the collection was generated first without assigning swag scores. Afterward, the number of unique occurrences of each possible layer in the collection was counted and swag scores were assigned based on frequency:

- Least frequent layers → swag score 5
- Most frequent layers → swag score 1

This helps align the swag score with the general collection rarity displayed on platforms like OpenSea and Magic Eden.

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

## Look Up Your Scores

Every trait's swag score: **[Trait Scores →](trait-scores.md)**

*Source: Zergucci (co-creator), describing the methodology used by Gumi, Zergucci, and other team members.*
