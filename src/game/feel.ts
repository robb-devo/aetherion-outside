import * as THREE from "three";

export type WeaponId = "sword" | "bow";

export type Arrow = {
  id: number;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  life: number;
  damage: number;
};

/** Shared combat / camera juice — intentional DS-style feedback, never walk jitter. */
export const feel = {
  weapon: "sword" as WeaponId,
  /** Queued light attacks from LMB / 1 (survives mouseup). */
  pendingMelee: 0,
  comboStep: 0,
  comboWindow: 0,
  meleeT: 0,
  meleeActive: false,
  meleeHitDone: false,
  /** Seconds of world freeze on connect. */
  hitStop: 0,
  /** Decaying camera punch (view space). */
  kickYaw: 0,
  kickPitch: 0,
  punchFov: 0,
  /** 0–1 white/red hit flash for HUD. */
  flash: 0,
  aiming: false,
  drawing: false,
  draw: 0,
  arrows: [] as Arrow[],
  nextArrowId: 1,
};

export const COMBO = [
  { dmg: 28, wind: 0.12, active: 0.14, recover: 0.28, reach: 3.6, name: "slash" },
  { dmg: 34, wind: 0.1, active: 0.12, recover: 0.3, reach: 3.7, name: "cross" },
  { dmg: 48, wind: 0.16, active: 0.16, recover: 0.42, reach: 4.0, name: "cleave" },
];

export function feelTick(dt: number) {
  if (feel.hitStop > 0) {
    feel.hitStop = Math.max(0, feel.hitStop - dt);
  }
  feel.kickYaw *= Math.exp(-14 * dt);
  feel.kickPitch *= Math.exp(-14 * dt);
  feel.punchFov *= Math.exp(-8 * dt);
  feel.flash = Math.max(0, feel.flash - dt * 3.2);
  if (feel.comboWindow > 0) {
    feel.comboWindow = Math.max(0, feel.comboWindow - dt);
    if (feel.comboWindow <= 0 && !feel.meleeActive) feel.comboStep = 0;
  }
}

/** Realtime dt after hitstop (enemies/player share this). */
export function scaledDt(dt: number) {
  return feel.hitStop > 0 ? dt * 0.08 : dt;
}

export function landHit(heavy: boolean) {
  feel.hitStop = heavy ? 0.11 : 0.07;
  feel.kickYaw = (Math.random() - 0.5) * (heavy ? 0.085 : 0.05);
  feel.kickPitch = -0.035 * (heavy ? 1.4 : 1);
  feel.punchFov = heavy ? 4.5 : 2.5;
  feel.flash = heavy ? 0.55 : 0.32;
}

export function spawnArrow(origin: THREE.Vector3, dir: THREE.Vector3, power: number) {
  const d = dir.clone().normalize();
  const speed = 28 + power * 38;
  feel.arrows.push({
    id: feel.nextArrowId++,
    pos: origin.clone(),
    vel: d.multiplyScalar(speed),
    life: 2.4,
    damage: 18 + Math.round(power * 36),
  });
}
