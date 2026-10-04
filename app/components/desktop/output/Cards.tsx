import projectsData from "../../../content/projects.json";
import collaborationsData from "../../../content/collaborations.json";
import servicesData from "../../../content/services.json";

type Locale = "es" | "en";
type WorkEntry = { name: string; description: string; descriptionEn?: string; descriptionEs?: string; url: string; tags: string[]; tagsEn?: string[]; tagsEs?: string[] };

function WorkCards({ entries, locale }: { entries: WorkEntry[]; locale: Locale }) {
  return <div className="cards">
    {entries.map((p) => <article key={p.name} className="card">
      <h3>{p.name}<a href={p.url} target="_blank" rel="noopener noreferrer">{locale === "es" ? "abrir" : "open"} ↗</a></h3>
      <p>{locale === "es" ? p.descriptionEs ?? p.description : p.descriptionEn ?? p.description}</p>
      <div className="tags">{(locale === "es" ? p.tagsEs ?? p.tags : p.tagsEn ?? p.tags).map((tag) => <span key={tag}>{tag}</span>)}</div>
    </article>)}
  </div>;
}

// `projects` output: collaborations first, followed by independent tools.
export function Projects({ locale = "en" }: { locale?: Locale }) {
  return (
    <div className="work-groups">
      <h3>{locale === "es" ? "Colaboraciones" : "Collaborations"}</h3>
      <WorkCards entries={collaborationsData.collaborations} locale={locale}/>
      <h3>{locale === "es" ? "Herramientas de código abierto" : "Open source tools"}</h3>
      <WorkCards entries={projectsData.projects} locale={locale}/>
    </div>
  );
}

// `services` output: cards with price and call to action.
export function Services({ locale = "en" }: { locale?: Locale }) {
  return (
    <>
      <div className="cards">
        {servicesData.services.map((s) => (
          <article key={s.name} className="card">
            <h3>{locale === "es" ? s.nameEs : s.name}</h3>
            <p>{locale === "es" ? s.descriptionEs : s.description}</p>
            <div className="price">{locale === "es" ? s.priceEs : s.price}</div>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="c-cy">
              {locale === "es" ? s.ctaEs : s.cta} →
            </a>
          </article>
        ))}
      </div>
      <span className="c-cm">
        {locale === "es" ? <>¿No sabes cuál elegir? <span className="c-acc">Conversemos</span> y lo descubrimos.</> : <>Not sure which one? <span className="c-acc">contact</span> and we figure it out.</>}
      </span>
    </>
  );
}
