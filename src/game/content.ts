export type SkillId = "combat" | "foraging" | "mining" | "fishing" | "farming";

export type ItemDef = {
  id: string;
  name: string;
  flavor: string;
  icon: string;
  sellShards?: number;
};

export const ITEMS: Record<string, ItemDef> = {
  moonpetal: {
    id: "moonpetal",
    name: "Moonpetal",
    flavor: "Opens only at dusk. Wick-makers pay well.",
    icon: "❀",
    sellShards: 3,
  },
  shade_fang: {
    id: "shade_fang",
    name: "Shade Fang",
    flavor: "Still cold. Still humming.",
    icon: "⚔",
    sellShards: 2,
  },
  amethyst_chip: {
    id: "amethyst_chip",
    name: "Amethyst Chip",
    flavor: "A splinter of the Mines' colour.",
    icon: "◆",
    sellShards: 4,
  },
  duskfin: {
    id: "duskfin",
    name: "Duskfin",
    flavor: "Silver-violet. Best fried on the pier.",
    icon: "🎣",
    sellShards: 3,
  },
  health_tonic: {
    id: "health_tonic",
    name: "Harbour Tonic",
    flavor: "Lila's stock. Tastes like brine and honey.",
    icon: "✚",
  },
  dusk_lantern: {
    id: "dusk_lantern",
    name: "Dusk Lantern",
    flavor: "Harbour cosmetic. Burns with a violet edge.",
    icon: "🕯",
  },
  traveler_cloak: {
    id: "traveler_cloak",
    name: "Traveler's Cloak",
    flavor: "You arrived wearing this.",
    icon: "🧥",
  },
};

export const SKILLS: Record<
  SkillId,
  { name: string; blurb: string; island: string; playable: boolean }
> = {
  combat: { name: "Combat", blurb: "Blades against rift-touched pests.", island: "Harbour", playable: true },
  foraging: { name: "Foraging", blurb: "Twist, don't yank.", island: "Forage Isle / Moonpetal Hill", playable: true },
  mining: { name: "Mining", blurb: "Chips from living crystal.", island: "Amethyst Mines", playable: true },
  fishing: { name: "Fishing", blurb: "Line in at dusk, patience after.", island: "Fishing Isle / Harbour pier", playable: true },
  farming: { name: "Farming", blurb: "Soil that remembers seasons.", island: "Farm Isle", playable: false },
};

export type NpcId = "corin" | "wren" | "brann" | "lila";

export type NpcDef = {
  id: NpcId;
  name: string;
  title: string;
  position: [number, number, number];
  facing: number;
  palette: { tunic: string; cloak: string; hair: string };
  lines: string[];
};

export const NPCS: NpcDef[] = [
  {
    id: "corin",
    name: "Harbourmaster Corin",
    title: "Keeps the dusk ledgers",
    position: [1.1, 0, -0.8],
    facing: Math.PI * 0.15,
    palette: { tunic: "#4d3a24", cloak: "#6e2b2b", hair: "#cfc3a4" },
    lines: [
      "Traveler. The dusk lanterns stay dark — moonpetals unpicked, shade-rats in the wick crates.",
      "Plaza and north hill for petals. Warehouse east for the rats. Three of each. Harbour pays in shards.",
    ],
  },
  {
    id: "wren",
    name: "Wren",
    title: "Forager",
    position: [-30.5, 0, -23.5],
    facing: 0.4,
    palette: { tunic: "#355c3a", cloak: "#24402a", hair: "#6b3a1c" },
    lines: [
      "Moonpetals open at dusk. Don't yank the root — twist.",
      "Leave two in the ground if you can. The hill remembers greed.",
    ],
  },
  {
    id: "brann",
    name: "Captain Brann",
    title: "Harbour Guard",
    position: [26.5, 0, 2.2],
    facing: -1.2,
    palette: { tunic: "#3e4458", cloak: "#2a3044", hair: "#2b2118" },
    lines: [
      "Keep the blade clean. The rift-stink on those rats isn't natural.",
      "Tab to mark one. Left-click or 1 to strike. If they scatter, herd them off the pier.",
    ],
  },
  {
    id: "lila",
    name: "Lila",
    title: "Shard Merchant",
    position: [11.2, 0, -9.4],
    facing: -0.2,
    palette: { tunic: "#6a3d6e", cloak: "#e6c56a", hair: "#1c1210" },
    lines: [
      "Shards in, goods out. Tonic for eight. I'll take moonpetals at three a piece.",
      "When the lanterns are lit, prices drop. Harbour math.",
    ],
  },
];

