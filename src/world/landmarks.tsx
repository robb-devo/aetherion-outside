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
    if (beam.current) beam.current.rotation.y += dt * 0.48;
  });
  const p: [number, number, number] = [28, surfaceY(28, -32), -32];
  return (
    <group position={p}>
      <Cyl args={[2.6, 3.0, 1.3, 14]} color={COLORS.stoneDark} position={[0, 0.45, 0]} />
      <Cyl args={[1.45, 1.85, 9.2, 14]} color="#d7cbb6" position={[0, 5.4, 0]} />
      <Cyl args={[1.46, 1.46, 1.5, 14]} color="#7a2f32" position={[0, 2.8, 0]} />
      <Cyl args={[1.46, 1.46, 1.5, 14]} color="#7a2f32" position={[0, 5.8, 0]} />
      <Cyl args={[1.46, 1.46, 1.5, 14]} color="#7a2f32" position={[0, 8.8, 0]} />
      <Box size={[3.4, 0.28, 3.4]} color={COLORS.stone} position={[0, 10.1, 0]} />
      <Cyl args={[1.1, 1.1, 1.7, 12]} color="#1a1422" position={[0, 11.0, 0]} />
      <mesh position={[0, 11.05, 0]}>
        <sphereGeometry args={[0.48, 14, 14]} />
        <meshStandardMaterial color="#fff1c2" emissive="#ffb25a" emissiveIntensity={3.2} />
      </mesh>
      <group ref={beam} position={[0, 11.05, 0]}>
        <mesh rotation={[0, 0, 0.02]} position={[0, 0, 12]}>
          <boxGeometry args={[0.18, 0.18, 24]} />
          <meshBasicMaterial color="#ffd7a0" transparent opacity={0.24} />
        </mesh>
      </group>
      <pointLight position={[0, 11.15, 0]} color="#ffc27a" intensity={36} distance={52} />
      <WindowGlow position={[0, 4.6, 1.7]} />
      <Banner position={[-2.4, 0, 1.5]} color="#6e2b2b" />
    </group>
  );
}

function GuildHall() {
  const x = -16;
  const z = -12;
  const y = surfaceY(x, z);
  return (
    <group position={[x, y, z]}>
      <Building position={[0, 0, 0]} size={[11, 4.8, 7.2]} roofColor={COLORS.roof} wall="#cfc3b0">
        <Box size={[3.6, 2.6, 0.32]} color="#3d2416" position={[0, 1.3, 3.7]} />
        <Box size={[1.8, 0.42, 0.12]} color={COLORS.gold} position={[0, 3.7, 3.68]} />
        <Cyl args={[0.9, 0.9, 0.45, 12]} color={COLORS.amethyst} position={[0, 5.1, 0]} />
      </Building>
      <Box size={[4.8, 0.3, 2.8]} color={COLORS.stone} position={[0, 0.18, 5.0]} />
      <Banner position={[6.0, 0, 3.6]} color="#7a2f32" />
      <Banner position={[-6.0, 0, 3.6]} color="#2f5e5a" rot={0.1} />
      <LampPost position={[5.2, 0, 5.8]} />
      <LampPost position={[-5.2, 0, 5.8]} />
    </group>
  );
}

function HarbourOffice() {
  const x = 6.2;
  const z = -6.4;
  return (
    <Building position={[x, surfaceY(x, z), z]} size={[6.2, 3.4, 4.8]} roofColor={COLORS.roofTeal} wall="#d2c4ae">
      <Box size={[2.0, 0.32, 0.1]} color={COLORS.gold} position={[0, 2.85, 2.46]} />
    </Building>
  );
}

function Tavern() {
  const x = -10;
  const z = -2;
  return (
    <group position={[x, surfaceY(x, z), z]}>
      <Building position={[0, 0, 0]} size={[7.2, 3.8, 5.6]} roofColor="#6a2a1c" wall="#c4a07a">
        <WindowGlow position={[-1.8, 1.7, 2.86]} size={[0.75, 0.85, 0.1]} />
        <WindowGlow position={[1.8, 1.7, 2.86]} size={[0.75, 0.85, 0.1]} />
      </Building>
      <Box size={[1.5, 1.15, 0.85]} color="#3d2416" position={[2.5, 0.58, 3.1]} />
      <Barrel position={[3.2, 0, 2.7]} />
      <Barrel position={[3.8, 0, 1.9]} />
    </group>
  );
}

