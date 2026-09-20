import { useEffect, useRef } from "react";
import { ITEMS, QUEST, xpToNext } from "../game/content";
import { useGame } from "../game/store";
import { LANDMARKS } from "../game/content";
import { NPCS } from "../game/content";

export function HUD() {
  const hp = useGame((s) => s.hp);
  const maxHp = useGame((s) => s.maxHp);
  const shards = useGame((s) => s.shards);
  const skills = useGame((s) => s.skills);
  const questStage = useGame((s) => s.questStage);
  const petals = useGame((s) => s.petals);
  const rats = useGame((s) => s.rats);
  const prompt = useGame((s) => s.prompt);
  const toasts = useGame((s) => s.toasts);
  const gathering = useGame((s) => s.gathering);
  const locked = useGame((s) => s.locked);

  return (
    <div className="hud">
      <div className="compass">N</div>
      <div className="hud-top-left">
        <div className="portrait-row">
          <div className="portrait">Æ</div>
          <div className="bars">
            <div className="bar-label">
              <span>Health</span>
              <span>
                {hp}/{maxHp}
              </span>
            </div>
            <div className="bar">
              <span className="hp-fill" style={{ width: `${(hp / maxHp) * 100}%` }} />
            </div>
            <div className="bar-label">
              <span>Combat {skills.combat.level}</span>
              <span>
                {skills.combat.xp}/{xpToNext(skills.combat.level)}
              </span>
            </div>
            <div className="bar">
              <span
                className="combat-fill"
                style={{ width: `${(skills.combat.xp / xpToNext(skills.combat.level)) * 100}%` }}
              />
            </div>
            <div className="bar-label">
              <span>Foraging {skills.foraging.level}</span>
              <span>
                {skills.foraging.xp}/{xpToNext(skills.foraging.level)}
              </span>
            </div>
            <div className="bar">
              <span
                className="forage-fill"
                style={{ width: `${(skills.foraging.xp / xpToNext(skills.foraging.level)) * 100}%` }}
              />
            </div>
          </div>
        </div>
        <div className="shards">◆ {shards} shards</div>
      </div>

      <Minimap />

      {questStage !== "idle" && (
        <div className="hud-quest panel">
          <h3>{QUEST.name}</h3>
          <div className="obj">
            {questStage === "done" ? "Lanterns lit. Harbour remembers." : QUEST.summary}
          </div>
          {questStage !== "done" && (
            <>
              <div className={`obj ${petals >= QUEST.petalsNeeded ? "done" : ""}`}>
                Gather moonpetals {petals}/{QUEST.petalsNeeded}
              </div>
              <div className={`obj ${rats >= QUEST.ratsNeeded ? "done" : ""}`}>
                Clear shade-rats {rats}/{QUEST.ratsNeeded}
              </div>
              <div className={`obj ${questStage === "turnin" ? "done" : ""}`}>
                Return to Harbourmaster Corin
              </div>
            </>
          )}
        </div>
      )}

      {prompt && (
        <div className="hud-prompt panel">
          <kbd>E</kbd>
          {prompt.label}
        </div>
      )}

      {gathering && (
        <div className="hud-prompt panel" style={{ bottom: 188 }}>
          Gathering…
          <div className="bar" style={{ width: 180, marginTop: 6 }}>
            <span className="forage-fill" style={{ width: `${(gathering.t / 1.45) * 100}%` }} />
          </div>
        </div>
      )}

      <div className="hud-toasts">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.kind === "loot" ? "loot" : ""}`}>
            {t.text}
          </div>
        ))}
      </div>

      <div className="hud-bottom">
        <div className="actionbar panel">
          <div className="slot">
            ⚔<small>F</small>
          </div>
          <div className="slot">
            ❀<small>E</small>
          </div>
          <div className="slot">
            ◎<small>⇧</small>
          </div>
          <div className="slot">
            C<small>C</small>
          </div>
          <div className="slot">
            I<small>I</small>
          </div>
        </div>
        <div className="hotkeys">
          {locked ? "Mouse look on — Esc releases" : "Click the world to look · WASD move · Space jump"}
        </div>
      </div>

      <DialogBox />
      <Panels />
    </div>
  );
}

function Minimap() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const player = useGame((s) => s.player);

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const w = (c.width = 168);
    const h = (c.height = 168);
    ctx.fillStyle = "#13241c";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#1c4d5c";
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.62, 70, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#3f6a3a";
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.42, 58, 0, Math.PI * 2);
    ctx.fill();
    const toMap = (x: number, z: number) => [w / 2 + x * 2.15, h / 2 + z * 2.15] as const;
    for (const lm of LANDMARKS) {
      const [mx, my] = toMap(lm.x, lm.z);
      ctx.fillStyle = lm.color;
      ctx.beginPath();
      ctx.arc(mx, my, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
    const [px, py] = toMap(player.x, player.z);
    ctx.fillStyle = "#fff6df";
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(-player.yaw);
    ctx.beginPath();
    ctx.moveTo(0, -7);
    ctx.lineTo(5, 5);
    ctx.lineTo(0, 2);
    ctx.lineTo(-5, 5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }, [player]);

  return (
    <div className="hud-top-right">
      <div className="minimap">
        <canvas ref={canvas} />
      </div>
      <div className="minimap-label">Harbour</div>
    </div>
  );
}

function DialogBox() {
  const npcId = useGame((s) => s.dialogNpc);
  const idx = useGame((s) => s.dialogIndex);
  const questStage = useGame((s) => s.questStage);
  if (!npcId) return null;
  const npc = NPCS.find((n) => n.id === npcId);
  if (!npc) return null;
  const line = npc.lines[Math.min(idx, npc.lines.length - 1)];
  const last = idx >= npc.lines.length - 1;
  const isCorin = npcId === "corin";

  return (
    <div className="hud-dialog panel">
      <div className="dialog-name">
        {npc.name} · {npc.title}
      </div>
      <p className="dialog-body">{line}</p>
      <div className="dialog-options">
        {!last && (
          <button onClick={() => useGame.getState().dialogChoice("next")}>Continue</button>
        )}
        {last && isCorin && questStage === "idle" && (
          <button onClick={() => useGame.getState().dialogChoice("accept")}>Accept — Dusk Lanterns</button>
        )}
        {last && isCorin && questStage === "turnin" && (
          <button onClick={() => useGame.getState().dialogChoice("turnin")}>Turn in — take shards</button>
        )}
        {last && isCorin && questStage === "active" && (
          <button onClick={() => useGame.getState().dialogChoice("close")}>I'll handle it</button>
        )}
        {last && isCorin && questStage === "done" && (
          <button onClick={() => useGame.getState().dialogChoice("close")}>The lanterns hold</button>
        )}
        {last && !isCorin && <button onClick={() => useGame.getState().dialogChoice("close")}>Farewell</button>}
        <button onClick={() => useGame.getState().dialogChoice("close")}>Leave</button>
      </div>
    </div>
  );
}

function Panels() {
  const panel = useGame((s) => s.panel);
  if (!panel) return null;
  return (
    <div className="modal-wrap" onClick={() => useGame.getState().setPanel(null)}>
      <div className="modal panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>{panel === "skills" ? "Skills" : panel === "inventory" ? "Pack" : "Harbour Primer"}</h2>
          <button className="panel-close" onClick={() => useGame.getState().setPanel(null)}>
            Close
          </button>
        </div>
        {panel === "skills" && <SkillsBody />}
        {panel === "inventory" && <InventoryBody />}
        {panel === "help" && <HelpBody />}
      </div>
    </div>
  );
}

function SkillsBody() {
  const skills = useGame((s) => s.skills);
  return (
    <div className="skills-list">
      {(["combat", "foraging"] as const).map((id) => {
        const s = skills[id];
        const need = xpToNext(s.level);
        return (
          <div key={id}>
            <div className="bar-label">
              <span>
                {id === "combat" ? "Combat" : "Foraging"} · Rank {s.level}
              </span>
              <span>
                {s.xp}/{need}
              </span>
            </div>
            <div className="bar">
              <span className={id === "combat" ? "combat-fill" : "forage-fill"} style={{ width: `${(s.xp / need) * 100}%` }} />
            </div>
            <div className="obj">
              {id === "combat"
                ? "Blades against rift-touched pests. XP from shade-rats."
                : "Twist, don't yank. XP from moonpetals on the north hill."}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function InventoryBody() {
  const inventory = useGame((s) => s.inventory);
  const shards = useGame((s) => s.shards);
  return (
    <>
      <div className="shards" style={{ marginBottom: 12 }}>
        ◆ {shards} shards in pouch
      </div>
      <div className="grid-items">
        {inventory.map((stack) => {
          const def = ITEMS[stack.id];
          return (
            <div className="item" key={stack.id}>
              <b>
                {def?.icon} {def?.name ?? stack.id} ×{stack.qty}
              </b>
              <div className="obj">{def?.flavor}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function HelpBody() {
  return (
    <div className="help-list">
      <div>
        <b>W A S D</b> Move
      </div>
      <div>
        <b>Mouse</b> Look (click to capture)
      </div>
      <div>
        <b>Shift</b> Sprint
      </div>
      <div>
        <b>Space</b> Jump
      </div>
      <div>
        <b>F / Click</b> Attack
      </div>
      <div>
        <b>E</b> Talk / Gather / Pad
      </div>
      <div>
        <b>C</b> Skills
      </div>
      <div>
        <b>I</b> Inventory
      </div>
      <div>
        <b>H</b> Primer
      </div>
      <div>
        <b>Esc</b> Close panels
      </div>
      <div>Quest bang lives over Harbourmaster Corin.</div>
    </div>
  );
}
