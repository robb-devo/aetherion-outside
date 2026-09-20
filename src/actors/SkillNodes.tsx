import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { registry } from "../game/registry";
import { surfaceY } from "../game/terrain";
import { COLORS } from "../game/palette";

function ChannelNode({
  id,
  xz,
  kind,
  label,
  yOff = 0.2,
}: {
  id: string;
  xz: [number, number];
  kind: "mine" | "fish";
  label: string;
  yOff?: number;
}) {
  const used = useRef(false);
  const [gone, setGone] = useState(false);
  const group = useRef<THREE.Group>(null);
  const pos = useMemo(() => {
    const [x, z] = xz;
    return new THREE.Vector3(x, surfaceY(x, z) + yOff, z);
  }, [xz, yOff]);

  useEffect(() => {
    return registry.registerNode({
      id,
      kind,
      label,
      getPos: () => pos.clone(),
      available: () => (kind === "fish" ? true : !used.current),
      consume: () => {
        if (kind === "fish") return;
        used.current = true;
        setGone(true);
      },
    });
  }, [id, kind, label, pos]);

  useFrame(({ clock }) => {
    if (!group.current || used.current) return;
    group.current.position.y = pos.y + Math.sin(clock.elapsedTime * 2.2 + pos.x) * 0.05;
  });

  if (gone) return null;

  if (kind === "fish") {
    return (
      <group ref={group} position={[pos.x, pos.y, pos.z]}>
        <mesh rotation={[0.2, 0.4, 0]}>
          <cylinderGeometry args={[0.04, 0.05, 1.6, 6]} />
          <meshStandardMaterial color="#6a4026" />
        </mesh>
        <mesh position={[0.35, 0.55, 0]}>
          <boxGeometry args={[0.7, 0.04, 0.04]} />
          <meshStandardMaterial color="#d8c3a0" />
        </mesh>
        <mesh position={[0.7, 0.2, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#3c7f86" emissive="#3c7f86" emissiveIntensity={0.4} />
        </mesh>
      </group>
    );
  }

  return (
    <group ref={group} position={[pos.x, pos.y, pos.z]}>
      <mesh rotation={[0.2, 0.4, 0.1]}>
        <octahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial
          color={COLORS.amethyst}
          emissive={COLORS.amethyst}
          emissiveIntensity={0.9}
          roughness={0.22}
          transparent
          opacity={0.92}
        />
      </mesh>
      <pointLight color="#b48cff" intensity={3.2} distance={5} />
    </group>
  );
}

export function SkillNodes() {
  return (
    <group>
      <ChannelNode id="crystal-plaza" xz={[1.35, -6.2]} kind="mine" label="Mine Amethyst Chip" yOff={0.35} />
      <ChannelNode id="crystal-hill" xz={[-25.2, -19.1]} kind="mine" label="Mine Amethyst Chip" yOff={0.4} />
      <ChannelNode id="fish-pier" xz={[2.4, 8.2]} kind="fish" label="Fish the dusk water" yOff={0.35} />
    </group>
  );
}
