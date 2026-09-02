import projectsData from "../../../content/projects.json";
import servicesData from "../../../content/services.json";

// `projects` output: staggered cards with tags and an external link.
export function Projects() {
  return (
    <div className="cards">
      {projectsData.projects.map((p) => (
        <article key={p.name} className="card">
          <h3>
            {p.name}
            <a href={p.url} target="_blank" rel="noopener noreferrer">
              open ↗
            </a>
          </h3>
          <p>{p.description}</p>
          <div className="tags">
            {p.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </article>
      ))}
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
