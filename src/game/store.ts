import { create } from "zustand";
import { ITEMS, QUEST, xpToNext, type NpcId, type SkillId } from "./content";

export type Phase = "boot" | "title" | "playing";
export type Panel = null | "skills" | "inventory" | "help";

export type Skill = { level: number; xp: number };
export type ItemStack = { id: string; qty: number };
export type Toast = { id: number; text: string; kind: "info" | "loot" | "xp" };
export type QuestStage = "idle" | "active" | "turnin" | "done";

export type Prompt = {
  kind: "talk" | "gather" | "jump";
  id: string;
  label: string;
} | null;

type GameState = {
  phase: Phase;
  panel: Panel;
  hp: number;
  maxHp: number;
  shards: number;
  skills: Record<SkillId, Skill>;
  inventory: ItemStack[];
  questStage: QuestStage;
  petals: number;
  rats: number;
  dialogNpc: NpcId | null;
  dialogIndex: number;
  prompt: Prompt;
  toasts: Toast[];
  gathering: { id: string; t: number } | null;
  player: { x: number; z: number; yaw: number };
  locked: boolean;
  enterWorld: () => void;
  setLocked: (v: boolean) => void;
  setPanel: (p: Panel) => void;
  setPrompt: (p: Prompt) => void;
  setPlayer: (x: number, z: number, yaw: number) => void;
  damagePlayer: (n: number) => void;
  heal: (n: number) => void;
  addItem: (id: string, qty?: number) => void;
  addShards: (n: number) => void;
  addSkillXp: (skill: SkillId, amount: number) => void;
  toast: (text: string, kind?: Toast["kind"]) => void;
  openDialog: (npc: NpcId) => void;
  dialogChoice: (choice: "next" | "accept" | "turnin" | "close") => void;
  onRatKilled: () => void;
  beginGather: (id: string) => void;
  tickGather: (dt: number) => boolean;
  cancelGather: () => void;
};

let toastSeq = 1;

export const useGame = create<GameState>((set, get) => ({
  phase: "title",
  panel: null,
  hp: 100,
  maxHp: 100,
  shards: 4,
  skills: {
    combat: { level: 1, xp: 0 },
    foraging: { level: 1, xp: 0 },
  },
  inventory: [{ id: "traveler_cloak", qty: 1 }],
  questStage: "idle",
  petals: 0,
  rats: 0,
  dialogNpc: null,
  dialogIndex: 0,
  prompt: null,
  toasts: [],
  gathering: null,
  player: { x: 0, z: 2, yaw: 0 },
  locked: false,

  enterWorld: () => {
    set({ phase: "playing", panel: null });
    get().toast("Harbourmaster Corin wants a word.", "info");
  },
  setLocked: (locked) => set({ locked }),
  setPanel: (panel) => set({ panel, dialogNpc: panel ? get().dialogNpc : get().dialogNpc }),
  setPrompt: (prompt) => set({ prompt }),
  setPlayer: (x, z, yaw) => set({ player: { x, z, yaw } }),

  damagePlayer: (n) => {
    const hp = Math.max(0, get().hp - n);
    set({ hp });
    if (hp <= 0) {
      set({ hp: get().maxHp });
      get().toast("The harbour pulls you back from the brink.", "info");
    }
  },
  heal: (n) => set({ hp: Math.min(get().maxHp, get().hp + n) }),

  addItem: (id, qty = 1) => {
    const inventory = [...get().inventory];
    const found = inventory.find((s) => s.id === id);
    if (found) found.qty += qty;
    else inventory.push({ id, qty });
    set({ inventory });
    const def = ITEMS[id];
    get().toast(`Received ${def?.name ?? id} ×${qty}`, "loot");
  },

  addShards: (n) => {
    set({ shards: get().shards + n });
    get().toast(`+${n} shards`, "loot");
  },

  addSkillXp: (skill, amount) => {
    const cur = { ...get().skills[skill] };
    cur.xp += amount;
    let leveled = false;
    while (cur.xp >= xpToNext(cur.level)) {
      cur.xp -= xpToNext(cur.level);
      cur.level += 1;
      leveled = true;
    }
    set({ skills: { ...get().skills, [skill]: cur } });
    get().toast(`+${amount} ${skill} XP`, "xp");
    if (leveled) get().toast(`${skill} is now rank ${cur.level}`, "info");
  },

  toast: (text, kind = "info") => {
    const id = toastSeq++;
    set({ toasts: [...get().toasts, { id, text, kind }] });
    window.setTimeout(() => {
      set({ toasts: get().toasts.filter((t) => t.id !== id) });
    }, 2600);
  },

  openDialog: (npc) => {
    set({ dialogNpc: npc, dialogIndex: 0, panel: null, gathering: null });
  },

  dialogChoice: (choice) => {
    const { dialogNpc, questStage, petals, rats } = get();
    if (!dialogNpc) return;
    if (choice === "close") {
      set({ dialogNpc: null });
      return;
    }
    if (dialogNpc === "corin" && choice === "accept" && questStage === "idle") {
      set({ questStage: "active", dialogNpc: null });
      get().toast("Quest accepted: Dusk Lanterns", "info");
      return;
    }
    if (dialogNpc === "corin" && choice === "turnin" && questStage === "turnin") {
      get().addShards(QUEST.shardReward);
      get().addItem("dusk_lantern", 1);
      get().addSkillXp("combat", 20);
      get().addSkillXp("foraging", 20);
      set({ questStage: "done", dialogNpc: null });
      get().toast("Harbour lanterns will burn tonight.", "info");
      return;
    }
    if (choice === "next") {
      set({ dialogIndex: get().dialogIndex + 1 });
    }
    void petals;
    void rats;
  },

  onRatKilled: () => {
    const rats = get().rats + 1;
    const questStage = advanceQuest(get().questStage, get().petals, rats);
    set({ rats, questStage });
    get().addItem("shade_fang", 1);
    get().addSkillXp("combat", 18);
    get().addShards(2);
  },

  beginGather: (id) => set({ gathering: { id, t: 0 } }),
  tickGather: (dt) => {
    const g = get().gathering;
    if (!g) return false;
    const t = g.t + dt;
    if (t >= 1.45) {
      set({ gathering: null });
      const petals = get().petals + 1;
      const questStage = advanceQuest(get().questStage, petals, get().rats);
      set({ petals, questStage });
      get().addItem("moonpetal", 1);
      get().addSkillXp("foraging", 16);
      return true;
    }
    set({ gathering: { ...g, t } });
    return false;
  },
  cancelGather: () => set({ gathering: null }),
}));

function advanceQuest(stage: QuestStage, petals: number, rats: number): QuestStage {
  if (stage !== "active") return stage;
  if (petals >= QUEST.petalsNeeded && rats >= QUEST.ratsNeeded) return "turnin";
  return "active";
}
