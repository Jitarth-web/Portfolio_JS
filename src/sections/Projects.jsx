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
import { ExternalLink, Play } from "lucide-react";

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
    case "PySide6": return (
      <span style={{ ...iconStyle, color: "#41cd52" }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "100%", height: "100%" }}>
          <circle cx="12" cy="12" r="8" />
          <line x1="17" y1="17" x2="20" y2="20" />
        </svg>
      </span>
    );
    case "Ollama (Qwen)": return (
      <span style={{ ...iconStyle, color: "#ffffff" }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "100%", height: "100%" }}>
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      </span>
    );
    case "Speech Recognition": return (
      <span style={{ ...iconStyle, color: "#ff6a21" }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "100%", height: "100%" }}>
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/>
        </svg>
      </span>
    );
    case "Text-to-Speech": return (
      <span style={{ ...iconStyle, color: "#38bdf8" }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "100%", height: "100%" }}>
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
        </svg>
      </span>
    );
    case "PyAutoGUI": return (
      <span style={{ ...iconStyle, color: "#e83e8c" }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "100%", height: "100%" }}>
          <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3zM13 13l6 6"/>
        </svg>
      </span>
    );
    case "Playwright": return (
      <span style={{ ...iconStyle, color: "#2b9348" }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "100%", height: "100%" }}>
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
          <line x1="2" y1="9" x2="22" y2="9"/>
          <path d="M8 21h8M12 17v4"/>
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
                <a href={project.live} className={project.title === "NEXA AI" ? "project-btn demo-video-btn" : "project-btn"} target="_blank" rel="noopener noreferrer">
                  {project.title === "NEXA AI" ? (
                    <>
                      <Play className="w-4 h-4" style={{ fill: "currentColor" }} />
                      Demo Video
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </>
                  )}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
