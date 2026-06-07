import SectionHeading from "../components/SectionHeading";
import { experience } from "../data/portfolio";

export default function Experience() {
  return (
    <section id="experience" className="content-section">
      <div className="section-inner">
        <SectionHeading label="Experience" title="A focused software development path." />
        <div className="timeline">
          {experience.map((item) => (
            <article className="timeline-item reveal" key={item.title}>
              <span className="timeline-dot" />
              <div className="glass-card">
                <p>{item.meta}</p>
                <h3>{item.title}</h3>
                <span>{item.detail}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
