import { useMemo, type ReactNode } from "react";
import * as THREE from "three";
import { COLORS, standard } from "../game/palette";

type V3 = [number, number, number];

export function Box({
  position,
  rotation,
  scale,
  size = [1, 1, 1],
  color,
  emissive,
  emissiveIntensity = 0,
  cast = true,
  receive = true,
}: {
  position?: V3;
  rotation?: V3;
  scale?: V3;
  size?: V3;
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  cast?: boolean;
  receive?: boolean;
}) {
  const mat = useMemo(
    () => standard(color, { emissive, emissiveIntensity, roughness: 0.78 }),
    [color, emissive, emissiveIntensity],
  );
  return (
    <mesh
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow={cast}
      receiveShadow={receive}
      material={mat}
    >
      <boxGeometry args={size} />
    </mesh>
  );
}

export function Cyl({
  position,
  rotation,
  args = [0.5, 0.5, 1, 10],
  color,
  emissive,
  emissiveIntensity = 0,
  cast = true,
}: {
  position?: V3;
  rotation?: V3;
  args?: [number, number, number, number];
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  cast?: boolean;
}) {
  const mat = useMemo(
    () => standard(color, { emissive, emissiveIntensity, roughness: 0.7 }),
    [color, emissive, emissiveIntensity],
  );
  return (
    <mesh position={position} rotation={rotation} castShadow={cast} receiveShadow material={mat}>
      <cylinderGeometry args={args} />
    </mesh>
  );
}

export function Cone({
  position,
  rotation,
  args = [1, 1.5, 8],
  color,
  cast = true,
}: {
  position?: V3;
  rotation?: V3;
  args?: [number, number, number];
  color: string;
  cast?: boolean;
}) {
  const mat = useMemo(() => standard(color, { roughness: 0.82 }), [color]);
  return (
    <mesh position={position} rotation={rotation} castShadow={cast} receiveShadow material={mat}>
      <coneGeometry args={args} />
    </mesh>
  );
}

export function Roof({ position, size, color = COLORS.roof, rot = 0 }: { position: V3; size: V3; color?: string; rot?: number }) {
  return (
    <group position={position} rotation={[0, rot, 0]}>
      <Box size={size} color={color} position={[0, 0, 0]} rotation={[0, 0, 0]} />
      <Box size={[size[0] * 1.08, 0.12, size[2] * 1.08]} color="#3a1f16" position={[0, size[1] * 0.52, 0]} />
    </group>
  );
}

export function WindowGlow({ position, size = [0.55, 0.7, 0.08] as V3 }: { position: V3; size?: V3 }) {
  return (
    <Box
      position={position}
      size={size}
      color="#ffcf7a"
      emissive="#ff9a3a"
      emissiveIntensity={1.4}
      cast={false}
    />
  );
}

export function LampPost({ position }: { position: V3 }) {
  return (
    <group position={position}>
      <Cyl args={[0.08, 0.1, 2.2, 8]} color={COLORS.stoneDark} position={[0, 1.1, 0]} />
      <Box size={[0.55, 0.12, 0.55]} color={COLORS.stone} position={[0, 2.2, 0]} />
      <Box
        size={[0.32, 0.38, 0.32]}
        color="#ffe0a0"
        emissive={COLORS.lantern}
        emissiveIntensity={2.2}
        position={[0, 2.45, 0]}
        cast={false}
      />
      <pointLight position={[0, 2.5, 0]} color="#ffb25a" intensity={6.5} distance={11} decay={2} />
    </group>
  );
}

export function Crate({ position, rotation }: { position: V3; rotation?: V3 }) {
  return (
    <group position={position} rotation={rotation}>
      <Box size={[0.7, 0.7, 0.7]} color="#8a5a32" />
      <Box size={[0.74, 0.08, 0.74]} color="#5c3a1e" position={[0, 0.32, 0]} />
    </group>
  );
}

export function Barrel({ position }: { position: V3 }) {
  return (
    <group position={position}>
      <Cyl args={[0.32, 0.36, 0.7, 10]} color="#6b3f24" position={[0, 0.35, 0]} />
      <Cyl args={[0.33, 0.33, 0.06, 10]} color="#c9a15b" position={[0, 0.12, 0]} cast={false} />
      <Cyl args={[0.33, 0.33, 0.06, 10]} color="#c9a15b" position={[0, 0.58, 0]} cast={false} />
    </group>
  );
}

