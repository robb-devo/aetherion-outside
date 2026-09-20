import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { launchImpulse, registry } from "../game/registry";
import { surfaceY } from "../game/terrain";
import { COLORS } from "../game/palette";

export function JumpPad() {
  const group = useRef<THREE.Group>(null);
  const x = 11.5;
  const z = 2.2;
  const y = surfaceY(x, z);

  useEffect(() => {
    const p = new THREE.Vector3(x, y + 0.4, z);
    return registry.registerNode({
      id: "pad-plaza",
      kind: "jump",
      label: "Jump Pad — lighthouse spit",
      getPos: () => p,
      available: () => true,
    });
  }, [x, y, z]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const s = 1 + Math.sin(clock.elapsedTime * 4) * 0.06;
    group.current.scale.set(s, 1, s);
  });

  return (
    <group
      ref={group}
      position={[x, y, z]}
      onClick={() => {
        launchImpulse.current = new THREE.Vector3(3.2, 13.5, -8.5);
      }}
    >
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
        <cylinderGeometry args={[1.05, 1.05, 0.16, 16]} />
        <meshStandardMaterial color="#3a2458" emissive={COLORS.amethyst} emissiveIntensity={0.7} metalness={0.3} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.14, 0]}>
        <ringGeometry args={[0.35, 0.72, 16]} />
        <meshStandardMaterial color={COLORS.gold} emissive={COLORS.gold} emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <octahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial color={COLORS.amethystSoft} emissive={COLORS.amethyst} emissiveIntensity={1.1} />
      </mesh>
      <pointLight color="#b48cff" intensity={4} distance={6} />
    </group>
  );
}
