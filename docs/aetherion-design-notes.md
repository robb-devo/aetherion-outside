# Aetherion Outside — Design Notes

Standalone 3D slice in this repo only. Minecraft plugins are **inspiration**, never a source of copied Java.

## Scan of `aetherion-plugins`

This agent attempted a **read-only** scan of `https://github.com/robb-devo/aetherion-plugins`:

| Attempt | Result |
| --- | --- |
| `gh repo view` / GitHub REST tree / contents / README | **404 Not Found** (token cannot see the repo — private or not on this org) |
| `git clone --depth 1` (no push, temp path) | `Repository not found` |
| Adjacent names (`aetherion`, `aetherion-mc`) under `robb-devo` | 404 |
| GitHub code search for the org | No accessible plugin tree |

**No files were written to, committed, or pushed on that repository.** Design below is mapped from the product brief (skills, hub/islands, quests, shards, jump pads, cosmetics) plus typical MMO-R hub pacing — not from decompiled or copied plugin code.

If the plugins repo is granted read access later, this document should be revised with concrete NPC names, island layouts, and skill formulas from that scan.

## Network fantasy (target, not cloned)

Aetherion plays as a **hub-and-spoke MMO-R**: you land in a social capital, take short punchy jobs, then peel off to skilled islands.

### Skills

| Skill | Network intent | Slice v0.1 |
| --- | --- | --- |
| Combat | Clear rift-touched pests / wildlife | Shade-rats in the warehouse yard; XP + fangs + shards |
| Foraging | Gather dusk reagents | Moonpetals on the north hill; channelled gather |
| Mining | Amethyst Mines loop | Landmark only (distant purple isle + crystal shrine) |
| Farming | Farm Isle | Distant green isle silhouette |
| Fishing | Fishing Isle | Distant teal isle + docked ships / piers as flair |

Combat + foraging are the two **playable** loops. The others exist as readable geography so the harbour feels like a capital, not a greybox.

### Hub and islands

| Place | Role | Slice |
| --- | --- | --- |
| Harbour / Capital | Social spawn, vendors, quest board energy | Fully playable authored zone |
| Eldervale | Adventure / overland spoke | Stone gate + “coming later” arch |
| Farm / Fishing / Forage isles | Skill islands | Horizon silhouettes |
| Amethyst Mines | Mining / crystal identity | Horizon isle + plaza crystals |

### Quests and NPCs

Dialog is **short and punchy** (two beats, then a verb). No lore walls.

- **Harbourmaster Corin** — quest giver, dusk ledgers
- **Wren** — forager on the hill
- **Captain Brann** — combat flavour at the yard
- **Lila** — shard merchant at the stalls

Quest **Dusk Lanterns**: talk → 3 moonpetals + 3 shade-rats → turn-in → shards, XP, *Dusk Lantern* cosmetic.

### Economy

**Shards** are the harbour currency (not Minecraft coins, not diamonds). v0.1: starting pouch, combat drops, quest payout. No auction house yet.

### Flair

- **Jump pad** on the plaza — amethyst disc, launches toward the lighthouse spit (network “pad” language as traversal toy).
- **Cosmetics**: starting Traveler's Cloak; Dusk Lantern reward.
- Lighthouse beam, lantern bloom, fireflies, bobbing ships.

## Vertical slice pillars

1. Third-person body you can read at a glance (cloak, hood, sword — not a capsule).
2. Authored harbour with named landmarks and NPC plates.
3. Two skill loops feeding a shared HUD (HP, skill XP, shards, minimap, quest tracker).
4. One complete quest state machine: `idle → active → turnin → done`.
5. Inventory + skills panels that look like a game, not debug overlays.
6. Stylized dusk: fog, bloom, ACES, lanterns, amethyst accents.

## Architecture (online later)

v0.1 is local Zustand. State is already serializable (`skills`, `inventory`, `questStage`, `shards`, `hp`). `registry.ts` is the entity socket: later a netcode layer can own the same handles (enemy HP, gather nodes, NPC gossip). No Minecraft protocol.

## What we refused

- Blocky voxel world, tic-tac floor, capsule-only “controller demo”.
- Shipping Java plugin packages into this tree.
- Hyperreal PBR tourist screenshot — this is readable fantasy silhouette + dusk grade.
