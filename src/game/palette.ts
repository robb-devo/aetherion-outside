import * as THREE from "three";

export const COLORS = {
  duskFog: "#2b1733",
  waterDeep: "#12353f",
  waterShallow: "#3c7f86",
  foam: "#d7efe8",
  grass: "#3f6a3a",
  grassDry: "#6d7a3b",
  sand: "#c8b07a",
  stone: "#b7ab9a",
  stoneDark: "#6d645b",
  wood: "#6a4026",
  woodDark: "#3d2416",
  roof: "#7a2f32",
  roofTeal: "#2f5e5a",
  amethyst: "#8a5cff",
  amethystSoft: "#c3a6ff",
  lantern: "#ffb25a",
  sail: "#e8d2a6",
  tunic: "#2c5f66",
  leather: "#4a2d1f",
  skin: "#e2b492",
  hair: "#3b241c",
  cloak: "#5b2a6e",
  rat: "#3a3148",
  gold: "#e6c56a",
};

export function makeToonGradient() {
  const data = new Uint8Array([32, 28, 40, 255, 92, 78, 70, 255, 160, 140, 120, 255, 255, 232, 196, 255]);
  const tex = new THREE.DataTexture(data, 4, 1, THREE.RGBAFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.needsUpdate = true;
  return tex;
}

const gradient = makeToonGradient();

export function toon(color: string, opts?: { emissive?: string; emissiveIntensity?: number }) {
  const mat = new THREE.MeshToonMaterial({
    color,
    gradientMap: gradient,
    emissive: opts?.emissive ?? "#000000",
    emissiveIntensity: opts?.emissiveIntensity ?? 0,
  });
  return mat;
}

export function standard(
  color: string,
  opts?: { roughness?: number; metalness?: number; emissive?: string; emissiveIntensity?: number },
) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: opts?.roughness ?? 0.72,
    metalness: opts?.metalness ?? 0.08,
    emissive: opts?.emissive ?? "#000000",
    emissiveIntensity: opts?.emissiveIntensity ?? 0,
  });
}
