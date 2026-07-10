import ProjectVisual from "../components/ProjectVisual";
import SectionHeading from "../components/SectionHeading";
import { projects } from "../data/portfolio";
import CircularShowcase from "../../circular/src/App.jsx";

export default function Projects() {
  return (
    <section id="projects" className="content-section">
      <div className="section-inner">
        <SectionHeading label="Projects" title="Real-World {Builds with Clean} Presentation." />
        <div className="glass-card reveal h-[500px] md:h-[600px] relative w-full my-10 overflow-hidden">
          <CircularShowcase />
        </div>
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
