"use client";
import { useEffect, useState } from "react";

// ASCII banner shown on boot. Two layouts: one line on desktop, stacked on mobile.
const DESKTOP = [
  "    _    _  __               _         ____              _ _ _       ",
  "   / \\  | |/ _|_ __ ___  __| | ___   | __ )  ___  _ __ (_) | | __ _ ",
  "  / _ \\ | | |_| '__/ _ \\/ _` |/ _ \\  |  _ \\ / _ \\| '_ \\| | | |/ _` |",
  " / ___ \\| |  _| | |  __/ (_| | (_) | | |_) | (_) | | | | | | | (_| |",
  "/_/   \\_\\_|_| |_|  \\___|\\__,_|\\___/  |____/ \\___/|_| |_|_|_|_|\\__,_|",
  "",
  "   ─── founder @ indie mind · software engineer · costa rica ───",
];

const MOBILE = [
  "    _    _  __               _       ",
  "   / \\  | |/ _|_ __ ___  __| | ___  ",
  "  / _ \\ | | |_| '__/ _ \\/ _` |/ _ \\ ",
  " / ___ \\| |  _| | |  __/ (_| | (_) |",
  "/_/   \\_\\_|_| |_|  \\___|\\__,_|\\___/ ",
  " ____              _ _ _             ",
  "| __ )  ___  _ __ (_) | | __ _      ",
  "|  _ \\ / _ \\| '_ \\| | | |/ _` |     ",
  "| |_) | (_) | | | | | | | (_| |     ",
  "|____/ \\___/|_| |_|_|_|_|\\__,_|     ",
  "",
  " ─ founder @ indie mind · costa rica ─",
];

const CHUNK = 4; // characters revealed per tick
const TICK_MS = 4;

export function Banner({ onDone }: { onDone: () => void }) {
  const [rows, setRows] = useState<string[]>([]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const src = window.innerWidth < 640 ? MOBILE : DESKTOP;

    if (reduce) {
      setRows(src);
      onDone();
      return;
    }

    // Reveal row by row, a few characters at a time (a cheap "typing" effect).
    let row = 0;
    let col = 0;
    let cancelled = false;
    const step = () => {
      if (cancelled) return;
      if (row >= src.length) {
        onDone();
        return;
      }
      col += CHUNK;
      const r = row; // capture: the updater runs later, after `row` may have moved on
      const current = src[r].slice(0, col);
      setRows((prev) => {
        const next = prev.slice(0, r);
        next[r] = current;
        return next;
      });
      if (col >= src[row].length) {
        row++;
        col = 0;
      }
      setTimeout(step, TICK_MS);
    };
    step();
    return () => {
      cancelled = true;
    };
    // onDone is stable (memoized by the parent); run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="banner" aria-label="Alfredo Bonilla">
      {rows.map((r, i) => (
        <div key={i}>{r || " "}</div>
      ))}
    </div>
  );
}
