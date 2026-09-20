# Aetherion Outside

Standalone **stylized 3D action-RPG** slice inspired by Peter’s Aetherion MMO-R network.

**Not** Minecraft. **Not** a plugin client. **Not** a capsule tech demo. Third-person harbour fantasy with a World of Warcraft-style camera, action bar, quest log, and zone atmosphere.

Minecraft plugins in `aetherion-plugins` are **read-only inspiration**. This repository never modifies that tree. See [`docs/aetherion-design-notes.md`](docs/aetherion-design-notes.md).

## Stack (quality over format)

Picked for **visual quality + playability**, not for “must be an .exe”:

| Option | Why not for this slice |
| --- | --- |
| Godot 4 / Unity | Not installed on the build VM. Rebuilding the harbour from zero would throw away the playable dusk lighting, bloom, water, and WoW HUD. |
| Electron Windows `.exe` | Same WebGL picture, ~150MB Chromium blob that does not belong in git. |
| **This slice** | WebGL (Vite + React Three Fiber + Rapier + postFX) in a **tab-less Edge/Chrome app window**. Same GPU path as a native wrapper; launch is still one double-click. |

Browser is the engine. The Windows launcher makes it *feel* like a desktop game.

## Play on Windows (one folder — always overwrite)

**Same path every update. Do not create a second Desktop folder.**

1. Copy `release/windows/` **into** this existing folder and **replace** files when asked:

   `C:\Users\Robbi\Desktop\Aetherion Outside\`

2. Double-click the **same** launcher every time:

   `C:\Users\Robbi\Desktop\Aetherion Outside\Play Aetherion Outside.vbs`

Optional: `Pin to Desktop.vbs` → always `C:\Users\Robbi\Desktop\Aetherion Outside.lnk`

Never “Aetherion Outside (2)” / “Copy” / “new”. Details: [`release/windows/COPY-TO-DESKTOP.txt`](release/windows/COPY-TO-DESKTOP.txt).

Rebuild in the repo (overwrites `release/windows/game/` in place): `npm run package:windows`

## Play in a browser (one click, local)

```bash
npm install
npm run play
```

That starts Vite and opens `http://localhost:5173`. Equivalent: `npm start` then visit that URL.

**Enter the Harbour**.

## Controls (WoW-like)

| Input | Action |
| --- | --- |
| Hold **right mouse** | Look (sword) / Aim (bow) |
| **Left click** | Sword: combo strike · Bow (while aiming): hold to draw |
| Release **left click** | Bow: shoot |
| **1** | Equip sword + strike |
| **2** | Equip bow |
| **Wheel** | Zoom (sword mode) |
| **Both mouse buttons** | Walk forward (sword) |
| WASD | Move |
| Shift | Sprint |
| Space | Jump |
| **Tab** | Target / cycle |
| E | Talk, gather, mine, fish, jump pad |
| 5 | Drink harbour tonic |
| C | Character / skills (all five professions) |
| B or I | Bags |
| **L** | Quest log |
| M | Map |
| H | Primer |
| F11 | Fullscreen |
| Esc | Close / clear target |

## Systems in this slice

| System | In the harbour |
| --- | --- |
| Hub | Authored Harbour of Dusk + distant isles (Eldervale, Farm, Fishing, Amethyst Mines) |
| Combat | Shade-rats, Tab target, Strike (1), target frame |
| Foraging | Moonpetals |
| Mining | Amethyst chips at plaza / hill crystals |
| Fishing | Repeatable dusk line at the pier |
| Farming | On the character sheet, locked to Farm Isle |
| Quest | **Dusk Lanterns** — Corin → 3 petals + 3 rats → shards + Dusk Lantern |
| Economy | Shards, Lila buys petals / sells tonic |

Save is local (`Continue` on the title if you have been here).

## What’s next

- Farm Isle / Eldervale as walkable zones behind the gate
- Tab-target dungeon beat
- Auction-style shard board
- Optional multiplayer on the existing snapshot + `registry` handles
- Optional Godot/Unity port *after* this loop is signed off (same systems, new renderer)
