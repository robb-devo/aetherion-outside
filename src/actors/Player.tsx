import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CapsuleCollider, RigidBody, useRapier, type RapierRigidBody } from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { Adventurer, type AnimState } from "./Adventurer";
import { Arrows } from "./Arrows";
import { useGame } from "../game/store";
import { launchImpulse, playerPose, registry } from "../game/registry";
import { sfx } from "../game/audio";
import { surfaceY } from "../game/terrain";
import { subzoneAt, type NpcId } from "../game/content";
import { COMBO, feel, feelTick, landHit, scaledDt, spawnArrow } from "../game/feel";

const up = new THREE.Vector3(0, 1, 0);
const camDir = new THREE.Vector3();
const camRight = new THREE.Vector3();
const wish = new THREE.Vector3();
const lookAt = new THREE.Vector3();
const camPos = new THREE.Vector3(6, 10, 16);
const from = new THREE.Vector3();
const velXZ = new THREE.Vector3();
const targetVel = new THREE.Vector3();
const aimDir = new THREE.Vector3();
const arrowOrigin = new THREE.Vector3();

const STAND = 1.08;

export function Player() {
  const body = useRef<RapierRigidBody>(null);
  const group = useRef<THREE.Group>(null);
  const yaw = useRef(0);
  const pitch = useRef(0.32);
  const dist = useRef(7.6);
  const facing = useRef(0);
  const attackT = useRef(0);
  const comboRef = useRef(0);
  const grounded = useRef(true);
  const anim = useRef<AnimState>("idle");
  const stepPhase = useRef(0);
  const interactLock = useRef(0);
  const wantInteract = useRef(false);
  const wantTab = useRef(false);
  const rmb = useRef(false);
  const lmb = useRef(false);
  const camY = useRef(0);
  const ready = useRef(false);
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
        feel.aiming = feel.weapon === "bow";
        el.requestPointerLock();
      }
      if (e.button === 0) {
        lmb.current = true;
        if (feel.weapon === "sword") {
          // Queue survives mouseup — previous bug cleared strike before the frame ran
          feel.pendingMelee += 1;
          const t = body.current?.translation();
          if (t) {
            const near = registry.nearestEnemy(new THREE.Vector3(t.x, t.y, t.z), 18);
            if (near) st.setTarget(near.id, near.name, near.getHp(), near.getMaxHp());
          }
        } else if (feel.weapon === "bow" && (rmb.current || document.pointerLockElement === el)) {
          feel.drawing = true;
          feel.draw = Math.max(feel.draw, 0.05);
          sfx.draw();
        }
      }
    };

    const onUp = (e: MouseEvent) => {
      if (e.button === 2) {
        rmb.current = false;
        feel.aiming = false;
        feel.drawing = false;
        feel.draw = 0;
        if (feel.weapon !== "bow" && document.pointerLockElement === el) document.exitPointerLock();
      }
      if (e.button === 0) {
        if (feel.weapon === "bow" && feel.drawing) {
          const power = THREE.MathUtils.clamp(feel.draw, 0.15, 1);
          camera.getWorldDirection(aimDir);
          const t = body.current?.translation();
          if (t) {
            arrowOrigin.set(t.x, t.y + 1.35, t.z).addScaledVector(aimDir, 0.9);
            spawnArrow(arrowOrigin, aimDir, power);
            sfx.release();
          }
          feel.draw = 0;
          feel.drawing = false;
        }
        lmb.current = false;
      }
    };

    const onMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== el && !rmb.current) return;
      const st = useGame.getState();
      if (st.dialogNpc || st.panel) return;
      const sens = feel.aiming ? 0.00135 : 0.002;
      yaw.current -= e.movementX * sens;
      pitch.current = THREE.MathUtils.clamp(pitch.current + e.movementY * sens * 0.85, -0.12, 0.95);
    };

    const onWheel = (e: WheelEvent) => {
      if (feel.aiming) return;
      dist.current = THREE.MathUtils.clamp(dist.current + e.deltaY * 0.008, 4.2, 14);
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
  }, [camera, gl]);

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
        feel.aiming = false;
        feel.drawing = false;
      }
      if (e.code === "KeyE") wantInteract.current = true;
      if (e.code === "Digit1" || e.code === "KeyF") {
        if (feel.weapon !== "sword") {
          feel.weapon = "sword";
          feel.aiming = false;
          feel.drawing = false;
          feel.draw = 0;
          sfx.equip();
          st.toast("Sword drawn.", "info");
        }
        feel.pendingMelee += 1;
      }
      if (e.code === "Digit2") {
        feel.weapon = "bow";
        feel.pendingMelee = 0;
        feel.meleeActive = false;
        sfx.equip();
        st.toast("Bow — hold RMB aim, hold LMB draw, release to shoot.", "info");
      }
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
    const x = 0.2;
    const z = 2.2;
    return [x, surfaceY(x, z) + STAND, z] as [number, number, number];
  }, []);

  function beginMelee() {
    if (feel.meleeActive) {
      const def = COMBO[feel.comboStep];
      if (feel.comboWindow <= 0) return false;
      if (feel.meleeT < def.wind + def.active) return false;
    }
    const useStep = feel.comboWindow > 0 || feel.meleeActive ? Math.min(feel.comboStep + 1, COMBO.length - 1) : 0;
    feel.comboStep = useStep;
    feel.meleeActive = true;
    feel.meleeHitDone = false;
    feel.meleeT = 0;
    attackT.current = 0.001;
    comboRef.current = useStep;
    sfx.swing();
    useGame.getState().startSwing();
    return true;
  }

  function resolveMeleeHit() {
    const rb = body.current;
    if (!rb) return;
    const st = useGame.getState();
    const def = COMBO[feel.comboStep];
    const t = rb.translation();
    const origin = from.set(t.x, t.y, t.z);
    let enemy = st.targetId ? registry.getEnemy(st.targetId) : null;
    if (!enemy || !enemy.alive() || enemy.getPos().distanceTo(origin) > def.reach + 0.5) {
      enemy = registry.nearestEnemy(origin, def.reach);
      if (enemy) st.setTarget(enemy.id, enemy.name, enemy.getHp(), enemy.getMaxHp());
    }
    if (enemy && enemy.getPos().distanceTo(origin) <= def.reach) {
      const heavy = feel.comboStep === 2;
      const died = enemy.hurt(def.dmg, origin);
      if (heavy) sfx.heavyHit();
      else sfx.hit();
      landHit(heavy);
      st.updateTargetHp(enemy.getHp());
      st.addSkillXp("combat", heavy ? 14 : 8);
      if (died) st.onRatKilled();
    }
  }

  useFrame((state, rawDt) => {
    const rb = body.current;
    if (!rb || phase !== "playing") return;

    feelTick(rawDt);
    const dt = scaledDt(rawDt);
    const st = useGame.getState();
    st.tickCds(rawDt);
    const blocked = !!st.dialogNpc || !!st.panel;
    const keys = getKeys();
    const tr = rb.translation();

    if (!ready.current) {
      camY.current = tr.y;
      ready.current = true;
    }

    const ray = new rapier.Ray({ x: tr.x, y: tr.y, z: tr.z }, { x: 0, y: -1, z: 0 });
    let toi = 99;
    try {
      const hit = world.castRay(ray, 1.4, true, undefined, undefined, undefined, rb);
      toi = hit ? hit.timeOfImpact : 99;
    } catch {
      toi = tr.y - surfaceY(tr.x, tr.z);
    }
    const surf = surfaceY(tr.x, tr.z) + STAND;
    grounded.current = toi < 1.25 || tr.y <= surf + 0.12;

    camDir.set(Math.sin(yaw.current), 0, Math.cos(yaw.current));
    camRight.crossVectors(up, camDir).normalize();

    let mx = 0;
    let mz = 0;
    const canMove = !blocked && !feel.aiming;
    if (canMove) {
      if (keys.forward) mz -= 1;
      if (keys.back) mz += 1;
      if (keys.left) mx -= 1;
      if (keys.right) mx += 1;
      if (lmb.current && rmb.current && feel.weapon === "sword") mz -= 1;
    }
    if (!blocked && feel.aiming) {
      if (keys.forward) mz -= 0.4;
      if (keys.back) mz += 0.4;
      if (keys.left) mx -= 0.4;
      if (keys.right) mx += 0.4;
    }

    const moving = mx !== 0 || mz !== 0;
    const sprint = canMove && keys.sprint && moving && !feel.meleeActive;
    const maxSpeed = feel.meleeActive ? 1.5 : sprint ? 6.2 : feel.aiming ? 2.1 : 3.7;

    wish.set(0, 0, 0);
    wish.addScaledVector(camDir, mz);
    wish.addScaledVector(camRight, mx);
    if (wish.lengthSq() > 0) wish.normalize();

    const accel = grounded.current ? (moving ? 10 : 14) : 3.5;
    targetVel.copy(wish).multiplyScalar(maxSpeed);
    velXZ.x = THREE.MathUtils.damp(velXZ.x, targetVel.x, accel, dt);
    velXZ.z = THREE.MathUtils.damp(velXZ.z, targetVel.z, accel, dt);
    if (!moving && velXZ.lengthSq() < 0.025) velXZ.set(0, 0, 0);

    const lv = rb.linvel();
    let nextY = lv.y;

    if (launchImpulse.current) {
      const imp = launchImpulse.current;
      velXZ.set(imp.x, 0, imp.z);
      nextY = imp.y;
      launchImpulse.current = null;
      sfx.pad();
      grounded.current = false;
    } else if (!blocked && keys.jump && grounded.current && !feel.aiming) {
      nextY = 7.1;
      grounded.current = false;
      sfx.jump();
    } else if (grounded.current) {
      nextY = 0;
    }

    rb.setLinvel({ x: velXZ.x, y: nextY, z: velXZ.z }, true);

    if (grounded.current && !keys.jump) {
      const pinned = surfaceY(tr.x, tr.z) + STAND;
      if (Math.abs(tr.y - pinned) > 0.01) {
        rb.setTranslation({ x: tr.x, y: pinned, z: tr.z }, true);
      }
    }

    if (tr.y < -2) {
      rb.setTranslation({ x: 0.2, y: surfaceY(0.2, 2.2) + STAND, z: 2.2 }, true);
      rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
      velXZ.set(0, 0, 0);
    }

    const tr2 = rb.translation();

    if (moving) facing.current = Math.atan2(wish.x, wish.z);
    if (feel.aiming) facing.current = yaw.current;
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, facing.current, feel.meleeActive ? 6 : 10, dt);
    }

    const spd = Math.hypot(velXZ.x, velXZ.z);
    if (moving && grounded.current) stepPhase.current += spd * dt * 1.6;
    anim.current = !grounded.current
      ? "jump"
      : feel.meleeActive
        ? "attack"
        : feel.aiming
          ? "aim"
          : sprint
            ? "run"
            : moving
              ? "walk"
              : "idle";

    if (!blocked && feel.weapon === "sword" && feel.pendingMelee > 0) {
      if (beginMelee()) feel.pendingMelee -= 1;
    }

    if (feel.meleeActive) {
      const def = COMBO[feel.comboStep];
      feel.meleeT += dt;
      attackT.current = feel.meleeT;
      if (!feel.meleeHitDone && feel.meleeT >= def.wind) {
        feel.meleeHitDone = true;
        resolveMeleeHit();
      }
      if (feel.meleeT >= def.wind + def.active) feel.comboWindow = 0.42;
      if (feel.meleeT >= def.wind + def.active + def.recover) {
        feel.meleeActive = false;
        attackT.current = 0;
        if (feel.pendingMelee === 0 && feel.comboWindow <= 0) feel.comboStep = 0;
      }
    }

    if (feel.drawing && feel.weapon === "bow") {
      feel.draw = Math.min(1, feel.draw + dt * 1.15);
    }

    if (wantTab.current) {
      wantTab.current = false;
      const n = registry.cycleEnemy(from.set(tr2.x, tr2.y, tr2.z), st.targetId, 20);
      if (n) st.setTarget(n.id, n.name, n.getHp(), n.getMaxHp());
      else st.setTarget(null);
    }

    // Hard camera follow on surface height — no physics Y, no lag lerp
    camY.current = surfaceY(tr2.x, tr2.z) + STAND;
    const aim = feel.aiming;
    const d = aim ? 2.35 : dist.current;
    const py = pitch.current + feel.kickPitch;
    const yy = yaw.current + feel.kickYaw;
    lookAt.set(tr2.x, camY.current + (aim ? 0.42 : 0.28), tr2.z);

    if (aim) {
      camPos.set(
        lookAt.x - Math.sin(yy) * d + Math.cos(yy) * 0.55,
        lookAt.y + Math.sin(Math.max(py, 0.05)) * 0.9 + 0.2,
        lookAt.z - Math.cos(yy) * d - Math.sin(yy) * 0.55,
      );
    } else {
      camPos.set(
        lookAt.x + Math.sin(yy) * Math.cos(py) * d,
        lookAt.y + Math.sin(py) * d + 0.25,
        lookAt.z + Math.cos(yy) * Math.cos(py) * d,
      );
    }
    camera.position.copy(camPos);
    camera.lookAt(lookAt);

    const persp = camera as THREE.PerspectiveCamera;
    const wantFov = (aim ? 36 - feel.draw * 4 : 47) + feel.punchFov;
    if (Math.abs(persp.fov - wantFov) > 0.02) {
      persp.fov = wantFov;
      persp.updateProjectionMatrix();
    }

    playerPose.x = tr2.x;
    playerPose.y = tr2.y;
    playerPose.z = tr2.z;
    playerPose.yaw = yaw.current;

    from.set(tr2.x, tr2.y, tr2.z);
    const node = registry.nearestNode(from, 3.6);
    if (node) st.setPrompt({ kind: node.kind, id: node.id, label: node.label });
    else if (st.prompt) st.setPrompt(null);

    st.setSubzone(subzoneAt(tr2.x, tr2.z).name);

    if (st.targetId) {
      const tg = registry.getEnemy(st.targetId);
      if (!tg || !tg.alive()) st.setTarget(null);
      else st.updateTargetHp(tg.getHp());
    }

    interactLock.current = Math.max(0, interactLock.current - dt);
    const tapE = wantInteract.current;
    wantInteract.current = false;
    if (!blocked && !feel.aiming && (keys.interact || tapE) && node && interactLock.current <= 0) {
      interactLock.current = 0.28;
      if (node.kind === "npc") {
        document.exitPointerLock();
        st.openDialog(node.id as NpcId);
      }
      if ((node.kind === "forage" || node.kind === "mine" || node.kind === "fish") && !st.gathering) {
        st.beginChannel(node.id, node.kind);
      }
      if (node.kind === "jump") {
        launchImpulse.current = new THREE.Vector3(wish.x * 2.4, 12.5, wish.z * 2.4 - 3.2);
      }
    }

    if (st.gathering) {
      const g = st.gathering;
      if (!node || node.kind !== g.kind || node.id !== g.id || moving) st.cancelGather();
      else {
        const done = st.tickGather(dt);
        if (done) {
          sfx.gather();
          node.consume?.();
        }
      }
    }

    if (state.clock.elapsedTime % 0.12 < rawDt) st.setPlayer(tr2.x, tr2.z, yaw.current);
  });

  return (
    <>
      <RigidBody
        ref={body}
        position={spawn}
        colliders={false}
        lockRotations
        friction={1.6}
        restitution={0}
        linearDamping={0.05}
        angularDamping={1}
        canSleep={false}
        ccd
      >
        <CapsuleCollider args={[0.45, 0.3]} position={[0, 0.75, 0]} />
        <group ref={group}>
          <Adventurer anim="idle" animRef={anim} attackRef={attackT} comboRef={comboRef} stepRef={stepPhase} scale={1.14} />
        </group>
      </RigidBody>
      <Arrows />
    </>
  );
}
