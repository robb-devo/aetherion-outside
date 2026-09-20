import { create } from "zustand";
import { ITEMS, QUEST, SKILLS, VENDOR, xpToNext, type NpcId, type SkillId } from "./content";
import { SAVE_KEY, advanceQuest } from "./systems";
import type { QuestStage } from "./content";
import type { NodeKind } from "./registry";

export type Phase = "boot" | "title" | "playing";
export type Panel = null | "skills" | "inventory" | "help" | "questlog" | "map";

export type Skill = { level: number; xp: number };
export type ItemStack = { id: string; qty: number };
export type Toast = { id: number; text: string; kind: "info" | "loot" | "xp" };
export type ChatLine = { id: number; channel: "system" | "loot" | "say"; text: string };
export type Prompt = {
  kind: NodeKind;
  id: string;
  label: string;
} | null;

export type Snapshot = {
  hp: number;
  shards: number;
  skills: Record<SkillId, Skill>;
  inventory: ItemStack[];
  questStage: QuestStage;
  petals: number;
  rats: number;
};

function emptySkills(): Record<SkillId, Skill> {
  return {
    combat: { level: 1, xp: 0 },
    foraging: { level: 1, xp: 0 },
    mining: { level: 1, xp: 0 },
    fishing: { level: 1, xp: 0 },
    farming: { level: 1, xp: 0 },
  };
}

function loadSnap(): Snapshot | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Snapshot;
  } catch {
    return null;
  }
}

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
  chat: ChatLine[];
  gathering: { id: string; t: number; kind: "forage" | "mine" | "fish" } | null;
  player: { x: number; z: number; yaw: number };
  locked: boolean;
  targetId: string | null;
  targetName: string;
  targetHp: number;
  targetMax: number;
  subzone: string;
  zonePing: { name: string; at: number } | null;
  swingCd: number;
  tonicCd: number;
  hasSave: boolean;
  enterWorld: (mode: "new" | "continue") => void;
  setLocked: (v: boolean) => void;
  setPanel: (p: Panel) => void;
  setPrompt: (p: Prompt) => void;
  setPlayer: (x: number, z: number, yaw: number) => void;
  setSubzone: (name: string) => void;
  setTarget: (id: string | null, name?: string, hp?: number, max?: number) => void;
  updateTargetHp: (hp: number) => void;
  damagePlayer: (n: number) => void;
  heal: (n: number) => void;
  addItem: (id: string, qty?: number) => void;
  removeItem: (id: string, qty?: number) => boolean;
  addShards: (n: number) => void;
  addSkillXp: (skill: SkillId, amount: number) => void;
  toast: (text: string, kind?: Toast["kind"]) => void;
  say: (channel: ChatLine["channel"], text: string) => void;
  openDialog: (npc: NpcId) => void;
  dialogChoice: (choice: "next" | "accept" | "turnin" | "close" | "buy" | "sell") => void;
  onRatKilled: () => void;
  beginChannel: (id: string, kind: "forage" | "mine" | "fish") => void;
  tickGather: (dt: number) => boolean;
  cancelGather: () => void;
  useTonic: () => void;
  tickCds: (dt: number) => void;
  startSwing: () => boolean;
  persist: () => void;
};

let toastSeq = 1;
let chatSeq = 1;

