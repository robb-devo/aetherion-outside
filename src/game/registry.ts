import * as THREE from "three";

export type EnemyHandle = {
  id: string;
  getPos: () => THREE.Vector3;
  hurt: (dmg: number, from: THREE.Vector3) => boolean;
  alive: () => boolean;
};

export type NodeHandle = {
  id: string;
  kind: "npc" | "forage" | "jump";
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
