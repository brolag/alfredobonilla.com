"use client";
import { useCallback, useRef, useState, type ReactNode } from "react";
import { commands, resolve, COMMAND_NAMES, THEME_NAMES, type CommandContext } from "../../lib/commands";
import { Prompt } from "./Prompt";

export type Line = { id: number; node: ReactNode };

type Env = Pick<CommandContext, "theme" | "setTheme" | "setTime" | "runMatrix" | "navigate">;

/**
 * Terminal state machine: output lines, history, tab completion and dispatch.
 * `env` is read through a ref so commands always see the latest theme/setters.
 */
export function useTerminal(env: Env) {
  const [lines, setLines] = useState<Line[]>([]);
  const nextId = useRef(0);
  const history = useRef<string[]>([]);
  const hIdx = useRef(0);
  const envRef = useRef(env);
  envRef.current = env;

  const print = useCallback((node: ReactNode) => {
    setLines((prev) => [...prev, { id: nextId.current++, node }]);
  }, []);

  const clear = useCallback(() => setLines([]), []);

  // Echo the typed command with the prompt, like a real shell.
  const echo = useCallback(
    (raw: string) =>
      print(
        <span>
          <Prompt /> {raw}
        </span>,
      ),
    [print],
  );

  const run = useCallback(
    (raw: string) => {
      echo(raw);
      const line = raw.trim();
      if (!line) return;
      history.current.push(line);
      hIdx.current = history.current.length;

      const [name, args] = resolve(line);
      const cmd = commands[name];
      const ctx: CommandContext = { ...envRef.current, print, clear, history: history.current };
      if (cmd) {
        cmd.run(args, ctx);
      } else {
        print(
          <span>
            zsh: command not found: <span className="c-err">{name}</span> <span className="c-cm">— try</span> help
          </span>,
        );
      }
    },
    [echo, print, clear],
  );

  /** ↑ / ↓ through history. Returns the value to put in the input. */
  const historyStep = useCallback((dir: -1 | 1, current: string): string => {
    const h = history.current;
    if (dir === -1 && hIdx.current > 0) hIdx.current--;
    else if (dir === 1 && hIdx.current < h.length) hIdx.current++;
    else return current;
    return h[hIdx.current] ?? "";
  }, []);

  /** Tab completion for command names and theme names. */
  const complete = useCallback(
    (value: string): string => {
      const parts = value.split(/\s+/);
      const pool = parts.length === 1 ? COMMAND_NAMES : parts[0] === "theme" ? THEME_NAMES : [];
      const prefix = (parts[parts.length - 1] ?? "").toLowerCase();
      const matches = pool.filter((n) => n.startsWith(prefix));
      if (matches.length === 1) return [...parts.slice(0, -1), matches[0]].join(" ") + (parts.length === 1 ? " " : "");
      if (matches.length > 1) {
        echo(value);
        print(
          <span>
            {matches.map((m) => (
              <span key={m} className="c-acc" style={{ marginRight: "3ch" }}>
                {m}
              </span>
            ))}
          </span>,
        );
      }
      return value;
    },
    [echo, print],
  );

  return { lines, print, clear, run, echo, historyStep, complete };
}
