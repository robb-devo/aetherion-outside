import { useEffect, useRef, useState } from "react";
import { ABILITIES, ITEMS, LANDMARKS, QUEST, SKILLS, VENDOR, xpToNext } from "../game/content";
import { useGame } from "../game/store";
import { NPCS } from "../game/content";
import { feel } from "../game/feel";

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
  const targetId = useGame((s) => s.targetId);
  const targetName = useGame((s) => s.targetName);
  const targetHp = useGame((s) => s.targetHp);
  const targetMax = useGame((s) => s.targetMax);
  const zonePing = useGame((s) => s.zonePing);
  const subzone = useGame((s) => s.subzone);
  const chat = useGame((s) => s.chat);
  const swingCd = useGame((s) => s.swingCd);
  const tonicCd = useGame((s) => s.tonicCd);
  const combatLv = skills.combat.level;
  const [juice, setJuice] = useState({ flash: 0, draw: 0, aiming: false, weapon: "sword" });

  useEffect(() => {
    let id = 0;
    const tick = () => {
      setJuice({
        flash: feel.flash,
        draw: feel.draw,
        aiming: feel.aiming,
        weapon: feel.weapon,
      });
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  const zoneFresh = zonePing && Date.now() - zonePing.at < 3200;

  return (
    <div className="hud">
      {juice.flash > 0.02 && (
        <div
          className="hit-flash"
          style={{
            opacity: juice.flash * 0.85,
            background: `radial-gradient(circle at 50% 45%, rgba(255,220,180,${0.35 * juice.flash}) 0%, rgba(80,0,0,${0.45 * juice.flash}) 55%, transparent 75%)`,
          }}
        />
      )}
      {juice.aiming && (
        <div className="bow-reticle">
          <i />
          <i />
          <i />
          <i />
          {juice.draw > 0.05 && (
            <div className="draw-ring">
              <span style={{ transform: `scale(${0.55 + juice.draw * 0.45})` }} />
            </div>
          )}
        </div>
      )}

      {zoneFresh && zonePing && (
        <div className="zone-splash">
          <div className="zone-continent">Aetherion</div>
          <div className="zone-name">{zonePing.name}</div>
        </div>
      )}

      <div className="hud-top-left">
        <div className="unitframe player-frame">
          <div className="portrait">Æ</div>
          <div className="bars">
            <div className="uf-name">
              Traveler <span>Lv {combatLv}</span>
            </div>
            <div className="bar hp-bar">
              <span className="hp-fill" style={{ width: `${(hp / maxHp) * 100}%` }} />
              <em>
                {hp}/{maxHp}
              </em>
            </div>
            <div className="bar xp-bar">
              <span
                className="combat-fill"
                style={{ width: `${(skills.combat.xp / xpToNext(skills.combat.level)) * 100}%` }}
              />
            </div>
          </div>
        </div>
        {targetId && (
          <div className="unitframe target-frame">
            <div className="portrait rat">🐀</div>
            <div className="bars">
              <div className="uf-name">{targetName}</div>
              <div className="bar hp-bar">
                <span className="hp-fill" style={{ width: `${targetMax ? (targetHp / targetMax) * 100 : 0}%` }} />
                <em>
                  {Math.max(0, Math.round(targetHp))}/{targetMax}
                </em>
              </div>
            </div>
          </div>
        )}
        <div className="shards">◆ {shards} shards</div>
        <div className="weapon-pill">{juice.weapon === "bow" ? "🏹 Bow" : "⚔ Sword"} · combo LMB</div>
      </div>

      <Minimap label={subzone} />

      {questStage !== "idle" && (
        <div className="hud-quest panel">
          <h3>
            {QUEST.name}
            <small> L log</small>
          </h3>
          {questStage === "done" ? (
            <div className="obj done">Lanterns lit. Harbour remembers.</div>
          ) : (
            <>
              <div className={`obj ${petals >= QUEST.petalsNeeded ? "done" : ""}`}>
                Gather moonpetals {petals}/{QUEST.petalsNeeded}
              </div>
              <div className={`obj ${rats >= QUEST.ratsNeeded ? "done" : ""}`}>
                Clear shade-rats {rats}/{QUEST.ratsNeeded}
              </div>
              <div className={`obj ${questStage === "turnin" ? "done" : ""}`}>Return to Harbourmaster Corin</div>
            </>
          )}
        </div>
      )}

      {prompt && !juice.aiming && (
        <div className="hud-prompt panel">
          <kbd>E</kbd>
          {prompt.label}
        </div>
      )}

      {gathering && (
        <div className="castbar panel">
          <span>{gathering.kind === "forage" ? "Gathering" : gathering.kind === "mine" ? "Mining" : "Fishing"}…</span>
          <div className="bar">
            <span
              className="forage-fill"
              style={{
                width: `${(gathering.t / (gathering.kind === "fish" ? 2.1 : 1.45)) * 100}%`,
              }}
            />
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

      <div className="chat panel">
        {chat.slice(-7).map((c) => (
          <div key={c.id} className={`chat-line ${c.channel}`}>
            {c.text}
          </div>
        ))}
      </div>

      <div className="hud-bottom">
        <div className="actionbar">
          {ABILITIES.map((ab) => {
            const cd = ab.id === "strike" ? swingCd / 0.35 : ab.id === "tonic" ? tonicCd / 8 : 0;
            const active =
              (ab.id === "strike" && juice.weapon === "sword") || (ab.id === "bow" && juice.weapon === "bow");
            return (
              <div key={ab.id} className={`slot ${active ? "slot-active" : ""}`} title={ab.name}>
                <span className="slot-icon">{ab.icon}</span>
                {cd > 0 && <i className="cd" style={{ height: `${cd * 100}%` }} />}
                <small>{ab.key}</small>
              </div>
            );
          })}
          {[6, 7, 8, 9, 0].map((n) => (
            <div key={n} className="slot empty">
              <small>{n}</small>
            </div>
          ))}
        </div>
        <div className="hotkeys">
          {juice.weapon === "bow"
            ? juice.aiming
              ? "Aiming · hold LMB to draw · release to shoot"
              : "2 Bow · hold RMB aim · LMB draw/release · 1 Sword"
            : locked
              ? "RMB look · LMB combo Strike · 2 Bow · Tab target"
              : "RMB look · LMB / 1 combo Strike · 2 Bow · Tab target"}
        </div>
      </div>

      <DialogBox />
      <Panels />
    </div>
  );
}

function Minimap({ label }: { label: string }) {
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
      <div className="minimap-label">{label}</div>
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
  const isLila = npcId === "lila";

  return (
    <div className="hud-dialog panel">
      <div className="dialog-name">
        {npc.name} · {npc.title}
      </div>
      <p className="dialog-body">{line}</p>
      <div className="dialog-options">
        {!last && <button onClick={() => useGame.getState().dialogChoice("next")}>Continue</button>}
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
        {last && isLila && (
          <>
            <button onClick={() => useGame.getState().dialogChoice("buy")}>
              Buy tonic ({VENDOR.tonicCost} shards)
            </button>
            <button onClick={() => useGame.getState().dialogChoice("sell")}>
              Sell moonpetal ({ITEMS.moonpetal.sellShards} shards)
            </button>
          </>
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
  const title =
    panel === "skills"
      ? "Character"
      : panel === "inventory"
        ? "Bags"
        : panel === "questlog"
          ? "Quest Log"
          : panel === "map"
            ? "Map — Harbour of Dusk"
            : "Keybind Primer";
  return (
    <div className="modal-wrap" onClick={() => useGame.getState().setPanel(null)}>
      <div className="modal panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="panel-close" onClick={() => useGame.getState().setPanel(null)}>
            Close
          </button>
        </div>
        {panel === "skills" && <SkillsBody />}
        {panel === "inventory" && <InventoryBody />}
        {panel === "questlog" && <QuestLogBody />}
        {panel === "map" && <MapBody />}
        {panel === "help" && <HelpBody />}
      </div>
    </div>
  );
}

function SkillsBody() {
  const skills = useGame((s) => s.skills);
  return (
    <div className="skills-list">
      {(Object.keys(SKILLS) as Array<keyof typeof SKILLS>).map((id) => {
        const def = SKILLS[id];
        const s = skills[id];
        const need = xpToNext(s.level);
        return (
          <div key={id} className={def.playable ? "" : "skill-locked"}>
            <div className="bar-label">
              <span>
                {def.name} · Rank {s.level}
                {!def.playable && " — island later"}
              </span>
              <span>
                {s.xp}/{need}
              </span>
            </div>
            <div className="bar">
              <span className={id === "combat" ? "combat-fill" : "forage-fill"} style={{ width: `${(s.xp / need) * 100}%` }} />
            </div>
            <div className="obj">
              {def.blurb} · {def.island}
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

function QuestLogBody() {
  const questStage = useGame((s) => s.questStage);
  const petals = useGame((s) => s.petals);
  const rats = useGame((s) => s.rats);
  if (questStage === "idle") {
    return <p className="obj">No quests. Speak with Harbourmaster Corin in the plaza.</p>;
  }
  return (
    <div>
      <h3 className="gold-title" style={{ fontSize: 16 }}>
        {QUEST.name}
      </h3>
      <p className="obj">{QUEST.log}</p>
      {questStage === "done" ? (
        <p className="obj done">Completed.</p>
      ) : (
        <>
          <div className={`obj ${petals >= QUEST.petalsNeeded ? "done" : ""}`}>
            Moonpetals {petals}/{QUEST.petalsNeeded}
          </div>
          <div className={`obj ${rats >= QUEST.ratsNeeded ? "done" : ""}`}>
            Shade-rats {rats}/{QUEST.ratsNeeded}
          </div>
          <div className={`obj ${questStage === "turnin" ? "done" : ""}`}>Turn in: Harbourmaster Corin</div>
        </>
      )}
    </div>
  );
}

function MapBody() {
  return (
    <div className="obj">
      <p>Harbour of Dusk — capital hub. Spokes on the horizon:</p>
      <ul>
        <li>North-west hill — foraging (moonpetals)</li>
        <li>East warehouse — combat (shade-rats)</li>
        <li>Plaza crystals — mining chips</li>
        <li>Docks — fishing</li>
        <li>Eldervale Gate — adventure isle (later)</li>
        <li>Farm Isle / Fishing Isle / Amethyst Mines — silhouettes</li>
      </ul>
      <p>Minimap is top-right. Gold dots are landmarks.</p>
    </div>
  );
}

function HelpBody() {
  return (
    <div className="help-list">
      <div>
        <b>Hold RMB</b> Look
      </div>
      <div>
        <b>Wheel</b> Zoom
      </div>
      <div>
        <b>Both mouse</b> Walk
      </div>
      <div>
        <b>W A S D</b> Move
      </div>
      <div>
        <b>Shift</b> Sprint
      </div>
      <div>
        <b>Space</b> Jump
      </div>
      <div>
        <b>1 / F</b> Strike
      </div>
      <div>
        <b>Tab</b> Target
      </div>
      <div>
        <b>E</b> Talk / gather / fish / mine
      </div>
      <div>
        <b>5</b> Drink tonic
      </div>
      <div>
        <b>C</b> Character / skills
      </div>
      <div>
        <b>B / I</b> Bags
      </div>
      <div>
        <b>L</b> Quest log
      </div>
      <div>
        <b>M</b> Map
      </div>
      <div>
        <b>H</b> This primer
      </div>
      <div>
        <b>F11</b> Fullscreen
      </div>
      <div>
        <b>Esc</b> Close / clear target
      </div>
    </div>
  );
}
