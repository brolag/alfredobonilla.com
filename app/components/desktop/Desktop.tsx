"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { applyTheme, loadTheme, DEFAULT_THEME, type Theme } from "../../lib/theme";
import { clearTimeOfDay } from "../../lib/timeOfDay";
import { TerminalWindow } from "./TerminalWindow";
import { PaperScene } from "../paper/PaperScene";

/**
 * The "desktop": wallpaper + drifting blobs + the terminal window.
 * Owns theme and time-of-day state; in paper mode the wallpaper is replaced
 * by the paper-cut scene.
 */
export default function Desktop() {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);
  const [time, setTime] = useState(0);
  const router = useRouter();

  // Restore the persisted theme (never `paper`, see lib/theme.ts).
  useEffect(() => {
    const saved = loadTheme();
    setThemeState(saved);
    applyTheme(saved);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    applyTheme(t);
    if (t !== "paper") {
      setTime(0);
      clearTimeOfDay(document.documentElement);
    }
  }, []);

  const navigate = useCallback((href: string) => router.push(href), [router]);

  return (
    <main className="desktop">
      <div className="blob blob-a" aria-hidden="true" />
      <div className="blob blob-b" aria-hidden="true" />
      {theme === "paper" && <PaperScene time={time} />}
      <TerminalWindow theme={theme} setTheme={setTheme} time={time} setTime={setTime} navigate={navigate} />
    </main>
  );
}
