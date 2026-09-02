import type { ReactNode } from "react";
import { THEMES, isTheme, type Theme } from "./theme";
import { Help } from "../components/desktop/output/Help";
import { About, Readme } from "../components/desktop/output/About";
import { Skills } from "../components/desktop/output/Skills";
import { Projects, Services } from "../components/desktop/output/Cards";
import { Contact } from "../components/desktop/output/Contact";
import { ThemeList } from "../components/desktop/output/ThemeList";
import { parseClock } from "./timeOfDay";

/** What a command can do to the terminal / desktop. */
export type CommandContext = {
  print: (node: ReactNode) => void;
  clear: () => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  setTime: (t: number) => void; // paper mode, 0 = dusk .. 1 = night
  history: string[];
  runMatrix: () => void;
  navigate: (href: string) => void;
};

export type Command = {
  desc: string;
  hidden?: boolean; // not listed by `help`
  run: (args: string[], ctx: CommandContext) => void;
};

/** Multi-word phrases mapped to a real command. */
const ALIASES: Record<string, string> = {
  "pura vida": "theme paper",
  "cat readme.md": "readme",
  "cat .secrets": "secrets",
  "ls -a": "ls -a",
  "sudo hire brolag": "hire",
  "sudo hire alfredo": "hire",
};

const Cm = ({ children }: { children: ReactNode }) => <span className="c-cm">{children}</span>;
const Acc = ({ children }: { children: ReactNode }) => <span className="c-acc">{children}</span>;

