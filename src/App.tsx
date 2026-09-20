import { Canvas, useFrame } from "@react-three/fiber";
import { KeyboardControls, useProgress } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Suspense, useEffect } from "react";
import * as THREE from "three";
import { HarbourWorld } from "./world/HarbourWorld";
import { Player } from "./actors/Player";
import { HUD } from "./ui/HUD";
import { Loader, TitleScreen } from "./ui/TitleScreen";
import { useGame } from "./game/store";

const controls = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "back", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "sprint", keys: ["ShiftLeft", "ShiftRight"] },
  { name: "interact", keys: ["KeyE"] },
  { name: "attack", keys: ["KeyF", "Digit1"] },
];

function TitleCam() {
  useFrame(({ camera, clock }) => {
    const t = clock.elapsedTime * 0.11;
    camera.position.set(Math.sin(t) * 18 + 10, 8.5 + Math.sin(t * 0.65) * 1.2, Math.cos(t) * 16 + 8);
    camera.lookAt(6, 3.5, -10);
  });
  return null;
}

function BootGate() {
  const { progress, active } = useProgress();
  if (active) return <Loader progress={progress} />;
  return null;
}

export default function App() {
  const phase = useGame((s) => s.phase);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("app") === "1") document.documentElement.classList.add("app-shell");
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "F11") return;
      e.preventDefault();
      if (!document.fullscreenElement) void document.documentElement.requestFullscreen();
      else void document.exitFullscreen();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <KeyboardControls map={controls}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ fov: 48, near: 0.1, far: 420, position: [16, 10, 18] }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        onPointerDown={() => {
          /* click-to-look handled in Player */
        }}
      >
        <Suspense fallback={null}>
          {phase !== "playing" && <TitleCam />}
          <Physics gravity={[0, -22, 0]} interpolate>
            <HarbourWorld />
            {phase === "playing" && <Player />}
          </Physics>
        </Suspense>
      </Canvas>
      <BootGate />
      {phase !== "playing" && <TitleScreen />}
      {phase === "playing" && <HUD />}
    </KeyboardControls>
  );
}
