import { useState, useRef, useEffect } from "react";
import SectionHeading from "../components/SectionHeading";
import { skills } from "../data/portfolio";
import image41 from "../assets/figma/image 41.png";
import gsap from "gsap";
import FloatingSticker from "../components/FloatingSticker";
import {
  HtmlIcon, CssIcon, JsIcon, ReactIcon, ThreeJsIcon, TailwindCssIcon,
  NodeIcon, MongodbIcon, SqlIcon, DockerIcon, PythonIcon, FlaskIcon, FastApiIcon,
  GitIcon, GithubIcon, VsCodeIcon, FigmaMark, CursorIcon, AntigravityIcon,
  FramerIcon, ChatGptIcon, VercelIcon, RailwayIcon, RenderIcon, GsapIcon
} from "../components/Icons";

const getSkillIcon = (item) => {
  const iconStyle = {
    width: "16px",
    height: "16px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0
  };

  switch (item) {
    // Frontend
    case "HTML": return <span style={iconStyle} className="text-[#e34f26]"><HtmlIcon /></span>;
    case "CSS": return <span style={iconStyle} className="text-[#1572b6]"><CssIcon /></span>;
    case "JavaScript": return <span style={iconStyle} className="text-[#f7df1e]"><JsIcon /></span>;
    case "React":
    case "React Native": return <span style={iconStyle} className="text-[#61dafb]"><ReactIcon /></span>;
    case "Three.js": return <span style={iconStyle} className="text-[#ffffff]"><ThreeJsIcon /></span>;
    case "Tailwind CSS": return <span style={iconStyle} className="text-[#06b6d4]"><TailwindCssIcon /></span>;
    case "GSAP": return <span style={iconStyle} className="text-[#88ce02]"><GsapIcon /></span>;
    
    // Backend
    case "Node.js": return <span style={iconStyle} className="text-[#339933]"><NodeIcon /></span>;
    case "MongoDB": return <span style={iconStyle} className="text-[#47a248]"><MongodbIcon /></span>;
    case "SQL": return <span style={iconStyle} className="text-[#00758f]"><SqlIcon /></span>;
    case "Docker": return <span style={iconStyle} className="text-[#2496ed]"><DockerIcon /></span>;
    case "Python": return <span style={iconStyle} className="text-[#3776ab]"><PythonIcon /></span>;
    case "Flask": return <span style={iconStyle} className="text-[#ffffff]"><FlaskIcon /></span>;
    case "FastAPI": return <span style={iconStyle} className="text-[#009688]"><FastApiIcon /></span>;

    // Tools
    case "Git": return <span style={iconStyle} className="text-[#f05032]"><GitIcon /></span>;
    case "GitHub": return <span style={iconStyle} className="text-[#ffffff]"><GithubIcon /></span>;
    case "VS Code": return <span style={iconStyle} className="text-[#007acc]"><VsCodeIcon /></span>;
    case "Figma": return <span style={iconStyle} className="text-[#f24e1e]"><FigmaMark /></span>;
    case "Cursor": return <span style={iconStyle} className="text-[#55ffc0]"><CursorIcon /></span>;
    case "Antigravity": return <span style={iconStyle} className="text-[#00f5ff]"><AntigravityIcon /></span>;
    case "Framer": return <span style={iconStyle} className="text-[#0055ff]"><FramerIcon /></span>;
    case "ChatGPT": return <span style={iconStyle} className="text-[#10a37f]"><ChatGptIcon /></span>;
    case "Vercel": return <span style={iconStyle} className="text-[#ffffff]"><VercelIcon /></span>;
    case "Railway": return <span style={iconStyle} className="text-[#fd4f96]"><RailwayIcon /></span>;
    case "Render": return <span style={iconStyle} className="text-[#46e3b7]"><RenderIcon /></span>;

    // Fallbacks or AI/Other
    case "Prompt Engineering":
    case "LLMs":
    case "Machine Learning":
    case "Data Analysis":
      return (
        <svg style={iconStyle} className="text-[#10b981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4" />
        </svg>
      );

    default:
      return (
        <svg style={iconStyle} className="text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
  }
};

function SkillPill({ item, category }) {
  const pillRef = useRef(null);

  const getGlowColor = (cat) => {
    switch (cat) {
      case "Frontend": return "rgba(34, 211, 238, 0.4)";
      case "Backend": return "rgba(249, 115, 22, 0.4)";
      case "AI": return "rgba(16, 185, 129, 0.4)";
      case "Tools": return "rgba(168, 85, 247, 0.4)";
      default: return "rgba(255, 255, 255, 0.2)";
    }
  };

  const getBorderColor = (cat) => {
    switch (cat) {
      case "Frontend": return "rgba(34, 211, 238, 0.6)";
      case "Backend": return "rgba(249, 115, 22, 0.6)";
      case "AI": return "rgba(16, 185, 129, 0.6)";
      case "Tools": return "rgba(168, 85, 247, 0.6)";
      default: return "rgba(255, 255, 255, 0.35)";
    }
  };

  const handleMouseMove = (e) => {
    const el = pillRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(el, {
      x: x * 0.35,
      y: y * 0.35,
      scale: 1.08,
      borderColor: getBorderColor(category),
      boxShadow: `0 0 16px ${getGlowColor(category)}`,
      backgroundColor: "rgba(255, 255, 255, 0.12)",
      duration: 0.2,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    const el = pillRef.current;
    if (!el) return;

    gsap.to(el, {
      x: 0,
      y: 0,
      scale: 1,
      borderColor: "rgba(255, 255, 255, 0.15)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      duration: 0.3,
      ease: "power2.out"
    });
  };

  return (
    <div
      ref={pillRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="px-5 py-2.5 rounded-full text-sm font-medium transition-transform duration-300 inline-flex items-center gap-2.5 cursor-pointer select-none relative z-10"
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <div className={item !== "Figma" ? "skill-icon-spin inline-flex items-center justify-center" : "inline-flex items-center justify-center"} style={{ width: "16px", height: "16px", flexShrink: 0 }}>
        {getSkillIcon(item)}
      </div>
      <span>{item}</span>
    </div>
  );
}

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState(null);
  const cardRef = useRef(null);
  const blobRef = useRef(null);
  const trailerRef = useRef(null);

  const getIcon = (group) => {
    switch (group) {
      case "Frontend": return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>;
      case "Backend": return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>;
      case "AI":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Antenna */}
            <path d="M12 2v3" />
            <circle cx="12" cy="2" r="1" fill="#10b981" stroke="none" />

            {/* Head */}
            <rect x="5" y="6" width="14" height="12" rx="3" />

            {/* Eyes */}
            <circle cx="9" cy="12" r="1" fill="#10b981" stroke="none" />
            <circle cx="15" cy="12" r="1" fill="#10b981" stroke="none" />

            {/* Mouth */}
            <path d="M9 16h6" />

            {/* Side antennas */}
            <path d="M5 10H3" />
            <path d="M21 10h-2" />
          </svg>
        );
      case "Tools": return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>;
      default: return null;
    }
  };

  const handleCardMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (blobRef.current) {
      gsap.to(blobRef.current, {
        x: x,
        y: y,
        duration: 0.6,
        ease: "power2.out"
      });
    }

    if (trailerRef.current) {
      trailerRef.current.style.left = `${x}px`;
      trailerRef.current.style.top = `${y}px`;
    }
  };

  const handleCardMouseEnter = () => {
    document.body.classList.add("hide-global-cursor");
    if (blobRef.current) {
      gsap.to(blobRef.current, { opacity: 1, duration: 0.35 });
    }
    if (trailerRef.current) {
      gsap.to(trailerRef.current, { opacity: 1, scale: 1, duration: 0.2 });
    }
  };

  const handleCardMouseLeave = () => {
    document.body.classList.remove("hide-global-cursor");
    setActiveCategory(null);
    if (blobRef.current) {
      gsap.to(blobRef.current, { opacity: 0, duration: 0.5 });
    }
    if (trailerRef.current) {
      gsap.to(trailerRef.current, { opacity: 0, scale: 0, duration: 0.3 });
    }
  };

  useEffect(() => {
    if (!blobRef.current) return;

    let color = "rgba(7, 126, 126, 0.25)";
    let colorSecondary = "rgba(7, 126, 126, 0.03)";
    let trailerBg = "var(--theme-color)";
    let trailerShadow = "var(--theme-color)";

    if (activeCategory === "Frontend") {
      color = "rgba(34, 211, 238, 0.3)";
      colorSecondary = "rgba(34, 211, 238, 0.03)";
      trailerBg = "#22d3ee";
      trailerShadow = "rgba(34, 211, 238, 0.6)";
    } else if (activeCategory === "Backend") {
      color = "rgba(249, 115, 22, 0.3)";
      colorSecondary = "rgba(249, 115, 22, 0.03)";
      trailerBg = "#f97316";
      trailerShadow = "rgba(249, 115, 22, 0.6)";
    } else if (activeCategory === "AI") {
      color = "rgba(16, 185, 129, 0.3)";
      colorSecondary = "rgba(16, 185, 129, 0.03)";
      trailerBg = "#10b981";
      trailerShadow = "rgba(16, 185, 129, 0.6)";
    } else if (activeCategory === "Tools") {
      color = "rgba(168, 85, 247, 0.3)";
      colorSecondary = "rgba(168, 85, 247, 0.03)";
      trailerBg = "#a855f7";
      trailerShadow = "rgba(168, 85, 247, 0.6)";
    }

    gsap.to(blobRef.current, {
      background: `radial-gradient(circle, ${color} 0%, ${colorSecondary} 60%, transparent 100%)`,
      duration: 0.45
    });

    if (trailerRef.current) {
      gsap.to(trailerRef.current, {
        backgroundColor: trailerBg,
        boxShadow: `0 0 10px ${trailerShadow}, 0 0 20px ${trailerShadow}`,
        duration: 0.3
      });
    }
  }, [activeCategory]);

  useEffect(() => {
    return () => {
      document.body.classList.remove("hide-global-cursor");
    };
  }, []);

  return (
    <section id="skills" className="content-section">
      <FloatingSticker text="Still Centering Divs" theme="orange" size="md" top="15%" right="2%" rotation={11} />
      <FloatingSticker text="StackOverflow Savior" theme="red" size="md" top="30%" left="4%" rotation={-6} className="hidden lg:block" />
      <FloatingSticker text="Ctrl + S Addict" theme="green" size="md" top="45%" left="3%" rotation={-8} />
      <FloatingSticker text="Keyboard Smash" theme="blue" size="sm" top="60%" right="2%" rotation={8} className="hidden lg:block" />
      <FloatingSticker text="Not a bug, a feature" theme="purple" size="md" top="75%" right="4%" rotation={9} />
      <FloatingSticker text="Console.log('help')" theme="lime" size="md" top="90%" left="2%" rotation={-5} />
      
      <div className="section-inner relative z-10 flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-16">

        {/* Left Column: Heading and Image */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center relative reveal">
          <SectionHeading label="Skills" title="Crafting {beautiful interfaces} and powerful backends." />
          <div className="mt-12 flex justify-center lg:justify-start float-anim-2 w-full">
            <div className="relative w-[80%] max-w-[350px] lg:max-w-[400px] mix-blend-screen" style={{ mixBlendMode: 'screen' }}>
              {/* Eye backing patches to restore eye colors lost to transparency blend */}
              <span className="absolute bg-[white] rounded-full opacity-95" style={{
                top: '48.5%',
                left: '33.5%',
                width: '8.9%',
                height: '7%',
                transform: 'translate(-50%, -50%)',
                zIndex: 0
              }} />
              <span className="absolute bg-[#ffffff] rounded-full opacity-95" style={{
                top: '47.2%',
                left: '48.5%',
                width: '9%',
                height: '4%',
                transform: 'translate(-50%, -50%)',
                zIndex: 0
              }} />
              <img src={`${image41}?v=4`} alt="Skills visualization" className="w-full h-auto object-contain relative z-10" />
            </div>
          </div>
        </div>

        {/* Right Column: Skills Panel */}
        <div className="w-full lg:w-[50%] flex justify-end reveal">
          <div
            ref={cardRef}
            onMouseMove={handleCardMouseMove}
            onMouseEnter={handleCardMouseEnter}
            onMouseLeave={handleCardMouseLeave}
            className="glass-card w-full p-8 lg:p-12 shadow-2xl relative overflow-hidden hide-default-cursor"
            style={{
              background: "var(--bg-nav)",
              border: "1px solid color-mix(in srgb, var(--theme-color) 20%, transparent)",
              borderRadius: "24px"
            }}
          >
            {/* Ambient Spotlight Blob */}
            <div
              ref={blobRef}
              className="absolute w-[350px] h-[350px] rounded-full pointer-events-none opacity-0 blur-[60px] z-0"
              style={{
                background: "radial-gradient(circle, rgba(7, 126, 126, 0.25) 0%, rgba(7, 126, 126, 0.03) 60%, transparent 100%)",
                transform: "translate(-50%, -50%)",
                left: 0,
                top: 0,
                willChange: "transform"
              }}
            />

            {/* Custom Cursor Trailer Dot */}
            <div
              ref={trailerRef}
              className="absolute w-3.5 h-3.5 rounded-full pointer-events-none opacity-0 z-20"
              style={{
                backgroundColor: "var(--theme-color)",
                boxShadow: "0 0 10px var(--theme-color)",
                transform: "translate(-50%, -50%)",
                left: 0,
                top: 0,
                willChange: "transform",
                border: "2px solid #ffffff"
              }}
            />

            <div className="flex flex-col gap-10 relative z-10">
              {skills.map((group) => (
                <div
                  key={group.group}
                  className="flex flex-col gap-4 relative z-10"
                  onMouseEnter={() => setActiveCategory(group.group)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                      {getIcon(group.group)}
                    </div>
                    <h3 className="text-2xl font-bold tracking-wide text-[var(--theme-color)]" style={{ textTransform: "uppercase" }}>
                      {group.group}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {group.items.map((item) => (
                      <SkillPill key={item} item={item} category={group.group} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
