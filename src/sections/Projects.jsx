import ProjectVisual from "../components/ProjectVisual";
import SectionHeading from "../components/SectionHeading";
import { projects } from "../data/portfolio";
import CircularShowcase from "../../circular/src/App.jsx";
import videoUrl from "../assets/figma/blackhole.webm";

export default function Projects() {
  return (
    <section id="projects" className="content-section">
      <div className="section-inner">
        <SectionHeading label="Projects" title="Real-World {Builds with Clean} Presentation." />
        <div className="glass-card reveal h-[500px] md:h-[600px] relative w-full my-10 overflow-hidden">
          {/* Decorative Top Video Banner */}
          <div 
            className="absolute top-0 left-0 w-full h-[25%] md:h-[30%] pointer-events-none z-0 overflow-hidden"
            style={{
              maskImage: 'linear-gradient(to bottom, black 25%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 25%, transparent 100%)'
            }}
          >
            <video 
              src={videoUrl} 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover opacity-70"
              style={{
                transform: 'scaleY(-1)' // Inverted vertically so it arches downwards from the top edge
              }}
            />
          </div>
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
