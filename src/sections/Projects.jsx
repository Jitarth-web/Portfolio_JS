import ProjectVisual from "../components/ProjectVisual";
import SectionHeading from "../components/SectionHeading";
import { projects } from "../data/portfolio";
import CircularShowcase from "../../circular/src/App.jsx";
import videoUrl from "../assets/figma/blackhole.webm";
import { 
  HtmlIcon, CssIcon, JsIcon, ReactIcon, ThreeJsIcon, TailwindCssIcon,
  NodeIcon, MongodbIcon, SqlIcon, DockerIcon, PythonIcon, FlaskIcon, FastApiIcon,
  GitIcon, GithubIcon, VsCodeIcon, FigmaMark, VercelIcon, FramerIcon, GsapIcon
} from "../components/Icons";
import { ExternalLink } from "lucide-react";

const getTechIcon = (tech) => {
  const iconStyle = {
    width: "14px",
    height: "14px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0
  };

  const name = tech.trim();

  switch (name) {
    // Frontend
    case "HTML": return <span style={{ ...iconStyle, color: "#e34f26" }}><HtmlIcon /></span>;
    case "CSS": return <span style={{ ...iconStyle, color: "#1572b6" }}><CssIcon /></span>;
    case "JavaScript": return <span style={{ ...iconStyle, color: "#f7df1e" }}><JsIcon /></span>;
    case "React":
    case "React.JS":
    case "React Native": return <span style={{ ...iconStyle, color: "#61dafb" }}><ReactIcon /></span>;
    case "Three.js": return <span style={{ ...iconStyle, color: "#ffffff" }}><ThreeJsIcon /></span>;
    case "Tailwind CSS": return <span style={{ ...iconStyle, color: "#06b6d4" }}><TailwindCssIcon /></span>;
    case "GSAP": return <span style={{ ...iconStyle, color: "#88ce02" }}><GsapIcon /></span>;
    case "Framer Motion": return <span style={{ ...iconStyle, color: "#0055ff" }}><FramerIcon /></span>;
    
    // Backend & DB
    case "Node.js":
    case "Node.JS": return <span style={{ ...iconStyle, color: "#339933" }}><NodeIcon /></span>;
    case "MongoDB": return <span style={{ ...iconStyle, color: "#47a248" }}><MongodbIcon /></span>;
    case "SQL":
    case "SQLite":
    case "SQL-Persistent": return <span style={{ ...iconStyle, color: "#00758f" }}><SqlIcon /></span>;
    case "Docker": return <span style={{ ...iconStyle, color: "#2496ed" }}><DockerIcon /></span>;
    case "Python": return <span style={{ ...iconStyle, color: "#3776ab" }}><PythonIcon /></span>;
    case "Flask":
    case "Python Flask": return <span style={{ ...iconStyle, color: "#ffffff" }}><FlaskIcon /></span>;
    case "Fast-API":
    case "FastAPI": return <span style={{ ...iconStyle, color: "#009688" }}><FastApiIcon /></span>;

    // Tools & Platforms
    case "Git": return <span style={{ ...iconStyle, color: "#f05032" }}><GitIcon /></span>;
    case "GitHub": return <span style={{ ...iconStyle, color: "#ffffff" }}><GithubIcon /></span>;
    case "VS Code": return <span style={{ ...iconStyle, color: "#007acc" }}><VsCodeIcon /></span>;
    case "Figma": return <span style={{ ...iconStyle, color: "#f24e1e" }}><FigmaMark /></span>;
    case "Vercel": return <span style={{ ...iconStyle, color: "#ffffff" }}><VercelIcon /></span>;

    // AI
    case "Gemini AI": return (
      <span style={{ ...iconStyle, color: "#4ba3e3" }}>
        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "100%", height: "100%" }}>
          <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z"/>
        </svg>
      </span>
    );

    default: return null;
  }
};

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
                {project.tech.map((tech) => (
                  <span key={tech} className="flex items-center gap-1.5">
                    {getTechIcon(tech)}
                    {tech}
                  </span>
                ))}
              </div>
              <div className="project-actions">
                <a href={project.github} className="project-btn">
                  <span className="w-4 h-4 inline-flex items-center justify-center"><GithubIcon /></span>
                  GitHub
                </a>
                <a href={project.live} className="project-btn">
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
