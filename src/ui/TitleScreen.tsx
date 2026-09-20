import { unlockAudio } from "../game/audio";
import { useGame } from "../game/store";

export function TitleScreen() {
  const hasSave = useGame((s) => s.hasSave);
  return (
    <div className="title-screen">
      <p className="title-kicker">Aetherion Outside · Vertical Slice 0.1</p>
      <h1>AETHERION</h1>
      <p className="title-sub">Harbour of Dusk</p>
      <div className="title-actions">
        <button
          onClick={() => {
            void unlockAudio();
            useGame.getState().enterWorld("new");
          }}
        >
          Enter the Harbour
        </button>
        {hasSave && (
          <button
            onClick={() => {
              void unlockAudio();
              useGame.getState().enterWorld("continue");
            }}
          >
            Continue
          </button>
        )}
        <span className="title-hint">Right-mouse look · 1 Strike · Tab target · L quest log · F11 fullscreen</span>
        <button
          className="btn-quiet"
          onClick={() => {
            void fetch("/__shutdown").catch(() => undefined);
            window.close();
          }}
        >
          Exit
        </button>
      </div>
    </div>
  );
}

export function Loader({ progress }: { progress: number }) {
  return (
    <div className="loader">
      <div className="loader-inner">
        <div className="gold-title" style={{ fontSize: 28 }}>
          AETHERION
        </div>
        <div className="title-hint">Charting the harbour…</div>
        <div className="loader-bar">
          <span style={{ width: `${Math.round(progress)}%` }} />
        </div>
      </div>
    </div>
  );
}
