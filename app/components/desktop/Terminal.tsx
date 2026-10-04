"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Theme } from "../../lib/theme";
import { useTerminal } from "./useTerminal";
import { Banner } from "./Banner";
import { Prompt } from "./Prompt";
import { MatrixCanvas } from "./MatrixCanvas";

type Props = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  setTime: (t: number) => void;
  navigate: (href: string) => void;
};

/** The interactive part of the window: output, prompt, keyboard handling. */
export function Terminal({ theme, setTheme, setTime, navigate }: Props) {
  const [value, setValue] = useState("");
  const [booted, setBooted] = useState(false);
  const [focused, setFocused] = useState(false);
  const [matrix, setMatrix] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bootedOnce = useRef(false);

  const runMatrix = useCallback(() => setMatrix(true), []);
  const term = useTerminal({ theme, setTheme, setTime, runMatrix, navigate });
  const { lines, print, clear, run, echo, historyStep, complete } = term;

  const focus = useCallback(() => inputRef.current?.focus({ preventScroll: true }), []);

  // Boot sequence: banner types itself, then the login lines appear.
  const onBannerDone = useCallback(() => {
    print(<span className="c-cm">Last login: {new Date().toDateString()} on ttys001</span>);
    print(
      <span>
        Welcome to Alfredo Bonilla&apos;s portfolio shell <span className="c-cm">v2.0.0</span>. Type{" "}
        <span className="c-acc">help</span> to get started, or press <span className="c-acc">Tab</span> to complete.
      </span>,
    );
    print(
      <span className="c-cm">
        Not a terminal person? Type <span className="c-acc">gui</span> or use the button top-right.
      </span>,
    );
    print(" ");
    setBooted(true);
  }, [print]);

  useEffect(() => {
    if (bootedOnce.current) return; // guards React strict-mode double effects
    bootedOnce.current = true;
    print(<Banner onDone={onBannerDone} />);
  }, [print, onBannerDone]);

  useEffect(() => {
    if (booted) focus();
  }, [booted, focus]);

  // Keep the newest output in view.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, value]);

  const onMatrixDone = useCallback(() => {
    setMatrix(false);
    print(
      <span>
        <span className="c-gr">Wake up, guest…</span> <span className="c-cm">The shell has you. Follow the white rabbit — or just type</span>{" "}
        projects<span className="c-cm">.</span>
      </span>,
    );
    setTimeout(focus, 0);
  }, [print, focus]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!booted || matrix) {
      e.preventDefault();
      return;
    }
    switch (e.key) {
      case "Enter":
        run(value);
        setValue("");
        break;
      case "ArrowUp":
        e.preventDefault();
        setValue(historyStep(-1, value));
        break;
      case "ArrowDown":
        e.preventDefault();
        setValue(historyStep(1, value));
        break;
      case "Tab":
        e.preventDefault();
        setValue(complete(value));
        break;
      case "l":
        if (e.ctrlKey) {
          e.preventDefault();
          clear();
        }
        break;
      case "c":
        if (e.ctrlKey) {
          e.preventDefault();
          echo(`${value}^C`);
          setValue("");
        }
        break;
    }
  };

  return (
    <div
      className={`term${focused ? " focus" : ""}`}
      onClick={() => {
        // don't steal focus while the visitor is selecting text
        if (!window.getSelection()?.toString()) focus();
      }}
    >
      <div className="scroll" ref={scrollRef} aria-live="polite">
        {lines.map((l) => (
          <div key={l.id} className="line">
            {l.node}
          </div>
        ))}
        <div className="in">
          <Prompt />
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            type="text"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label="Terminal command input"
            disabled={!booted}
          />
          <span className="cursor" aria-hidden="true" />
        </div>
      </div>
      {matrix && <MatrixCanvas onDone={onMatrixDone} />}
      <div className="tap">
        Tap to type · try <b>help</b>
      </div>
    </div>
  );
}
