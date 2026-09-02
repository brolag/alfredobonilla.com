// Time-of-day model for the paper scene: t = 0 is golden dusk (18:40),
// t = 1 is blue night (23:59). Palettes are interpolated per CSS variable.

const START_MIN = 18 * 60 + 40; // 18:40
const SPAN_MIN = 5 * 60 + 19; // → 23:59

const DUSK: Record<string, string> = {
  "--sky-top": "#3b2a5c", "--sky-mid": "#c9698a", "--sky-bot": "#f7b26a",
  "--sun": "#ffd28a", "--moon": "#f4f1e6",
  "--l-far": "#8b6a9c", "--l-mid": "#6a4f83", "--l-hills": "#4f3a6b", "--l-trees": "#3a2a54",
  "--l-near": "#2b1f44", "--l-front": "#1c1533", "--l-ground": "#130f26",
  "--cloud": "#f7d5c4",
};

const NIGHT: Record<string, string> = {
  "--sky-top": "#050a1e", "--sky-mid": "#0f1c44", "--sky-bot": "#24356a",
  "--sun": "#ff9a5a", "--moon": "#f4f1e6",
  "--l-far": "#2b3a6b", "--l-mid": "#1f2c55", "--l-hills": "#182243", "--l-trees": "#111935",
  "--l-near": "#0c122a", "--l-front": "#080c1f", "--l-ground": "#050815",
  "--cloud": "#3a4a7a",
};

// The paper sheet (terminal window) dims slightly as night falls.
const PAPER_DUSK = { paper: "#f6ead6", ink: "#3b2a2a" };
const PAPER_NIGHT = { paper: "#e9e2d2", ink: "#1f1d2e" };

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
  scene.style.setProperty("--window", `rgba(255,${Math.round(200 - k * 40)},${Math.round(110 - k * 40)},${glow.toFixed(2)})`);

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
