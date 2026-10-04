// Time-of-day model for the paper scene: warm afternoon to forest-green night.

const START_MIN = 16 * 60; // 16:00
const SPAN_MIN = 4 * 60; // → 20:00

const DUSK: Record<string, string> = {
  "--sky-top": "#e9f0e4", "--sky-mid": "#dce9df", "--sky-bot": "#f8edca",
  "--sun": "#e8bd74", "--moon": "#f2e8ca",
  "--l-far": "#b7d1b0", "--l-mid": "#9bbc83", "--l-hills": "#85a98a", "--l-trees": "#679779",
  "--l-near": "#4f8067", "--l-front": "#31634d", "--l-ground": "#1c4d3e",
  "--cloud": "#fbf5e8",
};

const NIGHT: Record<string, string> = {
  "--sky-top": "#193e36", "--sky-mid": "#2b6055", "--sky-bot": "#6e9c7f",
  "--sun": "#d99d6d", "--moon": "#f2e8ca",
  "--l-far": "#557967", "--l-mid": "#3d6d5f", "--l-hills": "#2f5b53", "--l-trees": "#245044",
  "--l-near": "#1b413a", "--l-front": "#12362f", "--l-ground": "#0d2b27",
  "--cloud": "#b5d2bd",
};

// The paper sheet (terminal window) dims slightly as night falls.
const PAPER_DUSK = { paper: "#f7f2e6", ink: "#193e36" };
const PAPER_NIGHT = { paper: "#e9ead9", ink: "#193e36" };

function hexToRgb(h: string): [number, number, number] {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mix(a: string, b: string, t: number): string {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(",")})`;
}

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** Write all interpolated variables. `scene` gets the landscape palette,
 *  `root` gets the paper sheet colors (read by theme.css). */
export function applyTimeOfDay(t: number, scene: HTMLElement, root: HTMLElement) {
  const k = smooth(clamp01(t));
  for (const key in DUSK) scene.style.setProperty(key, mix(DUSK[key], NIGHT[key], k));

  // stars fade in through twilight; sun sinks; moon rises
  scene.style.setProperty("--stars", clamp01((t - 0.35) / 0.5).toFixed(3));
  scene.style.setProperty("--sun-y", smooth(Math.min(1, t * 1.25)).toFixed(3));
  scene.style.setProperty("--moon-y", (1 - smooth(clamp01((t - 0.3) / 0.7))).toFixed(3));

  // cabin window warms up as it gets dark
  const glow = 0.15 + k * 0.85;
  scene.style.setProperty("--window", `rgba(240,${Math.round(198 - k * 25)},${Math.round(124 - k * 20)},${glow.toFixed(2)})`);

  root.style.setProperty("--paper", mix(PAPER_DUSK.paper, PAPER_NIGHT.paper, k));
  root.style.setProperty("--paper-ink", mix(PAPER_DUSK.ink, PAPER_NIGHT.ink, k));
}

/** Remove the inline paper variables when leaving paper mode. */
export function clearTimeOfDay(root: HTMLElement) {
  root.style.removeProperty("--paper");
  root.style.removeProperty("--paper-ink");
}

/** t → "hh:mm" clock label. */
export function formatClock(t: number): string {
  const minutes = START_MIN + Math.round(clamp01(t) * SPAN_MIN);
  const hh = String(Math.floor(minutes / 60) % 24).padStart(2, "0");
  const mm = String(minutes % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

/** "hh:mm" | "dusk" | "night" → t, or null if it can't be parsed. */
export function parseClock(value: string): number | null {
  const v = value.trim().toLowerCase();
  if (v === "dusk" || v === "sunset") return 0;
  if (v === "night" || v === "midnight") return 1;
  const m = /^(\d{1,2}):(\d{2})$/.exec(v);
  if (!m) return null;
  const minutes = Number(m[1]) * 60 + Number(m[2]);
  if (Number.isNaN(minutes)) return null;
  return clamp01((minutes - START_MIN) / SPAN_MIN);
}
