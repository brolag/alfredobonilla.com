import projectsData from "../../../content/projects.json";
import collaborationsData from "../../../content/collaborations.json";
import servicesData from "../../../content/services.json";

function WorkCards({ entries }: { entries: { name: string; description: string; descriptionEn?: string; url: string; tags: string[]; tagsEn?: string[] }[] }) {
  return <div className="cards">
    {entries.map((p) => <article key={p.name} className="card">
      <h3>{p.name}<a href={p.url} target="_blank" rel="noopener noreferrer">open ↗</a></h3>
      <p>{p.descriptionEn ?? p.description}</p>
      <div className="tags">{(p.tagsEn ?? p.tags).map((tag) => <span key={tag}>{tag}</span>)}</div>
    </article>)}
  </div>;
}

// `projects` output: collaborations first, followed by independent tools.
export function Projects() {
  return (
    <div className="work-groups">
      <h3>Collaborations</h3>
      <WorkCards entries={collaborationsData.collaborations}/>
      <h3>Open source tools</h3>
      <WorkCards entries={projectsData.projects}/>
    </div>
  );
}

// `services` output: cards with price and call to action.
export function Services() {
  return (
    <>
      <div className="cards">
        {servicesData.services.map((s) => (
          <article key={s.name} className="card">
            <h3>{s.name}</h3>
            <p>{s.description}</p>
            <div className="price">{s.price}</div>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="c-cy">
              {s.cta} →
            </a>
          </article>
        ))}
      </div>
      <span className="c-cm">
        Not sure which one? <span className="c-acc">contact</span> and we figure it out.
      </span>
    </>
  );
}
