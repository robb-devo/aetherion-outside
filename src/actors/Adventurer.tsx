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
  const cloak = useRef<THREE.Group>(null);
  const sword = useRef<THREE.Group>(null);

  const mats = useMemo(() => {
    const tunic = toon(palette?.tunic ?? COLORS.tunic);
    const cloakM = toon(palette?.cloak ?? COLORS.cloak);
    const hair = toon(palette?.hair ?? COLORS.hair);
    const skin = toon(palette?.skin ?? COLORS.skin);
    const leather = toon(COLORS.leather);
    const metal = toon("#c9d0d8");
    const gold = toon(COLORS.gold);
    return { tunic, cloakM, hair, skin, leather, metal, gold };
  }, [palette]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const animNow = animRef?.current ?? anim;
    const attackNow = attackRef?.current ?? attackT;
    const moving = animNow === "walk" || animNow === "run";
    const spd = animNow === "run" ? 11 : animNow === "walk" ? 7 : 0;
    const swing = moving ? Math.sin(t * spd) : 0;
    const amp = animNow === "run" ? 0.7 : 0.45;
    if (lArm.current) lArm.current.rotation.x = moving ? swing * amp : Math.sin(t * 1.5) * 0.04;
    if (rArm.current) {
      if (animNow === "attack") {
        const a = Math.min(1, attackNow / 0.28);
        rArm.current.rotation.x = -1.6 * Math.sin(a * Math.PI);
        rArm.current.rotation.z = 0.4 * Math.sin(a * Math.PI);
      } else {
        rArm.current.rotation.x = moving ? -swing * amp : Math.sin(t * 1.5 + 1) * 0.04;
        rArm.current.rotation.z = 0.08;
      }
    }
    if (lLeg.current) lLeg.current.rotation.x = moving ? -swing * amp * 0.9 : 0;
    if (rLeg.current) rLeg.current.rotation.x = moving ? swing * amp * 0.9 : 0;
    if (torso.current) {
      torso.current.position.y = (moving ? Math.abs(Math.sin(t * spd)) * 0.05 : Math.sin(t * 2) * 0.02) + (animNow === "jump" ? 0.08 : 0);
      torso.current.rotation.x = animNow === "run" ? 0.18 : animNow === "jump" ? -0.1 : 0.04;
    }
    if (cloak.current) {
      cloak.current.rotation.x = 0.25 + (moving ? 0.35 : 0.08) + Math.sin(t * 3) * 0.04;
    }
    if (sword.current && animNow === "attack") {
      const a = Math.min(1, attackNow / 0.28);
      sword.current.rotation.z = -0.2 - Math.sin(a * Math.PI) * 0.8;
    }
    if (root.current && animNow === "jump") root.current.rotation.x = -0.08;
    else if (root.current) root.current.rotation.x = 0;
  });

  return (
    <group ref={root} scale={scale}>
      <group position={[0, 0.92, 0]}>
        <group ref={lLeg} position={[0.16, 0, 0]}>
          <mesh position={[0, -0.28, 0]} material={mats.leather} castShadow>
            <capsuleGeometry args={[0.09, 0.38, 4, 8]} />
          </mesh>
          <mesh position={[0, -0.52, 0.05]} material={mats.leather} castShadow>
            <boxGeometry args={[0.18, 0.12, 0.28]} />
          </mesh>
        </group>
        <group ref={rLeg} position={[-0.16, 0, 0]}>
          <mesh position={[0, -0.28, 0]} material={mats.leather} castShadow>
            <capsuleGeometry args={[0.09, 0.38, 4, 8]} />
          </mesh>
          <mesh position={[0, -0.52, 0.05]} material={mats.leather} castShadow>
            <boxGeometry args={[0.18, 0.12, 0.28]} />
          </mesh>
        </group>
      </group>

      <group ref={torso} position={[0, 1.18, 0]}>
        <mesh material={mats.tunic} castShadow>
          <capsuleGeometry args={[0.22, 0.42, 6, 10]} />
        </mesh>
        <mesh position={[0, -0.08, 0]} material={mats.leather} castShadow>
          <boxGeometry args={[0.48, 0.1, 0.34]} />
        </mesh>
        <mesh position={[0.28, 0.22, 0]} rotation={[0, 0, -0.4]} material={mats.leather} castShadow>
          <boxGeometry args={[0.22, 0.14, 0.28]} />
        </mesh>
        <mesh position={[-0.28, 0.22, 0]} rotation={[0, 0, 0.4]} material={mats.leather} castShadow>
          <boxGeometry args={[0.22, 0.14, 0.28]} />
        </mesh>
        <mesh position={[0, 0.12, 0.2]} material={mats.gold} castShadow>
          <octahedronGeometry args={[0.07, 0]} />
        </mesh>

        <group position={[0, 0.42, 0]}>
          <mesh material={mats.skin} castShadow>
            <sphereGeometry args={[0.18, 12, 10]} />
          </mesh>
          <mesh position={[0, 0.12, -0.02]} material={mats.hair} castShadow>
            <sphereGeometry args={[0.2, 10, 8]} />
          </mesh>
          <mesh position={[0, 0.06, 0.1]} rotation={[0.35, 0, 0]} material={mats.cloakM} castShadow>
            <coneGeometry args={[0.26, 0.28, 8]} />
          </mesh>
          <mesh position={[0, 0.02, 0.16]} material={mats.skin} castShadow>
            <boxGeometry args={[0.06, 0.05, 0.06]} />
          </mesh>
          <mesh position={[0.07, 0.03, 0.15]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial color="#1a1020" />
          </mesh>
          <mesh position={[-0.07, 0.03, 0.15]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial color="#1a1020" />
          </mesh>
        </group>

        <group ref={cloak} position={[0, 0.2, -0.16]}>
          <mesh material={mats.cloakM} castShadow>
            <boxGeometry args={[0.62, 0.9, 0.08]} />
          </mesh>
          <mesh position={[0, -0.55, -0.04]} rotation={[0.25, 0, 0]} material={mats.cloakM} castShadow>
            <boxGeometry args={[0.5, 0.4, 0.06]} />
          </mesh>
        </group>

        <group ref={lArm} position={[0.32, 0.18, 0]}>
          <mesh position={[0.04, -0.18, 0]} material={mats.tunic} castShadow>
            <capsuleGeometry args={[0.07, 0.32, 4, 8]} />
          </mesh>
        </group>
        <group ref={rArm} position={[-0.32, 0.18, 0]}>
          <mesh position={[-0.04, -0.18, 0]} material={mats.tunic} castShadow>
            <capsuleGeometry args={[0.07, 0.32, 4, 8]} />
          </mesh>
          {!npc && (
            <group ref={sword} position={[-0.05, -0.42, 0.12]} rotation={[0.2, 0, -0.3]}>
              <mesh material={mats.leather}>
                <boxGeometry args={[0.07, 0.18, 0.07]} />
              </mesh>
              <mesh position={[0, 0.42, 0]} material={mats.metal} castShadow>
                <boxGeometry args={[0.05, 0.72, 0.12]} />
              </mesh>
              <mesh position={[0, 0.08, 0]} material={mats.gold}>
                <boxGeometry args={[0.18, 0.05, 0.16]} />
              </mesh>
            </group>
          )}
        </group>
      </group>
    </group>
  );
}
