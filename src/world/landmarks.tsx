import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS } from "../game/palette";
import { heightAt, surfaceY } from "../game/terrain";
import { DISTANT_ISLES } from "../game/content";
import {
  Banner,
  Barrel,
  Box,
  Building,
  Crate,
  Crystal,
  Cyl,
  Fountain,
  LampPost,
  Pier,
  Rock,
  Ship,
  Stall,
  Tree,
  WindowGlow,
} from "./kit";

function Lighthouse() {
  const beam = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (beam.current) beam.current.rotation.y += dt * 0.55;
  });
  const p: [number, number, number] = [20, surfaceY(20, -24), -24];
  return (
    <group position={p}>
      <Cyl args={[2.4, 2.8, 1.2, 12]} color={COLORS.stoneDark} position={[0, 0.4, 0]} />
      <Cyl args={[1.35, 1.7, 8.4, 12]} color="#d7cbb6" position={[0, 5.0, 0]} />
      <Cyl args={[1.36, 1.36, 1.4, 12]} color="#7a2f32" position={[0, 2.6, 0]} />
      <Cyl args={[1.36, 1.36, 1.4, 12]} color="#7a2f32" position={[0, 5.4, 0]} />
      <Cyl args={[1.36, 1.36, 1.4, 12]} color="#7a2f32" position={[0, 8.2, 0]} />
      <Box size={[3.2, 0.25, 3.2]} color={COLORS.stone} position={[0, 9.3, 0]} />
      <Cyl args={[1.05, 1.05, 1.6, 10]} color="#1a1422" position={[0, 10.15, 0]} />
      <mesh position={[0, 10.2, 0]}>
        <sphereGeometry args={[0.42, 12, 12]} />
        <meshStandardMaterial color="#fff1c2" emissive="#ffb25a" emissiveIntensity={3} />
      </mesh>
      <group ref={beam} position={[0, 10.2, 0]}>
        <mesh rotation={[0, 0, 0.02]} position={[0, 0, 10]}>
          <boxGeometry args={[0.15, 0.15, 20]} />
          <meshBasicMaterial color="#ffd7a0" transparent opacity={0.22} />
        </mesh>
      </group>
      <pointLight position={[0, 10.3, 0]} color="#ffc27a" intensity={30} distance={40} />
      <WindowGlow position={[0, 4.2, 1.55]} />
      <Banner position={[-2.2, 0, 1.4]} color="#6e2b2b" />
    </group>
  );
}

function GuildHall() {
  const x = -12;
  const z = -9;
  const y = surfaceY(x, z);
  return (
    <group position={[x, y, z]}>
      <Building position={[0, 0, 0]} size={[9.5, 4.2, 6.4]} roofColor={COLORS.roof} wall="#cfc3b0">
        <Box size={[3.2, 2.4, 0.3]} color="#3d2416" position={[0, 1.2, 3.3]} />
        <Box size={[1.6, 0.4, 0.12]} color={COLORS.gold} position={[0, 3.3, 3.28]} />
        <Cyl args={[0.8, 0.8, 0.4, 12]} color={COLORS.amethyst} position={[0, 4.5, 0]} />
      </Building>
      <Box size={[4.2, 0.28, 2.4]} color={COLORS.stone} position={[0, 0.16, 4.4]} />
      <Banner position={[5.2, 0, 3.2]} color="#7a2f32" />
      <Banner position={[-5.2, 0, 3.2]} color="#2f5e5a" rot={0.1} />
      <LampPost position={[4.6, 0, 5.2]} />
      <LampPost position={[-4.6, 0, 5.2]} />
    </group>
  );
}

function HarbourOffice() {
  const x = 4.5;
  const z = -4.8;
  return (
    <Building position={[x, surfaceY(x, z), z]} size={[5.4, 3.1, 4.2]} roofColor={COLORS.roofTeal} wall="#d2c4ae">
      <Box size={[1.8, 0.3, 0.1]} color={COLORS.gold} position={[0, 2.6, 2.16]} />
    </Building>
  );
}

function Tavern() {
  const x = -7.5;
  const z = -1.5;
  return (
    <group position={[x, surfaceY(x, z), z]}>
      <Building position={[0, 0, 0]} size={[6.2, 3.4, 5]} roofColor="#6a2a1c" wall="#c4a07a">
        <WindowGlow position={[-1.6, 1.6, 2.56]} size={[0.7, 0.8, 0.1]} />
        <WindowGlow position={[1.6, 1.6, 2.56]} size={[0.7, 0.8, 0.1]} />
      </Building>
      <Box size={[1.4, 1.1, 0.8]} color="#3d2416" position={[2.2, 0.55, 2.8]} />
      <Barrel position={[2.9, 0, 2.4]} />
      <Barrel position={[3.4, 0, 1.7]} />
    </group>
  );
}