export function Banner({ position, color, rot = 0 }: { position: V3; color: string; rot?: number }) {
  return (
    <group position={position} rotation={[0, rot, 0]}>
      <Cyl args={[0.05, 0.05, 3.2, 6]} color={COLORS.woodDark} position={[0, 1.6, 0]} />
      <Box size={[1.1, 1.4, 0.05]} color={color} position={[0.55, 2.2, 0]} />
      <Box size={[0.18, 0.18, 0.05]} color={COLORS.gold} position={[0.55, 2.55, 0.02]} />
    </group>
  );
}

export function Tree({ position, scale = 1 }: { position: V3; scale?: number }) {
  const s = scale;
  return (
    <group position={position} scale={s}>
      <Cyl args={[0.18, 0.28, 1.6, 7]} color={COLORS.woodDark} position={[0, 0.8, 0]} />
      <mesh position={[0, 2.1, 0]} castShadow>
        <icosahedronGeometry args={[1.15, 0]} />
        <meshStandardMaterial color="#2f5a34" roughness={0.9} />
      </mesh>
      <mesh position={[0.45, 2.45, -0.2]} castShadow>
        <icosahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial color="#3f6f3c" roughness={0.9} />
      </mesh>
      <mesh position={[-0.4, 2.55, 0.25]} castShadow>
        <icosahedronGeometry args={[0.62, 0]} />
        <meshStandardMaterial color="#274c2d" roughness={0.9} />
      </mesh>
    </group>
  );
}

export function Rock({ position, scale = 1, color = COLORS.stoneDark }: { position: V3; scale?: number; color?: string }) {
  return (
    <mesh position={position} scale={scale} rotation={[0.2, 0.4, 0.1]} castShadow receiveShadow>
      <dodecahedronGeometry args={[0.7, 0]} />
      <meshStandardMaterial color={color} roughness={0.92} />
    </mesh>
  );
}

export function Crystal({ position, scale = 1 }: { position: V3; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh rotation={[0.15, 0.3, 0.1]} castShadow>
        <octahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial
          color={COLORS.amethyst}
          emissive={COLORS.amethyst}
          emissiveIntensity={0.85}
          roughness={0.22}
          metalness={0.35}
          transparent
          opacity={0.92}
        />
      </mesh>
      <mesh position={[0.28, -0.1, 0.1]} rotation={[0.4, 0.2, -0.3]} castShadow>
        <octahedronGeometry args={[0.28, 0]} />
        <meshStandardMaterial color={COLORS.amethystSoft} emissive={COLORS.amethyst} emissiveIntensity={0.6} roughness={0.25} />
      </mesh>
      <pointLight color="#b48cff" intensity={4} distance={7} />
    </group>
  );
}

export function Stall({ position, rot = 0, cloth = "#c45c5c" }: { position: V3; rot?: number; cloth?: string }) {
  return (
    <group position={position} rotation={[0, rot, 0]}>
      <Box size={[2.2, 0.18, 1.4]} color={COLORS.wood} position={[0, 0.95, 0]} />
      <Cyl args={[0.07, 0.07, 1.9, 6]} color={COLORS.woodDark} position={[-0.95, 0.95, -0.55]} />
      <Cyl args={[0.07, 0.07, 1.9, 6]} color={COLORS.woodDark} position={[0.95, 0.95, -0.55]} />
      <Cyl args={[0.07, 0.07, 1.4, 6]} color={COLORS.woodDark} position={[-0.95, 0.7, 0.55]} />
      <Cyl args={[0.07, 0.07, 1.4, 6]} color={COLORS.woodDark} position={[0.95, 0.7, 0.55]} />
      <Box size={[2.4, 0.08, 1.7]} color={cloth} position={[0, 1.95, 0]} rotation={[-0.18, 0, 0]} />
      <Box size={[0.35, 0.3, 0.35]} color={COLORS.gold} position={[-0.5, 1.12, 0.15]} />
      <Box size={[0.28, 0.38, 0.28]} color="#6e2b2b" position={[0.45, 1.18, 0.1]} />
    </group>
  );
}

