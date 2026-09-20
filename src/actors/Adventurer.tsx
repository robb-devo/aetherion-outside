import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS, toon } from "../game/palette";
import { feel } from "../game/feel";

export type AnimState = "idle" | "walk" | "run" | "jump" | "attack" | "aim";

type Props = {
  anim: AnimState;
  animRef?: MutableRefObject<AnimState>;
  attackT?: number;
  attackRef?: MutableRefObject<number>;
  comboRef?: MutableRefObject<number>;
  stepRef?: MutableRefObject<number>;
  palette?: { tunic?: string; cloak?: string; hair?: string; skin?: string };
  scale?: number;
  npc?: boolean;
};

export function Adventurer({
  anim,
  animRef,
  attackT = 0,
  attackRef,
  comboRef,
  stepRef,
  palette,
  scale = 1,
  npc = false,
}: Props) {
  const root = useRef<THREE.Group>(null);
  const hips = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const lArm = useRef<THREE.Group>(null);
  const rArm = useRef<THREE.Group>(null);
  const lLeg = useRef<THREE.Group>(null);
  const rLeg = useRef<THREE.Group>(null);
  const cloak = useRef<THREE.Mesh>(null);
  const sword = useRef<THREE.Group>(null);
  const bow = useRef<THREE.Group>(null);

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
      wood: toon("#6a4026"),
      string: toon("#e8d2a6"),
    };
  }, [palette]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const animNow = animRef?.current ?? anim;
    const attackNow = attackRef?.current ?? attackT;
    const combo = comboRef?.current ?? 0;
    const phase = stepRef?.current ?? t * 6;
    const moving = animNow === "walk" || animNow === "run";
    const run = animNow === "run";
    const amp = run ? 0.95 : 0.62;
    const swing = moving ? Math.sin(phase) : 0;
    const bob = moving ? Math.abs(Math.sin(phase)) * (run ? 0.055 : 0.035) : Math.sin(t * 1.5) * 0.006;

    if (hips.current) {
      hips.current.position.y = bob;
      hips.current.rotation.y = moving ? Math.sin(phase) * 0.08 : 0;
      hips.current.rotation.z = moving ? Math.sin(phase) * 0.04 : 0;
    }

    if (lArm.current) {
      if (animNow === "aim") {
        lArm.current.rotation.x = -1.15;
        lArm.current.rotation.y = 0.35;
        lArm.current.rotation.z = 0.2;
      } else if (animNow === "attack") {
        lArm.current.rotation.x = -0.4;
        lArm.current.rotation.y = 0.15;
        lArm.current.rotation.z = 0;
      } else {
        lArm.current.rotation.x = moving ? swing * amp * 0.85 : Math.sin(t * 1.3) * 0.04;
        lArm.current.rotation.y = 0;
        lArm.current.rotation.z = 0;
      }
    }

    if (rArm.current) {
      if (animNow === "attack") {
        const a = Math.min(1, attackNow / 0.32);
        const wave = Math.sin(a * Math.PI);
        if (combo === 0) {
          rArm.current.rotation.x = -2.05 * wave;
          rArm.current.rotation.y = 0.55 * wave;
          rArm.current.rotation.z = -0.4 * wave;
        } else if (combo === 1) {
          rArm.current.rotation.x = -1.5 * wave;
          rArm.current.rotation.y = -0.85 * wave;
          rArm.current.rotation.z = 0.55 * wave;
        } else {
          rArm.current.rotation.x = -2.35 * wave;
          rArm.current.rotation.y = 0.1;
          rArm.current.rotation.z = 0.2 * wave;
        }
      } else if (animNow === "aim") {
        const draw = feel.draw;
        rArm.current.rotation.x = -1.35 - draw * 0.25;
        rArm.current.rotation.y = -0.55 - draw * 0.35;
        rArm.current.rotation.z = -0.15;
      } else {
        rArm.current.rotation.x = moving ? -swing * amp * 0.85 : Math.sin(t * 1.3 + 1) * 0.04;
        rArm.current.rotation.y = 0;
        rArm.current.rotation.z = 0;
      }
    }

    if (lLeg.current) lLeg.current.rotation.x = moving ? -swing * amp : 0;
    if (rLeg.current) rLeg.current.rotation.x = moving ? swing * amp : 0;

    if (torso.current) {
      torso.current.rotation.x =
        animNow === "run" ? 0.14 : animNow === "jump" ? -0.12 : animNow === "aim" ? 0.06 : moving ? 0.05 : 0.02;
      torso.current.rotation.y = animNow === "attack" ? Math.sin(Math.min(1, attackNow / 0.3) * Math.PI) * (combo === 1 ? -0.35 : 0.25) : 0;
    }

    if (cloak.current) {
      cloak.current.rotation.x = 0.16 + (moving ? 0.25 + Math.abs(swing) * 0.12 : 0.05) + Math.sin(t * 2) * 0.02;
    }

    if (sword.current) {
      const sheathed = feel.weapon === "bow" || npc;
      sword.current.visible = !npc;
      if (sheathed) {
        sword.current.position.set(0.28, -0.15, -0.28);
        sword.current.rotation.set(0.2, 0.1, 1.15);
      } else if (animNow === "attack") {
        const a = Math.min(1, attackNow / 0.32);
        sword.current.position.set(-0.04, -0.48, 0.16);
        sword.current.rotation.set(0.35, 0.4, -0.2 - Math.sin(a * Math.PI) * (0.9 + combo * 0.25));
      } else {
        sword.current.position.set(-0.04, -0.48, 0.16);
        sword.current.rotation.set(0.35, 0.4, -0.2);
      }
    }

    if (bow.current) {
      const show = !npc && feel.weapon === "bow";
      bow.current.visible = show;
      if (animNow === "aim") {
        bow.current.position.set(0.05, -0.15, 0.35);
        bow.current.rotation.set(0.1, 0.0, 0.15);
        bow.current.scale.setScalar(1.05 + feel.draw * 0.08);
      } else {
        bow.current.position.set(0.32, -0.05, -0.22);
        bow.current.rotation.set(0.15, 0.4, 1.2);
        bow.current.scale.setScalar(1);
      }
    }

    if (root.current) root.current.rotation.x = animNow === "jump" ? -0.08 : 0;
  });

  return (
    <group ref={root} scale={scale}>
      <group ref={hips}>
        <group ref={lLeg} position={[0.13, 0.92, 0]}>
          <mesh position={[0, -0.28, 0]} material={mats.pants} castShadow>
            <boxGeometry args={[0.15, 0.52, 0.17]} />
          </mesh>
          <mesh position={[0, -0.56, 0.06]} material={mats.leather} castShadow>
            <boxGeometry args={[0.17, 0.12, 0.3]} />
          </mesh>
        </group>
        <group ref={rLeg} position={[-0.13, 0.92, 0]}>
          <mesh position={[0, -0.28, 0]} material={mats.pants} castShadow>
            <boxGeometry args={[0.15, 0.52, 0.17]} />
          </mesh>
          <mesh position={[0, -0.56, 0.06]} material={mats.leather} castShadow>
            <boxGeometry args={[0.17, 0.12, 0.3]} />
          </mesh>
        </group>

        <group ref={torso} position={[0, 1.22, 0]}>
          <mesh material={mats.tunic} castShadow>
            <boxGeometry args={[0.52, 0.54, 0.3]} />
          </mesh>
          <mesh position={[0, -0.24, 0]} material={mats.leather} castShadow>
            <boxGeometry args={[0.54, 0.11, 0.32]} />
          </mesh>
          <mesh position={[0.27, 0.2, 0]} material={mats.leather} castShadow>
            <boxGeometry args={[0.17, 0.15, 0.32]} />
          </mesh>
          <mesh position={[-0.27, 0.2, 0]} material={mats.leather} castShadow>
            <boxGeometry args={[0.17, 0.15, 0.32]} />
          </mesh>
          <mesh position={[0, 0.08, 0.16]} material={mats.gold} castShadow>
            <octahedronGeometry args={[0.075, 0]} />
          </mesh>

          <group position={[0, 0.48, 0.04]}>
            <mesh material={mats.skin} castShadow>
              <sphereGeometry args={[0.17, 14, 12]} />
            </mesh>
            <mesh position={[0, 0.09, -0.04]} material={mats.hair} castShadow>
              <sphereGeometry args={[0.185, 12, 10]} />
            </mesh>
            <mesh position={[0, 0.15, -0.02]} material={mats.cloakM} castShadow>
              <sphereGeometry args={[0.125, 10, 8]} />
            </mesh>
            <mesh position={[0.06, 0.02, 0.14]}>
              <sphereGeometry args={[0.028, 8, 8]} />
              <meshBasicMaterial color="#1a1020" />
            </mesh>
            <mesh position={[-0.06, 0.02, 0.14]}>
              <sphereGeometry args={[0.028, 8, 8]} />
              <meshBasicMaterial color="#1a1020" />
            </mesh>
          </group>

          <mesh ref={cloak} position={[0, -0.05, -0.22]} material={mats.cloakM} castShadow>
            <boxGeometry args={[0.48, 0.98, 0.07]} />
          </mesh>

          <group ref={lArm} position={[0.36, 0.16, 0]}>
            <mesh position={[0.02, -0.22, 0]} material={mats.tunic} castShadow>
              <boxGeometry args={[0.13, 0.48, 0.13]} />
            </mesh>
            <mesh position={[0.02, -0.46, 0.02]} material={mats.skin} castShadow>
              <boxGeometry args={[0.11, 0.11, 0.11]} />
            </mesh>
          </group>
          <group ref={rArm} position={[-0.36, 0.16, 0]}>
            <mesh position={[-0.02, -0.22, 0]} material={mats.tunic} castShadow>
              <boxGeometry args={[0.13, 0.48, 0.13]} />
            </mesh>
            {!npc && (
              <>
                <group ref={sword} position={[-0.04, -0.48, 0.16]} rotation={[0.35, 0.4, -0.2]}>
                  <mesh material={mats.leather}>
                    <boxGeometry args={[0.06, 0.16, 0.06]} />
                  </mesh>
                  <mesh position={[0, 0.08, 0]} material={mats.gold}>
                    <boxGeometry args={[0.22, 0.05, 0.08]} />
                  </mesh>
                  <mesh position={[0, 0.52, 0]} material={mats.metal} castShadow>
                    <boxGeometry args={[0.05, 0.88, 0.11]} />
                  </mesh>
                </group>
                <group ref={bow} visible={false}>
                  <mesh material={mats.wood} castShadow>
                    <torusGeometry args={[0.42, 0.035, 6, 14, Math.PI]} />
                  </mesh>
                  <mesh position={[0, 0, 0.02]} material={mats.string}>
                    <boxGeometry args={[0.015, 0.78, 0.015]} />
                  </mesh>
                </group>
              </>
            )}
          </group>
        </group>
      </group>
    </group>
  );
}
