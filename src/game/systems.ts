import { QUEST, type QuestStage } from "./content";

export type { QuestStage };

export function advanceQuest(stage: QuestStage, petals: number, rats: number): QuestStage {
  if (stage !== "active") return stage;
  if (petals >= QUEST.petalsNeeded && rats >= QUEST.ratsNeeded) return "turnin";
  return "active";
}

export const SAVE_KEY = "aetherion-outside-v01";