export const commands: Record<string, Command> = {
  help: {
    desc: "list commands",
    run: (_a, ctx) => {
      const entries = Object.entries(commands)
        .filter(([, c]) => !c.hidden)
        .map(([name, c]) => ({ name, desc: c.desc }));
      ctx.print(<Help entries={entries} />);
    },
  },
  about: { desc: "who is behind this terminal", run: (_a, ctx) => ctx.print(<About />) },
  skills: { desc: "what I use daily, as bars", run: (_a, ctx) => ctx.print(<Skills />) },
  projects: { desc: "selected work, rendered as cards", run: (_a, ctx) => ctx.print(<Projects />) },
  services: { desc: "ways we can work together", run: (_a, ctx) => ctx.print(<Services />) },
  contact: { desc: "ways to reach me", run: (_a, ctx) => ctx.print(<Contact />) },
  theme: {
    desc: "theme <dracula|nord|solarized>",
    run: ([name], ctx) => {
      const t = (name ?? "").toLowerCase();
      if (!isTheme(t)) return ctx.print(<ThemeList />);
      if (t === ctx.theme) return ctx.print(<Cm>already on {t}.</Cm>);
      ctx.setTheme(t);
      if (t === "paper") {
        ctx.print(
          <span>
            <span className="c-gr">pura vida.</span> <Cm>Unplugged. Move the pointer to look around, drag the sun to set it, or type</Cm>{" "}
            <Acc>time 22:00</Acc>. <Cm>Type</Cm> <Acc>exit</Acc> <Cm>to plug back in.</Cm>
          </span>,
        );
      } else {
        ctx.print(
          <span>
            Theme set to <Acc>{t}</Acc>.
          </span>,
        );
      }
    },
  },
  time: {
    desc: "time <hh:mm> — only in paper mode",
    hidden: true,
    run: ([value], ctx) => {
      if (ctx.theme !== "paper") return ctx.print(<Cm>time only works on paper. Have you tried going outside?</Cm>);
      const t = parseClock(value ?? "");
      if (t === null) return ctx.print(<Cm>usage: time &lt;18:40 … 23:59&gt; | dusk | night</Cm>);
      ctx.setTime(t);
    },
  },
  exit: {
    desc: "leave paper mode",
    hidden: true,
    run: (_a, ctx) => {
      if (ctx.theme === "paper") {
        ctx.setTheme("dracula");
        ctx.print(<Cm>Back to the machine. It missed you.</Cm>);
      } else {
        ctx.print(<Cm>This shell has no exit. Only other places to be.</Cm>);
      }
    },
  },
  clear: { desc: "wipe the screen", run: (_a, ctx) => ctx.clear() },
  history: {
    desc: "what you have typed (↑/↓ to navigate)",
    run: (_a, ctx) => {
      if (!ctx.history.length) return ctx.print(<Cm>(empty)</Cm>);
      ctx.history.forEach((h, i) =>
        ctx.print(
          <span>
            <Cm>{String(i + 1).padStart(4)}</Cm>
            {"  "}
            {h}
          </span>,
        ),
      );
    },
  },
  matrix: { desc: "there is no spoon", run: (_a, ctx) => ctx.runMatrix() },
  city: { desc: "walk into Neo San José 2099", run: (_a, ctx) => ctx.navigate("/city") },
  ls: {
    desc: "list files",
    hidden: true,
    run: ([flag], ctx) => {
      const all = flag === "-a" || flag === "-la";
      ctx.print(
        <span>
          <span className="c-cy">about</span> <span className="c-cy">projects</span> <span className="c-cy">skills</span>{" "}
          <span className="c-cy">services</span> <span className="c-cy">contact</span> README.md
          {all && (
            <>
              {" "}
              <Cm>.secrets</Cm> <Cm>.pura_vida</Cm>
            </>
          )}
        </span>,
      );
    },
  },
  cat: {
    desc: "read a file",
    hidden: true,
    run: ([file], ctx) => {
      const f = (file ?? "").toLowerCase();
      if (f === "readme.md") return commands.readme.run([], ctx);
      if (f === ".secrets") return commands.secrets.run([], ctx);
      if (f === ".pura_vida") return ctx.print(<Cm>it&apos;s not a file. it&apos;s a command.</Cm>);
      ctx.print(
        <span className="c-err">cat: {file ?? ""}: No such file or directory</span>,
      );
    },
  },
  readme: { desc: "", hidden: true, run: (_a, ctx) => ctx.print(<Readme />) },
  secrets: {
    desc: "",
    hidden: true,
    run: (_a, ctx) =>
      ctx.print(
        <span>
          <Cm># the secret is that I sometimes like board games more than code.</Cm>
          <br />
          <Cm># the other secret is two words. Costa Ricans say it all the time.</Cm>
        </span>,
      ),
  },
  whoami: { desc: "you, apparently", hidden: true, run: (_a, ctx) => ctx.print("guest — a curious visitor with excellent taste in terminals.") },
  date: { desc: "the current time on this machine", hidden: true, run: (_a, ctx) => ctx.print(new Date().toString()) },
  echo: { desc: "", hidden: true, run: (args, ctx) => ctx.print(args.join(" ")) },
  pwd: { desc: "", hidden: true, run: (_a, ctx) => ctx.print("/home/guest") },
  sudo: {
    desc: "",
    hidden: true,
    run: (_a, ctx) =>
      ctx.print(<span className="c-err">guest is not in the sudoers file. This incident will be reported to absolutely no one.</span>),
  },
  hire: {
    desc: "",
    hidden: true,
    run: (_a, ctx) => {
      ctx.print(<span className="c-gr">ACCESS GRANTED. Opening calendar…</span>);
      setTimeout(() => window.open("https://calendly.com/brolag/sesion-1-1", "_blank", "noopener"), 900);
    },
  },
};

export const COMMAND_NAMES = Object.keys(commands).filter((n) => !commands[n].hidden || ["ls", "cat", "exit", "time"].includes(n));
export const THEME_NAMES = THEMES.filter((t) => t !== "paper");

/** Resolve a raw line into [commandName, args], applying aliases. */
export function resolve(raw: string): [string, string[]] {
  const line = raw.trim().replace(/\s+/g, " ");
  const aliased = ALIASES[line.toLowerCase()] ?? line;
  const [name, ...args] = aliased.split(" ");
  return [name.toLowerCase(), args];
}
