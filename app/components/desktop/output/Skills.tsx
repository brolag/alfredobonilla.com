"use client";
import { useEffect, useState } from "react";
import skillsData from "../../../content/skills.json";

// `skills` output: animated bar per category, with the tool list underneath.
export function Skills({ locale = "en" }: { locale?: "es" | "en" }) {
  // Bars start at 0 and grow after mount so the CSS transition plays.
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <>
      <div className="skills">
        {skillsData.categories.map((c) => (
          <Row key={c.name} name={locale === "es" ? c.nameEs : c.name} level={c.level} skills={locale === "es" ? c.skillsEs : c.skills} width={grown ? c.level : 0} />
        ))}
      </div>
      <span className="c-cm">{locale === "es" ? "## niveles orientativos, según mi experiencia" : "## proficiency is self-reported, like all proficiency"}</span>
    </>
  );
}

function Row({ name, level, skills, width }: { name: string; level: number; skills: string[]; width: number }) {
  return (
    <>
      <span className="lab">{name}</span>
      <div className="bar-wrap">
        <div className="fill" style={{ width: `${width}%` }} />
      </div>
      <span className="pct">{level}%</span>
      <span className="list">{skills.join(" · ")}</span>
    </>
  );
}