function Warehouses() {
  return (
    <group>
      <Building position={[22, surfaceY(22, 1.5), 1.5]} size={[7.2, 3.6, 5.4]} roofColor="#4a4038" wall="#9a8b78" rot={-0.2} />
      <Building position={[27.5, surfaceY(27.5, -4), -4]} size={[5.5, 3.2, 4.6]} roofColor="#4a4038" wall="#8d7e6c" rot={0.4} />
      <Crate position={[18.8, surfaceY(18.8, 3.2), 3.2]} />
      <Crate position={[19.6, surfaceY(19.6, 3.8), 3.8]} rotation={[0, 0.4, 0]} />
      <Crate position={[20.2, surfaceY(20.2, 2.6), 2.6]} />
      <Barrel position={[18.2, surfaceY(18.2, 4.4), 4.4]} />
      <Barrel position={[17.6, surfaceY(17.6, 3.6), 3.6]} />
      <LampPost position={[16.5, surfaceY(16.5, 1.8), 1.8]} />
    </group>
  );
}

function Market() {
  return (
    <group>
      <Stall position={[8.6, surfaceY(8.6, -7.5), -7.5]} rot={-0.3} cloth="#7a2f32" />
      <Stall position={[11.4, surfaceY(11.4, -6.2), -6.2]} rot={0.4} cloth="#2f5e5a" />
      <Stall position={[7.2, surfaceY(7.2, -5.2), -5.2]} rot={0.1} cloth="#6a3d6e" />
      <Crate position={[9.6, surfaceY(9.6, -5.4), -5.4]} />
      <Barrel position={[10.4, surfaceY(10.4, -8.2), -8.2]} />
    </group>
  );
}

function EldervaleGate() {
  const x = -6;
  const z = 17.5;
  const y = surfaceY(x, z);
  return (
    <group position={[x, y, z]} rotation={[0, Math.PI, 0]}>
      <Box size={[1.4, 6.4, 1.4]} color={COLORS.stone} position={[-3.2, 3.2, 0]} />
      <Box size={[1.4, 6.4, 1.4]} color={COLORS.stone} position={[3.2, 3.2, 0]} />
      <Box size={[8.2, 1.5, 1.5]} color={COLORS.stoneDark} position={[0, 6.6, 0]} />
      <Box size={[2.4, 0.5, 0.2]} color={COLORS.gold} position={[0, 6.6, 0.8]} />
      <Crystal position={[0, 7.7, 0]} scale={1.15} />
      <Banner position={[-4.4, 0, 1.2]} color={COLORS.cloak} />
      <Banner position={[3.2, 0, 1.2]} color={COLORS.cloak} />
    </group>
  );
}

function HillGrove() {
  return (
    <group>
      <Tree position={[-20.5, surfaceY(-20.5, -15), -15]} scale={1.15} />
      <Tree position={[-27, surfaceY(-27, -20), -20]} scale={1.35} />
      <Tree position={[-18, surfaceY(-18, -21), -21]} scale={0.95} />
      <Tree position={[-29.5, surfaceY(-29.5, -14.5), -14.5]} scale={1.1} />
      <Rock position={[-23.4, surfaceY(-23.4, -14.2) + 0.2, -14.2]} scale={1.1} />
      <Crystal position={[-25.6, surfaceY(-25.6, -19.4) + 0.3, -19.4]} />
      <Crystal position={[-21.2, surfaceY(-21.2, -22) + 0.25, -22]} scale={0.7} />
    </group>
  );
}