export type QuestStage = "idle" | "active" | "turnin" | "done";

export const QUEST = {
  id: "dusk-lanterns",
  name: "Dusk Lanterns",
  giver: "corin" as NpcId,
  petalsNeeded: 3,
  ratsNeeded: 3,
  shardReward: 25,
  summary: "Light the harbour again: gather moonpetals, clear shade-rats, return to Corin.",
  log: "The dusk lanterns are dark. Corin wants three moonpetals (plaza and north hill) and three shade-rats cleared from the warehouse yard. Pay is shards — and a lantern that burns violet.",
};

export const VENDOR = {
  tonicCost: 8,
  tonicHeal: 40,
};

export const LANDMARKS = [
  { id: "plaza", name: "Harbour Plaza", x: 0, z: -5, color: "#e6c56a", radius: 14 },
  { id: "light", name: "Lighthouse Spit", x: 28, z: -32, color: "#ffb25a", radius: 14 },
  { id: "hall", name: "Guild Steps", x: -16, z: -11, color: "#c45c5c", radius: 11 },
  { id: "hill", name: "Moonpetal Hill", x: -32, z: -24, color: "#7dce8a", radius: 16 },
  { id: "yard", name: "Warehouse Yard", x: 30, z: 5, color: "#d98b4c", radius: 14 },
  { id: "gate", name: "Eldervale Gate", x: -10, z: 26, color: "#b48cff", radius: 12 },
  { id: "docks", name: "Dusk Docks", x: 3, z: 12, color: "#3c7f86", radius: 11 },
  { id: "market", name: "Shard Stalls", x: 12, z: -9, color: "#c3a6ff", radius: 9 },
];

export const ZONE = {
  name: "Harbour of Dusk",
  continent: "Aetherion",
};

export const DISTANT_ISLES = [
  { name: "Eldervale", position: [-120, 10, -95] as [number, number, number], scale: 1.7, hue: "#355c3a" },
  { name: "Farm Isle", position: [125, 5, -28] as [number, number, number], scale: 1.25, hue: "#6d7a3b" },
  { name: "Fishing Isle", position: [40, 4, 125] as [number, number, number], scale: 1.05, hue: "#2f5e5a" },
  { name: "Amethyst Mines", position: [-130, 12, 28] as [number, number, number], scale: 1.4, hue: "#5b2a6e" },
];

export const ABILITIES = [
  { id: "strike", slot: 1, name: "Strike", icon: "⚔", key: "LMB / 1", cooldown: 0.7 },
  { id: "interact", slot: 2, name: "Interact", icon: "✋", key: "E", cooldown: 0 },
  { id: "sprint", slot: 3, name: "Sprint", icon: "◎", key: "⇧", cooldown: 0 },
  { id: "jump", slot: 4, name: "Jump", icon: "▲", key: "Spc", cooldown: 0 },
  { id: "tonic", slot: 5, name: "Tonic", icon: "✚", key: "5", cooldown: 8 },
];

export function xpToNext(level: number) {
  return 40 + level * 35;
}

export function subzoneAt(x: number, z: number) {
  let best = LANDMARKS[0];
  let bestD = Infinity;
  for (const lm of LANDMARKS) {
    const d = Math.hypot(x - lm.x, z - lm.z);
    if (d < lm.radius && d < bestD) {
      bestD = d;
      best = lm;
    }
  }
  return bestD < Infinity ? best : { id: "wilds", name: "Harbour Wilds", x: 0, z: 0, color: "#888", radius: 0 };
}
