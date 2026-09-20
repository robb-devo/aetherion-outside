export type SkillId = "combat" | "foraging";

export type ItemDef = {
  id: string;
  name: string;
  flavor: string;
  icon: string;
};

export const ITEMS: Record<string, ItemDef> = {
  moonpetal: {
    id: "moonpetal",
    name: "Moonpetal",
    flavor: "Opens only at dusk. Wick-makers pay well.",
    icon: "❀",
  },
  shade_fang: {
    id: "shade_fang",
    name: "Shade Fang",
    flavor: "Still cold. Still humming.",
    icon: "⚔",
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
    position: [0.85, 0, -0.55],
    facing: Math.PI * 0.15,
    palette: { tunic: "#4d3a24", cloak: "#6e2b2b", hair: "#cfc3a4" },
    lines: [
      "Traveler. The dusk lanterns stay dark — moonpetals unpicked, shade-rats in the wick crates.",
      "Hill north of the plaza. Warehouse east. Three petals. Three rats. Harbour pays in shards.",
    ],
  },
  {
    id: "wren",
    name: "Wren",
    title: "Forager",
    position: [-22.5, 0, -17.5],
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
    position: [18.5, 0, 1.2],
    facing: -1.2,
    palette: { tunic: "#3e4458", cloak: "#2a3044", hair: "#2b2118" },
    lines: [
      "Keep the blade clean. The rift-stink on those rats isn't natural.",
      "If they scatter, herd them off the pier. I won't fish corpses out at night.",
    ],
  },
  {
    id: "lila",
    name: "Lila",
    title: "Shard Merchant",
    position: [8.4, 0, -7.2],
    facing: -0.2,
    palette: { tunic: "#6a3d6e", cloak: "#e6c56a", hair: "#1c1210" },
    lines: [
      "Shards in, goods out. When the lanterns are lit, prices drop. Harbour math.",
      "Bring me petals later. I'll pretend I didn't see you pocket extras.",
    ],
  },
];

export const QUEST = {
  id: "dusk-lanterns",
  name: "Dusk Lanterns",
  giver: "corin" as NpcId,
  petalsNeeded: 3,
  ratsNeeded: 3,
  shardReward: 25,
  summary: "Light the harbour again: gather moonpetals, clear shade-rats, return to Corin.",
};

export const LANDMARKS = [
  { id: "plaza", name: "Harbour Plaza", x: 0, z: -4, color: "#e6c56a" },
  { id: "light", name: "Lighthouse", x: 20, z: -24, color: "#ffb25a" },
  { id: "hall", name: "Guild Hall", x: -12, z: -8, color: "#c45c5c" },
  { id: "hill", name: "Moonpetal Hill", x: -24, z: -18, color: "#7dce8a" },
  { id: "yard", name: "Warehouse Yard", x: 22, z: 2, color: "#d98b4c" },
  { id: "gate", name: "Eldervale Gate", x: -8, z: 18, color: "#b48cff" },
];

export const DISTANT_ISLES = [
  { name: "Eldervale", position: [-90, 8, -70] as [number, number, number], scale: 1.4, hue: "#355c3a" },
  { name: "Farm Isle", position: [95, 4, -20] as [number, number, number], scale: 1.0, hue: "#6d7a3b" },
  { name: "Fishing Isle", position: [30, 3, 95] as [number, number, number], scale: 0.85, hue: "#2f5e5a" },
  { name: "Amethyst Mines", position: [-100, 10, 20] as [number, number, number], scale: 1.15, hue: "#5b2a6e" },
];

export function xpToNext(level: number) {
  return 40 + level * 35;
}
