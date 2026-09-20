let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let started = false;

function ac() {
  if (!ctx) {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = 0.22;
    master.connect(ctx.destination);
  }
  return ctx;
}

export async function unlockAudio() {
  const c = ac();
  if (c.state === "suspended") await c.resume();
  if (!started && master) {
    started = true;
    drone();
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
  ui: () => tone(520, 0.08, "triangle", 0.08),
  gather: () => {
    tone(523, 0.18, "sine", 0.12);
    tone(784, 0.22, "sine", 0.08, 0.05);
  },
  hit: () => tone(90, 0.12, "square", 0.16),
  swing: () => tone(220, 0.08, "sawtooth", 0.05),
  hurt: () => tone(140, 0.16, "square", 0.12),
  jump: () => tone(300, 0.1, "triangle", 0.06),
  pad: () => {
    tone(180, 0.3, "sine", 0.12);
    tone(360, 0.35, "sine", 0.08, 0.04);
  },
  level: () => {
    tone(392, 0.2, "triangle", 0.1);
    tone(523, 0.24, "triangle", 0.1, 0.08);
    tone(784, 0.3, "triangle", 0.1, 0.16);
  },
};

function drone() {
  const c = ac();
  if (!master) return;
  const o1 = c.createOscillator();
  const o2 = c.createOscillator();
  const g = c.createGain();
  const f = c.createBiquadFilter();
  o1.type = "sine";
  o2.type = "sine";
  o1.frequency.value = 73;
  o2.frequency.value = 110;
  f.type = "lowpass";
  f.frequency.value = 420;
  g.gain.value = 0.07;
  o1.connect(f);
  o2.connect(f);
  f.connect(g);
  g.connect(master);
  o1.start();
  o2.start();
}
