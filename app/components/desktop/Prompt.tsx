// The shell prompt: guest@brolag ~ ❯
export function Prompt() {
  return (
    <span>
      <span className="p-user">guest</span>
      <span className="p-at">@</span>
      <span className="p-user">brolag</span> <span className="p-dir">~</span> <span className="p-sym">❯</span>
    </span>
  );
}
