import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { registry, playerPose } from "../game/registry";
import { surfaceY } from "../game/terrain";
import { useGame } from "../game/store";
import { sfx } from "../game/audio";

const SPOTS: [number, number][] = [
  [21.2, 4.8],
  [24.0, 3.6],
  [20.4, 6.2],
  [25.1, 5.8],
];

function ShadeRat({ id, spawn }: { id: string; spawn: [number, number] }) {
  const group = useRef<THREE.Group>(null);
  const home = useMemo(() => new THREE.Vector3(spawn[0], surfaceY(spawn[0], spawn[1]) + 0.2, spawn[1]), [spawn]);
  const pos = useRef(home.clone());
  const vel = useRef(new THREE.Vector3());
  const hp = useRef(42);
  const alive = useRef(true);
  const flash = useRef(0);
  const biteCd = useRef(1.2);
  const wanderT = useRef(Math.random() * 4);
  const wanderDir = useRef(Math.random() * Math.PI * 2);
  const [hpUi, setHpUi] = useState(42);
  const [dead, setDead] = useState(false);

  useEffect(() => {
    return registry.registerEnemy({
      id,
      name: "Shade-rat",
      getPos: () => pos.current.clone(),
      getHp: () => hp.current,
      getMaxHp: () => 42,
      alive: () => alive.current,
      hurt: (dmg, from) => {
        if (!alive.current) return false;
        hp.current -= dmg;
        flash.current = 1;
        setHpUi(Math.max(0, hp.current));
        const knock = pos.current.clone().sub(from).setY(0);
        if (knock.lengthSq() < 0.001) knock.set(1, 0, 0);
        knock.normalize().multiplyScalar(3.2);
        vel.current.add(knock);
        if (hp.current <= 0) {
          alive.current = false;
          setDead(true);
          return true;
        }
        return false;
      },
    });
  }, [id]);

  useFrame((_, dt) => {
    if (!group.current) return;
    if (!alive.current) {
      group.current.scale.y = Math.max(0.02, group.current.scale.y - dt * 2.5);
      return;
    }
    flash.current = Math.max(0, flash.current - dt * 4);
    biteCd.current -= dt;
    wanderT.current -= dt;

    const playing = useGame.getState().phase === "playing";
    const player = new THREE.Vector3(playerPose.x, playerPose.y, playerPose.z);
    const toP = player.clone().sub(pos.current);
    const dist = toP.length();
    const fromHome = pos.current.distanceTo(home);

    if (playing && dist < 8.5 && dist > 1.2 && fromHome < 14) {
      toP.y = 0;
      if (toP.lengthSq() > 0.001) toP.normalize();
      vel.current.lerp(toP.multiplyScalar(3.2), 1 - Math.pow(0.02, dt));
    } else {
      if (wanderT.current <= 0) {
        wanderT.current = 1.6 + Math.random() * 2;
        wanderDir.current += (Math.random() - 0.5) * 1.4;
      }
      vel.current.x = Math.sin(wanderDir.current) * 1.05;
      vel.current.z = Math.cos(wanderDir.current) * 1.05;
      if (fromHome > 6) {
        const back = home.clone().sub(pos.current).setY(0);
        if (back.lengthSq() > 0.001) back.normalize();
        vel.current.x = back.x * 2.2;
        vel.current.z = back.z * 2.2;
      }
    }

    pos.current.addScaledVector(vel.current, dt);
    pos.current.y = surfaceY(pos.current.x, pos.current.z) + 0.18;
    group.current.position.copy(pos.current);
    if (vel.current.lengthSq() > 0.08) {
      group.current.rotation.y = Math.atan2(vel.current.x, vel.current.z);
    }
    if (playing && dist < 1.4 && biteCd.current <= 0) {
      biteCd.current = 1.45;
      useGame.getState().damagePlayer(8);
      sfx.hurt();
    }
  });

  if (dead) return null;

  return (
    <group ref={group} position={[home.x, home.y, home.z]}>
      <mesh castShadow position={[0, 0.16, 0.05]} rotation={[0.2, 0, 0]}>
        <capsuleGeometry args={[0.18, 0.42, 4, 8]} />
        <meshStandardMaterial
          color={flash.current > 0.2 ? "#f4d4ff" : "#3a3148"}
          emissive="#5b2a6e"
          emissiveIntensity={0.5 + flash.current}
        />
      </mesh>
      <mesh position={[0, 0.32, 0.36]} castShadow>
        <sphereGeometry args={[0.16, 10, 8]} />
        <meshStandardMaterial color="#2a2233" emissive="#7b4dff" emissiveIntensity={0.45} />
      </mesh>
      <mesh position={[0.08, 0.46, 0.32]} rotation={[0.15, 0.35, 0.1]}>
        <coneGeometry args={[0.055, 0.16, 5]} />
        <meshStandardMaterial color="#1a1020" />
      </mesh>
      <mesh position={[-0.08, 0.46, 0.32]} rotation={[0.15, -0.35, -0.1]}>
        <coneGeometry args={[0.055, 0.16, 5]} />
        <meshStandardMaterial color="#1a1020" />
      </mesh>
      <mesh position={[0, 0.2, -0.42]} rotation={[0.9, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.05, 0.55, 6]} />
        <meshStandardMaterial color="#5b2a6e" emissive="#8a5cff" emissiveIntensity={0.55} />
      </mesh>
      <Html position={[0, 0.78, 0]} center distanceFactor={8} style={{ pointerEvents: "none" }}>
        <div style={{ width: 42, height: 5, background: "#2a1020", border: "1px solid #000" }}>
          <div style={{ width: `${(hpUi / 42) * 100}%`, height: "100%", background: "#d45d6a" }} />
        </div>
      </Html>
    </group>
  );
}

export function ShadeRats() {
  return (
    <group>
      {SPOTS.map((s, i) => (
        <ShadeRat key={i} id={`rat-${i}`} spawn={s} />
      ))}
    </group>
  );
}
