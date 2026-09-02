// `help` output: two-column grid of visible commands.
type Entry = { name: string; desc: string };

export function Help({ entries }: { entries: Entry[] }) {
  return (
    <>
      <div className="help">
        {entries.map((e) => (
          <Entry key={e.name} {...e} />
        ))}
      </div>
      <span className="c-cm">
        ## there are hidden commands. <span className="c-acc">ls -a</span> might help.
      </span>
    </>
  );
}

function Entry({ name, desc }: Entry) {
  return (
    <>
      <b>{name}</b>
      <span>{desc}</span>
    </>
  );
}
