"use client";
import type { Theme } from "../../lib/theme";
import { Terminal } from "./Terminal";
import { TimeOfDay } from "../paper/TimeOfDay";

type Props = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  time: number;
  setTime: (t: number) => void;
  navigate: (href: string) => void;
};

/** macOS-style window chrome around the terminal. */
export function TerminalWindow({ theme, setTheme, time, setTime, navigate }: Props) {
  return (
    <section className="win" aria-label="Terminal window">
      <div className="bar">
        <div className="lights" aria-hidden="true">
          <span className="light-r" />
          <span className="light-y" />
          <span className="light-g" />
        </div>
        <div className="tabs">
          <div className="tab">
            <i />
            brolag@portfolio — zsh
          </div>
        </div>
        <div className="bar-right">
          <TimeOfDay value={time} onChange={setTime} />
          <span className="hint-long">
            type <kbd>help</kbd> · <kbd>Tab</kbd> to complete
          </span>
        </div>
      </div>
      <Terminal theme={theme} setTheme={setTheme} setTime={setTime} navigate={navigate} />
    </section>
  );
}
