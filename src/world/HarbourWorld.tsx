import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { Environment } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, SMAA, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { Birds, Clouds, DuskSky, Fireflies, TerrainMesh, Water } from "./atmosphere";
import { Landmarks } from "./landmarks";
import { NPCs } from "../actors/NPCs";
import { ShadeRats } from "../actors/ShadeRats";
import { Moonpetals } from "../actors/Moonpetals";
import { JumpPad } from "../actors/JumpPad";
import { COLORS } from "../game/palette";

export function HarbourWorld() {
  return (
    <>
      <color attach="background" args={["#1a1028"]} />
      <fog attach="fog" args={[COLORS.duskFog, 28, 115]} />
      <DuskSky />
      <Clouds />
      <Birds />
      <hemisphereLight args={["#ffc8a0", "#2a1838", 0.55]} />
      <ambientLight intensity={0.28} color="#9aa0c8" />
      <directionalLight
        castShadow
        position={[-28, 22, 36]}
        intensity={1.65}
        color="#ffb070"
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={2}
        shadow-camera-far={90}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
      />
      <Environment files="/env/dusk.hdr" />
      <Water />
      <Fireflies />
      <RigidBody type="fixed" colliders="trimesh" friction={1.1}>
        <TerrainMesh />
      </RigidBody>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[6, 2.2, 3.4]} position={[-12, 2.2, -9]} />
        <CuboidCollider args={[2.9, 1.7, 2.3]} position={[4.5, 1.7, -4.8]} />
        <CuboidCollider args={[3.3, 1.8, 2.7]} position={[-7.5, 1.8, -1.5]} />
        <CuboidCollider args={[3.8, 2, 2.9]} position={[22, 2, 1.5]} />
        <CuboidCollider args={[2.9, 1.8, 2.5]} position={[27.5, 1.8, -4]} />
        <CuboidCollider args={[1.1, 3.4, 1.1]} position={[-9.2, 3.4, 17.5]} />
        <CuboidCollider args={[1.1, 3.4, 1.1]} position={[-2.8, 3.4, 17.5]} />
        <CuboidCollider args={[1.6, 4.4, 1.6]} position={[20, 5, -24]} />
      </RigidBody>
      <Landmarks />
      <NPCs />
      <ShadeRats />
      <Moonpetals />
      <JumpPad />
      <EffectComposer enableNormalPass={false} multisampling={0}>
        <SMAA />
        <Bloom intensity={0.55} luminanceThreshold={0.72} mipmapBlur />
        <Vignette eskil={false} offset={0.22} darkness={0.62} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </>
  );
}
