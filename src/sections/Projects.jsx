import ProjectVisual from "../components/ProjectVisual";
import SectionHeading from "../components/SectionHeading";
import { projects } from "../data/portfolio";

export default function Projects() {
  return (
    <section id="projects" className="content-section">
      <div className="section-inner">
        <SectionHeading label="Projects" title="Real-world builds with clean presentation." />
        <div className="projects-grid">
          {projects.map((project, index) => (
            <article className="glass-card project-card reveal" key={project.title}>
              <ProjectVisual index={index} />
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="tech-stack">
                {project.tech.map((tech) => <span key={tech}>{tech}</span>)}
              </div>
              <div className="project-actions">
                <a href={project.github}>GitHub</a>
                <a href={project.live}>Live Demo</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
