let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let ambience: GainNode | null = null;
let started = false;

function ac() {
  if (!ctx) {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = 0.18;
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
  g.gain.linearRampToValueAtTime(gain, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.start(t);
  o.stop(t + dur + 0.05);
}

export const sfx = {
  ui: () => tone(520, 0.08, "triangle", 0.06),
  gather: () => {
    tone(523, 0.16, "sine", 0.09);
    tone(784, 0.2, "sine", 0.06, 0.05);
  },
  hit: () => tone(110, 0.1, "triangle", 0.1),
  swing: () => tone(260, 0.07, "triangle", 0.04),
  hurt: () => tone(160, 0.12, "sine", 0.08),
  jump: () => tone(320, 0.08, "triangle", 0.04),
  pad: () => {
    tone(200, 0.22, "sine", 0.08);
    tone(380, 0.26, "sine", 0.05, 0.04);
  },
  level: () => {
    tone(392, 0.18, "triangle", 0.08);
    tone(523, 0.22, "triangle", 0.08, 0.08);
    tone(784, 0.26, "triangle", 0.08, 0.16);
  },
};

/** Quiet filtered bed — no buzzing square / dual-sine drone. */
function softAmbience() {
  const c = ac();
  if (!master) return;
  ambience = c.createGain();
  ambience.gain.value = 0;
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 280;
  filter.Q.value = 0.6;
  const o = c.createOscillator();
  o.type = "sine";
  o.frequency.value = 98;
  o.connect(filter);
  filter.connect(ambience);
  ambience.connect(master);
  o.start();
  const t = c.currentTime;
  ambience.gain.linearRampToValueAtTime(0.018, t + 2.5);
}
