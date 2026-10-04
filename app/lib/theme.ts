// Theme registry. Themes are plain CSS variable sets in styles/theme.css,
// switched via `data-theme` on <html>.

export const THEMES = ["dracula", "nord", "solarized", "paper"] as const;
export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = "dracula";
const STORAGE_KEY = "brolag.theme";

export function isTheme(value: string): value is Theme {
  return (THEMES as readonly string[]).includes(value);
}

/** Apply a theme to the document. `paper` is the easter egg and is never persisted,
 *  so every fresh visit starts in the terminal and the surprise stays intact. */
export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  if (theme === DEFAULT_THEME) {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
  try {
    if (theme === "paper") return;
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* storage unavailable (private mode, etc.) — ignore */
  }
}

/** Read the persisted theme, falling back to the default. */
export function loadTheme(): Theme {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && isTheme(saved) && saved !== "paper") return saved;
  } catch {
    /* ignore */
  }
  return DEFAULT_THEME;
}
