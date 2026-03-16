import { useState, useEffect, useRef, useCallback } from "react";
import * as Tone from "tone";

/* ═══════════ AUDIO ═══════════ */
let audioReady = false;
const synths = {};
function initAudio() {
  if (audioReady) return;
  try {
    synths.tap = new Tone.Synth({ oscillator: { type: "triangle" }, envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 } }).toDestination();
    synths.success = new Tone.PolySynth(Tone.Synth, { oscillator: { type: "sine" }, envelope: { attack: 0.01, decay: 0.2, sustain: 0.05, release: 0.3 } }).toDestination();
    synths.fail = new Tone.Synth({ oscillator: { type: "sawtooth" }, envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.2 } }).toDestination();
    synths.win = new Tone.PolySynth(Tone.Synth, { oscillator: { type: "triangle" }, envelope: { attack: 0.01, decay: 0.3, sustain: 0.1, release: 0.5 } }).toDestination();
    synths.tick = new Tone.Synth({ oscillator: { type: "square" }, envelope: { attack: 0.01, decay: 0.05, sustain: 0, release: 0.05 }, volume: -12 }).toDestination();
    audioReady = true;
  } catch (e) {}
}
function snd(name, note) {
  if (!audioReady) return;
  try {
    const t = Tone.now();
    if (name === "tap") synths.tap.triggerAttackRelease(note || "C5", "16n", t);
    else if (name === "success") synths.success.triggerAttackRelease(["C5", "E5", "G5"], "8n", t);
    else if (name === "fail") synths.fail.triggerAttackRelease("C3", "8n", t);
    else if (name === "win") { synths.win.triggerAttackRelease(["C5", "E5"], "8n", t); synths.win.triggerAttackRelease(["E5", "G5"], "8n", t + 0.15); synths.win.triggerAttackRelease(["G5", "C6"], "4n", t + 0.3); }
    else if (name === "tick") synths.tick.triggerAttackRelease("A4", "32n", t);
  } catch (e) {}
}
const MNOTES = { jump: "C5", tuck: "D5", star: "E5", spin: "F5", flip: "G5", pike: "A5" };

/* ═══════════ CHARACTER OPTIONS ═══════════ */
const SKIN_COLORS = [
  { id: "light", color: "#ffcc99", label: "Light" },
  { id: "medium", color: "#e8a87c", label: "Medium" },
  { id: "tan", color: "#c68642", label: "Tan" },
  { id: "brown", color: "#8d5524", label: "Brown" },
  { id: "dark", color: "#5c3317", label: "Dark" },
];

const HAIR_STYLES = [
  { id: "short", label: "Short" },
  { id: "spiky", label: "Spiky" },
  { id: "long", label: "Long" },
  { id: "curly", label: "Curly", price: 15 },
  { id: "ponytail", label: "Ponytail", price: 15 },
  { id: "buns", label: "Buns", price: 20 },
  { id: "mohawk", label: "Mohawk", price: 30 },
  { id: "afro", label: "Afro", price: 25 },
  { id: "braids", label: "Braids", price: 35 },
  { id: "bob", label: "Bob", price: 20 },
  { id: "bald", label: "Bald" },
];

const HAIR_COLORS = [
  { id: "hblonde", color: "#f7d794", label: "Blonde" },
  { id: "hbrown", color: "#6b4423", label: "Brown" },
  { id: "hblack", color: "#2c2c2c", label: "Black" },
  { id: "hred", color: "#c0392b", label: "Red" },
  { id: "hblue", color: "#3498db", label: "Blue", price: 20 },
  { id: "hpink", color: "#e84393", label: "Pink", price: 20 },
  { id: "hpurple", color: "#8e44ad", label: "Purple", price: 25 },
  { id: "hgreen", color: "#27ae60", label: "Green", price: 25 },
];

const EYE_COLORS = [
  { id: "ebrown", color: "#5D4037", label: "Brown" },
  { id: "eblue", color: "#1976D2", label: "Blue" },
  { id: "egreen", color: "#388E3C", label: "Green" },
  { id: "ehazel", color: "#8D6E63", label: "Hazel" },
  { id: "egrey", color: "#607D8B", label: "Grey", price: 15 },
  { id: "eviolet", color: "#7B1FA2", label: "Violet", price: 30 },
];

const EXPRESSIONS = [
  { id: "happy", label: "Happy", emoji: "😊" },
  { id: "excited", label: "Excited", emoji: "😃" },
  { id: "cool", label: "Cool", emoji: "😎", price: 20 },
  { id: "determined", label: "Focused", emoji: "😤", price: 15 },
  { id: "silly", label: "Silly", emoji: "😜", price: 25 },
  { id: "surprised", label: "Wow", emoji: "😮", price: 15 },
];

const SHIRT_COLORS = [
  { id: "sred", color: "#e74c3c", label: "Red" },
  { id: "sblue", color: "#3498db", label: "Blue" },
  { id: "sgreen", color: "#2ecc71", label: "Green" },
  { id: "spurple", color: "#9b59b6", label: "Purple", price: 15 },
  { id: "syellow", color: "#f1c40f", label: "Yellow", price: 10 },
  { id: "spink", color: "#fd79a8", label: "Pink", price: 10 },
  { id: "sorange", color: "#e67e22", label: "Orange", price: 15 },
  { id: "swhite", color: "#ecf0f1", label: "White", price: 10 },
];

const SHIRT_PATTERNS = [
  { id: "plain", label: "Plain", emoji: "⬜" },
  { id: "stripes", label: "Stripes", emoji: "📏", price: 20 },
  { id: "star", label: "Star", emoji: "⭐", price: 25 },
  { id: "number", label: "No.1", emoji: "1️⃣", price: 30 },
  { id: "heart", label: "Heart", emoji: "❤️", price: 25 },
  { id: "lightning", label: "Bolt", emoji: "⚡", price: 40 },
];

const SHORTS_COLORS = [
  { id: "xnavy", color: "#2c3e50", label: "Navy" },
  { id: "xgrey", color: "#636e72", label: "Grey" },
  { id: "xred", color: "#d63031", label: "Red" },
  { id: "xblue", color: "#0984e3", label: "Blue", price: 10 },
  { id: "xblack", color: "#1e1e1e", label: "Black" },
  { id: "xgreen", color: "#00b894", label: "Green", price: 10 },
  { id: "xpink", color: "#e84393", label: "Pink", price: 15 },
  { id: "xwhite", color: "#dfe6e9", label: "White", price: 15 },
];

const SHOE_COLORS = [
  { id: "zwht", color: "#ffffff", label: "White" },
  { id: "zred", color: "#e74c3c", label: "Red" },
  { id: "zblue", color: "#2980b9", label: "Blue" },
  { id: "zblk", color: "#2d3436", label: "Black" },
  { id: "zpnk", color: "#fd79a8", label: "Pink", price: 15 },
  { id: "zylw", color: "#fdcb6e", label: "Yellow", price: 15 },
  { id: "zgrn", color: "#00b894", label: "Green", price: 15 },
  { id: "zorng", color: "#e67e22", label: "Orange", price: 20 },
];

const ACCESSORIES = [
  { id: "none", label: "None", emoji: "❌" },
  { id: "cap", label: "Cap", emoji: "🧢" },
  { id: "bow", label: "Bow", emoji: "🎀" },
  { id: "headband", label: "Band", emoji: "💫", price: 20 },
  { id: "glasses", label: "Glasses", emoji: "👓", price: 25 },
  { id: "star", label: "Star", emoji: "⭐", price: 30 },
  { id: "crown", label: "Crown", emoji: "👑", price: 60 },
  { id: "flower", label: "Flower", emoji: "🌸", price: 35 },
  { id: "sunglasses", label: "Shades", emoji: "🕶️", price: 40 },
  { id: "tiara", label: "Tiara", emoji: "💎", price: 75 },
];

const WRISTBANDS = [
  { id: "wnone", color: "none", label: "None" },
  { id: "wred", color: "#e74c3c", label: "Red", price: 10 },
  { id: "wblue", color: "#3498db", label: "Blue", price: 10 },
  { id: "wgreen", color: "#2ecc71", label: "Green", price: 10 },
  { id: "wgold", color: "#f1c40f", label: "Gold", price: 30 },
  { id: "wpink", color: "#fd79a8", label: "Pink", price: 15 },
  { id: "wblack", color: "#2d3436", label: "Black", price: 10 },
  { id: "wrainbow", color: "rainbow", label: "Rainbow", price: 50 },
];

const DEFAULT_CHAR = {
  skin: SKIN_COLORS[0].color,
  hair: "short",
  hairColor: HAIR_COLORS[1].color,
  eyeColor: EYE_COLORS[0].color,
  expression: "happy",
  shirt: SHIRT_COLORS[1].color,
  shirtPattern: "plain",
  shorts: SHORTS_COLORS[0].color,
  shoes: SHOE_COLORS[0].color,
  accessory: "none",
  wristband: "none",
};

/* ═══════════ ARENA / VENUE OPTIONS ═══════════ */
const VENUES = [
  { id: "school", label: "School Gym", emoji: "🏫" },
  { id: "club", label: "Gym Club", emoji: "🤸" },
  { id: "national", label: "Nationals", emoji: "🏟️", price: 50 },
  { id: "olympic", label: "Olympics", emoji: "🥇", price: 100 },
  { id: "festival", label: "Festival", emoji: "🎪", price: 40 },
];

const CROWD_LEVELS = [
  { id: "none", label: "Empty", emoji: "🚫" },
  { id: "small", label: "Small", emoji: "👥" },
  { id: "packed", label: "Packed", emoji: "🎉", price: 30 },
];

const BANNER_COLORS = [
  { id: "bnone", color: "none", label: "None" },
  { id: "bred", color: "#e74c3c", label: "Red" },
  { id: "bblue", color: "#3498db", label: "Blue" },
  { id: "bgreen", color: "#27ae60", label: "Green", price: 15 },
  { id: "bgold", color: "#f39c12", label: "Gold", price: 25 },
  { id: "bpink", color: "#e84393", label: "Pink", price: 15 },
];

const FLOOR_COLORS = [
  { id: "fblue", color: "#1a5276", label: "Blue" },
  { id: "fred", color: "#78281f", label: "Red" },
  { id: "fgreen", color: "#1e5631", label: "Green", price: 15 },
  { id: "fpurple", color: "#4a235a", label: "Purple", price: 20 },
  { id: "fgrey", color: "#2c3e50", label: "Grey" },
];

const ARENA_EXTRAS = [
  { id: "xnone", label: "None", emoji: "❌" },
  { id: "spotlights", label: "Lights", emoji: "💡", price: 35 },
  { id: "flags", label: "Flags", emoji: "🏁", price: 25 },
  { id: "scoreboard", label: "Score", emoji: "📊", price: 45 },
  { id: "judges", label: "Judges", emoji: "👩‍⚖️", price: 55 },
];

const DEFAULT_ARENA = {
  venue: "club",
  crowd: "small",
  bannerColor: "#3498db",
  floorColor: "#1a5276",
  extra: "xnone",
  trampType: "competition",
  trampColor: "#3498db",
};

/* ═══════════ TRAMPOLINE OPTIONS ═══════════ */
const TRAMP_TYPES = [
  { id: "competition", label: "BERG Ultim", emoji: "🏅" },
  { id: "round", label: "BERG Favorit", emoji: "⭕" },
  { id: "rectangle", label: "BERG Grand", emoji: "🟦", price: 20 },
  { id: "inground", label: "BERG InGround", emoji: "🕳️", price: 35 },
  { id: "octagon", label: "BERG Grand Ovaal", emoji: "🛑", price: 40 },
  { id: "pro", label: "BERG Elite", emoji: "⭐", price: 60 },
  { id: "rainbow", label: "BERG Rainbow", emoji: "🌈", price: 50 },
];

