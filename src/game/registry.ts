import * as THREE from "three";

export type EnemyHandle = {
  id: string;
  name: string;
  getPos: () => THREE.Vector3;
  getHp: () => number;
  getMaxHp: () => number;
  hurt: (dmg: number, from: THREE.Vector3) => boolean;
  alive: () => boolean;
};

export type NodeKind = "npc" | "forage" | "jump" | "mine" | "fish";

export type NodeHandle = {
  id: string;
  kind: NodeKind;
  label: string;
  getPos: () => THREE.Vector3;
  available: () => boolean;
  consume?: () => void;
};

const enemies = new Map<string, EnemyHandle>();
const nodes = new Map<string, NodeHandle>();

export const playerPose = { x: 0.4, y: 2, z: 2.2, yaw: 0 };

export const registry = {
  registerEnemy(h: EnemyHandle) {
    enemies.set(h.id, h);
    return () => {
      enemies.delete(h.id);
    };
  },
  registerNode(h: NodeHandle) {
    nodes.set(h.id, h);
    return () => {
      nodes.delete(h.id);
    };
  },
  getEnemy(id: string) {
    return enemies.get(id) ?? null;
  },
  enemies() {
    return [...enemies.values()];
  },
  nearestEnemy(from: THREE.Vector3, maxDist: number) {
    let best: EnemyHandle | null = null;
    let bestD = maxDist;
    for (const e of enemies.values()) {
      if (!e.alive()) continue;
      const d = e.getPos().distanceTo(from);
      if (d < bestD) {
        bestD = d;
        best = e;
      }
    }
    return best;
  },
  cycleEnemy(from: THREE.Vector3, currentId: string | null, maxDist: number) {
    const list = [...enemies.values()]
      .filter((e) => e.alive() && e.getPos().distanceTo(from) <= maxDist)
      .sort((a, b) => a.getPos().distanceTo(from) - b.getPos().distanceTo(from));
    if (!list.length) return null;
    const idx = list.findIndex((e) => e.id === currentId);
    return list[(idx + 1) % list.length];
  },
  nearestNode(from: THREE.Vector3, maxDist: number) {
    let best: NodeHandle | null = null;
    let bestD = maxDist;
    for (const n of nodes.values()) {
      if (!n.available()) continue;
      const d = n.getPos().distanceTo(from);
      if (d < bestD) {
        bestD = d;
        best = n;
      }
    }
    return best;
  },
};

export const launchImpulse = { current: null as THREE.Vector3 | null };
