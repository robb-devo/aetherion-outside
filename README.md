# Aetherion Outside

Standalone **stylized 3D action-RPG** slice inspired by Peter’s Aetherion MMO-R network.

This is **not** a Minecraft clone, **not** a plugin client, and **not** a capsule/tic-tac tech demo. It is a third-person harbour fantasy: authored landmarks, a dusk quest, combat + foraging, and a WoW-like HUD.

Minecraft plugins in `aetherion-plugins` are **read-only inspiration**. This repository never modifies that tree. See [`docs/aetherion-design-notes.md`](docs/aetherion-design-notes.md).

## Engine choice

| Option | On this VM? | Decision |
| --- | --- | --- |
| Godot 4 | Not installed | — |
| Unity | Not installed | — |
| **Three.js + React Three Fiber + Rapier** | Node 22 + Chrome available | **Used for v0.1** |

R3F lets the slice run in the browser, keep a serializable game store (ready for netcode), and still hit lighting, fog, bloom, water, and a third-person camera. If Godot lands in the environment later, the *design* (hub, skills, quest) ports; the *code* here is the playable reference.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. Click **Enter the Harbour**.

```bash
npm run build
npm run preview
```

## Controls

| Input | Action |
| --- | --- |
| Click canvas | Mouse look (pointer lock) |
| WASD | Move |
| Shift | Sprint |
| Space | Jump |
| Mouse / F | Sword |
| E | Talk, gather, jump pad |
| C | Skills |
| I | Inventory |
| H / Esc | Primer / close |

## What’s in the slice (v0.1)

- **Harbour of Dusk** — lighthouse, guild hall, tavern, market, warehouse yard, moonpetal hill, Eldervale gate, docked ships, distant isles (Eldervale, Farm, Fishing, Amethyst Mines).
- **Third-person adventurer** with cloak, hood, sword, walk/run/jump/attack.
- **Combat** — shade-rats, HP bars, shards + combat XP.
- **Foraging** — moonpetals, channelled gather, foraging XP.
- **Quest: Dusk Lanterns** — Harbourmaster Corin → petals + rats → shards + *Dusk Lantern* cosmetic.
- **HUD** — HP, skill XP, shards, minimap, quest tracker, dialog, inventory/skills panels.
- **Flair** — jump pad, lantern bloom, water shader, dusk sky, fireflies.

## What’s next

- Mining / fishing / farming as real islands behind the Eldervale gate.
- Tab-target + more enemy types; a short dungeon beat.
- Shard vendor stock (Lila).
- Optional multiplayer: replicate the Zustand snapshot + `registry` handles.
- Godot 4 port if the editor is available in CI / the VM.

## Credits

- Dusk HDRI: [Poly Haven — The Sky Is On Fire](https://polyhaven.com/a/the_sky_is_on_fire) (CC0), stored at `public/env/dusk.hdr`.
- Fonts: Cinzel + Source Sans 3 (Google Fonts).
- Aetherion fiction: original to this slice; plugin systems mapped at a design level only.