const TRAMP_COLORS = [
  { id: "tcblue", color: "#3498db", label: "Blue" },
  { id: "tcred", color: "#e74c3c", label: "Red" },
  { id: "tcgreen", color: "#27ae60", label: "Green" },
  { id: "tcblack", color: "#2c3e50", label: "Black" },
  { id: "tcpink", color: "#e84393", label: "Pink", price: 15 },
  { id: "tcgold", color: "#f39c12", label: "Gold", price: 25 },
  { id: "tcpurple", color: "#8e44ad", label: "Purple", price: 20 },
  { id: "tcteal", color: "#00b894", label: "Teal", price: 20 },
];

/* ═══════════ TRAMPOLINE DISPLAY COMPONENT ═══════════ */
function TrampolineDisplay({ type = "competition", color = "#3498db", stretch = false, width = 180 }) {
  const h = 14;
  const legH = 22;
  const padColor = color;
  const frameColor = "#7f8c8d";
  const springColor = "#bdc3c7";
  const dur = "0.12s";

  const isRainbow = type === "rainbow";
  const matGrad = isRainbow
    ? "linear-gradient(90deg, #e74c3c, #e67e22, #f1c40f, #2ecc71, #3498db, #9b59b6)"
    : `linear-gradient(180deg, ${padColor}ee, ${padColor}bb)`;

  const shapes = {
    competition: { borderRadius: 4, matW: width, padW: width + 16, padH: 6, legs: 3, legAngle: 8 },
    round: { borderRadius: "50%", matW: width * 0.85, padW: width, padH: 6, legs: 2, legAngle: 12 },
    rectangle: { borderRadius: 3, matW: width, padW: width + 12, padH: 7, legs: 4, legAngle: 6 },
    inground: { borderRadius: 4, matW: width * 0.95, padW: 0, padH: 0, legs: 0, legAngle: 0, inground: true },
    octagon: { borderRadius: 6, matW: width * 0.9, padW: width + 8, padH: 6, legs: 3, legAngle: 7 },
    pro: { borderRadius: 3, matW: width, padW: width + 20, padH: 8, legs: 4, legAngle: 5 },
    rainbow: { borderRadius: 4, matW: width, padW: width + 16, padH: 6, legs: 3, legAngle: 8 },
  };

  const s = shapes[type] || shapes.competition;

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      transform: stretch ? "scaleY(1.4) scaleX(1.04)" : "scaleY(1)",
      transition: `transform ${dur} ease-out`,
    }}>
      {/* Safety pad (not on inground) */}
      {s.padW > 0 && (
        <div style={{
          width: s.padW, height: s.padH,
          background: `linear-gradient(90deg, ${padColor}cc, ${padColor}88, ${padColor}cc)`,
          borderRadius: type === "round" ? "50%" : 10,
          position: "relative", zIndex: 2,
        }} />
      )}

      {/* Jumping mat */}
      <div style={{
        width: s.matW, height: h,
        background: matGrad,
        borderRadius: typeof s.borderRadius === "string" ? s.borderRadius : s.borderRadius,
        boxShadow: `0 4px 14px rgba(0,0,0,0.35)${type === "pro" ? ", 0 0 12px " + padColor + "40" : ""}`,
        border: type === "pro" ? `2px solid ${padColor}88` : "none",
        position: "relative", zIndex: 1,
        marginTop: s.padH > 0 ? -3 : 0,
      }}>
        {/* Spring pattern on mat */}
        {!s.inground && (
          <div style={{
            position: "absolute", inset: 2,
            backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(255,255,255,0.08) 8px, rgba(255,255,255,0.08) 9px)`,
            borderRadius: typeof s.borderRadius === "string" ? s.borderRadius : s.borderRadius - 1,
          }} />
        )}
      </div>

      {/* Inground ground cutout */}
      {s.inground && (
        <div style={{
          width: s.matW + 30, height: 18,
          background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)",
          borderRadius: "0 0 8px 8px",
          marginTop: -2,
          border: "1px solid rgba(255,255,255,0.05)",
          borderTop: "none",
        }} />
      )}

      {/* Frame + legs (not inground) */}
      {!s.inground && s.legs > 0 && (
        <div style={{
          width: s.padW > 0 ? s.padW - 20 : s.matW - 10,
          display: "flex", justifyContent: "space-between",
          padding: "0 4px",
        }}>
          {Array.from({ length: s.legs }).map((_, i) => {
            const angle = i === 0 ? -s.legAngle : i === s.legs - 1 ? s.legAngle : 0;
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                {/* Spring */}
                <div style={{
                  width: 3, height: 6,
                  background: `repeating-linear-gradient(180deg, ${springColor}, ${springColor} 2px, transparent 2px, transparent 3px)`,
                }} />
                {/* Leg */}
                <div style={{
                  width: type === "pro" ? 6 : 5,
                  height: type === "pro" ? legH + 4 : legH,
                  background: type === "pro"
                    ? `linear-gradient(180deg, ${frameColor}, #95a5a6)`
                    : frameColor,
                  borderRadius: 3,
                  transform: `rotate(${angle}deg)`,
                }} />
                {/* Foot */}
                <div style={{
                  width: type === "pro" ? 14 : 10, height: 4,
                  background: frameColor, borderRadius: 2,
                  transform: `rotate(${angle}deg)`,
                }} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══════════ ARENA BACKGROUND COMPONENT ═══════════ */
function ArenaBackground({ arena, width = 400, height = 300 }) {
  const { venue, crowd, bannerColor, floorColor, extra } = arena;
  const isOlympic = venue === "olympic";
  const isNational = venue === "national" || isOlympic;
  const isFestival = venue === "festival";

  const crowdRows = crowd === "none" ? 0 : crowd === "small" ? 1 : 2;
  const showBanners = bannerColor !== "none";

  // Generate crowd people
  const crowdPeople = [];
  for (let row = 0; row < crowdRows; row++) {
    const count = Math.floor(width / 16);
    for (let i = 0; i < count; i++) {
      const hue = Math.floor(Math.random() * 360);
      crowdPeople.push({
        x: (i / count) * 100,
        y: row === 0 ? 8 : 0,
        color: `hsl(${hue}, 60%, 55%)`,
        headColor: `hsl(${(hue + 30) % 360}, 30%, ${60 + Math.random() * 20}%)`,
        bobDelay: (Math.random() * 2).toFixed(1),
        size: 0.8 + Math.random() * 0.4,
        key: `${row}-${i}`,
      });
    }
  }

  return (
    <div style={{
      position: "absolute", inset: 0, overflow: "hidden", zIndex: 0,
      pointerEvents: "none",
    }}>
      {/* Venue wall / backdrop */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "45%",
        background: isOlympic
          ? "linear-gradient(180deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)"
          : isNational
          ? "linear-gradient(180deg, #1b2838 0%, #2c3e50 60%, #34495e 100%)"
          : isFestival
          ? "linear-gradient(180deg, #2d1b4e 0%, #4a2c82 60%, #6c3fa0 100%)"
          : venue === "school"
          ? "linear-gradient(180deg, #4a3728 0%, #5d4e37 60%, #6b5b45 100%)"
          : "linear-gradient(180deg, #1e3a5f 0%, #2c5f8a 60%, #3a7cbd 100%)",
      }}>
        {/* Venue name banner at top */}
        {isNational && (
          <div style={{
            position: "absolute", top: "4%", left: "50%", transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.4)", borderRadius: 8, padding: "3px 16px",
            color: "#fbbf24", fontSize: "clamp(8px, 2vw, 12px)", fontFamily: "'Lilita One', cursive",
            letterSpacing: 2, textAlign: "center",
          }}>
            {isOlympic ? "🥇 OLYMPIC GAMES 🥇" : "🏟️ NATIONAL CHAMPIONSHIP"}
          </div>
        )}
        {isFestival && (
          <div style={{
            position: "absolute", top: "3%", left: "50%", transform: "translateX(-50%)",
            fontSize: "clamp(10px, 2.5vw, 16px)", letterSpacing: 4,
          }}>
            🎪🎨🎭🎪🎨🎭
          </div>
        )}

        {/* Olympic rings */}
        {isOlympic && (
          <div style={{ position: "absolute", top: "18%", left: "50%", transform: "translateX(-50%)", display: "flex", gap: 3 }}>
            {["#0081C8", "#000", "#EE334E", "#FCB131", "#00A651"].map((c, i) => (
              <div key={i} style={{ width: "clamp(12px, 3vw, 18px)", height: "clamp(12px, 3vw, 18px)", borderRadius: "50%", border: `2.5px solid ${c}` }} />
            ))}
          </div>
        )}

        {/* Spotlights */}
        {extra === "spotlights" && (
          <>
            <div style={{ position: "absolute", top: 0, left: "20%", width: "15%", height: "100%",
              background: "linear-gradient(180deg, rgba(255,255,200,0.15) 0%, rgba(255,255,200,0.02) 100%)",
              clipPath: "polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)",
              animation: "spotSway1 4s ease-in-out infinite",
            }} />
            <div style={{ position: "absolute", top: 0, right: "20%", width: "15%", height: "100%",
              background: "linear-gradient(180deg, rgba(255,255,200,0.15) 0%, rgba(255,255,200,0.02) 100%)",
              clipPath: "polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)",
              animation: "spotSway2 4s ease-in-out infinite",
            }} />
            <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "20%", height: "100%",
              background: "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 100%)",
              clipPath: "polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)",
            }} />
          </>
        )}

        {/* Flags */}
        {extra === "flags" && (
          <div style={{ position: "absolute", top: "12%", left: 0, right: 0, display: "flex", justifyContent: "space-around", padding: "0 5%" }}>
            {["🇮🇪", "🏳️", "🇮🇪", "🏳️", "🇮🇪", "🏳️", "🇮🇪"].map((f, i) => (
              <span key={i} style={{ fontSize: "clamp(12px, 3vw, 18px)", animation: `flagWave 1.5s ${i * 0.2}s ease-in-out infinite` }}>{f}</span>
            ))}
          </div>
        )}

        {/* Banners */}
        {showBanners && (
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "16%",
            display: "flex",
          }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{
                flex: 1, background: i % 2 === 0 ? bannerColor : `${bannerColor}88`,
                clipPath: "polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%)",
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Crowd / Stands */}
      {crowdRows > 0 && (
        <div style={{
          position: "absolute", top: "28%", left: 0, right: 0, height: "20%",
          overflow: "hidden",
        }}>
          {/* Stand structure */}
          <div style={{
            position: "absolute", inset: 0,
            background: isOlympic || isNational
              ? "linear-gradient(180deg, #34495e 0%, #2c3e50 100%)"
              : isFestival
              ? "linear-gradient(180deg, #4a2c82 0%, #3b1f6e 100%)"
              : "linear-gradient(180deg, #5d6d7e 0%, #4a5568 100%)",
            borderTop: "3px solid rgba(255,255,255,0.1)",
          }} />
          {/* Crowd people SVG */}
          <svg viewBox={`0 0 100 ${crowdRows * 16 + 4}`} preserveAspectRatio="none" width="100%" height="100%"
            style={{ position: "absolute", inset: 0 }}>
            {crowdPeople.map(p => (
              <g key={p.key} transform={`translate(${p.x}, ${p.y})`}>
                <rect x="-1.5" y="7" width="3" height="7" rx="1" fill={p.color} opacity="0.85">
                  <animate attributeName="y" values="7;6;7" dur={`${1.5 + Math.random()}s`} begin={`${p.bobDelay}s`} repeatCount="indefinite" />
                </rect>
                <circle cx="0" cy="5" r="2.2" fill={p.headColor}>
                  <animate attributeName="cy" values="5;4.2;5" dur={`${1.5 + Math.random()}s`} begin={`${p.bobDelay}s`} repeatCount="indefinite" />
                </circle>
              </g>
            ))}
          </svg>
        </div>
      )}

      {/* Scoreboard */}
      {extra === "scoreboard" && (
        <div style={{
          position: "absolute", top: "6%", right: "5%",
          background: "#111", borderRadius: 6, padding: "4px 10px",
          border: "2px solid #333", minWidth: 60,
        }}>
          <div style={{ color: "#4ade80", fontSize: "clamp(7px, 1.8vw, 10px)", fontFamily: "monospace", textAlign: "center", letterSpacing: 1 }}>SCORE</div>
          <div style={{ color: "#fbbf24", fontSize: "clamp(12px, 3vw, 16px)", fontFamily: "monospace", fontWeight: 800, textAlign: "center" }}>10.0</div>
        </div>
      )}

      {/* Judges table */}
      {extra === "judges" && (
        <div style={{
          position: "absolute", bottom: "24%", left: "5%",
          display: "flex", gap: 2, alignItems: "flex-end",
        }}>
          {[
            { score: "9.5", emoji: "👩‍⚖️" },
            { score: "9.8", emoji: "👨‍⚖️" },
            { score: "9.3", emoji: "👩‍⚖️" },
          ].map((j, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "clamp(7px, 1.6vw, 9px)", color: "#fbbf24", fontFamily: "monospace", fontWeight: 800 }}>{j.score}</div>
              <div style={{
                background: "#2c3e50", borderRadius: "4px 4px 0 0", padding: "2px 5px",
                border: "1px solid rgba(255,255,255,0.1)",
              }}>
                <span style={{ fontSize: "clamp(10px, 2.5vw, 14px)" }}>{j.emoji}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floor / mat */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "28%",
        background: `linear-gradient(180deg, ${floorColor} 0%, ${floorColor}dd 100%)`,
        borderTop: isNational || isOlympic ? "3px solid rgba(255,255,255,0.15)" : "2px solid rgba(255,255,255,0.08)",
      }}>
        {/* Floor mat lines */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `
            linear-gradient(0deg, rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }} />
        {/* Competition boundary lines */}
        <div style={{
          position: "absolute", top: 8, left: "10%", right: "10%", bottom: 8,
          border: "2px solid rgba(255,255,255,0.12)", borderRadius: 4,
        }} />
        {/* Center circle on mat */}
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: "clamp(40px, 12vw, 70px)", height: "clamp(40px, 12vw, 70px)",
          borderRadius: "50%", border: "2px solid rgba(255,255,255,0.08)",
        }} />
      </div>
    </div>
  );
}

/* ═══════════ SVG CHILD CHARACTER ═══════════ */
const POSES = {
  idle: { headY: 0, bodyS: 1, armL: 15, armR: -15, legL: 5, legR: -5, rot: 0, sy: 1, sx: 1 },
  jump: { headY: -5, bodyS: 1.08, armL: -155, armR: 155, legL: 8, legR: -8, rot: 0, sy: 1.08, sx: 0.95 },
  tuck: { headY: 10, bodyS: 0.75, armL: 70, armR: -70, legL: -90, legR: 90, rot: 0, sy: 0.72, sx: 1.1 },
  star: { headY: -3, bodyS: 1, armL: -140, armR: 140, legL: -40, legR: 40, rot: 0, sy: 0.95, sx: 1.15 },
  spin: { headY: 0, bodyS: 1, armL: -90, armR: 90, legL: 0, legR: 0, rot: 360, sy: 1, sx: 1 },
  flip: { headY: 6, bodyS: 0.9, armL: 40, armR: -40, legL: -50, legR: 50, rot: -360, sy: 1, sx: 1 },
  pike: { headY: 8, bodyS: 0.85, armL: 55, armR: -55, legL: -70, legR: 70, rot: 0, sy: 0.75, sx: 1.05 },
  celebrate: { headY: -5, bodyS: 1.05, armL: -165, armR: 165, legL: -15, legR: 15, rot: 0, sy: 1.05, sx: 1.05 },
};

function ChildChar({ cfg, pose = "idle", bounce = false, scale = 1 }) {
  const p = POSES[pose] || POSES.idle;
  const dur = (pose === "spin" || pose === "flip") ? "0.5s" : "0.3s";
  const ease = (pose === "spin" || pose === "flip") ? "cubic-bezier(0.4,0,0.2,1)" : "ease-out";
  const { skin, hairColor, shirt, shorts, shoes, hair, accessory, eyeColor = "#5D4037", expression = "happy", shirtPattern = "plain", wristband = "none" } = cfg;

  const hairPaths = {
    short: <><ellipse cx="50" cy="16" rx="22" ry="12" fill={hairColor} /><rect x="28" y="12" width="44" height="14" rx="4" fill={hairColor} /></>,
    spiky: <><polygon points="30,22 35,2 42,18 50,0 58,18 65,2 70,22" fill={hairColor} /><rect x="29" y="16" width="42" height="10" rx="3" fill={hairColor} /></>,
    long: <><ellipse cx="50" cy="16" rx="23" ry="13" fill={hairColor} /><rect x="27" y="12" width="46" height="16" rx="4" fill={hairColor} /><rect x="27" y="22" width="10" height="28" rx="4" fill={hairColor} /><rect x="63" y="22" width="10" height="28" rx="4" fill={hairColor} /></>,
    curly: <><circle cx="34" cy="14" r="10" fill={hairColor} /><circle cx="50" cy="10" r="11" fill={hairColor} /><circle cx="66" cy="14" r="10" fill={hairColor} /><circle cx="28" cy="26" r="8" fill={hairColor} /><circle cx="72" cy="26" r="8" fill={hairColor} /><rect x="30" y="16" width="40" height="10" rx="3" fill={hairColor} /></>,
    ponytail: <><ellipse cx="50" cy="16" rx="22" ry="12" fill={hairColor} /><rect x="28" y="12" width="44" height="14" rx="4" fill={hairColor} /><ellipse cx="50" cy="6" rx="6" ry="4" fill={hairColor} /><rect x="47" y="2" width="6" height="14" rx="3" fill={hairColor} /><circle cx="50" cy="0" r="7" fill={hairColor} /></>,
    buns: <><ellipse cx="50" cy="16" rx="22" ry="12" fill={hairColor} /><rect x="28" y="12" width="44" height="14" rx="4" fill={hairColor} /><circle cx="30" cy="10" r="9" fill={hairColor} /><circle cx="70" cy="10" r="9" fill={hairColor} /></>,
    mohawk: <><rect x="44" y="0" width="12" height="20" rx="4" fill={hairColor} /><rect x="42" y="8" width="16" height="14" rx="3" fill={hairColor} /><rect x="28" y="16" width="44" height="8" rx="3" fill={hairColor} /></>,
    afro: <><circle cx="50" cy="16" r="28" fill={hairColor} /><rect x="28" y="20" width="44" height="8" rx="3" fill={hairColor} /></>,
    braids: <><ellipse cx="50" cy="16" rx="22" ry="12" fill={hairColor} /><rect x="28" y="12" width="44" height="14" rx="4" fill={hairColor} /><rect x="26" y="22" width="7" height="34" rx="3" fill={hairColor} /><rect x="67" y="22" width="7" height="34" rx="3" fill={hairColor} /><circle cx="29" cy="56" r="4" fill={hairColor} /><circle cx="71" cy="56" r="4" fill={hairColor} /></>,
    bob: <><ellipse cx="50" cy="16" rx="24" ry="14" fill={hairColor} /><rect x="26" y="12" width="48" height="22" rx="8" fill={hairColor} /></>,
    bald: null,
  };

  const mouthPaths = {
    happy: <path d="M44,36 Q50,42 56,36" fill="none" stroke="#333" strokeWidth="1.8" strokeLinecap="round" />,
    excited: <><path d="M43,35 Q50,44 57,35" fill="#fff" stroke="#333" strokeWidth="1.5" /><path d="M44,35 Q50,38 56,35" fill="#e74c3c" /></>,
    cool: <path d="M43,37 L57,37" stroke="#333" strokeWidth="1.8" strokeLinecap="round" />,
    determined: <><path d="M44,37 Q50,40 56,37" fill="none" stroke="#333" strokeWidth="1.8" strokeLinecap="round" /><line x1="35" y1="22" x2="42" y2="24" stroke="#333" strokeWidth="1.5" /><line x1="65" y1="22" x2="58" y2="24" stroke="#333" strokeWidth="1.5" /></>,
    silly: <><path d="M43,35 Q50,44 57,35" fill="#e74c3c" stroke="#333" strokeWidth="1.5" /><circle cx="44" cy="37" r="2" fill="#fff" /></>,
    surprised: <ellipse cx="50" cy="37" rx="5" ry="6" fill="#fff" stroke="#333" strokeWidth="1.5" />,
  };

  const eyeVariant = expression === "cool" || expression === "determined";
  const eyeSquint = expression === "silly";

  const shirtDecor = {
    plain: null,
    stripes: <><rect x="33" y="50" width="34" height="3" rx="1" fill="rgba(255,255,255,0.3)" /><rect x="33" y="56" width="34" height="3" rx="1" fill="rgba(255,255,255,0.3)" /><rect x="33" y="62" width="34" height="3" rx="1" fill="rgba(255,255,255,0.3)" /></>,
    star: <polygon points="50,48 52,53 57,53 53,56 55,61 50,58 45,61 47,56 43,53 48,53" fill="rgba(255,255,255,0.5)" />,
    number: <text x="50" y="60" textAnchor="middle" fontSize="14" fontWeight="800" fill="rgba(255,255,255,0.5)" fontFamily="sans-serif">1</text>,
    heart: <path d="M50,52 C50,48 43,46 43,50 C43,54 50,59 50,59 C50,59 57,54 57,50 C57,46 50,48 50,52Z" fill="rgba(255,255,255,0.4)" />,
    lightning: <polygon points="52,46 47,54 51,54 48,64 56,53 52,53 55,46" fill="rgba(255,255,255,0.45)" />,
  };

  const wbColor = wristband === "rainbow" ? null : wristband;
  const wbGrad = wristband === "rainbow";

  const accEl = {
    none: null,
    cap: <><rect x="26" y="8" width="48" height="8" rx="3" fill="#e74c3c" /><rect x="22" y="14" width="30" height="5" rx="2" fill="#c0392b" /></>,
    bow: <><polygon points="50,10 40,4 40,16" fill="#e84393" /><polygon points="50,10 60,4 60,16" fill="#fd79a8" /><circle cx="50" cy="10" r="3" fill="#d63031" /></>,
    headband: <rect x="26" y="15" width="48" height="5" rx="2" fill="#fbbf24" />,
    glasses: <><circle cx="40" cy="30" r="8" fill="none" stroke="#333" strokeWidth="2.5" /><circle cx="60" cy="30" r="8" fill="none" stroke="#333" strokeWidth="2.5" /><line x1="48" y1="30" x2="52" y2="30" stroke="#333" strokeWidth="2" /></>,
    star: <polygon points="50,2 53,12 63,12 55,18 58,28 50,22 42,28 45,18 37,12 47,12" fill="#fbbf24" stroke="#f39c12" strokeWidth="1" />,
    crown: <><polygon points="32,8 38,16 44,6 50,16 56,6 62,16 68,8 68,18 32,18" fill="#fbbf24" stroke="#f39c12" strokeWidth="1" /><circle cx="38" cy="10" r="2" fill="#e74c3c" /><circle cx="50" cy="6" r="2" fill="#3498db" /><circle cx="62" cy="10" r="2" fill="#2ecc71" /></>,
    flower: <><circle cx="68" cy="18" r="4" fill="#e84393" /><circle cx="64" cy="15" r="3.5" fill="#fd79a8" /><circle cx="72" cy="15" r="3.5" fill="#fd79a8" /><circle cx="64" cy="21" r="3.5" fill="#fd79a8" /><circle cx="72" cy="21" r="3.5" fill="#fd79a8" /><circle cx="68" cy="18" r="2.5" fill="#f1c40f" /></>,
    sunglasses: <><rect x="31" y="25" width="17" height="12" rx="3" fill="#1a1a2e" stroke="#333" strokeWidth="1.5" /><rect x="52" y="25" width="17" height="12" rx="3" fill="#1a1a2e" stroke="#333" strokeWidth="1.5" /><line x1="48" y1="30" x2="52" y2="30" stroke="#333" strokeWidth="2" /><rect x="31" y="25" width="17" height="5" rx="2" fill="rgba(100,200,255,0.3)" /><rect x="52" y="25" width="17" height="5" rx="2" fill="rgba(100,200,255,0.3)" /></>,
    tiara: <><path d="M32,16 L38,8 L44,14 L50,4 L56,14 L62,8 L68,16" fill="none" stroke="#c0c0c0" strokeWidth="2" /><circle cx="50" cy="5" r="3" fill="#00bcd4" stroke="#c0c0c0" strokeWidth="1" /><circle cx="38" cy="9" r="2" fill="#e1bee7" /><circle cx="62" cy="9" r="2" fill="#e1bee7" /></>,
  };

  return (
    <div style={{ width: 100 * scale, height: 140 * scale, position: "relative" }}>
      <div style={{
        width: "100%", height: "100%",
        animation: bounce && pose === "idle" ? "cFloat 0.8s ease-in-out infinite" : "none",
      }}>
        <div style={{
          width: "100%", height: "100%",
          transform: `scaleX(${p.sx}) scaleY(${p.sy}) rotate(${p.rot}deg)`,
          transition: `transform ${dur} ${ease}`,
          transformOrigin: "50% 50%",
        }}>
          <svg viewBox="-10 -5 120 150" width="100%" height="100%">
            {/* Left leg */}
            <g transform={`rotate(${p.legL} 42 82)`} style={{ transition: `transform ${dur} ${ease}` }}>
              <rect x="37" y="82" width="11" height="30" rx="5" fill={skin} stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
              <rect x="34" y="108" width="17" height="10" rx="5" fill={shoes} stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
              <rect x="34" y="108" width="17" height="4" rx="2" fill="rgba(255,255,255,0.3)" />
            </g>
            {/* Right leg */}
            <g transform={`rotate(${p.legR} 58 82)`} style={{ transition: `transform ${dur} ${ease}` }}>
              <rect x="52" y="82" width="11" height="30" rx="5" fill={skin} stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
              <rect x="49" y="108" width="17" height="10" rx="5" fill={shoes} stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
              <rect x="49" y="108" width="17" height="4" rx="2" fill="rgba(255,255,255,0.3)" />
            </g>
            {/* Defs for gradients */}
            <defs>
              <linearGradient id="rainbowWb" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e74c3c" /><stop offset="20%" stopColor="#f39c12" /><stop offset="40%" stopColor="#f1c40f" /><stop offset="60%" stopColor="#2ecc71" /><stop offset="80%" stopColor="#3498db" /><stop offset="100%" stopColor="#9b59b6" />
              </linearGradient>
            </defs>
            {/* Left arm */}
            <g transform={`rotate(${p.armL} 36 48)`} style={{ transition: `transform ${dur} ${ease}` }}>
              <rect x="18" y="43" width="20" height="11" rx="5" fill={shirt} stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
              <rect x="6" y="44" width="16" height="10" rx="5" fill={skin} stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
              {wristband !== "none" && (
                wbGrad ? <rect x="13" y="44" width="6" height="10" rx="3" fill="url(#rainbowWb)" />
                  : <rect x="13" y="44" width="6" height="10" rx="3" fill={wbColor} opacity="0.85" />
              )}
              <circle cx="7" cy="49" r="6" fill={skin} stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
              <ellipse cx="4" cy="47" rx="2.5" ry="3" fill={skin} />
            </g>
            {/* Right arm */}
            <g transform={`rotate(${p.armR} 64 48)`} style={{ transition: `transform ${dur} ${ease}` }}>
              <rect x="62" y="43" width="20" height="11" rx="5" fill={shirt} stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
              <rect x="78" y="44" width="16" height="10" rx="5" fill={skin} stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
              {wristband !== "none" && (
                wbGrad ? <rect x="81" y="44" width="6" height="10" rx="3" fill="url(#rainbowWb)" />
                  : <rect x="81" y="44" width="6" height="10" rx="3" fill={wbColor} opacity="0.85" />
              )}
              <circle cx="93" cy="49" r="6" fill={skin} stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
              <ellipse cx="96" cy="47" rx="2.5" ry="3" fill={skin} />
            </g>
            {/* Body / shirt */}
            <rect x="33" y="42" width="34" height="30" rx="8" fill={shirt} stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
            <rect x="42" y="42" width="16" height="8" rx="3" fill="rgba(255,255,255,0.15)" />
            {/* Shirt pattern */}
            {shirtDecor[shirtPattern]}
            {/* Shorts */}
            <rect x="33" y="68" width="34" height="18" rx="6" fill={shorts} stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
            <line x1="50" y1="70" x2="50" y2="84" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
            {/* Head */}
            <g style={{ transition: `transform ${dur} ${ease}`, transform: `translateY(${p.headY}px)` }}>
              {hairPaths[hair]}
              {/* Face */}
              <ellipse cx="50" cy="28" rx="21" ry="20" fill={skin} stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
              {/* Cheeks */}
              <ellipse cx="36" cy="33" rx="5" ry="3" fill="rgba(255,100,100,0.2)" />
              <ellipse cx="64" cy="33" rx="5" ry="3" fill="rgba(255,100,100,0.2)" />
              {/* Eyes - shape varies by expression */}
              <ellipse cx="41" cy="28" rx="4.5" ry={eyeSquint ? 3 : 5} fill="white" />
              <ellipse cx="59" cy="28" rx="4.5" ry={eyeSquint ? 3 : 5} fill="white" />
              <circle cx="42" cy={eyeSquint ? 28 : 29} r={eyeVariant ? 2.5 : 3} fill={eyeColor} />
              <circle cx="60" cy={eyeSquint ? 28 : 29} r={eyeVariant ? 2.5 : 3} fill={eyeColor} />
              <circle cx="43" cy={eyeSquint ? 26.5 : 27.5} r="1.2" fill="white" />
              <circle cx="61" cy={eyeSquint ? 26.5 : 27.5} r="1.2" fill="white" />
              {/* Expression / Mouth */}
              {mouthPaths[expression] || mouthPaths.happy}
              {/* Accessory */}
              {accEl[accessory]}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ═══════════ MOVES & TRICKS ═══════════ */
const MOVES = [
  { id: "jump", label: "Jump", emoji: "⬆️", color: "#22c55e", desc: "Launch up!" },
  { id: "tuck", label: "Tuck", emoji: "🔵", color: "#3b82f6", desc: "Curl up" },
  { id: "star", label: "Star", emoji: "⭐", color: "#eab308", desc: "Spread wide" },
  { id: "spin", label: "Spin", emoji: "🔄", color: "#a855f7", desc: "360° spin" },
  { id: "flip", label: "Flip", emoji: "🔃", color: "#ef4444", desc: "Somersault" },
  { id: "pike", label: "Pike", emoji: "📐", color: "#06b6d4", desc: "Touch toes" },
];

const TRICKS = [
  // ── 1-move (5) ──
  { name: "Basic Jump", moves: ["jump"], points: 10, emoji: "🦘" },
  { name: "Quick Tuck", moves: ["tuck"], points: 10, emoji: "🔵" },
  { name: "Lone Star", moves: ["star"], points: 10, emoji: "⭐" },
  { name: "Spin Out", moves: ["spin"], points: 12, emoji: "🔄" },
  { name: "Pike Pop", moves: ["pike"], points: 12, emoji: "📐" },

  // ── 2-move (14) ──
  { name: "Star Jump", moves: ["jump", "star"], points: 20, emoji: "🌟" },
  { name: "Tuck Jump", moves: ["jump", "tuck"], points: 20, emoji: "🏐" },
  { name: "Front Flip", moves: ["jump", "flip"], points: 25, emoji: "🤸" },
  { name: "Spin Jump", moves: ["jump", "spin"], points: 25, emoji: "💫" },
  { name: "Pike Jump", moves: ["jump", "pike"], points: 22, emoji: "📏" },
  { name: "Star Tuck", moves: ["star", "tuck"], points: 28, emoji: "✨" },
  { name: "Flip Spin", moves: ["flip", "spin"], points: 30, emoji: "🌀" },
  { name: "Pike Flip", moves: ["pike", "flip"], points: 30, emoji: "🏊" },
  { name: "Tuck Spin", moves: ["tuck", "spin"], points: 28, emoji: "🎱" },
  { name: "Star Pike", moves: ["star", "pike"], points: 28, emoji: "🌠" },
  { name: "Double Spin", moves: ["spin", "spin"], points: 32, emoji: "🔁" },
  { name: "Double Flip", moves: ["flip", "flip"], points: 35, emoji: "♻️" },
  { name: "Flip Pike", moves: ["flip", "pike"], points: 30, emoji: "🎯" },
  { name: "Spin Tuck", moves: ["spin", "tuck"], points: 28, emoji: "🫧" },

  // ── 3-move (16) ──
  { name: "Super Star", moves: ["jump", "star", "spin"], points: 40, emoji: "🎆" },
  { name: "Mega Flip", moves: ["jump", "flip", "tuck"], points: 42, emoji: "🚀" },
  { name: "Ultimate", moves: ["jump", "flip", "spin"], points: 45, emoji: "👑" },
  { name: "Starburst", moves: ["star", "spin", "star"], points: 42, emoji: "💥" },
  { name: "Tuck & Roll", moves: ["tuck", "flip", "tuck"], points: 42, emoji: "🎳" },
  { name: "Whirlwind", moves: ["spin", "star", "flip"], points: 45, emoji: "🌪️" },
  { name: "Pike Master", moves: ["jump", "pike", "flip"], points: 43, emoji: "🎿" },
  { name: "Star Shower", moves: ["star", "pike", "star"], points: 40, emoji: "🌌" },
  { name: "Corkscrew", moves: ["spin", "flip", "spin"], points: 48, emoji: "🍾" },
  { name: "Cannonball", moves: ["jump", "tuck", "tuck"], points: 38, emoji: "💣" },
  { name: "Rocket", moves: ["jump", "pike", "star"], points: 42, emoji: "🚀" },
  { name: "Cyclone", moves: ["spin", "pike", "flip"], points: 48, emoji: "🌊" },
  { name: "Gymnast", moves: ["pike", "flip", "star"], points: 45, emoji: "🎖️" },
  { name: "Bolt", moves: ["jump", "spin", "pike"], points: 40, emoji: "⚡" },
  { name: "Twister", moves: ["flip", "star", "spin"], points: 45, emoji: "🌀" },
  { name: "Boomerang", moves: ["tuck", "star", "tuck"], points: 40, emoji: "🪃" },

  // ── 4-move (14) ──
  { name: "Grand Slam", moves: ["jump", "star", "flip", "tuck"], points: 58, emoji: "🏅" },
  { name: "Tornado", moves: ["jump", "spin", "flip", "spin"], points: 62, emoji: "🌪️" },
  { name: "Showstopper", moves: ["star", "flip", "spin", "tuck"], points: 65, emoji: "🎪" },
  { name: "Firecracker", moves: ["jump", "flip", "star", "spin"], points: 65, emoji: "🧨" },
  { name: "Legendary", moves: ["flip", "spin", "star", "flip"], points: 70, emoji: "🐉" },
  { name: "Iron Cross", moves: ["star", "pike", "star", "pike"], points: 60, emoji: "✝️" },
  { name: "Blizzard", moves: ["spin", "tuck", "spin", "star"], points: 62, emoji: "❄️" },
  { name: "Supernova", moves: ["jump", "star", "spin", "pike"], points: 65, emoji: "☄️" },
  { name: "Thunderbolt", moves: ["pike", "flip", "spin", "jump"], points: 68, emoji: "⛈️" },
  { name: "Phoenix", moves: ["flip", "pike", "star", "flip"], points: 70, emoji: "🔥" },
  { name: "Eclipse", moves: ["spin", "flip", "pike", "tuck"], points: 68, emoji: "🌑" },
  { name: "Diamond", moves: ["star", "tuck", "pike", "star"], points: 62, emoji: "💎" },
  { name: "Galaxy", moves: ["spin", "star", "flip", "pike"], points: 72, emoji: "🌌" },
  { name: "Champion", moves: ["jump", "flip", "pike", "spin"], points: 70, emoji: "🏆" },
];

const LEVELS = [
  // Zone 1: Learning the ropes (1-move tricks)
  { level: 1, tricks: 3, time: 40, maxMoves: 1, title: "First Bounce", bg: ["#0c4a6e", "#0ea5e9"] },
  { level: 2, tricks: 4, time: 37, maxMoves: 1, title: "Getting Air", bg: ["#134e4a", "#14b8a6"] },
  // Zone 2: Combos begin (2-move tricks)
  { level: 3, tricks: 4, time: 35, maxMoves: 2, title: "Combo Time", bg: ["#312e81", "#818cf8"] },
  { level: 4, tricks: 5, time: 35, maxMoves: 2, title: "Trick Learner", bg: ["#4a1d6a", "#c084fc"] },
  { level: 5, tricks: 5, time: 31, maxMoves: 2, title: "Rising Star", bg: ["#7c2d12", "#fb923c"] },
  { level: 6, tricks: 6, time: 31, maxMoves: 2, title: "Flip Master", bg: ["#1e3a5f", "#38bdf8"] },
  { level: 7, tricks: 6, time: 29, maxMoves: 2, title: "Quick Feet", bg: ["#365314", "#84cc16"] },
  // Zone 3: Triple combos (3-move tricks)
  { level: 8, tricks: 5, time: 31, maxMoves: 3, title: "Air Acrobat", bg: ["#14532d", "#4ade80"] },
  { level: 9, tricks: 6, time: 30, maxMoves: 3, title: "Triple Threat", bg: ["#581c87", "#d946ef"] },
  { level: 10, tricks: 7, time: 30, maxMoves: 3, title: "Sky Dancer", bg: ["#7f1d1d", "#f87171"] },
  { level: 11, tricks: 7, time: 27, maxMoves: 3, title: "Speed Demon", bg: ["#713f12", "#fbbf24"] },
  { level: 12, tricks: 8, time: 27, maxMoves: 3, title: "Stunt Master", bg: ["#1e3a5f", "#67e8f9"] },
  { level: 13, tricks: 8, time: 25, maxMoves: 3, title: "No Pressure", bg: ["#4a1942", "#e879f9"] },
  { level: 14, tricks: 9, time: 27, maxMoves: 3, title: "Crowd Pleaser", bg: ["#052e16", "#34d399"] },
  // Zone 4: Quad combos (4-move tricks)
  { level: 15, tricks: 6, time: 33, maxMoves: 4, title: "Quad Squad", bg: ["#172554", "#60a5fa"] },
  { level: 16, tricks: 7, time: 31, maxMoves: 4, title: "Show-Off", bg: ["#431407", "#fb923c"] },
  { level: 17, tricks: 8, time: 30, maxMoves: 4, title: "Daredevil", bg: ["#3b0764", "#c084fc"] },
  { level: 18, tricks: 9, time: 29, maxMoves: 4, title: "Fearless", bg: ["#14532d", "#22d3ee"] },
  { level: 19, tricks: 10, time: 29, maxMoves: 4, title: "Legendary", bg: ["#7f1d1d", "#fbbf24"] },
  { level: 20, tricks: 12, time: 31, maxMoves: 4, title: "Grand Champion", bg: ["#fbbf24", "#f97316"] },
];

function getMove(id) { return MOVES.find(m => m.id === id); }
function pickTrick(max, last) {
  const ok = TRICKS.filter(t => t.moves.length <= max && t.name !== last);
  return ok[Math.floor(Math.random() * ok.length)] || TRICKS[0];
}

/* ═══════════ CONFETTI ═══════════ */
function Confetti({ active }) {
  const [pcs, setPcs] = useState([]);
  useEffect(() => {
    if (!active) { setPcs([]); return; }
    setPcs(Array.from({ length: 45 }, (_, i) => ({
      id: i, x: Math.random() * 100, d: Math.random() * 0.5,
      c: ["#fbbf24", "#22c55e", "#3b82f6", "#ef4444", "#a855f7", "#ec4899"][i % 6],
      s: 6 + Math.random() * 8, r: Math.random() * 360, dur: 1.5 + Math.random() * 1.5,
    })));
  }, [active]);
  if (!pcs.length) return null;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 50, overflow: "hidden" }}>
      {pcs.map(p => (
        <div key={p.id} style={{
          position: "absolute", left: `${p.x}%`, top: -20, width: p.s, height: p.s * 0.6,
          background: p.c, borderRadius: 2, transform: `rotate(${p.r}deg)`,
          animation: `confFall ${p.dur}s ${p.d}s ease-in forwards`,
        }} />
      ))}
    </div>
  );
}

/* ═══════════ COLOR PICKER ROW ═══════════ */
function ColorRow({ options, selected, onSelect, unlocked = [], coins = 0, onBuy }) {
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
      {options.map(o => {
        const val = o.color || o.id;
        const isNone = val === "none";
        const isRainbow = val === "rainbow";
        const isLocked = o.price && !unlocked.includes(o.id);
        const canAfford = o.price && coins >= o.price;
        const bg = isRainbow ? "linear-gradient(135deg, #e74c3c, #f39c12, #f1c40f, #2ecc71, #3498db, #9b59b6)"
          : isNone ? "rgba(255,255,255,0.08)" : val;
        return (
        <button key={o.id} onClick={() => {
          if (isLocked) { if (canAfford && onBuy) onBuy(o); }
          else onSelect(val);
        }} style={{
          width: 40, height: 40, borderRadius: 10, position: "relative",
          background: isLocked ? `${typeof bg === "string" && bg.startsWith("linear") ? bg : bg}` : bg,
          border: val === selected && !isLocked ? "3px solid #fff" : "3px solid rgba(255,255,255,0.15)",
          cursor: isLocked ? (canAfford ? "pointer" : "not-allowed") : "pointer",
          boxShadow: val === selected && !isLocked ? "0 0 12px rgba(255,255,255,0.4)" : "none",
          transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, color: "#fff", overflow: "hidden",
          opacity: isLocked ? 0.65 : 1,
        }}>
          {isLocked && (
            <div style={{
              position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              borderRadius: 7, gap: 0,
            }}>
              <span style={{ fontSize: 10 }}>🔒</span>
              <span style={{ fontSize: 8, fontWeight: 800, fontFamily: "'Baloo 2', cursive", color: canAfford ? "#4ade80" : "#fbbf24" }}>
                {o.price}🪙
              </span>
            </div>
          )}
          {!isLocked && (isNone ? "❌" : o.emoji || "")}
        </button>
        );
      })}
    </div>
  );
}

function StyleRow({ options, selected, onSelect, cfg, unlocked = [], coins = 0, onBuy }) {
  return (
    <div style={{ display: "flex", gap: 5, justifyContent: "center", flexWrap: "wrap" }}>
      {options.map(o => {
        const isLocked = o.price && !unlocked.includes(o.id);
        const canAfford = o.price && coins >= o.price;
        return (
        <button key={o.id} onClick={() => {
          if (isLocked) { if (canAfford && onBuy) onBuy(o); }
          else onSelect(o.id);
        }} style={{
          minWidth: 46, padding: "5px 8px", borderRadius: 10, position: "relative",
          background: !isLocked && o.id === selected ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)",
          border: !isLocked && o.id === selected ? "2px solid #fbbf24" : "2px solid rgba(255,255,255,0.1)",
          cursor: isLocked ? (canAfford ? "pointer" : "not-allowed") : "pointer",
          color: "#fff", fontSize: "clamp(10px, 2.5vw, 12px)",
          fontFamily: "'Baloo 2', cursive", fontWeight: 700,
          transition: "all 0.15s", display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
          opacity: isLocked ? 0.7 : 1,
        }}>
          {o.emoji && <span style={{ fontSize: 15, filter: isLocked ? "grayscale(0.5)" : "none" }}>{o.emoji}</span>}
          {isLocked ? (
            <span style={{ fontSize: 9, color: canAfford ? "#4ade80" : "#fbbf24", display: "flex", alignItems: "center", gap: 2 }}>
              🔒{o.price}🪙
            </span>
          ) : o.label}
        </button>
        );
      })}
    </div>
  );
}

/* ═══════════ MAIN GAME ═══════════ */
export default function TrampolineTricks() {
  const [screen, setScreen] = useState("menu");
  const [charCfg, setCharCfg] = useState({ ...DEFAULT_CHAR });
  const [arenaCfg, setArenaCfg] = useState({ ...DEFAULT_ARENA });
  const [customTab, setCustomTab] = useState("hair");
  const [lvIdx, setLvIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [unlocked, setUnlocked] = useState([]); // array of item ids that have been purchased
  const [coinPopup, setCoinPopup] = useState(null); // {text, x, y} for purchase/earn animation

  const [trick, setTrick] = useState(null);
  const [tricksLeft, setTricksLeft] = useState(0);
  const [tricksTotal, setTricksTotal] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const timeRef = useRef(0);
  const [progress, setProgress] = useState([]);
  const [charPose, setCharPose] = useState("idle");
  const [charY, setCharY] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [lvStars, setLvStars] = useState(Array(20).fill(0));
  const [confetti, setConfetti] = useState(false);
  const [tramStretch, setTramStretch] = useState(false);
  const [tutorial, setTutorial] = useState(-1);
  const [locked, setLocked] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const lastRef = useRef(null);
  const scoreRef = useRef(0);
  const timerRef = useRef(null);
  const fbRef = useRef(null);

  /* ─── Load saved data on mount ─── */
  useEffect(() => {
    try {
      const raw = localStorage.getItem("trampoline-save");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.charCfg) setCharCfg(prev => ({ ...prev, ...data.charCfg }));
        if (data.arenaCfg) setArenaCfg(prev => ({ ...prev, ...data.arenaCfg }));
        if (data.lvStars) setLvStars(data.lvStars);
        if (typeof data.totalScore === "number") setTotalScore(data.totalScore);
        if (typeof data.coins === "number") setCoins(data.coins);
        if (Array.isArray(data.unlocked)) setUnlocked(data.unlocked);
      }
    } catch (e) {
      // No save data yet, use defaults
    }
    setLoaded(true);
  }, []);

  /* ─── Save whenever customisation or progress changes ─── */
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem("trampoline-save", JSON.stringify({
        charCfg,
        arenaCfg,
        lvStars,
        totalScore,
        coins,
        unlocked,
      }));
    } catch (e) {
      // Storage unavailable, silent fail
    }
  }, [charCfg, arenaCfg, lvStars, totalScore, coins, unlocked, loaded]);

  const lv = LEVELS[lvIdx];
  const updateChar = (key, val) => setCharCfg(prev => ({ ...prev, [key]: val }));
  const updateArena = (key, val) => setArenaCfg(prev => ({ ...prev, [key]: val }));

  const buyItem = useCallback((item) => {
    if (!item.price || coins < item.price) return;
    setCoins(prev => prev - item.price);
    setUnlocked(prev => [...prev, item.id]);
    setCoinPopup({ text: `-${item.price} 🪙`, ts: Date.now() });
    snd("success");
    setTimeout(() => setCoinPopup(null), 1500);
  }, [coins]);

  const startLevel = useCallback((idx) => {
    Tone.start().then(() => initAudio());
    const l = LEVELS[idx];
    setLvIdx(idx); setScreen("playing");
    setScore(0); scoreRef.current = 0;
    setTricksLeft(l.tricks); setTricksTotal(l.tricks);
    setTimeLeft(l.time); timeRef.current = l.time;
    setProgress([]); setCharPose("idle"); setCharY(0);
    setFeedback(null); setConfetti(false); setTramStretch(false);
    setTutorial(idx === 0 ? 0 : -1); setLocked(false);
    lastRef.current = null;
    const t = pickTrick(l.maxMoves, null);
    setTrick(t); lastRef.current = t.name;
  }, []);

  useEffect(() => {
    if (screen !== "playing") return;
    const delay = tutorial >= 0 ? 2000 : 500;
    const did = setTimeout(() => {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          const n = t - 1; timeRef.current = n;
          if (n <= 5 && n > 0) snd("tick");
          if (n <= 0) { clearInterval(timerRef.current); setTimeout(() => { setScreen("result"); setCharPose("idle"); }, 300); return 0; }
          return n;
        });
      }, 1000);
    }, delay);
    return () => { clearTimeout(did); clearInterval(timerRef.current); };
  }, [screen, tutorial]);

  const animateMove = useCallback((moveId, cb) => {
    setLocked(true);
    setCharY(-50); setCharPose(moveId); snd("tap", MNOTES[moveId]);
    setTimeout(() => setCharY(-70), 150);
    setTimeout(() => setCharY(-20), 400);
    setTimeout(() => {
      setCharY(0); setCharPose("idle");
      setTramStretch(true); setTimeout(() => setTramStretch(false), 200);
      setLocked(false); if (cb) cb();
    }, 550);
  }, []);

  const handleMove = useCallback((moveId) => {
    if (screen !== "playing" || !trick || feedback || locked) return;
    if (!trick.moves.includes(moveId)) return;
    const idx = progress.length;
    const expected = trick.moves[idx];
    if (moveId === expected) {
      const newP = [...progress, moveId]; setProgress(newP);
      animateMove(moveId, () => {
        if (newP.length === trick.moves.length) {
          const pts = trick.points;
          const ns = scoreRef.current + pts; scoreRef.current = ns; setScore(ns);
          setCharPose("celebrate"); setCharY(-30); snd("success");
          setFeedback({ ok: true, text: `${trick.name}!`, sub: `+${pts} pts` });
          if (tutorial >= 0) setTutorial(-1);
          const rem = tricksLeft - 1; setTricksLeft(rem);
          fbRef.current = setTimeout(() => {
            setFeedback(null); setCharPose("idle"); setCharY(0); setProgress([]);
            if (rem <= 0) {
              clearInterval(timerRef.current);
              const t = timeRef.current; const l = LEVELS[lvIdx];
              let s = 1; if (t > l.time * 0.5) s = 3; else if (t > l.time * 0.2) s = 2;
              const coinReward = s * 10 + (lvIdx + 1) * 5; // big bonus for harder levels
              setCoins(prev => prev + coinReward);
              setCoinPopup({ text: `+${coinReward} 🪙`, ts: Date.now() });
              setLvStars(prev => { const n = [...prev]; n[lvIdx] = Math.max(n[lvIdx], s); return n; });
              setConfetti(true); setCharPose("celebrate"); snd("win");
              setTimeout(() => { setTotalScore(ts => ts + ns); setScreen("result"); }, 1200);
            } else {
              const nt = pickTrick(LEVELS[lvIdx].maxMoves, lastRef.current);
              setTrick(nt); lastRef.current = nt.name;
            }
          }, 600);
        }
      });
    } else {
      snd("fail"); setCharPose("idle");
      setFeedback({ ok: false, text: "Wrong order!", sub: "Try again" });
      setProgress([]); setLocked(true);
      fbRef.current = setTimeout(() => { setFeedback(null); setCharPose("idle"); setLocked(false); }, 800);
    }
  }, [screen, trick, progress, feedback, locked, tricksLeft, lvIdx, tutorial, animateMove]);

  useEffect(() => () => { clearInterval(timerRef.current); clearTimeout(fbRef.current); }, []);

  const won = tricksLeft <= 0 && screen === "result";
  const tp = lv ? (timeLeft / lv.time) * 100 : 100;
  const danger = timeLeft <= 5 && timeLeft > 0;
  const bg = lv?.bg || ["#0f172a", "#0ea5e9"];

  const TABS = [
    { id: "hair", label: "Hair", emoji: "💇" },
    { id: "face", label: "Face", emoji: "😊" },
    { id: "top", label: "Top", emoji: "👕" },
    { id: "bottom", label: "Bottom", emoji: "🩳" },
    { id: "shoes", label: "Shoes", emoji: "👟" },
    { id: "extra", label: "Extra", emoji: "✨" },
    { id: "venue", label: "Venue", emoji: "🏟️" },
    { id: "tramp", label: "Tramp", emoji: "🤸" },
    { id: "decor", label: "Decor", emoji: "🎨" },
  ];

  return (
    <div style={{
      width: "100%", height: "100dvh", overflow: "hidden", position: "relative",
      fontFamily: "'Lilita One', 'Baloo 2', cursive", userSelect: "none", WebkitUserSelect: "none",
      background: screen === "playing"
        ? "#111"
        : screen === "customize"
        ? "linear-gradient(170deg, #0a0a1a 0%, #111827 50%, #1e3a2e 100%)"
        : "linear-gradient(170deg, #0a0a1a 0%, #111827 40%, #1e3a2e 100%)",
      display: "flex", flexDirection: "column", transition: "background 0.8s ease",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Lilita+One&family=Baloo+2:wght@400;600;700;800&display=swap" rel="stylesheet" />
      <Confetti active={confetti} />

      {/* ═══ MENU ═══ */}
      {screen === "menu" && (
        <div style={{
          flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "flex-start", padding: "clamp(12px, 2vh, 24px) 20px",
          gap: "clamp(4px, 0.8vh, 10px)", overflowY: "auto",
        }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ animation: "bob 1.4s ease-in-out infinite" }}>
              <ChildChar cfg={charCfg} pose="pike" scale={0.9} />
            </div>
            <div style={{ marginTop: -4, transform: "scale(0.7)" }}>
              <TrampolineDisplay type={arenaCfg.trampType} color={arenaCfg.trampColor} width={150} />
            </div>
          </div>
          <h1 style={{ fontSize: "clamp(22px, 6vw, 36px)", color: "#fff", margin: 0, textShadow: "3px 3px 0 rgba(0,0,0,0.25)", textAlign: "center", lineHeight: 1.1 }}>
            Trampoline<br /><span style={{ color: "#4ade80" }}>Trick Master!</span>
          </h1>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(0,0,0,0.25)", borderRadius: 50, padding: "4px 14px",
          }}>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "clamp(10px, 2.5vw, 13px)", fontFamily: "'Baloo 2', cursive" }}>
              by
            </span>
            <span style={{
              color: "#4ade80", fontSize: "clamp(11px, 2.8vw, 14px)", fontWeight: 800,
              fontFamily: "'Baloo 2', cursive", letterSpacing: 0.5,
            }}>
              TrampolinesIreland.com
            </span>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 2, alignItems: "center" }}>
            <button onClick={() => setScreen("customize")} style={{
              background: "linear-gradient(135deg, #16a34a, #4ade80)", border: "none", borderRadius: 50,
              padding: "10px 24px", fontSize: "clamp(14px, 3.5vw, 18px)", fontFamily: "'Lilita One', cursive",
              color: "#fff", cursor: "pointer", boxShadow: "0 4px 14px rgba(22,163,74,0.4)",
            }}>Customize ✨</button>
            <div style={{
              background: "rgba(0,0,0,0.3)", borderRadius: 50, padding: "8px 16px",
              display: "flex", alignItems: "center", gap: 6,
              border: "2px solid rgba(251,191,36,0.3)",
            }}>
              <span style={{ fontSize: "clamp(16px, 4vw, 22px)" }}>🪙</span>
              <span style={{ color: "#fbbf24", fontSize: "clamp(16px, 4vw, 22px)", fontWeight: 800 }}>{coins}</span>
            </div>
          </div>

          <div style={{
            background: "rgba(255,255,255,0.1)", borderRadius: 14, padding: "10px 14px",
            maxWidth: 340, width: "100%", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)",
          }}>
            <div style={{ color: "#4ade80", fontWeight: 800, fontSize: "clamp(14px, 3.5vw, 17px)", marginBottom: 6, textAlign: "center" }}>🎯 How to Play</div>
            <div style={{ color: "#fff", fontSize: "clamp(12px, 3vw, 14px)", lineHeight: 1.8, fontFamily: "'Baloo 2', cursive" }}>
              <div>1️⃣ A <b>trick name</b> appears at the top</div>
              <div>2️⃣ Tap the <b>coloured buttons</b> at the bottom in the right order</div>
              <div>3️⃣ Your character <b>performs the trick!</b></div>
              <div>4️⃣ Finish all tricks <b>before the timer runs out</b></div>
            </div>
          </div>

          {/* Start prompt */}
          <div style={{
            background: "linear-gradient(135deg, #16a34a, #22c55e)", borderRadius: 14,
            padding: "10px 20px", maxWidth: 340, width: "100%", textAlign: "center",
            boxShadow: "0 4px 16px rgba(22,163,74,0.4)", animation: "pulse 1.5s ease-in-out infinite",
          }}>
            <div style={{ color: "#fff", fontSize: "clamp(15px, 4vw, 20px)", fontWeight: 800 }}>
              👇 Tap Level 1 below to start!
            </div>
          </div>

          <div style={{ color: "#fff", fontSize: "clamp(14px, 3.5vw, 17px)", fontWeight: 700 }}>Select Level</div>
          <div style={{ maxWidth: 340, width: "100%", display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { label: "🌱 Basics", range: [0, 2] },
              { label: "🔥 Combos", range: [2, 7] },
              { label: "⚡ Triple Tricks", range: [7, 14] },
              { label: "👑 Quad Combos", range: [14, 20] },
            ].map((zone, zi) => (
              <div key={zi}>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "clamp(9px, 2.2vw, 11px)", fontFamily: "'Baloo 2', cursive", fontWeight: 700, marginBottom: 3, letterSpacing: 1 }}>{zone.label}</div>
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(zone.range[1] - zone.range[0], 7)}, 1fr)`, gap: "clamp(3px, 1vw, 6px)" }}>
                  {LEVELS.slice(zone.range[0], zone.range[1]).map((l, j) => {
                    const i = zone.range[0] + j;
                    const ok = i === 0 || lvStars[i - 1] > 0; const s = lvStars[i];
                    return (
                      <button key={i} onClick={() => ok && startLevel(i)} style={{
                        background: ok ? s > 0 ? `linear-gradient(135deg, ${l.bg[0]}, ${l.bg[1]})` : "linear-gradient(135deg, #334155, #475569)" : "rgba(255,255,255,0.05)",
                        border: ok ? "2px solid rgba(255,255,255,0.25)" : "2px solid rgba(255,255,255,0.05)",
                        borderRadius: 10, padding: "clamp(5px, 1.3vw, 8px) 2px",
                        color: ok ? "#fff" : "rgba(255,255,255,0.2)", cursor: ok ? "pointer" : "default",
                        fontFamily: "'Lilita One', cursive", fontSize: "clamp(13px, 3.5vw, 17px)",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
                        boxShadow: ok ? "0 2px 8px rgba(0,0,0,0.3)" : "none", transition: "transform 0.12s",
                      }}>{ok ? l.level : "🔒"}{s > 0 && <div style={{ fontSize: "clamp(6px, 1.4vw, 8px)", letterSpacing: -1 }}>{"⭐".repeat(s)}{"☆".repeat(3 - s)}</div>}</button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {totalScore > 0 && <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontFamily: "'Baloo 2', cursive" }}>Total: {totalScore} pts</div>}

          {/* Branded footer */}
          <div style={{
            marginTop: "auto", paddingTop: 8, paddingBottom: 12, textAlign: "center",
            borderTop: "1px solid rgba(255,255,255,0.08)", width: "100%", maxWidth: 340,
          }}>
            <a href="https://www.trampolinesireland.com" target="_blank" rel="noopener noreferrer" style={{
              display: "inline-block", textDecoration: "none", textAlign: "center",
            }}>
              <span style={{ fontSize: "clamp(12px, 3vw, 14px)", color: "#4ade80", fontWeight: 800, fontFamily: "'Baloo 2', cursive" }}>
                🛒 TrampolinesIreland.com
              </span>
            </a>
            <div style={{
              color: "rgba(255,255,255,0.35)", fontSize: "clamp(9px, 2.2vw, 11px)", marginTop: 2,
              fontFamily: "'Baloo 2', cursive",
            }}>
              Selling BERG trampolines since 2020
            </div>
          </div>
        </div>
      )}

      {/* ═══ CUSTOMIZE ═══ */}
      {screen === "customize" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "12px 16px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button onClick={() => setScreen("menu")} style={{
              background: "rgba(255,255,255,0.1)", border: "2px solid rgba(255,255,255,0.2)",
              borderRadius: 10, padding: "6px 14px", color: "#fff", cursor: "pointer",
              fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 14,
            }}>← Back</button>
            <h2 style={{ color: "#fff", fontSize: "clamp(18px, 5vw, 24px)", margin: 0 }}>Customize ✨</h2>
            <div style={{
              background: "rgba(0,0,0,0.3)", borderRadius: 50, padding: "5px 12px",
              display: "flex", alignItems: "center", gap: 4,
              border: "2px solid rgba(251,191,36,0.3)",
            }}>
              <span style={{ fontSize: 14 }}>🪙</span>
              <span style={{ color: "#fbbf24", fontSize: "clamp(14px, 3.5vw, 18px)", fontWeight: 800 }}>{coins}</span>
            </div>
          </div>

          {/* Coin popup */}
          {coinPopup && (
            <div key={coinPopup.ts} style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
              background: coinPopup.text.startsWith("+") ? "linear-gradient(135deg, #22c55e, #16a34a)" : "linear-gradient(135deg, #e74c3c, #c0392b)",
              borderRadius: 16, padding: "10px 24px", zIndex: 60,
              color: "#fff", fontSize: "clamp(18px, 5vw, 26px)", fontWeight: 800,
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              animation: "coinPop 1.2s ease-out forwards",
              pointerEvents: "none",
            }}>
              {coinPopup.text}
            </div>
          )}

          {/* Character preview with arena backdrop */}
          <div style={{
            display: "flex", justifyContent: "center", alignItems: "center",
            padding: "8px 0", flexShrink: 0, position: "relative",
            height: "clamp(150px, 28vh, 220px)", overflow: "hidden",
            borderRadius: 12, margin: "0 12px",
          }}>
            <ArenaBackground arena={arenaCfg} />
            <div style={{ position: "relative", zIndex: 2 }}>
              <ChildChar cfg={charCfg} pose="idle" bounce={true} scale={1.2} />
              {/* Trampoline under preview */}
              <div style={{ position: "absolute", bottom: -12, left: "50%", transform: "translateX(-50%) scale(0.75)" }}>
                <TrampolineDisplay type={arenaCfg.trampType} color={arenaCfg.trampColor} width={140} />
              </div>
            </div>
          </div>

          {/* Category tabs */}
          <div style={{ display: "flex", justifyContent: "center", gap: 3, padding: "4px 8px", flexShrink: 0 }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setCustomTab(tab.id)} style={{
                background: customTab === tab.id ? "rgba(251,191,36,0.3)" : "rgba(255,255,255,0.06)",
                border: customTab === tab.id ? "2px solid #fbbf24" : "2px solid rgba(255,255,255,0.08)",
                borderRadius: 10, padding: "5px 8px", cursor: "pointer",
                color: customTab === tab.id ? "#fbbf24" : "rgba(255,255,255,0.6)",
                fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: "clamp(10px, 2.5vw, 13px)",
                transition: "all 0.15s", display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
              }}>
                <span style={{ fontSize: 14 }}>{tab.emoji}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Options area */}
          <div style={{
            flex: 1, overflow: "auto", padding: "10px 16px",
            display: "flex", flexDirection: "column", gap: 12,
          }}>
            {customTab === "hair" && (
              <>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "'Baloo 2', cursive", fontWeight: 700, textAlign: "center" }}>STYLE</div>
                <StyleRow options={HAIR_STYLES} selected={charCfg.hair} onSelect={(v) => updateChar("hair", v)} cfg={charCfg} unlocked={unlocked} coins={coins} onBuy={buyItem} />
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "'Baloo 2', cursive", fontWeight: 700, textAlign: "center", marginTop: 4 }}>COLOR</div>
                <ColorRow options={HAIR_COLORS} selected={charCfg.hairColor} onSelect={(v) => updateChar("hairColor", v)} unlocked={unlocked} coins={coins} onBuy={buyItem} />
              </>
            )}
            {customTab === "face" && (
              <>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "'Baloo 2', cursive", fontWeight: 700, textAlign: "center" }}>SKIN TONE</div>
                <ColorRow options={SKIN_COLORS} selected={charCfg.skin} onSelect={(v) => updateChar("skin", v)} unlocked={unlocked} coins={coins} onBuy={buyItem} />
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "'Baloo 2', cursive", fontWeight: 700, textAlign: "center", marginTop: 6 }}>EYE COLOR</div>
                <ColorRow options={EYE_COLORS} selected={charCfg.eyeColor} onSelect={(v) => updateChar("eyeColor", v)} unlocked={unlocked} coins={coins} onBuy={buyItem} />
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "'Baloo 2', cursive", fontWeight: 700, textAlign: "center", marginTop: 6 }}>EXPRESSION</div>
                <StyleRow options={EXPRESSIONS} selected={charCfg.expression} onSelect={(v) => updateChar("expression", v)} cfg={charCfg} unlocked={unlocked} coins={coins} onBuy={buyItem} />
              </>
            )}
            {customTab === "top" && (
              <>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "'Baloo 2', cursive", fontWeight: 700, textAlign: "center" }}>SHIRT COLOR</div>
                <ColorRow options={SHIRT_COLORS} selected={charCfg.shirt} onSelect={(v) => updateChar("shirt", v)} unlocked={unlocked} coins={coins} onBuy={buyItem} />
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "'Baloo 2', cursive", fontWeight: 700, textAlign: "center", marginTop: 6 }}>SHIRT DESIGN</div>
                <StyleRow options={SHIRT_PATTERNS} selected={charCfg.shirtPattern} onSelect={(v) => updateChar("shirtPattern", v)} cfg={charCfg} unlocked={unlocked} coins={coins} onBuy={buyItem} />
              </>
            )}
            {customTab === "bottom" && (
              <>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "'Baloo 2', cursive", fontWeight: 700, textAlign: "center" }}>SHORTS COLOR</div>
                <ColorRow options={SHORTS_COLORS} selected={charCfg.shorts} onSelect={(v) => updateChar("shorts", v)} unlocked={unlocked} coins={coins} onBuy={buyItem} />
              </>
            )}
            {customTab === "shoes" && (
              <>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "'Baloo 2', cursive", fontWeight: 700, textAlign: "center" }}>SHOE COLOR</div>
                <ColorRow options={SHOE_COLORS} selected={charCfg.shoes} onSelect={(v) => updateChar("shoes", v)} unlocked={unlocked} coins={coins} onBuy={buyItem} />
              </>
            )}
            {customTab === "extra" && (
              <>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "'Baloo 2', cursive", fontWeight: 700, textAlign: "center" }}>ACCESSORIES</div>
                <StyleRow options={ACCESSORIES} selected={charCfg.accessory} onSelect={(v) => updateChar("accessory", v)} cfg={charCfg} unlocked={unlocked} coins={coins} onBuy={buyItem} />
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "'Baloo 2', cursive", fontWeight: 700, textAlign: "center", marginTop: 6 }}>WRISTBANDS</div>
                <ColorRow options={WRISTBANDS} selected={charCfg.wristband} onSelect={(v) => updateChar("wristband", v)} unlocked={unlocked} coins={coins} onBuy={buyItem} />
              </>
            )}
            {customTab === "venue" && (
              <>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "'Baloo 2', cursive", fontWeight: 700, textAlign: "center" }}>VENUE TYPE</div>
                <StyleRow options={VENUES} selected={arenaCfg.venue} onSelect={(v) => updateArena("venue", v)} cfg={arenaCfg} unlocked={unlocked} coins={coins} onBuy={buyItem} />
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "'Baloo 2', cursive", fontWeight: 700, textAlign: "center", marginTop: 4 }}>CROWD</div>
                <StyleRow options={CROWD_LEVELS} selected={arenaCfg.crowd} onSelect={(v) => updateArena("crowd", v)} cfg={arenaCfg} unlocked={unlocked} coins={coins} onBuy={buyItem} />
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "'Baloo 2', cursive", fontWeight: 700, textAlign: "center", marginTop: 4 }}>FLOOR COLOR</div>
                <ColorRow options={FLOOR_COLORS} selected={arenaCfg.floorColor} onSelect={(v) => updateArena("floorColor", v)} unlocked={unlocked} coins={coins} onBuy={buyItem} />
              </>
            )}
            {customTab === "tramp" && (
              <>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "'Baloo 2', cursive", fontWeight: 700, textAlign: "center" }}>BERG TRAMPOLINE</div>
                <StyleRow options={TRAMP_TYPES} selected={arenaCfg.trampType} onSelect={(v) => updateArena("trampType", v)} cfg={arenaCfg} unlocked={unlocked} coins={coins} onBuy={buyItem} />
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "'Baloo 2', cursive", fontWeight: 700, textAlign: "center", marginTop: 8 }}>TRAMPOLINE COLOR</div>
                <ColorRow options={TRAMP_COLORS} selected={arenaCfg.trampColor} onSelect={(v) => updateArena("trampColor", v)} unlocked={unlocked} coins={coins} onBuy={buyItem} />
                <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
                  <TrampolineDisplay type={arenaCfg.trampType} color={arenaCfg.trampColor} width={160} />
                </div>
              </>
            )}
            {customTab === "decor" && (
              <>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "'Baloo 2', cursive", fontWeight: 700, textAlign: "center" }}>BANNERS</div>
                <ColorRow options={BANNER_COLORS} selected={arenaCfg.bannerColor} onSelect={(v) => updateArena("bannerColor", v)} unlocked={unlocked} coins={coins} onBuy={buyItem} />
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "'Baloo 2', cursive", fontWeight: 700, textAlign: "center", marginTop: 4 }}>EXTRAS</div>
                <StyleRow options={ARENA_EXTRAS} selected={arenaCfg.extra} onSelect={(v) => updateArena("extra", v)} cfg={arenaCfg} unlocked={unlocked} coins={coins} onBuy={buyItem} />
              </>
            )}
          </div>

          <div style={{ padding: "8px 16px 16px", flexShrink: 0, textAlign: "center", display: "flex", justifyContent: "center", gap: 10, alignItems: "center" }}>
            <button onClick={() => {
              setCharCfg({ ...DEFAULT_CHAR });
              setArenaCfg({ ...DEFAULT_ARENA });
            }} style={{
              background: "rgba(255,255,255,0.1)", border: "2px solid rgba(255,255,255,0.2)", borderRadius: 50,
              padding: "10px 18px", fontSize: "clamp(12px, 3vw, 15px)", fontFamily: "'Baloo 2', cursive",
              color: "rgba(255,255,255,0.7)", cursor: "pointer", fontWeight: 700,
            }}>Reset 🔄</button>
            <button onClick={() => setScreen("menu")} style={{
              background: "linear-gradient(135deg, #16a34a, #4ade80)", border: "none", borderRadius: 50,
              padding: "12px 36px", fontSize: "clamp(16px, 4vw, 22px)", fontFamily: "'Lilita One', cursive",
              color: "#fff", cursor: "pointer", boxShadow: "0 4px 16px rgba(22,163,74,0.4)",
            }}>Done! ✅</button>
          </div>
        </div>
      )}

      {/* ═══ PLAYING ═══ */}
      {screen === "playing" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
          <ArenaBackground arena={arenaCfg} />
          <div style={{ padding: "4px 14px 2px", flexShrink: 0, position: "relative", zIndex: 2, background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 80%, transparent 100%)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "clamp(10px, 2.5vw, 13px)", fontFamily: "'Baloo 2', cursive", fontWeight: 700 }}>Lv.{lv.level} {lv.title}</div>
              <div style={{ color: "#fbbf24", fontSize: "clamp(14px, 3.5vw, 18px)", fontWeight: 800 }}>{score} pts</div>
            </div>
            <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 10, height: "clamp(8px, 2vw, 12px)", overflow: "hidden", position: "relative" }}>
              <div style={{
                height: "100%", borderRadius: 10, width: `${tp}%`,
                background: danger ? "linear-gradient(90deg, #ef4444, #f97316)" : "linear-gradient(90deg, #22c55e, #86efac)",
                transition: "width 1s linear", animation: danger ? "pulse 0.5s infinite" : "none",
              }} />
              <div style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", color: "#fff", fontSize: "clamp(7px, 1.8vw, 10px)", fontWeight: 800, fontFamily: "'Baloo 2', cursive", textShadow: "1px 1px 0 rgba(0,0,0,0.5)" }}>{timeLeft}s</div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "clamp(2px, 0.6vw, 4px)", marginTop: 3 }}>
              {Array.from({ length: tricksTotal }).map((_, i) => {
                const done = i < (tricksTotal - tricksLeft); const cur = i === (tricksTotal - tricksLeft);
                return (<div key={i} style={{ width: "clamp(8px, 2vw, 12px)", height: "clamp(8px, 2vw, 12px)", borderRadius: "50%", background: done ? "#22c55e" : cur ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)", border: cur ? "2px solid #fbbf24" : "2px solid transparent", boxShadow: done ? "0 0 4px rgba(34,197,94,0.5)" : "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "clamp(5px, 1.2vw, 7px)", color: "#fff", fontWeight: 800 }}>{done && "✓"}</div>);
              })}
            </div>
          </div>

          {trick && (
            <div style={{ padding: "2px 10px", textAlign: "center", flexShrink: 0, position: "relative", zIndex: 2 }}>
              <div style={{ background: "rgba(0,0,0,0.25)", borderRadius: 12, padding: "5px 10px", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ color: "#fbbf24", fontSize: "clamp(12px, 3vw, 14px)", fontFamily: "'Baloo 2', cursive", fontWeight: 700, marginBottom: 3 }}>
                  Perform: <span style={{ color: "#fff", fontSize: "clamp(14px, 3.5vw, 17px)" }}>{trick.emoji} {trick.name}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: "clamp(3px, 1vw, 8px)", alignItems: "center" }}>
                  {trick.moves.map((mid, i) => {
                    const m = getMove(mid); const done = i < progress.length; const act = i === progress.length;
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "clamp(2px, 0.5vw, 4px)" }}>
                        <div style={{
                          width: "clamp(30px, 7.5vw, 40px)", height: "clamp(30px, 7.5vw, 40px)", borderRadius: 10,
                          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                          background: done ? m.color : act ? `${m.color}30` : "rgba(255,255,255,0.05)",
                          border: act ? `2px solid ${m.color}` : done ? `2px solid ${m.color}` : "2px solid rgba(255,255,255,0.1)",
                          boxShadow: done ? `0 0 8px ${m.color}60` : "none", position: "relative",
                          animation: act ? "seqP 1.2s ease-in-out infinite" : "none",
                        }}>
                          <span style={{ fontSize: "clamp(12px, 3vw, 15px)" }}>{m.emoji}</span>
                          <span style={{ fontSize: "clamp(6px, 1.4vw, 8px)", color: "#fff", fontWeight: 700, fontFamily: "'Baloo 2', cursive" }}>{m.label}</span>
                          {done && <div style={{ position: "absolute", top: -3, right: -3, width: 12, height: 12, borderRadius: "50%", background: "#22c55e", color: "#fff", fontSize: 7, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>✓</div>}
                        </div>
                        {i < trick.moves.length - 1 && <span style={{ color: done ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)", fontSize: "clamp(10px, 2.5vw, 14px)", fontWeight: 800 }}>›</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", minHeight: 0, zIndex: 2, maxHeight: "35vh" }}>
            {feedback && (
              <div style={{
                position: "absolute", top: "6%", left: "50%", transform: "translateX(-50%)",
                animation: "popIn 0.25s ease-out", zIndex: 15,
                background: feedback.ok ? "linear-gradient(135deg, #22c55e, #16a34a)" : "linear-gradient(135deg, #ef4444, #b91c1c)",
                borderRadius: 14, padding: "7px 20px", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.35)", whiteSpace: "nowrap",
              }}>
                <div style={{ color: "#fff", fontSize: "clamp(16px, 4.5vw, 22px)", fontWeight: 800 }}>{feedback.text}</div>
                <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "clamp(11px, 2.8vw, 14px)", fontFamily: "'Baloo 2', cursive" }}>{feedback.sub}</div>
              </div>
            )}
            {tutorial === 0 && (
              <div style={{
                background: "rgba(0,0,0,0.75)", borderRadius: 10, padding: "6px 14px", color: "#fff",
                fontSize: "clamp(11px, 2.8vw, 14px)", textAlign: "center", fontFamily: "'Baloo 2', cursive",
                fontWeight: 600, maxWidth: "90%", border: "1px solid rgba(251,191,36,0.3)",
              }}>👇 Tap the <b style={{ color: "#fbbf24" }}>glowing button</b> below!</div>
            )}

            <div style={{ transform: `translateY(${charY}px)`, transition: "transform 0.2s ease-out" }}>
              <ChildChar cfg={charCfg} pose={charPose} bounce={charPose === "idle" && !locked} scale={0.6} />
            </div>

            <div style={{ marginTop: 2, position: "relative" }}>
              <TrampolineDisplay type={arenaCfg.trampType} color={arenaCfg.trampColor} stretch={tramStretch} width={Math.min(window.innerWidth * 0.3, 130)} />
            </div>
          </div>

          <div style={{ padding: "4px 6px 6px", flexShrink: 0, position: "relative", zIndex: 2, background: "linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 0 }}>
              {MOVES.map((move, mi) => {
                const inT = trick && trick.moves.includes(move.id);
                const isNext = trick && progress.length < trick.moves.length && trick.moves[progress.length] === move.id;
                const isFirst = mi === 0;
                const isLast = mi === MOVES.length - 1;
                return (
                  <button key={move.id} onClick={() => inT && handleMove(move.id)} disabled={!inT || locked}
                    style={{
                      width: "clamp(52px, 15.5vw, 68px)", height: "clamp(54px, 14vw, 68px)",
                      borderRadius: isFirst ? "14px 4px 4px 14px" : isLast ? "4px 14px 14px 4px" : 4,
                      background: `linear-gradient(160deg, ${move.color}${isNext ? "ee" : inT ? "cc" : "55"}, ${move.color}${isNext ? "bb" : inT ? "88" : "33"})`,
                      border: isNext ? "3px solid #fff" : "none",
                      borderRight: !isLast && !isNext ? "1px solid rgba(255,255,255,0.1)" : undefined,
                      color: "#fff", cursor: inT && !locked ? "pointer" : "default",
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3,
                      boxShadow: isNext ? `0 0 20px ${move.color}70` : "0 3px 8px rgba(0,0,0,0.2)",
                      opacity: 1,
                      animation: isNext ? "btnG 0.8s ease-in-out infinite" : "none", transition: "background 0.15s, box-shadow 0.15s",
                      position: "relative", overflow: "hidden",
                    }}>
                    {isNext && <div style={{ position: "absolute", top: 0, left: "-100%", width: "200%", height: "100%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)", animation: "shine 1.5s ease-in-out infinite" }} />}
                    <span style={{ fontSize: "clamp(22px, 5.5vw, 30px)", position: "relative" }}>{move.emoji}</span>
                    <span style={{ fontSize: "clamp(10px, 2.5vw, 13px)", fontWeight: 800, fontFamily: "'Baloo 2', cursive", position: "relative", textShadow: "1px 1px 0 rgba(0,0,0,0.3)" }}>{move.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ═══ RESULT ═══ */}
      {screen === "result" && (
        <div style={{
          flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: 24,
          background: won ? `linear-gradient(170deg, ${bg[0]} 0%, ${bg[1]} 100%)` : "linear-gradient(170deg, #1e1e2e 0%, #7f1d1d 50%, #ef4444 100%)",
        }}>
          <Confetti active={won} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ animation: won ? "bob 1.2s ease-in-out infinite" : "none" }}>
              <ChildChar cfg={charCfg} pose={won ? "celebrate" : "idle"} scale={0.9} />
            </div>
            <div style={{ marginTop: -4, transform: "scale(0.65)" }}>
              <TrampolineDisplay type={arenaCfg.trampType} color={arenaCfg.trampColor} width={140} />
            </div>
          </div>
          <h2 style={{ fontSize: "clamp(24px, 6.5vw, 36px)", color: "#fff", margin: 0, textShadow: "2px 2px 0 rgba(0,0,0,0.3)", textAlign: "center" }}>
            {won ? "Level Complete!" : "Time's Up!"}
          </h2>
          {won && <div style={{ fontSize: "clamp(26px, 7vw, 38px)", letterSpacing: 6 }}>{"⭐".repeat(lvStars[lvIdx])}{"☆".repeat(3 - lvStars[lvIdx])}</div>}
          <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "clamp(14px, 3.5vw, 17px)", textAlign: "center", lineHeight: 1.8, fontFamily: "'Baloo 2', cursive" }}>
            <div>Score: <b style={{ color: "#fbbf24" }}>{score} pts</b></div>
            <div>Tricks: <b>{tricksTotal - tricksLeft}</b> / {tricksTotal}</div>
            {won && timeRef.current > 0 && <div>Time left: <b>{timeRef.current}s</b></div>}
            {won && <div style={{ color: "#fbbf24", marginTop: 4, fontSize: "clamp(16px, 4vw, 20px)" }}>
              🪙 <b>+{lvStars[lvIdx] * 10 + (lvIdx + 1) * 5} coins earned!</b>
            </div>}
            {!won && <div style={{ color: "#fca5a5", marginTop: 4 }}>💡 Tap the glowing buttons faster!</div>}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 4, flexWrap: "wrap", justifyContent: "center" }}>
            {!won && <button onClick={() => startLevel(lvIdx)} style={{ background: "linear-gradient(135deg, #f97316, #ef4444)", border: "none", borderRadius: 50, padding: "10px 26px", fontSize: "clamp(15px, 3.8vw, 19px)", fontFamily: "'Lilita One', cursive", color: "#fff", cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>Retry 🔄</button>}
            {won && lvIdx < 19 && <button onClick={() => startLevel(lvIdx + 1)} style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", border: "none", borderRadius: 50, padding: "10px 26px", fontSize: "clamp(15px, 3.8vw, 19px)", fontFamily: "'Lilita One', cursive", color: "#fff", cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>Next Level ➡️</button>}
            {won && lvIdx === 19 && <div style={{ color: "#fbbf24", fontSize: "clamp(17px, 4.5vw, 24px)", fontWeight: 800 }}>🏆 ALL LEVELS COMPLETE! 🏆</div>}
            <button onClick={() => setScreen("menu")} style={{ background: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.25)", borderRadius: 50, padding: "10px 22px", fontSize: "clamp(12px, 3vw, 15px)", fontFamily: "'Lilita One', cursive", color: "#fff", cursor: "pointer" }}>Menu 🏠</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes cFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes popIn{0%{transform:translateX(-50%) scale(0.6);opacity:0}100%{transform:translateX(-50%) scale(1);opacity:1}}
        @keyframes seqP{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.85;transform:scale(1.06)}}
        @keyframes btnG{0%,100%{box-shadow:0 0 10px rgba(255,255,255,0.3)}50%{box-shadow:0 0 24px rgba(255,255,255,0.6)}}
        @keyframes shine{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.7}}
        @keyframes confFall{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
        @keyframes spotSway1{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
        @keyframes spotSway2{0%,100%{transform:rotate(3deg)}50%{transform:rotate(-3deg)}}
        @keyframes flagWave{0%,100%{transform:translateY(0) rotate(-5deg)}50%{transform:translateY(-3px) rotate(5deg)}}
        @keyframes coinPop{0%{opacity:0;transform:translate(-50%,-50%) scale(0.5)}15%{opacity:1;transform:translate(-50%,-50%) scale(1.1)}30%{transform:translate(-50%,-50%) scale(1)}80%{opacity:1;transform:translate(-50%,-70%) scale(1)}100%{opacity:0;transform:translate(-50%,-90%) scale(0.8)}}
      `}</style>
    </div>
  );
}
