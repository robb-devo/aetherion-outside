import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { registry, playerPose } from "../game/registry";
import { surfaceY } from "../game/terrain";
import { useGame } from "../game/store";
import { sfx } from "../game/audio";

const SPOTS: [number, number][] = [
  [20.4, 4.1],
  [23.2, 3.2],
  [19.1, 1.8],
  [24.6, 5.2],
];

function ShadeRat({ id, spawn }: { id: string; spawn: [number, number] }) {
  const group = useRef<THREE.Group>(null);
  const pos = useRef(new THREE.Vector3(spawn[0], surfaceY(spawn[0], spawn[1]) + 0.2, spawn[1]));
  const vel = useRef(new THREE.Vector3());
  const hp = useRef(42);
  const alive = useRef(true);
  const flash = useRef(0);
  const biteCd = useRef(1);
  const wanderT = useRef(Math.random() * 4);
  const wanderDir = useRef(Math.random() * Math.PI * 2);
  const [dead, setDead] = useState(false);
  const world = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    return registry.registerEnemy({
      id,
      getPos: () => pos.current.clone(),
      alive: () => alive.current,
      hurt: (dmg, from) => {
        if (!alive.current) return false;
        hp.current -= dmg;
        flash.current = 1;
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
    if (!alive.current || !group.current) {
      if (group.current && !alive.current) {
        group.current.scale.y = Math.max(0.02, group.current.scale.y - dt * 2.5);
        group.current.position.y = pos.current.y - (1 - group.current.scale.y) * 0.2;
      }
      return;
    }
    flash.current = Math.max(0, flash.current - dt * 4);
    biteCd.current -= dt;
    wanderT.current -= dt;
    const player = new THREE.Vector3(playerPose.x, playerPose.y, playerPose.z);
    const toP = player.clone().sub(pos.current);
    const dist = toP.length();
    if (dist < 9 && dist > 1.15) {
      toP.y = 0;
      toP.normalize();
      vel.current.lerp(toP.multiplyScalar(3.4), 1 - Math.pow(0.02, dt));
    } else if (dist > 9) {
      if (wanderT.current <= 0) {
        wanderT.current = 1.4 + Math.random() * 2;
        wanderDir.current += (Math.random() - 0.5) * 1.6;
      }
      vel.current.x = Math.sin(wanderDir.current) * 1.2;
      vel.current.z = Math.cos(wanderDir.current) * 1.2;
    }
    pos.current.addScaledVector(vel.current, dt);
    pos.current.y = surfaceY(pos.current.x, pos.current.z) + 0.18;
    group.current.position.copy(pos.current);
    if (vel.current.lengthSq() > 0.05) {
      group.current.rotation.y = Math.atan2(vel.current.x, vel.current.z);
    }
    if (dist < 1.35 && biteCd.current <= 0) {
      biteCd.current = 1.35;
      useGame.getState().damagePlayer(8);
      sfx.hurt();
    }
  });

  if (dead && !group.current) return null;

  return (
    <group ref={group} position={[pos.current.x, pos.current.y, pos.current.z]}>
      <mesh castShadow position={[0, 0.12, 0]} rotation={[0.15, 0, 0]}>
        <capsuleGeometry args={[0.16, 0.38, 4, 8]} />
        <meshStandardMaterial
          color={flash.current > 0.2 ? "#f4d4ff" : "#3a3148"}
          emissive="#5b2a6e"
          emissiveIntensity={0.45 + flash.current}
        />
      </mesh>
      <mesh position={[0.12, 0.28, 0.28]} castShadow>
        <sphereGeometry args={[0.14, 10, 8]} />
        <meshStandardMaterial color="#2a2233" emissive="#7b4dff" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0.08, 0.4, 0.22]} rotation={[0.2, 0.4, 0]}>
        <coneGeometry args={[0.06, 0.16, 5]} />
        <meshStandardMaterial color="#1a1020" />
      </mesh>
      <mesh position={[0.16, 0.4, 0.16]} rotation={[0.2, -0.4, 0]}>
        <coneGeometry args={[0.06, 0.16, 5]} />
        <meshStandardMaterial color="#1a1020" />
      </mesh>
      <mesh position={[-0.28, 0.16, -0.05]} rotation={[0.6, 0, 0.4]}>
        <cylinderGeometry args={[0.03, 0.05, 0.55, 6]} />
        <meshStandardMaterial color="#5b2a6e" emissive="#8a5cff" emissiveIntensity={0.5} />
      </mesh>
      <Html position={[0, 0.7, 0]} center distanceFactor={8} style={{ pointerEvents: "none" }}>
        {alive.current && (
          <div style={{ width: 42, height: 5, background: "#2a1020", border: "1px solid #000" }}>
            <div style={{ width: `${(hp.current / 42) * 100}%`, height: "100%", background: "#d45d6a" }} />
          </div>
        )}
      </Html>
      <group visible={false} userData={{ world }} />
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
