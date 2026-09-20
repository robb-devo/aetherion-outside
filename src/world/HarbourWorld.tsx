import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { EffectComposer, Bloom, Vignette, SMAA, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { Birds, Clouds, DuskSky, Fireflies, TerrainMesh, Water } from "./atmosphere";
import { Landmarks } from "./landmarks";
import { NPCs } from "../actors/NPCs";
import { ShadeRats } from "../actors/ShadeRats";
import { Moonpetals } from "../actors/Moonpetals";
import { JumpPad } from "../actors/JumpPad";
import { SkillNodes } from "../actors/SkillNodes";
import { COLORS } from "../game/palette";

export function HarbourWorld() {
  return (
    <>
      <color attach="background" args={["#1a1028"]} />
      <fog attach="fog" args={[COLORS.duskFog, 48, 175]} />
      <DuskSky />
      <Clouds />
      <Birds />
      <hemisphereLight args={["#ffc8a0", "#2a1838", 0.48]} />
      <ambientLight intensity={0.2} color="#8a90b8" />
      <directionalLight
        castShadow
        position={[-36, 28, 42]}
        intensity={1.15}
        color="#ffb070"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.00035}
        shadow-camera-near={2}
        shadow-camera-far={120}
        shadow-camera-left={-55}
        shadow-camera-right={55}
        shadow-camera-top={55}
        shadow-camera-bottom={-55}
      />
      <pointLight position={[0, 6, -4]} color="#ffc27a" intensity={8} distance={28} />
      <Water />
      <Fireflies />
      <RigidBody type="fixed" colliders="trimesh" friction={1.35} restitution={0}>
        <TerrainMesh />
      </RigidBody>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[7, 2.5, 4]} position={[-16, 2.5, -12]} />
        <CuboidCollider args={[3.3, 1.9, 2.6]} position={[6.2, 1.9, -6.4]} />
        <CuboidCollider args={[3.8, 2.1, 3.0]} position={[-10, 2.1, -2]} />
        <CuboidCollider args={[4.4, 2.2, 3.3]} position={[30, 2.2, 2]} />
        <CuboidCollider args={[3.4, 2.0, 2.8]} position={[37, 2.0, -5]} />
        <CuboidCollider args={[1.2, 3.8, 1.2]} position={[-11.8, 3.8, 25]} />
        <CuboidCollider args={[1.2, 3.8, 1.2]} position={[-4.2, 3.8, 25]} />
        <CuboidCollider args={[1.7, 5.0, 1.7]} position={[28, 5.5, -32]} />
      </RigidBody>
      <Landmarks />
      <NPCs />
      <ShadeRats />
      <Moonpetals />
      <SkillNodes />
      <JumpPad />
      <EffectComposer enableNormalPass={false} multisampling={0}>
        <SMAA />
        <Bloom intensity={0.48} luminanceThreshold={0.68} mipmapBlur />
        <Vignette eskil={false} offset={0.18} darkness={0.55} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </>
  );
}
