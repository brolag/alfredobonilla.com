import contactData from "../../../content/contact.json";

// `contact` output: key/value list of links + a human note.
export function Contact() {
  return (
    <>
      <div className="kv">
        {contactData.details.map((d) => (
          <Row key={d.type} type={d.type} label={d.label} url={d.url} />
        ))}
      </div>
      <span className="c-cm">{contactData.note}</span>
    </>
  );
}

function Row({ type, label, url }: { type: string; label: string; url: string }) {
  const external = url.startsWith("http");
  return (
    <>
      <b>{type}</b>
      <a href={url} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
        {label}
      </a>
    </>
  );
}
