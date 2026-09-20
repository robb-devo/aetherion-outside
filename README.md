# Aetherion Outside

Standalone **stylized 3D action-RPG** slice inspired by Peter’s Aetherion MMO-R network.

**Not** Minecraft. **Not** a plugin client. **Not** a capsule tech demo. Third-person harbour fantasy with a World of Warcraft-style camera, action bar, quest log, and zone atmosphere.

Minecraft plugins in `aetherion-plugins` are **read-only inspiration**. This repository never modifies that tree. See [`docs/aetherion-design-notes.md`](docs/aetherion-design-notes.md).

## Engine

Godot 4 and Unity are not installed on the build VM. v0.1 uses **Vite + React Three Fiber + Rapier + postprocessing** (browser + a Windows desktop launcher). Game state is a serializable Zustand snapshot so netcode can sit on top later.

## Play on Windows (desktop)

Copy the **entire** folder:

| From (this repo) | To (Peter’s machine) |
| --- | --- |
| `release/windows/` | `C:\Users\Robbi\Desktop\Aetherion Outside\` |

Then double-click:

`C:\Users\Robbi\Desktop\Aetherion Outside\Aetherion Outside.bat`

A browser opens at `http://127.0.0.1:8088/`. Leave the console window open while you play. Details: [`release/windows/COPY-TO-DESKTOP.txt`](release/windows/COPY-TO-DESKTOP.txt).

Rebuild that folder after code changes:

```bash
npm install
npm run package:windows
```

## Play in a browser (dev)

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. **Enter the Harbour**.

## Controls (WoW-like)

| Input | Action |
| --- | --- |
| Hold **right mouse** | Look |
| **Wheel** | Zoom |
| **Both mouse buttons** | Walk forward |
| WASD | Move |
| Shift | Sprint |
| Space | Jump |
| **1** or F | Strike |
| **Tab** | Target / cycle |
| E | Talk, gather, mine, fish, jump pad |
| 5 | Drink harbour tonic |
| C | Character / skills (all five professions) |
| B or I | Bags |
| **L** | Quest log |
| M | Map |
| H | Primer |
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
