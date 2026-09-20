import { unlockAudio } from "../game/audio";
import { useGame } from "../game/store";

export function TitleScreen() {
  return (
    <div className="title-screen">
      <p className="title-kicker">Aetherion Outside · Vertical Slice 0.1</p>
      <h1>AETHERION</h1>
      <p className="title-sub">Harbour of Dusk</p>
      <div className="title-actions">
        <button
          onClick={() => {
            void unlockAudio();
            useGame.getState().enterWorld();
          }}
        >
          Enter the Harbour
        </button>
        <span className="title-hint">Third-person · single-player slice · shards, skills, one dusk quest</span>
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