export const useGame = create<GameState>((set, get) => ({
  phase: "title",
  panel: null,
  hp: 100,
  maxHp: 100,
  shards: 4,
  skills: emptySkills(),
  inventory: [{ id: "traveler_cloak", qty: 1 }],
  questStage: "idle",
  petals: 0,
  rats: 0,
  dialogNpc: null,
  dialogIndex: 0,
  prompt: null,
  toasts: [],
  chat: [{ id: 0, channel: "system", text: "Welcome to the Harbour of Dusk." }],
  gathering: null,
  player: { x: 0, z: 2, yaw: 0 },
  locked: false,
  targetId: null,
  targetName: "",
  targetHp: 0,
  targetMax: 0,
  subzone: "Harbour Plaza",
  zonePing: null,
  swingCd: 0,
  tonicCd: 0,
  hasSave: typeof localStorage !== "undefined" && !!loadSnap(),

  persist: () => {
    const s = get();
    const snap: Snapshot = {
      hp: s.hp,
      shards: s.shards,
      skills: s.skills,
      inventory: s.inventory,
      questStage: s.questStage,
      petals: s.petals,
      rats: s.rats,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(snap));
    set({ hasSave: true });
  },

  enterWorld: (mode) => {
    if (mode === "continue") {
      const snap = loadSnap();
      if (snap) {
        set({
          phase: "playing",
          panel: null,
          hp: snap.hp,
          shards: snap.shards,
          skills: { ...emptySkills(), ...snap.skills },
          inventory: snap.inventory,
          questStage: snap.questStage,
          petals: snap.petals,
          rats: snap.rats,
          zonePing: { name: "Harbour of Dusk", at: Date.now() },
        });
        get().say("system", "The harbour remembers you.");
        return;
      }
    }
    localStorage.removeItem(SAVE_KEY);
    set({
      phase: "playing",
      panel: null,
      hp: 100,
      shards: 4,
      skills: emptySkills(),
      inventory: [{ id: "traveler_cloak", qty: 1 }],
      questStage: "idle",
      petals: 0,
      rats: 0,
      hasSave: false,
      zonePing: { name: "Harbour of Dusk", at: Date.now() },
    });
    get().toast("Harbourmaster Corin wants a word.", "info");
    get().say("system", "Entered Harbour of Dusk. LMB combo Strike · 2 Bow (RMB aim) · Tab target · L quest log.");
  },

  setLocked: (locked) => set({ locked }),
  setPanel: (panel) => set({ panel }),
  setPrompt: (prompt) => set({ prompt }),
  setPlayer: (x, z, yaw) => set({ player: { x, z, yaw } }),
  setSubzone: (name) => {
    if (get().subzone === name) return;
    set({ subzone: name, zonePing: { name, at: Date.now() } });
  },
  setTarget: (id, name = "", hp = 0, max = 0) => set({ targetId: id, targetName: name, targetHp: hp, targetMax: max }),
  updateTargetHp: (hp) => set({ targetHp: hp }),

  damagePlayer: (n) => {
    const hp = Math.max(0, get().hp - n);
    set({ hp });
    if (hp <= 0) {
      set({ hp: get().maxHp });
      get().toast("The harbour pulls you back from the brink.", "info");
      get().say("system", "You fall. The harbour will not keep you.");
    }
    get().persist();
  },
  heal: (n) => {
    set({ hp: Math.min(get().maxHp, get().hp + n) });
    get().persist();
  },

  addItem: (id, qty = 1) => {
    const inventory = [...get().inventory];
    const found = inventory.find((s) => s.id === id);
    if (found) found.qty += qty;
    else inventory.push({ id, qty });
    set({ inventory });
    const def = ITEMS[id];
    get().toast(`Received ${def?.name ?? id} ×${qty}`, "loot");
    get().say("loot", `You receive ${def?.name ?? id} ×${qty}.`);
    get().persist();
  },

  removeItem: (id, qty = 1) => {
    const inventory = get().inventory.map((s) => ({ ...s }));
    const found = inventory.find((s) => s.id === id);
    if (!found || found.qty < qty) return false;
    found.qty -= qty;
    set({ inventory: inventory.filter((s) => s.qty > 0) });
    get().persist();
    return true;
  },

  addShards: (n) => {
    set({ shards: get().shards + n });
    if (n > 0) {
      get().toast(`+${n} shards`, "loot");
      get().say("loot", `+${n} shards.`);
    }
    get().persist();
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
    get().toast(`+${amount} ${SKILLS[skill].name} XP`, "xp");
    if (leveled) {
      get().toast(`${SKILLS[skill].name} is now rank ${cur.level}`, "info");
      get().say("system", `${SKILLS[skill].name} rank ${cur.level}!`);
    }
    get().persist();
  },

  toast: (text, kind = "info") => {
    const id = toastSeq++;
    set({ toasts: [...get().toasts, { id, text, kind }] });
    window.setTimeout(() => {
      set({ toasts: get().toasts.filter((t) => t.id !== id) });
    }, 2600);
  },

  say: (channel, text) => {
    const line = { id: chatSeq++, channel, text };
    set({ chat: [...get().chat.slice(-24), line] });
  },

  openDialog: (npc) => {
    set({ dialogNpc: npc, dialogIndex: 0, panel: null, gathering: null });
  },

  dialogChoice: (choice) => {
    const { dialogNpc, questStage } = get();
    if (!dialogNpc) return;
    if (choice === "close") {
      set({ dialogNpc: null });
      return;
    }
    if (dialogNpc === "corin" && choice === "accept" && questStage === "idle") {
      set({ questStage: "active", dialogNpc: null });
      get().toast("Quest accepted: Dusk Lanterns", "info");
      get().say("system", "Quest accepted: Dusk Lanterns.");
      get().persist();
      return;
    }
    if (dialogNpc === "corin" && choice === "turnin" && questStage === "turnin") {
      get().addShards(QUEST.shardReward);
      get().addItem("dusk_lantern", 1);
      get().addSkillXp("combat", 20);
      get().addSkillXp("foraging", 20);
      set({ questStage: "done", dialogNpc: null });
      get().toast("Harbour lanterns will burn tonight.", "info");
      get().say("system", "Quest complete: Dusk Lanterns.");
      get().persist();
      return;
    }
    if (dialogNpc === "lila" && choice === "buy") {
      if (get().shards < VENDOR.tonicCost) {
        get().toast("Not enough shards.", "info");
        return;
      }
      get().addShards(-VENDOR.tonicCost);
      get().addItem("health_tonic", 1);
      get().say("say", "Lila: Don't spill it on the stalls.");
      return;
    }
    if (dialogNpc === "lila" && choice === "sell") {
      if (!get().removeItem("moonpetal", 1)) {
        get().toast("No moonpetals to sell.", "info");
        return;
      }
      get().addShards(ITEMS.moonpetal.sellShards ?? 3);
      get().say("say", "Lila: Fresh twist. I'll take it.");
      return;
    }
    if (choice === "next") set({ dialogIndex: get().dialogIndex + 1 });
  },

  onRatKilled: () => {
    const rats = get().rats + 1;
    const questStage = advanceQuest(get().questStage, get().petals, rats);
    set({ rats, questStage, targetId: null, targetName: "", targetHp: 0, targetMax: 0 });
    get().addItem("shade_fang", 1);
    get().addSkillXp("combat", 18);
    get().addShards(2);
    if (questStage === "turnin") get().say("system", "Return to Harbourmaster Corin.");
  },

  beginChannel: (id, kind) => set({ gathering: { id, t: 0, kind } }),
  tickGather: (dt) => {
    const g = get().gathering;
    if (!g) return false;
    const t = g.t + dt;
    const dur = g.kind === "fish" ? 2.1 : 1.45;
    if (t >= dur) {
      set({ gathering: null });
      if (g.kind === "forage") {
        const petals = get().petals + 1;
        set({ petals, questStage: advanceQuest(get().questStage, petals, get().rats) });
        get().addItem("moonpetal", 1);
        get().addSkillXp("foraging", 16);
      } else if (g.kind === "mine") {
        get().addItem("amethyst_chip", 1);
        get().addSkillXp("mining", 14);
        get().addShards(1);
      } else {
        get().addItem("duskfin", 1);
        get().addSkillXp("fishing", 14);
      }
      return true;
    }
    set({ gathering: { ...g, t } });
    return false;
  },
  cancelGather: () => set({ gathering: null }),

  useTonic: () => {
    if (get().tonicCd > 0) return;
    if (!get().removeItem("health_tonic", 1)) {
      get().toast("No harbour tonic.", "info");
      return;
    }
    get().heal(VENDOR.tonicHeal);
    set({ tonicCd: 8 });
    get().toast("The tonic burns warm.", "info");
  },

  tickCds: (dt) => {
    const swingCd = Math.max(0, get().swingCd - dt);
    const tonicCd = Math.max(0, get().tonicCd - dt);
    if (swingCd !== get().swingCd || tonicCd !== get().tonicCd) set({ swingCd, tonicCd });
  },

  startSwing: () => {
    // Combo chains manage their own timing; keep a short UI CD pulse
    set({ swingCd: 0.35 });
    return true;
  },
}));
