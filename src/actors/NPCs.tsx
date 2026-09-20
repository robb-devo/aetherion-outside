import { useEffect, useMemo, useRef } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { Adventurer } from "./Adventurer";
import { NPCS, QUEST, type NpcId } from "../game/content";
import { registry } from "../game/registry";
import { useGame } from "../game/store";
import { surfaceY } from "../game/terrain";

function NPC({ id }: { id: NpcId }) {
  const def = NPCS.find((n) => n.id === id)!;
  const group = useRef<THREE.Group>(null);
  const pos = useMemo(() => {
    const [x, , z] = def.position;
    return [x, surfaceY(x, z), z] as [number, number, number];
  }, [def]);
  const questStage = useGame((s) => s.questStage);

  useEffect(() => {
    const world = new THREE.Vector3();
    return registry.registerNode({
      id: def.id,
      kind: "npc",
      label: `Talk — ${def.name}`,
      getPos: () => {
        group.current?.getWorldPosition(world);
        world.y += 0.9;
        return world;
      },
      available: () => true,
    });
  }, [def.id, def.name]);

  const mark =
    def.id === QUEST.giver
      ? questStage === "idle"
        ? "!"
        : questStage === "turnin"
          ? "?"
          : questStage === "active"
            ? "…"
            : ""
      : "";

  return (
    <group ref={group} position={pos} rotation={[0, def.facing, 0]}>
      <Adventurer anim="idle" npc palette={def.palette} scale={1.02} />
      <Html position={[0, 2.35, 0]} center distanceFactor={10} style={{ pointerEvents: "none" }}>
        <div
          style={{
            fontFamily: "Cinzel, serif",
            color: "#e6c56a",
            textShadow: "0 2px 8px #000",
            textAlign: "center",
            whiteSpace: "nowrap",
            fontSize: 14,
          }}
        >
          {mark && <div style={{ color: "#ffe38a", fontSize: 22, lineHeight: 1 }}>{mark}</div>}
          {def.name}
        </div>
      </Html>
    </group>
  );
}

export function NPCs() {
  return (
    <group>
      {NPCS.map((n) => (
        <NPC key={n.id} id={n.id} />
      ))}
    </group>
  );
}