export function Building({
  position,
  size,
  roofColor = COLORS.roof,
  wall = COLORS.stone,
  rot = 0,
  children,
}: {
  position: V3;
  size: V3;
  roofColor?: string;
  wall?: string;
  rot?: number;
  children?: ReactNode;
}) {
  const [w, h, d] = size;
  return (
    <group position={position} rotation={[0, rot, 0]}>
      <Box size={size} color={wall} position={[0, h / 2, 0]} />
      <Roof position={[0, h + 0.55, 0]} size={[w + 0.5, 1.1, d + 0.45]} color={roofColor} />
      <Box size={[0.9, 1.7, 0.12]} color={COLORS.woodDark} position={[0, 0.85, d / 2 + 0.04]} />
      <WindowGlow position={[-w * 0.28, h * 0.55, d / 2 + 0.05]} />
      <WindowGlow position={[w * 0.28, h * 0.55, d / 2 + 0.05]} />
      {children}
    </group>
  );
}

export function Pier({ position, length = 10, rot = 0 }: { position: V3; length?: number; rot?: number }) {
  const planks = Math.floor(length / 1.1);
  return (
    <group position={position} rotation={[0, rot, 0]}>
      {Array.from({ length: planks }, (_, i) => (
        <Box
          key={i}
          size={[2.4, 0.18, 1.05]}
          color={i % 2 ? "#7a4a28" : "#6a4026"}
          position={[0, 0.22, i * 1.08 - length / 2]}
        />
      ))}
      {Array.from({ length: 4 }, (_, i) => (
        <Cyl
          key={`p${i}`}
          args={[0.16, 0.2, 1.4, 8]}
          color={COLORS.woodDark}
          position={[i % 2 ? 1.1 : -1.1, -0.2, (i * length) / 4 - length / 2 + 0.8]}
        />
      ))}
    </group>
  );
}

export function Ship({ position, rot = 0 }: { position: V3; rot?: number }) {
  return (
    <group position={position} rotation={[0, rot, 0]}>
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.9, 7.2]} />
        <meshStandardMaterial color="#5a321c" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.55, 3.5]} rotation={[0.4, 0, 0]} castShadow>
        <boxGeometry args={[2.0, 0.7, 1.6]} />
        <meshStandardMaterial color="#4a2816" />
      </mesh>
      <mesh position={[0, 0.55, -3.5]} rotation={[-0.4, 0, 0]} castShadow>
        <boxGeometry args={[2.0, 0.7, 1.6]} />
        <meshStandardMaterial color="#4a2816" />
      </mesh>
      <Box size={[1.6, 0.9, 2.4]} color="#7a4e2e" position={[0, 1.15, -0.6]} />
      <Cyl args={[0.1, 0.12, 6.4, 8]} color="#d8c3a0" position={[0, 4.2, 0.4]} />
      <Box size={[0.08, 3.6, 2.8]} color={COLORS.sail} position={[0.15, 4.0, 0.4]} />
      <Box size={[0.08, 2.2, 1.8]} color="#f0e0c0" position={[-0.12, 3.2, -1.5]} />
      <Box size={[0.9, 0.12, 0.9]} color={COLORS.gold} position={[0, 1.7, -0.6]} />
    </group>
  );
}

export function Fountain({ position }: { position: V3 }) {
  return (
    <group position={position}>
      <Cyl args={[2.1, 2.1, 0.35, 16]} color={COLORS.stone} position={[0, 0.18, 0]} />
      <Cyl args={[1.7, 1.7, 0.4, 16]} color="#1f4a52" position={[0, 0.38, 0]} />
      <Cyl args={[0.28, 0.32, 1.3, 8]} color={COLORS.stone} position={[0, 1.0, 0]} />
      <mesh position={[0, 1.7, 0]}>
        <octahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial color={COLORS.amethyst} emissive={COLORS.amethyst} emissiveIntensity={0.8} />
      </mesh>
      <Cyl args={[0.35, 0.45, 0.7, 10]} color="#3c7f86" position={[0, 0.7, 0]} cast={false} />
    </group>
  );
}
