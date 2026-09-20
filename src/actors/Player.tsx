import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CapsuleCollider, RigidBody, useRapier, type RapierRigidBody } from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { Adventurer, type AnimState } from "./Adventurer";
import { useGame } from "../game/store";
import { launchImpulse, playerPose, registry } from "../game/registry";
import { sfx } from "../game/audio";
import { surfaceY } from "../game/terrain";
import { subzoneAt, type NpcId } from "../game/content";

const up = new THREE.Vector3(0, 1, 0);
const camDir = new THREE.Vector3();
const camRight = new THREE.Vector3();
const wish = new THREE.Vector3();
const desiredCam = new THREE.Vector3();
const camTarget = new THREE.Vector3();
const camPos = new THREE.Vector3(4, 9, 14);
const from = new THREE.Vector3();

export function Player() {
  const body = useRef<RapierRigidBody>(null);
  const group = useRef<THREE.Group>(null);
  const yaw = useRef(-0.08);
  const pitch = useRef(0.22);
  const dist = useRef(7.1);
  const facing = useRef(0);
  const attackT = useRef(0);
  const grounded = useRef(true);
  const anim = useRef<AnimState>("idle");
  const interactLock = useRef(0);
  const wantInteract = useRef(false);
  const wantStrike = useRef(false);
  const wantTab = useRef(false);
  const rmb = useRef(false);
  const lmb = useRef(false);
  const { camera, gl } = useThree();
  const { rapier, world } = useRapier();
  const [, getKeys] = useKeyboardControls();
  const phase = useGame((s) => s.phase);

  useEffect(() => {
    const el = gl.domElement;
    const onContext = (e: Event) => e.preventDefault();
    const onDown = (e: MouseEvent) => {
      const st = useGame.getState();
      if (st.phase !== "playing" || st.dialogNpc || st.panel) return;
      if (e.button === 2) {
        rmb.current = true;
        el.requestPointerLock();
      }
      if (e.button === 0) {
        lmb.current = true;
        if (!rmb.current) {
          const t = body.current?.translation();
          if (t) {
            const near = registry.nearestEnemy(new THREE.Vector3(t.x, t.y, t.z), 14);
            if (near) st.setTarget(near.id, near.name, near.getHp(), near.getMaxHp());
          }
        }
      }
    };
    const onUp = (e: MouseEvent) => {
      if (e.button === 2) {
        rmb.current = false;
        if (document.pointerLockElement === el) document.exitPointerLock();
      }
      if (e.button === 0) lmb.current = false;
    };
    const onMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== el && !rmb.current) return;
      const st = useGame.getState();
      if (st.dialogNpc || st.panel) return;
      yaw.current -= e.movementX * 0.0024;
      pitch.current = THREE.MathUtils.clamp(pitch.current + e.movementY * 0.0018, -0.08, 0.92);
    };
    const onWheel = (e: WheelEvent) => {
      dist.current = THREE.MathUtils.clamp(dist.current + e.deltaY * 0.008, 3.4, 13.5);
    };
    const onLock = () => useGame.getState().setLocked(document.pointerLockElement === el);
    el.addEventListener("contextmenu", onContext);
    el.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mousemove", onMove);
    el.addEventListener("wheel", onWheel, { passive: true });
    document.addEventListener("pointerlockchange", onLock);
    return () => {
      el.removeEventListener("contextmenu", onContext);
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mousemove", onMove);
      el.removeEventListener("wheel", onWheel);
      document.removeEventListener("pointerlockchange", onLock);
    };
  }, [gl]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const st = useGame.getState();
      if (st.phase !== "playing") return;
      if (e.repeat && e.code !== "KeyE") return;
      if (e.code === "Escape") {
        if (st.dialogNpc) st.dialogChoice("close");
        else if (st.panel) st.setPanel(null);
        else if (st.targetId) st.setTarget(null);
        document.exitPointerLock();
      }
      if (e.code === "KeyE") wantInteract.current = true;
      if (e.code === "Digit1" || e.code === "KeyF") wantStrike.current = true;
      if (e.code === "Tab") {
        e.preventDefault();
        wantTab.current = true;
      }
      if (e.code === "Digit5") st.useTonic();
      if (e.code === "KeyC") st.setPanel(st.panel === "skills" ? null : "skills");
      if (e.code === "KeyI" || e.code === "KeyB") st.setPanel(st.panel === "inventory" ? null : "inventory");
      if (e.code === "KeyL") st.setPanel(st.panel === "questlog" ? null : "questlog");
      if (e.code === "KeyM") st.setPanel(st.panel === "map" ? null : "map");
      if (e.code === "KeyH") st.setPanel(st.panel === "help" ? null : "help");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const spawn = useMemo(() => {
    const x = 0.15;
    const z = 1.15;
    return [x, surfaceY(x, z) + 1.35, z] as [number, number, number];
  }, []);

  function tryAttack() {
    const rb = body.current;
    if (!rb) return;
    const st = useGame.getState();
    if (st.dialogNpc || st.panel || !st.startSwing()) return;
    attackT.current = 0.001;
    sfx.swing();
    const t = rb.translation();
    const origin = new THREE.Vector3(t.x, t.y, t.z);
    let enemy = st.targetId ? registry.getEnemy(st.targetId) : null;
    if (!enemy || !enemy.alive() || enemy.getPos().distanceTo(origin) > 3.1) {
      enemy = registry.nearestEnemy(origin, 2.95);
      if (enemy) st.setTarget(enemy.id, enemy.name, enemy.getHp(), enemy.getMaxHp());
    }
    if (enemy && enemy.getPos().distanceTo(origin) <= 3.1) {
      const died = enemy.hurt(22, origin);
      sfx.hit();
      st.updateTargetHp(enemy.getHp());
      if (died) st.onRatKilled();
    }
  }

  useFrame((state, dt) => {
    const rb = body.current;
    if (!rb || phase !== "playing") return;
    const st = useGame.getState();
    st.tickCds(dt);
    const blocked = !!st.dialogNpc || !!st.panel;
    const keys = getKeys();
    const translation = rb.translation();
    const origin = { x: translation.x, y: translation.y, z: translation.z };
    const ray = new rapier.Ray(origin, { x: 0, y: -1, z: 0 });
    let toi = 99;
    try {
      const hit = world.castRay(ray, 1.3, true, undefined, undefined, undefined, rb);
      toi = hit ? hit.timeOfImpact : 99;
    } catch {
      toi = translation.y - surfaceY(translation.x, translation.z);
    }
    grounded.current = toi < 1.2;

    if (launchImpulse.current) {
      const imp = launchImpulse.current;
      rb.setLinvel({ x: imp.x, y: imp.y, z: imp.z }, true);
      launchImpulse.current = null;
      sfx.pad();
      grounded.current = false;
    }

    if (translation.y < -3) {
      rb.setTranslation({ x: 0.15, y: 5, z: 1.15 }, true);
      rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }

    camDir.set(Math.sin(yaw.current), 0, Math.cos(yaw.current));
    camRight.crossVectors(up, camDir).normalize();
    let mx = 0;
    let mz = 0;
    if (!blocked) {
      if (keys.forward) mz -= 1;
      if (keys.back) mz += 1;
      if (keys.left) mx -= 1;
      if (keys.right) mx += 1;
      if (lmb.current && rmb.current) mz -= 1;
    }
    const moving = mx !== 0 || mz !== 0;
    const sprint = !blocked && keys.sprint && moving;
    const speed = sprint ? 7.4 : 4.35;
    wish.set(0, 0, 0);
    wish.addScaledVector(camDir, mz);
    wish.addScaledVector(camRight, mx);
    if (wish.lengthSq() > 0) wish.normalize();

    const vel = rb.linvel();
    if (!blocked && keys.jump && grounded.current) {
      rb.setLinvel({ x: wish.x * speed, y: 7.6, z: wish.z * speed }, true);
      sfx.jump();
    } else {
      rb.setLinvel({ x: wish.x * speed, y: vel.y, z: wish.z * speed }, true);
    }

    if (moving) facing.current = Math.atan2(wish.x, wish.z);
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, facing.current, 12, dt);
    }

    if (attackT.current > 0) attackT.current += dt;
    if (attackT.current > 0.38) attackT.current = 0;
    if (!blocked && (keys.attack || wantStrike.current)) tryAttack();
    wantStrike.current = false;

    if (wantTab.current) {
      wantTab.current = false;
      const n = registry.cycleEnemy(from.set(translation.x, translation.y, translation.z), st.targetId, 16);
      if (n) st.setTarget(n.id, n.name, n.getHp(), n.getMaxHp());
      else st.setTarget(null);
    }

    if (!grounded.current) anim.current = "jump";
    else if (attackT.current > 0) anim.current = "attack";
    else if (sprint) anim.current = "run";
    else if (moving) anim.current = "walk";
    else anim.current = "idle";

    const look = camTarget.set(translation.x, translation.y + 1.28, translation.z);
    const d = dist.current + (sprint ? 0.55 : 0);
    const ox = Math.sin(yaw.current) * Math.cos(pitch.current) * d;
    const oy = Math.sin(pitch.current) * d + 0.85;
    const oz = Math.cos(yaw.current) * Math.cos(pitch.current) * d;
    camPos.lerp(desiredCam.set(look.x + ox, look.y + oy, look.z + oz), 1 - Math.pow(0.0007, dt));
    camera.position.copy(camPos);
    camera.lookAt(look);
    const persp = camera as THREE.PerspectiveCamera;
    persp.fov = THREE.MathUtils.damp(persp.fov, sprint ? 56 : 48, 6, dt);
    persp.updateProjectionMatrix();

    playerPose.x = translation.x;
    playerPose.y = translation.y;
    playerPose.z = translation.z;
    playerPose.yaw = yaw.current;

    from.set(translation.x, translation.y, translation.z);
    const node = registry.nearestNode(from, 3.4);
    if (node) st.setPrompt({ kind: node.kind, id: node.id, label: node.label });
    else if (st.prompt) st.setPrompt(null);

    const zone = subzoneAt(translation.x, translation.z);
    st.setSubzone(zone.name);

    if (st.targetId) {
      const t = registry.getEnemy(st.targetId);
      if (!t || !t.alive()) st.setTarget(null);
      else st.updateTargetHp(t.getHp());
    }

    interactLock.current = Math.max(0, interactLock.current - dt);
    const tapE = wantInteract.current;
    wantInteract.current = false;
    if (!blocked && (keys.interact || tapE) && node && interactLock.current <= 0) {
      interactLock.current = 0.28;
      if (node.kind === "npc") {
        document.exitPointerLock();
        st.openDialog(node.id as NpcId);
      }
      if ((node.kind === "forage" || node.kind === "mine" || node.kind === "fish") && !st.gathering) {
        st.beginChannel(node.id, node.kind);
      }
      if (node.kind === "jump") launchImpulse.current = new THREE.Vector3(wish.x * 2, 11.8, wish.z * 2 - 2.5);
    }

    if (st.gathering) {
      const g = st.gathering;
      if (!node || node.kind !== g.kind || node.id !== g.id || moving) {
        st.cancelGather();
      } else {
        const done = st.tickGather(dt);
        if (done) {
          sfx.gather();
          node.consume?.();
        }
      }
    }

    if (state.clock.elapsedTime % 0.12 < dt) st.setPlayer(translation.x, translation.z, yaw.current);
  });

  return (
    <RigidBody
      ref={body}
      position={spawn}
      colliders={false}
      lockRotations
      friction={0.9}
      restitution={0}
      canSleep={false}
    >
      <CapsuleCollider args={[0.42, 0.32]} position={[0, 0.74, 0]} />
      <group ref={group}>
        <Adventurer anim="idle" animRef={anim} attackRef={attackT} scale={1.12} />
      </group>
    </RigidBody>
  );
}
