import aboutData from "../../../content/about.json";

// `about` output: key/value facts, like a well-formatted `whois`.
export function About() {
  const facts = aboutData.facts as Record<string, string>;
  return (
    <>
      <div className="kv">
        {Object.entries(facts).map(([k, v]) => (
          <Fact key={k} k={k} v={v} />
        ))}
      </div>
      <span className="c-cm">
        Long version: <span className="c-acc">cat README.md</span>
      </span>
    </>
  );
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <>
      <b>{k}</b>
      <span>{v}</span>
    </>
  );
}

// `cat README.md`: the paragraphs from about.json
export function Readme() {
  return (
    <div className="kv" style={{ gridTemplateColumns: "1fr" }}>
      {aboutData.content.map((p, i) => (
        <span key={i}>{p}</span>
      ))}
    </div>
  );
}
