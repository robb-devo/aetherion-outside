let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let started = false;

function ac() {
  if (!ctx) {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = 0.2;
    master.connect(ctx.destination);
  }
  return ctx;
}

export async function unlockAudio() {
  const c = ac();
  if (c.state === "suspended") await c.resume();
  if (!started && master) {
    started = true;
    softAmbience();
  }
}

function tone(freq: number, dur: number, type: OscillatorType, gain = 0.2, delay = 0) {
  const c = ac();
  if (!master) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.value = 0;
  o.connect(g);
  g.connect(master);
  const t = c.currentTime + delay;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.start(t);
  o.stop(t + dur + 0.04);
}

function noiseBurst(dur: number, gain = 0.12, delay = 0) {
  const c = ac();
  if (!master) return;
  const n = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
  const d = n.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = n;
  const g = c.createGain();
  const f = c.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.value = 420;
  f.Q.value = 0.7;
  src.connect(f);
  f.connect(g);
  g.connect(master);
  const t = c.currentTime + delay;
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.start(t);
  src.stop(t + dur + 0.02);
}

export const sfx = {
  ui: () => tone(520, 0.08, "triangle", 0.05),
  gather: () => {
    tone(523, 0.16, "sine", 0.08);
    tone(784, 0.2, "sine", 0.05, 0.05);
  },
  /** Meaty Dark Souls-ish connect. */
  hit: () => {
    noiseBurst(0.09, 0.16);
    tone(75, 0.14, "square", 0.14);
    tone(140, 0.1, "triangle", 0.08, 0.02);
  },
  heavyHit: () => {
    noiseBurst(0.14, 0.22);
    tone(55, 0.22, "square", 0.18);
    tone(110, 0.16, "sawtooth", 0.07, 0.03);
    tone(40, 0.28, "sine", 0.12, 0.01);
  },
  swing: () => {
    noiseBurst(0.07, 0.07);
    tone(240, 0.09, "triangle", 0.05);
  },
  hurt: () => {
    tone(150, 0.12, "sine", 0.09);
    noiseBurst(0.06, 0.08);
  },
  jump: () => tone(320, 0.08, "triangle", 0.035),
  pad: () => {
    tone(200, 0.22, "sine", 0.07);
    tone(380, 0.26, "sine", 0.045, 0.04);
  },
  level: () => {
    tone(392, 0.18, "triangle", 0.07);
    tone(523, 0.22, "triangle", 0.07, 0.08);
    tone(784, 0.26, "triangle", 0.07, 0.16);
  },
  draw: () => tone(180, 0.06, "triangle", 0.03),
  release: () => {
    noiseBurst(0.05, 0.06);
    tone(520, 0.07, "triangle", 0.05);
  },
  equip: () => tone(300, 0.07, "triangle", 0.05),
};

function softAmbience() {
  const c = ac();
  if (!master) return;
  const g = c.createGain();
  g.gain.value = 0;
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 240;
  const o = c.createOscillator();
  o.type = "sine";
  o.frequency.value = 92;
  o.connect(filter);
  filter.connect(g);
  g.connect(master);
  o.start();
  g.gain.linearRampToValueAtTime(0.012, c.currentTime + 2.2);
}