function Warehouses() {
  return (
    <group>
      <Building position={[30, surfaceY(30, 2), 2]} size={[8.4, 4.0, 6.2]} roofColor="#4a4038" wall="#9a8b78" rot={-0.18} />
      <Building position={[37, surfaceY(37, -5), -5]} size={[6.4, 3.6, 5.2]} roofColor="#4a4038" wall="#8d7e6c" rot={0.35} />
      <Crate position={[25.5, surfaceY(25.5, 4.2), 4.2]} />
      <Crate position={[26.4, surfaceY(26.4, 5.0), 5.0]} rotation={[0, 0.4, 0]} />
      <Crate position={[27.2, surfaceY(27.2, 3.4), 3.4]} />
      <Barrel position={[24.8, surfaceY(24.8, 5.6), 5.6]} />
      <Barrel position={[24.0, surfaceY(24.0, 4.6), 4.6]} />
      <LampPost position={[22.5, surfaceY(22.5, 2.2), 2.2]} />
    </group>
  );
}

function Market() {
  return (
    <group>
      <Stall position={[11.4, surfaceY(11.4, -9.8), -9.8]} rot={-0.3} cloth="#7a2f32" />
      <Stall position={[15.0, surfaceY(15.0, -8.2), -8.2]} rot={0.4} cloth="#2f5e5a" />
      <Stall position={[9.6, surfaceY(9.6, -6.8), -6.8]} rot={0.1} cloth="#6a3d6e" />
      <Crate position={[12.8, surfaceY(12.8, -7.2), -7.2]} />
      <Barrel position={[13.8, surfaceY(13.8, -10.6), -10.6]} />
    </group>
  );
}

function EldervaleGate() {
  const x = -8;
  const z = 25;
  const y = surfaceY(x, z);
  return (
    <group position={[x, y, z]} rotation={[0, Math.PI, 0]}>
      <Box size={[1.6, 7.2, 1.6]} color={COLORS.stone} position={[-3.8, 3.6, 0]} />
      <Box size={[1.6, 7.2, 1.6]} color={COLORS.stone} position={[3.8, 3.6, 0]} />
      <Box size={[9.6, 1.7, 1.7]} color={COLORS.stoneDark} position={[0, 7.4, 0]} />
      <Box size={[2.8, 0.55, 0.22]} color={COLORS.gold} position={[0, 7.4, 0.9]} />
      <Crystal position={[0, 8.7, 0]} scale={1.25} />
      <Banner position={[-5.0, 0, 1.3]} color={COLORS.cloak} />
      <Banner position={[3.6, 0, 1.3]} color={COLORS.cloak} />
    </group>
  );
}

function HillGrove() {
  return (
    <group>
      <Tree position={[-27, surfaceY(-27, -20), -20]} scale={1.25} />
      <Tree position={[-36, surfaceY(-36, -26), -26]} scale={1.45} />
      <Tree position={[-24, surfaceY(-24, -28), -28]} scale={1.05} />
      <Tree position={[-39, surfaceY(-39, -19), -19]} scale={1.2} />
      <Tree position={[-31, surfaceY(-31, -30), -30]} scale={1.3} />
      <Rock position={[-31.2, surfaceY(-31.2, -18.8) + 0.2, -18.8]} scale={1.2} />
      <Crystal position={[-34.2, surfaceY(-34.2, -25.4) + 0.3, -25.4]} />
      <Crystal position={[-28.4, surfaceY(-28.4, -29) + 0.25, -29]} scale={0.75} />
    </group>
  );
}

function Vegetation() {
  const trees = useMemo(() => {
    const pts: [number, number, number, number][] = [];
    const spots: [number, number][] = [
      [-22, 10],
      [-30, 8],
      [-38, 3],
      [-40, -8],
      [-24, -30],
      [8, -30],
      [16, -26],
      [42, -16],
      [46, 8],
      [-6, 32],
      [10, 28],
      [-42, -30],
      [4, -36],
      [-18, 18],
      [22, 18],
      [-12, -24],
      [36, 14],
      [-28, 16],
      [18, -34],
      [-44, -16],
      [48, -4],
      [-16, 30],
    ];
    for (const [x, z] of spots) {
      if (heightAt(x, z) < 0.6) continue;
      pts.push([x, surfaceY(x, z), z, 0.9 + ((Math.abs(x * z) % 7) * 0.05)]);
    }
    return pts;
  }, []);
  const rocks = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i < 28; i++) {
      const a = i * 1.55;
      const r = 20 + (i % 6) * 5.5;
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
        <Rock key={i} position={r} scale={0.65 + (i % 4) * 0.2} />
      ))}
    </group>
  );
}