function Vegetation() {
  const trees = useMemo(() => {
    const pts: [number, number, number, number][] = [];
    const spots: [number, number][] = [
      [-16, 8],
      [-22, 6],
      [-28, 2],
      [-30, -6],
      [-18, -22],
      [6, -22],
      [12, -20],
      [32, -12],
      [34, 6],
      [-4, 22],
      [8, 20],
      [-32, -22],
      [2, -26],
      [-14, 14],
      [16, 14],
      [-8, -18],
    ];
    for (const [x, z] of spots) {
      if (heightAt(x, z) < 0.6) continue;
      pts.push([x, surfaceY(x, z), z, 0.85 + ((x * z) % 7) * 0.04]);
    }
    return pts;
  }, []);
  const rocks = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i < 18; i++) {
      const a = i * 1.7;
      const r = 16 + (i % 5) * 4.5;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r - 2;
      if (heightAt(x, z) < 0.5) continue;
      pts.push([x, surfaceY(x, z) + 0.15, z]);
    }
    return pts;
  }, []);
  return (
    <group>
      {trees.map((t, i) => (
        <Tree key={i} position={[t[0], t[1], t[2]]} scale={t[3]} />
      ))}
      {rocks.map((r, i) => (
        <Rock key={i} position={r} scale={0.6 + (i % 4) * 0.18} />
      ))}
    </group>
  );
}

function DistantIsles() {
  return (
    <group>
      {DISTANT_ISLES.map((isle) => (
        <group key={isle.name} position={isle.position} scale={isle.scale}>
          <mesh>
            <coneGeometry args={[14, 10, 6]} />
            <meshStandardMaterial color={isle.hue} roughness={1} />
          </mesh>
          <mesh position={[6, -1, 4]}>
            <coneGeometry args={[8, 7, 5]} />
            <meshStandardMaterial color={isle.hue} roughness={1} />
          </mesh>
          {isle.name === "Amethyst Mines" && (
            <mesh position={[0, 4, 0]}>
              <octahedronGeometry args={[3.2, 0]} />
              <meshStandardMaterial color={COLORS.amethyst} emissive={COLORS.amethyst} emissiveIntensity={0.7} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

function DockedShips() {
  const s1 = useRef<THREE.Group>(null);
  const s2 = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (s1.current) {
      s1.current.position.y = 0.15 + Math.sin(t * 0.7) * 0.12;
      s1.current.rotation.z = Math.sin(t * 0.5) * 0.03;
    }
    if (s2.current) {
      s2.current.position.y = 0.1 + Math.sin(t * 0.6 + 1.2) * 0.1;
      s2.current.rotation.z = Math.cos(t * 0.45) * 0.025;
    }
  });
  return (
    <group>
      <group ref={s1}>
        <Ship position={[6.5, 0, 10.5]} rot={0.35} />
      </group>
      <group ref={s2}>
        <Ship position={[-8.2, 0, 13]} rot={-0.5} />
      </group>
    </group>
  );
}

function Plaza() {
  return (
    <group>
      <Fountain position={[0, surfaceY(0, -3.2), -3.2]} />
      <LampPost position={[4.8, surfaceY(4.8, 0.6), 0.6]} />
      <LampPost position={[-4.8, surfaceY(-4.8, 0.8), 0.8]} />
      <LampPost position={[5.2, surfaceY(5.2, -10.2), -10.2]} />
      <LampPost position={[-5.4, surfaceY(-5.4, -10), -10]} />
      <Crate position={[2.4, surfaceY(2.4, 1.8), 1.8]} />
      <Barrel position={[-2.8, surfaceY(-2.8, 1.4), 1.4]} />
    </group>
  );
}

function NoticeBoard() {
  return (
    <group position={[1.6, surfaceY(1.6, -0.6), -0.6]}>
      <Box size={[1.8, 1.6, 0.12]} color="#5a321c" position={[0, 1.3, 0]} />
      <Box size={[1.5, 1.2, 0.04]} color="#e8d2a6" position={[0, 1.35, 0.08]} />
      <Box size={[0.12, 2.0, 0.12]} color={COLORS.woodDark} position={[-0.85, 1.0, 0]} />
      <Box size={[0.12, 2.0, 0.12]} color={COLORS.woodDark} position={[0.85, 1.0, 0]} />
    </group>
  );
}

export function Landmarks() {
  return (
    <group>
      <Lighthouse />
      <GuildHall />
      <HarbourOffice />
      <Tavern />
      <Warehouses />
      <Market />
      <EldervaleGate />
      <HillGrove />
      <Vegetation />
      <DistantIsles />
      <DockedShips />
      <Plaza />
      <NoticeBoard />
      <Pier position={[2.2, 0.15, 7.8]} length={9} rot={0.15} />
      <Pier position={[-4.5, 0.12, 8.6]} length={8} rot={-0.25} />
      <Crystal position={[1.2, surfaceY(1.2, -6.4) + 0.2, -6.4]} scale={0.8} />
    </group>
  );
}
