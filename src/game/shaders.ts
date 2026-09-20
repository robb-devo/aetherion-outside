export const waterVertex = /* glsl */ `
varying vec2 vUv;
varying vec3 vWorld;
varying vec3 vNormal;
uniform float uTime;

void main() {
  vUv = uv;
  vec3 p = position;
  float w1 = sin(p.x * 0.18 + uTime * 0.7) * 0.12;
  float w2 = cos(p.z * 0.16 + uTime * 0.55) * 0.1;
  float w3 = sin((p.x + p.z) * 0.09 + uTime * 0.35) * 0.08;
  p.y += w1 + w2 + w3;
  vec4 world = modelMatrix * vec4(p, 1.0);
  vWorld = world.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

export const waterFragment = /* glsl */ `
varying vec2 vUv;
varying vec3 vWorld;
varying vec3 vNormal;
uniform float uTime;
uniform vec3 uDeep;
uniform vec3 uShallow;
uniform vec3 uFoam;

void main() {
  float n = sin(vWorld.x * 0.35 + uTime) * 0.5 + cos(vWorld.z * 0.28 - uTime * 0.7) * 0.5;
  float fres = pow(1.0 - max(dot(normalize(vNormal), vec3(0.0, 1.0, 0.0)), 0.0), 2.0);
  vec3 col = mix(uDeep, uShallow, 0.45 + n * 0.18);
  col = mix(col, uFoam, fres * 0.35 + step(0.92, fract(n * 0.5 + uTime * 0.05)) * 0.12);
  float spark = pow(max(0.0, sin(vWorld.x * 3.0 + vWorld.z * 2.2 + uTime * 2.0)), 24.0);
  col += spark * 0.18;
  gl_FragColor = vec4(col, 0.9);
}
`;

export const skyVertex = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = position;
  vec4 clip = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_Position = clip.xyww;
}
`;

export const skyFragment = /* glsl */ `
varying vec3 vDir;
uniform vec3 uTop;
uniform vec3 uHorizon;
uniform vec3 uBottom;
uniform vec3 uSunDir;
uniform vec3 uSunColor;

void main() {
  vec3 d = normalize(vDir);
  float h = d.y * 0.5 + 0.5;
  vec3 col = mix(uBottom, uHorizon, smoothstep(0.28, 0.52, h));
  col = mix(col, uTop, smoothstep(0.52, 0.95, h));
  float sun = pow(max(dot(d, normalize(uSunDir)), 0.0), 80.0);
  float glow = pow(max(dot(d, normalize(uSunDir)), 0.0), 8.0);
  col += uSunColor * sun * 1.4 + uSunColor * glow * 0.25;
  gl_FragColor = vec4(col, 1.0);
}
`;
