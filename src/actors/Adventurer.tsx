import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS, toon } from "../game/palette";

export type AnimState = "idle" | "walk" | "run" | "jump" | "attack";

type Props = {
  anim: AnimState;
  animRef?: MutableRefObject<AnimState>;
  attackT?: number;
  attackRef?: MutableRefObject<number>;
  palette?: { tunic?: string; cloak?: string; hair?: string; skin?: string };
  scale?: number;
  npc?: boolean;
};

export function Adventurer({ anim, animRef, attackT = 0, attackRef, palette, scale = 1, npc = false }: Props) {
  const root = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const lArm = useRef<THREE.Group>(null);
  const rArm = useRef<THREE.Group>(null);
  const lLeg = useRef<THREE.Group>(null);
  const rLeg = useRef<THREE.Group>(null);
  const cloak = useRef<THREE.Mesh>(null);
  const sword = useRef<THREE.Group>(null);

  const mats = useMemo(() => {
    return {
      tunic: toon(palette?.tunic ?? COLORS.tunic),
      cloakM: toon(palette?.cloak ?? COLORS.cloak),
      hair: toon(palette?.hair ?? COLORS.hair),
      skin: toon(palette?.skin ?? COLORS.skin),
      leather: toon(COLORS.leather),
      metal: toon("#d5dde4"),
      gold: toon(COLORS.gold),
      pants: toon("#2a2430"),
    };
  }, [palette]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const animNow = animRef?.current ?? anim;
    const attackNow = attackRef?.current ?? attackT;
    const moving = animNow === "walk" || animNow === "run";
    const spd = animNow === "run" ? 10.5 : animNow === "walk" ? 7.2 : 0;
    const swing = moving ? Math.sin(t * spd) : 0;
    const amp = animNow === "run" ? 0.78 : 0.5;
    if (lArm.current) lArm.current.rotation.x = moving ? swing * amp : Math.sin(t * 1.4) * 0.05;
    if (rArm.current) {
      if (animNow === "attack") {
        const a = Math.min(1, attackNow / 0.28);
        rArm.current.rotation.x = -1.85 * Math.sin(a * Math.PI);
        rArm.current.rotation.y = 0.35 * Math.sin(a * Math.PI);
      } else {
        rArm.current.rotation.x = moving ? -swing * amp : Math.sin(t * 1.4 + 1) * 0.05;
        rArm.current.rotation.y = 0;
      }
    }
    if (lLeg.current) lLeg.current.rotation.x = moving ? -swing * amp * 0.95 : 0;
    if (rLeg.current) rLeg.current.rotation.x = moving ? swing * amp * 0.95 : 0;
    if (torso.current) {
      torso.current.position.y = 1.22 + (moving ? Math.abs(Math.sin(t * spd)) * 0.04 : Math.sin(t * 2.1) * 0.015);
      torso.current.rotation.x = animNow === "run" ? 0.16 : animNow === "jump" ? -0.12 : 0.03;
    }
    if (cloak.current) {
      cloak.current.rotation.x = 0.18 + (moving ? 0.28 : 0.06) + Math.sin(t * 2.8) * 0.05;
    }
    if (sword.current && animNow === "attack") {
      const a = Math.min(1, attackNow / 0.28);
      sword.current.rotation.z = -0.15 - Math.sin(a * Math.PI) * 0.7;
    }
    if (root.current) root.current.rotation.x = animNow === "jump" ? -0.1 : 0;
  });

  return (
    <group ref={root} scale={scale}>
      <group ref={lLeg} position={[0.13, 0.92, 0]}>
        <mesh position={[0, -0.28, 0]} material={mats.pants} castShadow>
          <boxGeometry args={[0.14, 0.52, 0.16]} />
        </mesh>
        <mesh position={[0, -0.56, 0.05]} material={mats.leather} castShadow>
          <boxGeometry args={[0.16, 0.12, 0.28]} />
        </mesh>
      </group>
      <group ref={rLeg} position={[-0.13, 0.92, 0]}>
        <mesh position={[0, -0.28, 0]} material={mats.pants} castShadow>
          <boxGeometry args={[0.14, 0.52, 0.16]} />
        </mesh>
        <mesh position={[0, -0.56, 0.05]} material={mats.leather} castShadow>
          <boxGeometry args={[0.16, 0.12, 0.28]} />
        </mesh>
      </group>

      <group ref={torso} position={[0, 1.22, 0]}>
        <mesh material={mats.tunic} castShadow>
          <boxGeometry args={[0.5, 0.52, 0.28]} />
        </mesh>
        <mesh position={[0, -0.22, 0]} material={mats.leather} castShadow>
          <boxGeometry args={[0.52, 0.1, 0.3]} />
        </mesh>
        <mesh position={[0.26, 0.2, 0]} material={mats.leather} castShadow>
          <boxGeometry args={[0.16, 0.14, 0.3]} />
        </mesh>
        <mesh position={[-0.26, 0.2, 0]} material={mats.leather} castShadow>
          <boxGeometry args={[0.16, 0.14, 0.3]} />
        </mesh>
        <mesh position={[0, 0.06, 0.15]} material={mats.gold} castShadow>
          <octahedronGeometry args={[0.07, 0]} />
        </mesh>

        <group position={[0, 0.46, 0.04]}>
          <mesh material={mats.skin} castShadow>
            <sphereGeometry args={[0.16, 14, 12]} />
          </mesh>
          <mesh position={[0, 0.08, -0.04]} material={mats.hair} castShadow>
            <sphereGeometry args={[0.175, 12, 10]} />
          </mesh>
          <mesh position={[0, 0.14, -0.02]} material={mats.cloakM} castShadow>
            <sphereGeometry args={[0.12, 10, 8]} />
          </mesh>
          <mesh position={[0.055, 0.02, 0.13]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshBasicMaterial color="#1a1020" />
          </mesh>
          <mesh position={[-0.055, 0.02, 0.13]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshBasicMaterial color="#1a1020" />
          </mesh>
        </group>

        <mesh ref={cloak} position={[0, -0.05, -0.2]} material={mats.cloakM} castShadow>
          <boxGeometry args={[0.46, 0.95, 0.06]} />
        </mesh>

        <group ref={lArm} position={[0.34, 0.16, 0]}>
          <mesh position={[0.02, -0.2, 0]} material={mats.tunic} castShadow>
            <boxGeometry args={[0.12, 0.46, 0.12]} />
          </mesh>
          <mesh position={[0.02, -0.44, 0.02]} material={mats.skin} castShadow>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
          </mesh>
        </group>
        <group ref={rArm} position={[-0.34, 0.16, 0]}>
          <mesh position={[-0.02, -0.2, 0]} material={mats.tunic} castShadow>
            <boxGeometry args={[0.12, 0.46, 0.12]} />
          </mesh>
          {!npc && (
            <group ref={sword} position={[-0.04, -0.48, 0.16]} rotation={[0.35, 0.4, -0.2]}>
              <mesh material={mats.leather}>
                <boxGeometry args={[0.06, 0.16, 0.06]} />
              </mesh>
              <mesh position={[0, 0.08, 0]} material={mats.gold}>
                <boxGeometry args={[0.2, 0.05, 0.08]} />
              </mesh>
              <mesh position={[0, 0.48, 0]} material={mats.metal} castShadow>
                <boxGeometry args={[0.045, 0.78, 0.1]} />
              </mesh>
            </group>
          )}
        </group>
      </group>
    </group>
  );
}
