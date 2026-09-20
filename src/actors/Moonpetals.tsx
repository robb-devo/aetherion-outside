import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { registry } from "../game/registry";
import { surfaceY } from "../game/terrain";
import { COLORS } from "../game/palette";

const SPOTS: [number, number][] = [
  [-3.4, 1.4],
  [-11.2, -12.5],
  [-18.5, -18.2],
  [-29.5, -21.5],
  [-33.2, -25.4],
  [-27.0, -27.2],
  [-36.5, -22.0],
  [2.8, -11.5],
];

function Moonpetal({ id, xz }: { id: string; xz: [number, number] }) {
  const collected = useRef(false);
  const [gone, setGone] = useState(false);
  const group = useRef<THREE.Group>(null);
  const pos = useMemo(() => {
    const [x, z] = xz;
    return new THREE.Vector3(x, surfaceY(x, z), z);
  }, [xz]);

  useEffect(() => {
    return registry.registerNode({
      id,
      kind: "forage",
      label: "Gather Moonpetal",
      getPos: () => pos.clone().setY(pos.y + 0.4),
      available: () => !collected.current,
      consume: () => {
        collected.current = true;
        setGone(true);
      },
    });
  }, [id, pos]);

  useFrame(({ clock }) => {
    if (!group.current || collected.current) return;
    group.current.position.y = pos.y + 0.08 + Math.sin(clock.elapsedTime * 2 + pos.x) * 0.06;
    group.current.rotation.y += 0.4 * 0.016;
  });

  if (gone) return null;

  return (
    <group ref={group} position={[pos.x, pos.y + 0.1, pos.z]}>
      <mesh>
        <cylinderGeometry args={[0.03, 0.05, 0.45, 6]} />
        <meshStandardMaterial color="#355c3a" />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[Math.sin(i * 1.26) * 0.16, 0.32, Math.cos(i * 1.26) * 0.16]} rotation={[0.5, i, 0]}>
          <sphereGeometry args={[0.11, 8, 6]} />
          <meshStandardMaterial
            color={COLORS.amethystSoft}
            emissive={COLORS.amethyst}
            emissiveIntensity={0.9}
            roughness={0.35}
          />
        </mesh>
      ))}
      <mesh position={[0, 0.34, 0]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color="#ffe38a" emissive="#ffb25a" emissiveIntensity={1.2} />
      </mesh>
      <pointLight color="#c3a6ff" intensity={2.2} distance={3.5} />
    </group>
  );
}

export function Moonpetals() {
  return (
    <group>
      {SPOTS.map((p, i) => (
        <Moonpetal key={i} id={`petal-${i}`} xz={p} />
      ))}
    </group>
  );
}
