import * as THREE from "three";
import { fbm, lerp, smoothstep } from "./noise";
import { COLORS } from "./palette";

export const WORLD = {
  size: 168,
  segs: 128,
  waterY: 0,
};

export function heightAt(x: number, z: number) {
  const r = Math.hypot(x, z);
  const angle = Math.atan2(x, z);

  let h = 1.7 * smoothstep(72, 48, r);
  h *= smoothstep(70, 42, r);

  const harbourW = Math.exp(-(angle * angle) / 0.28);
  const harbourR = smoothstep(8, 34, r) * smoothstep(62, 38, r);
  h -= harbourW * harbourR * 2.7;

  const pr = Math.hypot(x, z + 4);
  h = lerp(h, 1.42, smoothstep(22, 6, pr) * 0.94);

  const hr = Math.hypot(x + 32, z + 24);
  h += 4.1 * Math.exp(-(hr * hr) / 120);

  const lr = Math.hypot(x - 28, z + 32);
  h += 3.1 * Math.exp(-(lr * lr) / 72);

  const wr = Math.hypot(x - 30, z - 2);
  h += 0.65 * Math.exp(-(wr * wr) / 90);

  const gate = Math.hypot(x + 8, z - 26);
  h += 0.45 * Math.exp(-(gate * gate) / 55);

  const ridge = Math.hypot(x + 8, z + 8);
  h += 0.9 * Math.exp(-(ridge * ridge) / 200) * smoothstep(18, 36, r);

  h += (fbm(x * 0.055, z * 0.055) - 0.45) * 0.7 * smoothstep(10, 24, r);
  h += (fbm(x * 0.14 + 8, z * 0.14) - 0.5) * 0.18;

  if (r > 74) h = Math.min(h, -1.6);
  return h;
}

export function colorAt(x: number, z: number, y: number) {
  const r = Math.hypot(x, z);
  const c = new THREE.Color();
  if (y < 0.35) c.set(COLORS.sand);
  else if (y > 4.2) c.set("#6f7a52");
  else c.set(COLORS.grass);
  if (r < 18 && Math.hypot(x, z + 4) < 16) c.set("#8d8070");
  const wr = Math.hypot(x - 30, z - 2);
  if (wr < 11) c.lerp(new THREE.Color("#8a7b68"), 0.45);
  const n = fbm(x * 0.18, z * 0.18);
  c.offsetHSL(0, 0, (n - 0.5) * 0.07);
  return c;
}

export function createTerrainGeometry() {
  const { size, segs } = WORLD;
  const geo = new THREE.PlaneGeometry(size, size, segs, segs);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const y = heightAt(x, z);
    pos.setY(i, y);
    const c = colorAt(x, z, y);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return geo;
}

export function surfaceY(x: number, z: number) {
  return Math.max(heightAt(x, z), 0.02);
}
