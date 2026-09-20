# Aetherion Outside — Design Notes

Standalone 3D slice in this repo only. Minecraft plugins are **inspiration**, never a source of copied Java.

## Scan of `aetherion-plugins` / Minecraft server world

This agent attempted a **read-only** scan of Peter’s Minecraft MMO-R sources:

| Attempt | Result |
| --- | --- |
| `aetherion-plugins` via `gh` / REST / shallow clone | **404 / not found** (token cannot see the repo) |
| Adjacent repos (`aetherion`, `aetherion-mc`, `aetherion-server`, `aetherion-world`, …) | 404 |
| Local `.mca` / world folders on the VM | none |

**No Minecraft world files were available to scan.** The harbour layout is therefore a **stylized rebuild of the hub fantasy** from the product brief (capital docks, guild, warehouse yard, moonpetal hill, Eldervale gate, lighthouse spit) — not a 1:1 voxel import.

If world access is granted later (repo, zip, or read-only SFTP), revise landmarks to match real coords / districts.

**No files were written to, committed, or pushed on `aetherion-plugins`.**

## Network fantasy (target, not cloned)

Aetherion plays as a **hub-and-spoke MMO-R**: you land in a social capital, take short punchy jobs, then peel off to skilled islands.

### Skills

| Skill | Network intent | Slice v0.1 |
| --- | --- | --- |
| Combat | Clear rift-touched pests / wildlife | Shade-rats in the warehouse yard; XP + fangs + shards |
| Foraging | Gather dusk reagents | Moonpetals on the plaza and north hill; channelled gather |
| Mining | Amethyst Mines loop | Plaza / hill crystals drop chips; distant purple isle |
| Farming | Farm Isle | Distant green isle; character sheet locked |
| Fishing | Fishing Isle | Repeatable dusk line at the pier; distant teal isle |

Combat + foraging are the two **quest** loops. Mining and fishing are playable harbour toys so the capital is not greybox. Farming waits on Farm Isle.

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

## Stack decision (quality over format dogma)

Peter allowed a native desktop app **or** a browser if the harbour looks and feels like a game. This slice uses **WebGL in a Chromium app window**:

- Godot and Unity are not on the VM that built this. Porting now would reset lighting, HUD, and the quest loop for no visual gain.
- Electron would wrap the same canvas in a huge `.exe`. The Edge/Chrome `--app` window is that wrapper, using the GPU browser already on Windows.
- `Play Aetherion Outside.vbs` is the one-click desktop launcher. `Pin to Desktop.vbs` / first launch writes `Aetherion Outside.lnk` on the Desktop.
- `npm run play` is the one-click local/web start for macOS/Linux.

A later Godot/Unity port is welcome once this loop is signed off — systems in `content.ts` / `store.ts` / `registry.ts` are renderer-agnostic.

## Architecture (this slice)

Clean modules, serializable snapshot — not plugin Java:

| Module | Role |
| --- | --- |
| `src/game/content.ts` | Skills (combat/forage/mine/fish/farm), NPCs, quest, vendor prices, zones |
| `src/game/systems.ts` | Quest state machine, save key |
| `src/game/store.ts` | HP, shards, inventory, target, chat, cooldowns, persist |
| `src/game/registry.ts` | Live entity handles (enemies, gather nodes) — netcode socket later |
| `src/actors/Player.tsx` | WoW camera (RMB look, wheel zoom, Tab target, ability 1) |

Island silhouettes stand in for Farm / Fishing / Eldervale / Amethyst Mines until those zones are walkable.

## What we refused

- Blocky voxel world, tic-tac floor, capsule-only “controller demo”.
- Shipping Java plugin packages into this tree.
- Hyperreal PBR tourist screenshot — this is readable fantasy silhouette + dusk grade.
