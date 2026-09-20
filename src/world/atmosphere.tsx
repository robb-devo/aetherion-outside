import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS } from "../game/palette";
import { createTerrainGeometry, WORLD } from "../game/terrain";
import { skyFragment, skyVertex, waterFragment, waterVertex } from "../game/shaders";

export function TerrainMesh() {
  const geo = useMemo(() => createTerrainGeometry(), []);
  return (
    <mesh geometry={geo} receiveShadow>
      <meshStandardMaterial vertexColors roughness={0.92} metalness={0.02} />
    </mesh>
  );
}

export function Water() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDeep: { value: new THREE.Color(COLORS.waterDeep) },
      uShallow: { value: new THREE.Color(COLORS.waterShallow) },
      uFoam: { value: new THREE.Color(COLORS.foam) },
    }),
    [],
  );
  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt;
  });
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, WORLD.waterY, 0]}>
      <planeGeometry args={[320, 320, 64, 64]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={waterVertex}
        fragmentShader={waterFragment}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export function DuskSky() {
  const uniforms = useMemo(
    () => ({
      uTop: { value: new THREE.Color("#1b1438") },
      uHorizon: { value: new THREE.Color("#c45a3a") },
      uBottom: { value: new THREE.Color("#2a1730") },
      uSunDir: { value: new THREE.Vector3(-0.55, 0.22, 0.8).normalize() },
      uSunColor: { value: new THREE.Color("#ffb070") },
    }),
    [],
  );
  return (
    <mesh>
      <sphereGeometry args={[260, 32, 20]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={skyVertex}
        fragmentShader={skyFragment}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

export function Clouds() {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (g.current) g.current.rotation.y += dt * 0.012;
  });
  const puffs = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        pos: [Math.cos(i * 0.85) * 95, 32 + (i % 3) * 5, Math.sin(i * 0.85) * 95] as [number, number, number],
        s: 10 + (i % 4) * 3.5,
      })),
    [],
  );
  return (
    <group ref={g}>
      {puffs.map((p, i) => (
        <mesh key={i} position={p.pos} scale={[p.s, p.s * 0.35, p.s * 0.7]}>
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial color="#f0c8b0" transparent opacity={0.35} roughness={1} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

export function Fireflies() {
  const pts = useMemo(() => {
    const a = new Float32Array(120 * 3);
    for (let i = 0; i < 120; i++) {
      const ang = Math.random() * Math.PI * 2;
      const r = 8 + Math.random() * 40;
      a[i * 3] = Math.cos(ang) * r;
      a[i * 3 + 1] = 1.4 + Math.random() * 4.5;
      a[i * 3 + 2] = Math.sin(ang) * r - 5;
    }
    return a;
  }, []);
  const ref = useRef<THREE.Points>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.15) * 0.05;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = 0.45 + Math.sin(clock.elapsedTime * 2.2) * 0.2;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pts, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#e6c56a" size={0.18} transparent opacity={0.7} depthWrite={false} />
    </points>
  );
}

export function Birds() {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (g.current) g.current.rotation.y = clock.elapsedTime * 0.18;
  });
  return (
    <group ref={g} position={[0, 11, 0]}>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[12 + i * 1.5, Math.sin(i) * 1.2, 0]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.7, 0.08, 0.18]} />
          <meshStandardMaterial color="#2a2230" />
        </mesh>
      ))}
    </group>
  );
}