function DistantIsles() {
  return (
    <group>
      {DISTANT_ISLES.map((isle) => (
        <group key={isle.name} position={isle.position} scale={isle.scale}>
          <mesh castShadow receiveShadow>
            <coneGeometry args={[16, 12, 7]} />
            <meshStandardMaterial color={isle.hue} roughness={0.95} />
          </mesh>
          <mesh position={[7, -1, 5]} castShadow>
            <coneGeometry args={[9, 8, 6]} />
            <meshStandardMaterial color={isle.hue} roughness={0.95} />
          </mesh>
          {isle.name === "Amethyst Mines" && (
            <mesh position={[0, 5, 0]}>
              <octahedronGeometry args={[3.6, 0]} />
              <meshStandardMaterial color={COLORS.amethyst} emissive={COLORS.amethyst} emissiveIntensity={0.75} />
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
  const s3 = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (s1.current) {
      s1.current.position.y = 0.15 + Math.sin(t * 0.55) * 0.1;
      s1.current.rotation.z = Math.sin(t * 0.4) * 0.022;
    }
    if (s2.current) {
      s2.current.position.y = 0.1 + Math.sin(t * 0.48 + 1.2) * 0.09;
      s2.current.rotation.z = Math.cos(t * 0.38) * 0.02;
    }
    if (s3.current) {
      s3.current.position.y = 0.12 + Math.sin(t * 0.42 + 2.1) * 0.08;
      s3.current.rotation.z = Math.sin(t * 0.35 + 0.5) * 0.018;
    }
  });
  return (
    <group>
      <group ref={s1}>
        <Ship position={[9, 0, 14]} rot={0.35} />
      </group>
      <group ref={s2}>
        <Ship position={[-11, 0, 17]} rot={-0.5} />
      </group>
      <group ref={s3}>
        <Ship position={[18, 0, 12]} rot={0.7} />
      </group>
    </group>
  );
}

function Plaza() {
  return (
    <group>
      <Fountain position={[0, surfaceY(0, -4.2), -4.2]} />
      <LampPost position={[6.2, surfaceY(6.2, 0.8), 0.8]} />
      <LampPost position={[-6.2, surfaceY(-6.2, 1.0), 1.0]} />
      <LampPost position={[6.8, surfaceY(6.8, -13.2), -13.2]} />
      <LampPost position={[-7.0, surfaceY(-7.0, -13), -13]} />
      <LampPost position={[0.5, surfaceY(0.5, 4.5), 4.5]} />
      <Crate position={[3.2, surfaceY(3.2, 2.2), 2.2]} />
      <Barrel position={[-3.6, surfaceY(-3.6, 1.8), 1.8]} />
      <Barrel position={[4.0, surfaceY(4.0, -1.2), -1.2]} />
    </group>
  );
}

function NoticeBoard() {
  return (
    <group position={[-3.2, surfaceY(-3.2, -0.4), -0.4]}>
      <Box size={[2.0, 1.75, 0.12]} color="#5a321c" position={[0, 1.4, 0]} />
      <Box size={[1.65, 1.3, 0.04]} color="#e8d2a6" position={[0, 1.45, 0.08]} />
      <Box size={[0.12, 2.15, 0.12]} color={COLORS.woodDark} position={[-0.95, 1.05, 0]} />
      <Box size={[0.12, 2.15, 0.12]} color={COLORS.woodDark} position={[0.95, 1.05, 0]} />
    </group>
  );
}

function Paths() {
  // Subtle stone rings so the plaza reads larger without cards/UI clutter
  const rings = useMemo(
    () =>
      [
        [0, -4, 7.5],
        [0, -4, 11],
        [14, -8, 4],
        [-12, -6, 4],
      ] as [number, number, number][],
    [],
  );
  return (
    <group>
      {rings.map(([x, z, s], i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, surfaceY(x, z) + 0.02, z]} receiveShadow>
          <circleGeometry args={[s, 28]} />
          <meshStandardMaterial color="#7a7166" roughness={0.95} transparent opacity={0.35} />
        </mesh>
      ))}
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
      <Paths />
      <NoticeBoard />
      <Pier position={[3.0, 0.15, 10.5]} length={12} rot={0.15} />
      <Pier position={[-6.0, 0.12, 11.5]} length={11} rot={-0.25} />
      <Pier position={[14, 0.14, 9.2]} length={8} rot={0.55} />
      <Crystal position={[1.6, surfaceY(1.6, -8.2) + 0.2, -8.2]} scale={0.9} />
      <Crystal position={[-5.5, surfaceY(-5.5, -7.0) + 0.2, -7.0]} scale={0.65} />
    </group>
  );
}
