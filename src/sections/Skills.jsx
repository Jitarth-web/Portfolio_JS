import SectionHeading from "../components/SectionHeading";
import { skills } from "../data/portfolio";

export default function Skills() {
  return (
    <section id="skills" className="content-section">
      <div className="section-inner">
        <SectionHeading label="Skills" title="Frontend, Backend, and Tools." />
        <div className="skills-grid">
          {skills.map((group) => (
            <article className="glass-card skill-group reveal" key={group.group}>
              <h3>{group.group}</h3>
              <div>
                {group.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
