import * as THREE from "three";
import { fbm, lerp, smoothstep } from "./noise";
import { COLORS } from "./palette";

export const WORLD = {
  size: 108,
  segs: 96,
  waterY: 0,
};

export function heightAt(x: number, z: number) {
  const r = Math.hypot(x, z);
  const angle = Math.atan2(x, z);

  let h = 1.55 * smoothstep(50, 36, r);
  h *= smoothstep(49, 30, r);

  const harbourW = Math.exp(-(angle * angle) / 0.22);
  const harbourR = smoothstep(6, 26, r) * smoothstep(46, 28, r);
  h -= harbourW * harbourR * 2.55;

  const pr = Math.hypot(x, z + 3.5);
  h = lerp(h, 1.38, smoothstep(16, 5, pr) * 0.92);

  const hr = Math.hypot(x + 24, z + 18);
  h += 3.35 * Math.exp(-(hr * hr) / 78);

  const lr = Math.hypot(x - 20, z + 24);
  h += 2.55 * Math.exp(-(lr * lr) / 46);

  const wr = Math.hypot(x - 22, z - 2);
  h += 0.55 * Math.exp(-(wr * wr) / 58);

  const gate = Math.hypot(x + 6, z - 18);
  h += 0.35 * Math.exp(-(gate * gate) / 40);

  h += (fbm(x * 0.07, z * 0.07) - 0.45) * 0.55 * smoothstep(8, 18, r);
  h += (fbm(x * 0.18 + 8, z * 0.18) - 0.5) * 0.16;

  if (r > 52) h = Math.min(h, -1.4);
  return h;
}

export function colorAt(x: number, z: number, y: number) {
  const r = Math.hypot(x, z);
  const c = new THREE.Color();
  if (y < 0.35) c.set(COLORS.sand);
  else if (y > 3.4) c.set("#6f7a52");
  else c.set(COLORS.grass);
  if (r < 14 && Math.hypot(x, z + 3.5) < 12) c.set(COLORS.stone);
  const wr = Math.hypot(x - 22, z - 2);
  if (wr < 8) c.lerp(new THREE.Color("#8a7b68"), 0.45);
  const n = fbm(x * 0.2, z * 0.2);
  c.offsetHSL(0, 0, (n - 0.5) * 0.08);
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
