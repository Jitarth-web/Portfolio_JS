import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "../components/SectionHeading";
import { profile } from "../data/portfolio";
import avatarMain from "../assets/figma/image 30.png";
import ringImg from "../assets/figma/image 4.png";
import { PythonIcon, ReactIcon, JsIcon } from "../components/Icons";
import { 
  Terminal, 
  Cpu, 
  Award, 
  Coffee, 
  Activity, 
  Sparkles, 
  GraduationCap, 
  Target, 
  Milestone, 
  Brain, 
  Code,
  Compass,
  MapPin,
  Briefcase,
  Hourglass
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const containerRef = useRef(null);
  const [activeJourney, setActiveJourney] = useState(1); // 0-indexed: JEE, NITD, Dev, AI, Build
  const [activeTab, setActiveTab] = useState("education"); // education, interests, goals, mission
  const [consoleText, setConsoleText] = useState("");

  // Actual inspiring technology and design quotes
  const quotes = [
    { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
    { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
    { text: "Clean code always looks like it was written by someone who cares.", author: "Robert C. Martin" },
    { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
    { text: "Design is not just what it looks like and feels like. Design is how it works.", author: "Steve Jobs" }
  ];

  const [currentQuoteIdx, setCurrentQuoteIdx] = useState(0);
  const [quoteFade, setQuoteFade] = useState("in");

  // Quotes Carousel logic
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteFade("out");
      setTimeout(() => {
        setCurrentQuoteIdx((prev) => (prev + 1) % quotes.length);
        setQuoteFade("in");
      }, 500);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const journeySteps = [
    {
      label: "JEE",
      icon: <Award className="w-5 h-5" />,
      title: "JEE Main Milestone",
      desc: "Cleared JEE Main with high credentials, securing admission into the prestigious Computer Science program at NIT Delhi."
    },
    {
      label: "NITD",
      icon: <GraduationCap className="w-5 h-5" />,
      title: "NIT Delhi Academics",
      desc: "Pursuing B.Tech in Computer Science and Engineering. Focusing on Algorithms, Data Structures, Database Management, and Systems."
    },
    {
      label: "Dev",
      icon: <Code className="w-5 h-5" />,
      title: "Full-Stack Development",
      desc: "Mastered modern frontend & backend architectures: React, Node, Express, MongoDB, Tailwind, Framer Motion, and GSAP."
    },
    {
      label: "AI",
      icon: <Brain className="w-5 h-5" />,
      title: "Artificial Intelligence & ML",
      desc: "Delved into Deep Learning, PyTorch, Large Language Models, Prompt Engineering, and building smart AI-agent integrations."
    },
    {
      label: "Build",
      icon: <Compass className="w-5 h-5" />,
      title: "Deploying Products",
      desc: "Currently crafting real-world applications (ClassClan, SwachhCity, AgriSort) that bridge user interface with AI capabilities."
    }
  ];

  // Journey Auto-switcher
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveJourney((prev) => (prev + 1) % journeySteps.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [journeySteps.length]);

  // macOS Stack tabs Auto-switcher
  useEffect(() => {
    const tabs = ["education", "interests", "goals", "mission"];
    const timer = setInterval(() => {
      setActiveTab((prev) => {
        const currIdx = tabs.indexOf(prev);
        return tabs[(currIdx + 1) % tabs.length];
      });
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Typing effect for Console
  useEffect(() => {
    const fullText = [
      "> Initializing developer core...",
      "> System status: Online",
      `> Identity: ${profile.name.toUpperCase()}`,
      `> Education: B.TECH CSE @ NIT DELHI`,
      "> Passion level: [||||||||||] 100%",
      "> Curiosity: Infinite Loop",
      "> Loop>>Skills: Ready to build amazing things"
    ].join("\n");

    let idx = 0;
    const timer = setInterval(() => {
      setConsoleText((prev) => prev + fullText[idx]);
      idx++;
      if (idx >= fullText.length) {
        clearInterval(timer);
      }
    }, 25);

    return () => clearInterval(timer);
  }, []);

  // Age Ticker Logic with high speed milliseconds (DOB: 01/10/2006)
  const [age, setAge] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0
  });

  useEffect(() => {
    const dob = new Date("2006-10-01T00:00:00");
    
    const calculateAge = () => {
      const now = new Date();
      let years = now.getFullYear() - dob.getFullYear();
      let months = now.getMonth() - dob.getMonth();
      let days = now.getDate() - dob.getDate();
      let hours = now.getHours() - dob.getHours();
      let minutes = now.getMinutes() - dob.getMinutes();
      let seconds = now.getSeconds() - dob.getSeconds();
      let milliseconds = now.getMilliseconds();

      if (seconds < 0) {
        seconds += 60;
        minutes--;
      }
      if (minutes < 0) {
        minutes += 60;
        hours--;
      }
      if (hours < 0) {
        hours += 24;
        days--;
      }
      if (days < 0) {
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
      }
      if (months < 0) {
        months += 12;
        years--;
      }

      setAge({
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
        milliseconds: Math.floor(milliseconds / 10) // 2-digit representation
      });
    };

    calculateAge();
    const interval = setInterval(calculateAge, 33); // ~30 fps ticking for milliseconds
    return () => clearInterval(interval);
  }, []);

  // Helper pad function
  const pad = (num, len = 2) => String(num).padStart(len, "0");

  // GSAP animations for parallax & count-up
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      // 1. Mouse Parallax for Bento Cards
      const handleMouseMove = (e) => {
        const rect = root.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(".about-parallax-card", {
          x: x * 15,
          y: y * 15,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.01
        });
      };

      root.addEventListener("mousemove", handleMouseMove);

      // 2. Count-up Stats Animation
      const statElements = root.querySelectorAll(".about-stat-number");
      statElements.forEach((el) => {
        const val = parseInt(el.getAttribute("data-val") || "0", 10);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: val,
          duration: 1.8,
          ease: "power2.out",
          snap: { val: 1 },
          onUpdate: () => {
            el.innerText = obj.val + "+";
          },
          scrollTrigger: {
            trigger: el,
            start: "top 92%"
          }
        });
      });

      return () => {
        root.removeEventListener("mousemove", handleMouseMove);
      };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="content-section" ref={containerRef}>
      <div className="section-inner">
        <SectionHeading label="About" title="CSE Student Building Modern Digital Experiences." />
        
        {/* Unified Bento Grid Layout */}
        <div className="about-bento-grid">
          
          {/* Card 1: Profile Main Card */}
          <div className="about-bento-card about-card-profile-main about-parallax-card">
            <div className="about-profile-badge-wrapper">
              <span className="about-profile-tag">ABOUT ME</span>
            </div>
            
            <div className="about-profile-avatar-container">
              <div className="about-avatar-orbit-ring">
                <div className="about-orbit-emblem py"><PythonIcon /></div>
                <div className="about-orbit-emblem react"><ReactIcon /></div>
                <div className="about-orbit-emblem js"><JsIcon /></div>
              </div>
              <img src={avatarMain} alt="Jitarth Singh" className="about-avatar-large animate-float-avatar" />
            </div>

            <div className="about-profile-info">
              <h3 className="about-profile-name">{profile.name}</h3>
              <p className="about-profile-title">AI Engineer & Developer</p>
              
              <div className="mt-3 flex justify-center">
                <div className="about-status-badge">
                  <span className="about-status-pulse"></span>
                  <span>Currently Building</span>
                </div>
              </div>

              <p className="about-profile-desc leading-relaxed">
                Third-year Computer Science student at National Institute of Technology Delhi, passionate about building modern web experiences and solving real-world problems through technology.
              </p>

              <div className="about-profile-meta-grid">
                <div className="about-meta-item">
                  <MapPin className="w-4 h-4 text-[#ff6a21]" />
                  <span>Delhi, India</span>
                </div>
                <div className="about-meta-item">
                  <Briefcase className="w-4 h-4 text-[#0acf83]" />
                  <span>Open to Opportunities</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Command Console */}
          <div className="about-bento-card about-card-terminal about-parallax-card">
            <div className="about-console">
              <div className="about-console-header">
                <span className="about-console-dot red"></span>
                <span className="about-console-dot yellow"></span>
                <span className="about-console-dot green"></span>
                <span className="text-xs text-gray-500 font-mono ml-2">jitarth@terminal</span>
              </div>
              <div className="about-console-body font-mono text-[11px] leading-tight text-[#a8ffb2]">
                {consoleText}
                <span className="animate-pulse">|</span>
              </div>
            </div>
          </div>

          {/* Card 3: Stats Dashboard */}
          <div className="about-bento-card about-card-stats about-parallax-card">
            <div className="about-stats-grid">
              <div className="about-stat-item">
                <h4 className="about-stat-number" data-val="10">0+</h4>
                <p>Projects</p>
              </div>
              <div className="about-stat-item">
                <h4 className="about-stat-number" data-val="400">0+</h4>
                <p>LeetCode</p>
              </div>
              <div className="about-stat-item">
                <h4 className="about-stat-number" data-val="5">0+</h4>
                <p>Hackathons</p>
              </div>
              <div className="about-stat-item">
                <h4 className="about-stat-number" data-val="15">0+</h4>
                <p>Tech Stack</p>
              </div>
            </div>
          </div>

          {/* Card 4: macOS Stack */}
          <div className="about-bento-card about-card-stack about-parallax-card">
            <div className="about-stack-container">
              <div className="about-stack-tabs">
                <button 
                  className={`about-stack-tab-btn ${activeTab === "education" ? "active" : ""}`}
                  onClick={() => setActiveTab("education")}
                >
                  Education
                </button>
                <button 
                  className={`about-stack-tab-btn ${activeTab === "interests" ? "active" : ""}`}
                  onClick={() => setActiveTab("interests")}
                >
                  Interests
                </button>
                <button 
                  className={`about-stack-tab-btn ${activeTab === "goals" ? "active" : ""}`}
                  onClick={() => setActiveTab("goals")}
                >
                  Goals
                </button>
                <button 
                  className={`about-stack-tab-btn ${activeTab === "mission" ? "active" : ""}`}
                  onClick={() => setActiveTab("mission")}
                >
                  Mission
                </button>
              </div>

              <div className="about-stack-windows">
                
                {/* Education Tab */}
                <div className={`about-stack-window ${activeTab === "education" ? "active" : ""}`}>
                  <div className="about-timeline-feed">
                    <div className="about-timeline-item">
                      <div className="flex justify-between items-start mb-0.5">
                        <span className="text-[13px] font-bold text-white flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4 text-[#ff6a21]" /> B.Tech CSE - NIT Delhi
                        </span>
                        <span className="text-[10px] text-[#ff6a21] font-bold uppercase">2024 - 2028</span>
                      </div>
                      <p className="text-[12px] text-gray-400 leading-normal">
                        Pursuing Computer Science and Engineering. Focusing on advanced algorithms, systems architecture, and database engineering.
                      </p>
                    </div>

                    <div className="about-timeline-item mt-2 pt-2 border-t border-white/5">
                      <div className="flex justify-between items-start mb-0.5">
                        <span className="text-[13px] font-bold text-white flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4 text-[#ff6a21]" /> Vivekanand International School
                        </span>
                        <span className="text-[10px] text-gray-500 font-semibold uppercase">Class 12 | 2024</span>
                      </div>
                      <p className="text-[12px] text-gray-400 leading-normal">
                        Completed Class 12 with a strong academic record, specializing in Physics, Chemistry, Mathematics, and Computer Science.
                      </p>
                    </div>

                    <div className="about-timeline-item mt-2 pt-2 border-t border-white/5">
                      <div className="flex justify-between items-start mb-0.5">
                        <span className="text-[13px] font-bold text-white flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4 text-[#ff6a21]" /> Vivekanand International School
                        </span>
                        <span className="text-[10px] text-gray-500 font-semibold uppercase">Class 10 | 2022</span>
                      </div>
                      <p className="text-[12px] text-gray-400 leading-normal">
                        Completed Class 10 with high credentials, establishing a solid logical and scientific foundation.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Interests Tab */}
                <div className={`about-stack-window ${activeTab === "interests" ? "active" : ""}`}>
                  <div className="about-timeline-feed">
                    <div className="about-timeline-item">
                      <h5 className="text-[13px] font-bold text-white mb-0.5 flex items-center gap-1.5">
                        <Brain className="w-4 h-4 text-[#ff6a21]" /> AI Tinkering & LLMs
                      </h5>
                      <p className="text-[12px] text-gray-400 leading-normal">
                        Experimenting with neural networking, open-source model fine-tuning, smart agent logic, and RAG.
                      </p>
                    </div>
                    <div className="about-timeline-item mt-2.5 pt-2.5 border-t border-white/5">
                      <h5 className="text-[13px] font-bold text-white mb-0.5 flex items-center gap-1.5">
                        <Code className="w-4 h-4 text-[#ff6a21]" /> Creative Frontends
                      </h5>
                      <p className="text-[12px] text-gray-400 leading-normal">
                        Building gorgeous interfaces using GSAP timelines, responsive layout constraints, and vector canvases.
                      </p>
                    </div>
                    <div className="about-timeline-item mt-2.5 pt-2.5 border-t border-white/5">
                      <h5 className="text-[13px] font-bold text-white mb-0.5 flex items-center gap-1.5">
                        <Target className="w-4 h-4 text-[#ff6a21]" /> Competitive Programming
                      </h5>
                      <p className="text-[12px] text-gray-400 leading-normal">
                        Solving complex algorithmic math challenges on platforms like LeetCode (400+ problems completed).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Goals Tab */}
                <div className={`about-stack-window ${activeTab === "goals" ? "active" : ""}`}>
                  <div className="about-timeline-feed">
                    <div className="about-timeline-item">
                      <h5 className="text-[13px] font-bold text-white mb-0.5 flex items-center gap-1.5">
                        <Target className="w-4 h-4 text-[#ff6a21]" /> Hackathon Engineering
                      </h5>
                      <p className="text-[12px] text-gray-400 leading-normal">
                        Developing smart full-stack products within tight execution windows to address actual user problems.
                      </p>
                    </div>
                    <div className="about-timeline-item mt-2.5 pt-2.5 border-t border-white/5">
                      <h5 className="text-[13px] font-bold text-white mb-0.5 flex items-center gap-1.5">
                        <Code className="w-4 h-4 text-[#ff6a21]" /> Open-Source Contributions
                      </h5>
                      <p className="text-[12px] text-gray-400 leading-normal">
                        Contributing active pull requests to public developer packages, visual modules, and UI utilities.
                      </p>
                    </div>
                    <div className="about-timeline-item mt-2.5 pt-2.5 border-t border-white/5">
                      <h5 className="text-[13px] font-bold text-white mb-0.5 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#ff6a21]" /> 3D WebGL Interactions
                      </h5>
                      <p className="text-[12px] text-gray-400 leading-normal">
                        Mastering shader coordinate maths, WebGL canvas integrations, and rich 3D graphics rendering.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mission Tab */}
                <div className={`about-stack-window ${activeTab === "mission" ? "active" : ""}`}>
                  <div className="about-timeline-feed">
                    <div className="about-timeline-item">
                      <h5 className="text-[13px] font-bold text-white mb-0.5 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#ff6a21]" /> Harmonizing AI & Design
                      </h5>
                      <p className="text-[12px] text-gray-400 leading-normal">
                        Coupling state-of-the-art neural models with gorgeous, responsive user design frameworks.
                      </p>
                    </div>
                    <div className="about-timeline-item mt-2.5 pt-2.5 border-t border-white/5">
                      <h5 className="text-[13px] font-bold text-white mb-0.5 flex items-center gap-1.5">
                        <Target className="w-4 h-4 text-[#ff6a21]" /> User-First Focus
                      </h5>
                      <p className="text-[12px] text-gray-400 leading-normal">
                        Constructing fast, accessible web solutions that deliver immediate utility and value to active users.
                      </p>
                    </div>
                    <div className="about-timeline-item mt-2.5 pt-2.5 border-t border-white/5">
                      <h5 className="text-[13px] font-bold text-white mb-0.5 flex items-center gap-1.5">
                        <Brain className="w-4 h-4 text-[#ff6a21]" /> Continuous Prototyping
                      </h5>
                      <p className="text-[12px] text-gray-400 leading-normal">
                        Gathering user feedback rapidly, learning through deployment, and iterating constantly.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Card 5: Philosophy Quote Carousel with Ring */}
          <div className="about-bento-card about-card-quote about-parallax-card">
            <div className="about-quote-card-layout">
              <div className="about-quote-content">
                <span className="about-quote-icon start">“</span>
                <p className={`about-quote-text transition-all duration-500 transform ${quoteFade === "in" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
                  {quotes[currentQuoteIdx].text}
                </p>
                <p className={`about-quote-author transition-all duration-500 ${quoteFade === "in" ? "opacity-90" : "opacity-0"}`}>
                  — <span className="text-[#ff6a21] font-semibold">{quotes[currentQuoteIdx].author}</span>
                </p>
              </div>
              <div className="about-quote-image-wrapper float-anim-1">
                <img src={ringImg} alt="Orange Ring Asset" className="about-quote-ring-img animate-spin-ring" />
              </div>
            </div>
          </div>

          {/* Card 6: Skill Radar (Rotating Web SVG) */}
          <div className="about-bento-card about-card-radar about-parallax-card flex flex-col justify-between">
            <h4 className="text-xs text-[#ff6a21] font-semibold tracking-wider uppercase mb-2">Core Dimensions</h4>
            <div className="about-radar-container">
              <svg className="about-radar-svg" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="rgba(255, 106, 33, 0.15)" strokeWidth="0.5" fill="none" />
                <circle cx="50" cy="50" r="30" stroke="rgba(255, 106, 33, 0.1)" strokeWidth="0.5" fill="none" />
                <circle cx="50" cy="50" r="20" stroke="rgba(255, 106, 33, 0.08)" strokeWidth="0.5" fill="none" />
                <circle cx="50" cy="50" r="10" stroke="rgba(255, 106, 33, 0.05)" strokeWidth="0.5" fill="none" />

                <line x1="50" y1="10" x2="50" y2="90" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.5" />
                <line x1="15" y1="30" x2="85" y2="70" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.5" />
                <line x1="15" y1="70" x2="85" y2="30" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.5" />

                <text x="50" y="8" textAnchor="middle" fontSize="3.5" fill="rgba(255, 255, 255, 0.5)" fontWeight="bold">PROBLEM SOLVING</text>
                <text x="90" y="32" textAnchor="start" fontSize="3.5" fill="rgba(255, 255, 255, 0.5)" fontWeight="bold">FRONTEND</text>
                <text x="90" y="72" textAnchor="start" fontSize="3.5" fill="rgba(255, 255, 255, 0.5)" fontWeight="bold">AI / ML</text>
                <text x="50" y="94" textAnchor="middle" fontSize="3.5" fill="rgba(255, 255, 255, 0.5)" fontWeight="bold">SYSTEMS</text>
                <text x="10" y="72" textAnchor="end" fontSize="3.5" fill="rgba(255, 255, 255, 0.5)" fontWeight="bold">BACKEND</text>
                <text x="10" y="32" textAnchor="end" fontSize="3.5" fill="rgba(255, 255, 255, 0.5)" fontWeight="bold">TOOLS / GIT</text>

                <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" stroke="rgba(255, 106, 33, 0.25)" strokeWidth="0.5" fill="none" />
                <polygon points="50,12 81.5,35 78.7,66 50,80 20.2,67.5 20.8,33.5" 
                         stroke="#ff6a21" strokeWidth="1" fill="rgba(255, 106, 33, 0.15)" />
                
                <circle cx="50" cy="12" r="1.5" fill="#ff6a21" />
                <circle cx="81.5" cy="35" r="1.5" fill="#ff6a21" />
                <circle cx="78.7" cy="66" r="1.5" fill="#ff6a21" />
                <circle cx="50" cy="80" r="1.5" fill="#ff6a21" />
                <circle cx="20.2" cy="67.5" r="1.5" fill="#ff6a21" />
                <circle cx="20.8" cy="33.5" r="1.5" fill="#ff6a21" />
              </svg>
            </div>
          </div>

          {/* Card 7: Interactive Journey Path */}
          <div className="about-bento-card about-card-journey about-parallax-card">
            <h4 className="text-xs text-[#ff6a21] font-semibold tracking-wider uppercase mb-3">Interactive Journey Path</h4>
            <div className="about-journey-container">
              <div className="about-journey-nodes">
                {journeySteps.map((step, idx) => (
                  <button
                    key={idx}
                    className={`about-journey-node ${activeJourney === idx ? "active" : ""}`}
                    onClick={() => setActiveJourney(idx)}
                    title={step.label}
                    aria-label={`Show details for ${step.title}`}
                  >
                    {step.icon}
                  </button>
                ))}
              </div>
              <div className="about-journey-details transition-all duration-300">
                <h4>{journeySteps[activeJourney].title}</h4>
                <p>{journeySteps[activeJourney].desc}</p>
              </div>
            </div>
          </div>

          {/* Card 8: Achievement Chips */}
          <div className="about-bento-card about-card-chips about-parallax-card">
            <h4 className="text-xs text-[#ff6a21] font-semibold tracking-wider uppercase mb-3">Core Identity Tags</h4>
            <div className="about-chips-container">
              <span className="about-chip"><Brain className="w-3.5 h-3.5 text-[#ff6a21]" /> AI Enthusiast</span>
              <span className="about-chip"><Code className="w-3.5 h-3.5 text-[#ff6a21]" /> Problem Solver</span>
              <span className="about-chip"><Activity className="w-3.5 h-3.5 text-[#ff6a21]" /> Fast Learner</span>
              <span className="about-chip"><Sparkles className="w-3.5 h-3.5 text-[#ff6a21]" /> UI/UX Lover</span>
              <span className="about-chip"><Terminal className="w-3.5 h-3.5 text-[#ff6a21]" /> Terminal Geek</span>
            </div>
          </div>

          {/* Card 9: Live Age Ticker (shifted to the very end as a footer) */}
          <div className="about-bento-card about-card-ticker about-parallax-card">
            {/* Classy rotating Earth wireframe globe in background */}
            <div className="about-ticker-earth-bg">
              <svg viewBox="0 0 100 100" className="about-earth-svg animate-spin" style={{ animationDuration: "60s" }}>
                <circle cx="50" cy="50" r="45" stroke="rgba(255, 106, 33, 0.05)" strokeWidth="0.4" fill="none" />
                <ellipse cx="50" cy="50" rx="45" ry="14" stroke="rgba(255, 106, 33, 0.03)" strokeWidth="0.4" fill="none" />
                <ellipse cx="50" cy="50" rx="45" ry="28" stroke="rgba(255, 106, 33, 0.03)" strokeWidth="0.4" fill="none" />
                <ellipse cx="50" cy="50" rx="14" ry="45" stroke="rgba(255, 106, 33, 0.03)" strokeWidth="0.4" fill="none" />
                <ellipse cx="50" cy="50" rx="28" ry="45" stroke="rgba(255, 106, 33, 0.03)" strokeWidth="0.4" fill="none" />
                <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(255, 106, 33, 0.04)" strokeWidth="0.4" />
                <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(255, 106, 33, 0.04)" strokeWidth="0.4" />
              </svg>
            </div>

            <div className="about-ticker-layout">
              <div className="about-ticker-left">
                <h4 className="text-xs text-[#ff6a21] font-semibold tracking-wider uppercase flex items-center gap-1.5">
                  <Hourglass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "4s" }} /> Time on Earth
                </h4>
                <p className="text-[10px] text-gray-500 font-mono mt-1">Present on this planet since:</p>
              </div>

              <div className="about-ticker-grid">
                <div className="about-ticker-unit">
                  <span className="about-ticker-num">{pad(age.years, 2)}</span>
                  <span className="about-ticker-label">years</span>
                </div>
                <div className="about-ticker-unit">
                  <span className="about-ticker-num">{pad(age.months, 2)}</span>
                  <span className="about-ticker-label">months</span>
                </div>
                <div className="about-ticker-unit">
                  <span className="about-ticker-num">{pad(age.days, 2)}</span>
                  <span className="about-ticker-label">days</span>
                </div>
                <div className="about-ticker-unit">
                  <span className="about-ticker-num">{pad(age.hours, 2)}</span>
                  <span className="about-ticker-label">hours</span>
                </div>
                <div className="about-ticker-unit">
                  <span className="about-ticker-num">{pad(age.minutes, 2)}</span>
                  <span className="about-ticker-label">mins</span>
                </div>
                <div className="about-ticker-unit">
                  <span className="about-ticker-num">{pad(age.seconds, 2)}</span>
                  <span className="about-ticker-label">secs</span>
                </div>
                <div className="about-ticker-unit highlight">
                  <span className="about-ticker-num text-[#ff6a21]">{pad(age.milliseconds, 2)}</span>
                  <span className="about-ticker-label text-[#ff6a21]">ms</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
