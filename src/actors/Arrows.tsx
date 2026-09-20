import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { feel, landHit, scaledDt } from "../game/feel";
import { registry } from "../game/registry";
import { useGame } from "../game/store";
import { sfx } from "../game/audio";
import { COLORS } from "../game/palette";

const scratch = new THREE.Vector3();
const upY = new THREE.Vector3(0, 1, 0);

export function Arrows() {
  const group = useRef<THREE.Group>(null);

  useFrame((_, rawDt) => {
    const dt = scaledDt(rawDt);
    const g = group.current;
    if (!g) return;

    // Sync mesh children to arrow list
    while (g.children.length < feel.arrows.length) {
      const m = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.01, 0.85, 5),
        new THREE.MeshStandardMaterial({
          color: "#d8c3a0",
          emissive: COLORS.gold,
          emissiveIntensity: 0.15,
          roughness: 0.55,
        }),
      );
      m.castShadow = true;
      g.add(m);
    }
    while (g.children.length > feel.arrows.length) {
      const c = g.children[g.children.length - 1];
      g.remove(c);
      (c as THREE.Mesh).geometry.dispose();
      ((c as THREE.Mesh).material as THREE.Material).dispose();
    }

    for (let i = feel.arrows.length - 1; i >= 0; i--) {
      const a = feel.arrows[i];
      a.life -= dt;
      a.vel.y -= 9.5 * dt;
      a.pos.addScaledVector(a.vel, dt);

      const mesh = g.children[i] as THREE.Mesh;
      if (mesh) {
        mesh.position.copy(a.pos);
        scratch.copy(a.vel).normalize();
        mesh.quaternion.setFromUnitVectors(upY, scratch);
      }

      let hit = false;
      for (const e of registry.enemies()) {
        if (!e.alive()) continue;
        if (e.getPos().distanceTo(a.pos) < 1.15) {
          const died = e.hurt(a.damage, a.pos.clone().sub(a.vel));
          sfx.hit();
          landHit(a.damage > 40);
          const st = useGame.getState();
          st.setTarget(e.id, e.name, e.getHp(), e.getMaxHp());
          st.addSkillXp("combat", 10);
          if (died) st.onRatKilled();
          hit = true;
          break;
        }
      }
      if (hit || a.life <= 0 || a.pos.y < -1) {
        feel.arrows.splice(i, 1);
      }
    }
  });

  return <group ref={group} />;
}
