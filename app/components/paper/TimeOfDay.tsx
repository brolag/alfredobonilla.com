"use client";
import { formatClock } from "../../lib/timeOfDay";

// Dusk → night slider. Lives in the window bar; only visible in paper mode (CSS).
export function TimeOfDay({ value, onChange }: { value: number; onChange: (t: number) => void }) {
  return (
    <div className="tod">
      <output htmlFor="tod" aria-live="off">
        {formatClock(value)}
      </output>
      <input
        id="tod"
        type="range"
        min={0}
        max={1000}
        step={1}
        value={Math.round(value * 1000)}
        onChange={(e) => onChange(Number(e.target.value) / 1000)}
        aria-label="Time of day, from golden dusk to blue night"
      />
    </div>
  );
}
