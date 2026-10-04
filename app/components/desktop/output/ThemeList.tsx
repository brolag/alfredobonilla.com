import { THEMES } from "../../../lib/theme";

// `theme` with no args: list themes + swatches of the current palette.
// `paper` is deliberately left out of the list — it's the easter egg.
export function ThemeList() {
  const visible = THEMES.filter((t) => t !== "paper");
  return (
    <>
      <span>
        Available themes:{" "}
        {visible.map((t, i) => (
          <span key={t}>
            <span className="c-acc">{t}</span>
            {i < visible.length - 1 ? ", " : ""}
          </span>
        ))}
      </span>
      <div className="swatches">
        {["--bg", "--accent", "--green", "--pink", "--cyan", "--yellow"].map((v) => (
          <span key={v} className="sw" style={{ background: `var(${v})` }} />
        ))}
      </div>
      <span className="c-cm">usage: theme &lt;name&gt;</span>
    </>
  );
}
