import { useState, useEffect, useRef } from "react";
import avatarSmall from "../assets/figma/avatar-small.png";
import projectThumb from "../assets/figma/domiq.png";
import soundwaveAiImg from "../assets/figma/soundwave_ai.png";
import nexaAiImg from "../assets/figma/nexa_ai.png";
import certImg from "../pages/cert1.png";
import heatWavesCover from "../assets/figma/heat_waves_cover.png";
import daylightCover from "../assets/figma/daylight_cover.png";
import haayeReCover from "../assets/figma/haaye_re_cover.png";

const COMMITS = [
  {
    message: "feat: integrate NEXA AI agent",
    hash: "c7f8b9d",
    files: "About.jsx, styles.css",
    changes: "2 files changed, 48 insertions(+), 12 deletions(-)"
  },
  {
    message: "style: customize premium HSL color themes",
    hash: "8a9b2c3",
    files: "styles.css, ThemeSelector.jsx",
    changes: "2 files changed, 84 insertions(+), 6 deletions(-)"
  },
  {
    message: "perf: optimize WebGL shaders for mobile",
    hash: "d4e5f6a",
    files: "CyberpunkGlobe.jsx",
    changes: "1 file changed, 19 insertions(+), 35 deletions(-)"
  },
  {
    message: "fix: resolve 3D viewport canvas resizing",
    hash: "f1a2b3c",
    files: "OrbitSystem.jsx",
    changes: "1 file changed, 5 insertions(+), 4 deletions(-)"
  },
  {
    message: "refactor: clean up bento grid layouts",
    hash: "e5f6a7b",
    files: "About.jsx",
    changes: "1 file changed, 14 insertions(+), 14 deletions(-)"
  }
];

const SPOTIFY_TRACKS = [
  {
    title: "Heat Waves",
    artist: "Glass Animals",
    duration: "3:55",
    progress: "1:18",
    percent: "33%",
    coverImg: heatWavesCover,
    gradient: "from-cyan-500 to-blue-600"
  },
  {
    title: "Daylight",
    artist: "David Kushner",
    duration: "3:43",
    progress: "2:05",
    percent: "56%",
    coverImg: daylightCover,
    gradient: "from-yellow-400 to-amber-500"
  },
  {
    title: "Fortuner",
    artist: "Ruchika Jangid",
    duration: "3:12",
    progress: "0:45",
    percent: "24%",
    coverImg: haayeReCover,
    gradient: "from-orange-500 to-red-600"
  }
];

export default function InteractiveGitTerminal() {
  const [commitIdx, setCommitIdx] = useState(0);
  const currentCommit = COMMITS[commitIdx];
  const [terminalLines, setTerminalLines] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [phase, setPhase] = useState("init"); // init, status_typing, add_typing, commit_typing, push_typing, push_output, vercel_typing, vercel_output, live_demo
  const [demoScroll, setDemoScroll] = useState(0);
  const [spotifyTrackIdx, setSpotifyTrackIdx] = useState(0);
  const scrollRef = useRef(null);
  const demoIntervalRef = useRef(null);

  // Cycle Spotify tracks during live demo
  useEffect(() => {
    let spotifyInterval;
    if (phase === "live_demo") {
      spotifyInterval = setInterval(() => {
        setSpotifyTrackIdx((prev) => (prev + 1) % SPOTIFY_TRACKS.length);
      }, 3500);
    } else {
      setSpotifyTrackIdx(0);
    }
    return () => {
      if (spotifyInterval) clearInterval(spotifyInterval);
    };
  }, [phase]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [terminalLines, currentInput]);

  // Scroll effect in mock browser preview
  useEffect(() => {
    if (phase === "live_demo") {
      setDemoScroll(0);
      let direction = 1;
      demoIntervalRef.current = setInterval(() => {
        setDemoScroll((prev) => {
          if (prev >= 620) {
            direction = -1;
          } else if (prev <= 0) {
            direction = 1;
          }
          return prev + direction * 1.5;
        });
      }, 50);
    } else {
      if (demoIntervalRef.current) {
        clearInterval(demoIntervalRef.current);
      }
    }
    return () => {
      if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
    };
  }, [phase]);

  useEffect(() => {
    let timer;

    const typeCommand = (fullText, onComplete) => {
      let index = 0;
      setCurrentInput("");
      const interval = setInterval(() => {
        if (index < fullText.length) {
          setCurrentInput((prev) => prev + fullText.charAt(index));
          index++;
        } else {
          clearInterval(interval);
          setTimeout(onComplete, 300);
        }
      }, 55);
    };

    if (phase === "init") {
      setTerminalLines([]);
      setCurrentInput("");
      timer = setTimeout(() => {
        setPhase("status_typing");
      }, 800);
    } else if (phase === "status_typing") {
      typeCommand("git status", () => {
        setTerminalLines((prev) => [
          ...prev,
          { text: "jitarth@git-console:~/portfolio$ git status", type: "command" },
          { text: "On branch main", type: "output" },
          { text: "Your branch is up to date with 'origin/main'.", type: "output" },
          { text: "", type: "output" },
          { text: "Changes not staged for commit:", type: "output" },
          { text: "  (use \"git add <file>...\" to update what will be committed)", type: "meta" },
          { text: `\tmodified:   src/sections/${currentCommit.files.split(", ")[0]}`, type: "danger" },
          currentCommit.files.split(", ")[1] ? { text: `\tmodified:   src/${currentCommit.files.split(", ")[1]}`, type: "danger" } : null,
          { text: "", type: "output" },
          { text: "no changes added to commit (use \"git add\" and/or \"git commit -a\")", type: "output" }
        ].filter(Boolean));
        setCurrentInput("");
        setPhase("add_typing");
      });
    } else if (phase === "add_typing") {
      timer = setTimeout(() => {
        typeCommand("git add .", () => {
          setTerminalLines((prev) => [
            ...prev,
            { text: "jitarth@git-console:~/portfolio$ git add .", type: "command" }
          ]);
          setCurrentInput("");
          setPhase("commit_typing");
        });
      }, 600);
    } else if (phase === "commit_typing") {
      timer = setTimeout(() => {
        typeCommand(`git commit -m "${currentCommit.message}"`, () => {
          setTerminalLines((prev) => [
            ...prev,
            { text: `jitarth@git-console:~/portfolio$ git commit -m "${currentCommit.message}"`, type: "command" },
            { text: `[main ${currentCommit.hash}] ${currentCommit.message}`, type: "output-success" },
            { text: ` ${currentCommit.changes}`, type: "output" }
          ]);
          setCurrentInput("");
          setPhase("push_typing");
        });
      }, 600);
    } else if (phase === "push_typing") {
      timer = setTimeout(() => {
        typeCommand("git push origin main", () => {
          setTerminalLines((prev) => [
            ...prev,
            { text: "jitarth@git-console:~/portfolio$ git push origin main", type: "command" }
          ]);
          setCurrentInput("");
          setPhase("push_output");
        });
      }, 600);
    } else if (phase === "push_output") {
      const lines = [
        "Enumerating objects: 7, done.",
        "Counting objects: 100% (7/7), done.",
        "Delta compression using up to 12 threads",
        "Compressing objects: 100% (4/4), done.",
        `Writing objects: 100% (4/4), 624 bytes | 624.00 KiB/s, done.`,
        "Total 4 (delta 3), reused 0 (delta 0)",
        "To github.com:Jitarth-web/Portfolio_JS.git",
        `   a5f8c1b..${currentCommit.hash}  main -> main`,
        "✓ Push successful! origin/main updated."
      ];

      let currentLineIdx = 0;
      const interval = setInterval(() => {
        if (currentLineIdx < lines.length) {
          const type = currentLineIdx === lines.length - 1 ? "output-success" : "output";
          setTerminalLines((prev) => [...prev, { text: lines[currentLineIdx], type }]);
          currentLineIdx++;
        } else {
          clearInterval(interval);
          setPhase("vercel_typing");
        }
      }, 200);
    } else if (phase === "vercel_typing") {
      timer = setTimeout(() => {
        typeCommand("vercel --prod", () => {
          setTerminalLines((prev) => [
            ...prev,
            { text: "jitarth@git-console:~/portfolio$ vercel --prod", type: "command" }
          ]);
          setCurrentInput("");
          setPhase("vercel_output");
        });
      }, 600);
    } else if (phase === "vercel_output") {
      const vercelLines = [
        "Vercel CLI 34.2.0 - Deploying to Production...",
        "Inspect URL: https://vercel.com/jitarth-web/portfolio/inspect [copied]",
        "Production URL: https://jitarth.dev",
        "✓ Building client bundle (Vite compilation)...",
        "✓ Compiling modules: 2743 transformed",
        "✓ Serverless routes verified",
        "✓ Production deployment active!",
        "✓ Edge Network cached successfully"
      ];

      let currentLineIdx = 0;
      const interval = setInterval(() => {
        if (currentLineIdx < vercelLines.length) {
          const type = vercelLines[currentLineIdx].startsWith("✓") ? "output-success" : "output";
          setTerminalLines((prev) => [...prev, { text: vercelLines[currentLineIdx], type }]);
          currentLineIdx++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setPhase("live_demo");
          }, 1000);
        }
      }, 220);
    } else if (phase === "live_demo") {
      timer = setTimeout(() => {
        setCommitIdx((prev) => (prev + 1) % COMMITS.length);
        setPhase("init");
      }, 15000); // Show live browser preview for 15 seconds
    }

    return () => {
      clearTimeout(timer);
    };
  }, [phase, commitIdx]);

  const renderLine = (line, idx) => {
    switch (line.type) {
      case "command":
        return (
          <div key={idx} className="font-mono text-xs text-white mb-1">
            {line.text}
          </div>
        );
      case "danger":
        return (
          <div key={idx} className="font-mono text-xs text-red-400 mb-0.5 pl-2">
            {line.text}
          </div>
        );
      case "meta":
        return (
          <div key={idx} className="font-mono text-[10px] text-gray-500 mb-0.5">
            {line.text}
          </div>
        );
      case "output-success":
        return (
          <div key={idx} className="font-mono text-xs text-green-400 mb-0.5">
            {line.text}
          </div>
        );
      default:
        return (
          <div key={idx} className="font-mono text-xs text-gray-400 mb-0.5">
            {line.text}
          </div>
        );
    }
  };

  if (phase === "live_demo") {
    return (
      <div className="w-full h-full flex flex-col bg-[#05080c] border border-white/5 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500">
        {/* Browser Header Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#090d16] border-b border-white/5 select-none shrink-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <div className="flex-1 max-w-[200px] mx-4 py-1 px-3.5 bg-white/[0.03] border border-white/5 rounded-md text-[10.5px] font-mono text-center text-white/70 flex items-center justify-center gap-1">
            <span className="truncate">http://127.0.0.1:5174/</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-green-400 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
            <span className="hidden sm:inline">LIVE PREVIEW</span>
          </div>
        </div>

        {/* Browser Body Mockup */}
        <div 
          className="flex-1 relative overflow-hidden flex flex-col items-center"
          style={{ background: "radial-gradient(circle at 50% 15%, rgba(7, 126, 126, 0.22), rgba(0,0,0,0) 65%), #03060a" }}
        >
          {/* Mock scrolling web container */}
          <div 
            className="w-full px-5 py-4 flex flex-col gap-4.5 transition-transform duration-75 ease-out select-none"
            style={{ transform: `translateY(-${demoScroll}px)` }}
          >
            {/* Mock Nav */}
            <div className="flex justify-between items-center pb-2 border-b border-white/5 shrink-0">
              <span className="font-bold text-[11px] text-white tracking-widest bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">JITARTH</span>
              <div className="flex gap-3 text-[9.5px] text-white/50">
                <span>About</span>
                <span>Projects</span>
                <span>Contact</span>
              </div>
            </div>

            {/* Mock Hero info */}
            <div className="flex flex-col gap-2.5 pt-1.5 shrink-0">
              <div className="relative self-center w-14 h-14 rounded-full border border-white/10 p-[1.5px] bg-gradient-to-tr from-cyan-400 to-purple-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                <img src={avatarSmall} alt="Avatar" className="w-full h-full object-cover rounded-full" />
              </div>
              <div className="text-[14px] font-bold text-white text-center tracking-wide font-sans">
                Jitarth Singh
              </div>
              <div className="text-[10px] text-cyan-400 font-mono text-center uppercase tracking-widest font-semibold mt-[-5px]">
                Full Stack AI Developer
              </div>
              <div className="text-[10.5px] text-white/70 text-center leading-relaxed max-w-[240px] mx-auto mt-0.5 font-sans">
                CSE Student @ NIT Delhi. Building visual, high-performance web applications and neural network agents.
              </div>
            </div>

            {/* Section 1: Skills */}
            <div className="flex flex-col gap-2 shrink-0">
              <span className="text-[10px] font-bold text-white tracking-wider uppercase">Tech Stack</span>
              <div className="p-3 bg-[#090d16]/80 border border-white/5 rounded-lg flex flex-wrap gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
                <span className="px-2 py-0.5 text-[8.5px] font-mono text-orange-400 bg-orange-400/10 border border-orange-400/20 rounded">HTML</span>
                <span className="px-2 py-0.5 text-[8.5px] font-mono text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 rounded">React</span>
                <span className="px-2 py-0.5 text-[8.5px] font-mono text-purple-400 bg-purple-400/10 border border-purple-400/20 rounded">Node</span>
                <span className="px-2 py-0.5 text-[8.5px] font-mono text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded">JS</span>
                <span className="px-2 py-0.5 text-[8.5px] font-mono text-green-400 bg-green-400/10 border border-green-400/20 rounded">Python</span>
                <span className="px-2 py-0.5 text-[8.5px] font-mono text-blue-400 bg-blue-400/10 border border-blue-400/20 rounded">C++</span>
              </div>
            </div>

            {/* Section 2: Projects Showcase */}
            <div className="flex flex-col gap-2.5 shrink-0">
              <span className="text-[10px] font-bold text-white tracking-wider uppercase">Projects Showcase</span>
              
              {/* Project Card 1 */}
              <div className="p-3 bg-[#090d16]/80 border border-white/5 rounded-lg flex gap-3 items-center justify-between shadow-[0_4px_12px_rgba(0,0,0,0.4)] overflow-hidden">
                <div className="flex-1 min-w-0">
                  <span className="text-[7.5px] text-cyan-400 uppercase tracking-widest font-bold">Featured Project</span>
                  <span className="text-[12px] font-bold text-white mt-0.5 block truncate">Domiq AI</span>
                  <span className="text-[9.5px] text-white/50 block leading-snug mt-0.5">Interactive 3D floor layout planner & compiler</span>
                </div>
                <img src={projectThumb} alt="Domiq Preview" className="w-16 h-11 object-cover rounded border border-white/10 shrink-0 shadow-[0_0_6px_rgba(255,255,255,0.08)]" />
              </div>

              {/* Project Card 2 */}
              <div className="p-3 bg-[#090d16]/80 border border-white/5 rounded-lg flex gap-3 items-center justify-between shadow-[0_4px_12px_rgba(0,0,0,0.4)] overflow-hidden">
                <div className="flex-1 min-w-0">
                  <span className="text-[7.5px] text-purple-400 uppercase tracking-widest font-bold">Neural Engine</span>
                  <span className="text-[12px] font-bold text-white mt-0.5 block truncate">Soundwave AI</span>
                  <span className="text-[9.5px] text-white/50 block leading-snug mt-0.5">Real-time voice processing & synthesis model</span>
                </div>
                <img src={soundwaveAiImg} alt="Soundwave Preview" className="w-16 h-11 object-cover rounded border border-white/10 shrink-0 shadow-[0_0_6px_rgba(255,255,255,0.08)]" />
              </div>

              {/* Project Card 3 */}
              <div className="p-3 bg-[#090d16]/80 border border-white/5 rounded-lg flex gap-3 items-center justify-between shadow-[0_4px_12px_rgba(0,0,0,0.4)] overflow-hidden">
                <div className="flex-1 min-w-0">
                  <span className="text-[7.5px] text-emerald-400 uppercase tracking-widest font-bold">Agentic Orchestration</span>
                  <span className="text-[12px] font-bold text-white mt-0.5 block truncate">Nexa AI</span>
                  <span className="text-[9.5px] text-white/50 block leading-snug mt-0.5">Autonomous workspace assistant network</span>
                </div>
                <img src={nexaAiImg} alt="Nexa Preview" className="w-16 h-11 object-cover rounded border border-white/10 shrink-0 shadow-[0_0_6px_rgba(255,255,255,0.08)]" />
              </div>
            </div>

            {/* Section 3: Spotify Coding Playlist */}
            <div className="flex flex-col gap-2.5 shrink-0">
              <span className="text-[10px] font-bold text-white tracking-wider uppercase flex items-center gap-1">
                <span className="text-green-500 font-bold">●</span> Coding Playlist
              </span>
              <div className="p-3.5 bg-[#090d16]/95 border border-green-500/20 rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.5)] flex flex-col gap-2.5">
                {/* Now Playing Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-green-500 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.893-1.007-.336.074-.67-.14-.744-.477-.074-.336.14-.67.477-.744 3.844-.88 7.15-.502 9.813 1.13.295.18.387.565.207.861zm1.226-2.723c-.226.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.076-1.183-.412.125-.845-.107-.97-.52-.125-.413.107-.847.52-.972 3.666-1.112 8.243-.57 11.34 1.333.367.227.487.708.26 1.076zm.106-2.833C14.707 9.07 9.3 8.892 6.182 9.837c-.478.145-.98-.124-1.125-.6-.145-.478.125-.98.6-.126 3.593-1.09 9.544-.883 13.275 1.332.43.256.57.813.314 1.243-.256.43-.813.57-1.243.314z"/>
                    </svg>
                    <span className="text-[9px] text-green-400 font-bold uppercase tracking-wider font-mono">Spotify Now Playing</span>
                  </div>
                  {/* Visualizer bars */}
                  <div className="flex gap-0.5 items-end h-3">
                    <span className="w-[1.5px] h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <span className="w-[1.5px] h-3.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                    <span className="w-[1.5px] h-2.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>

                {/* Track Details */}
                <div className="flex items-center gap-3">
                  {/* Album art cover */}
                  <div className="w-11 h-11 rounded-lg border border-white/10 shrink-0 flex items-center justify-center relative overflow-hidden transition-all duration-500 shadow-[0_0_8px_rgba(0,0,0,0.5)]">
                    <img src={SPOTIFY_TRACKS[spotifyTrackIdx].coverImg} alt="Album Art" className="w-full h-full object-cover" />
                  </div>
                  
                  {/* Title & Artist */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-bold text-white truncate leading-tight transition-all duration-500">{SPOTIFY_TRACKS[spotifyTrackIdx].title}</div>
                    <div className="text-[9.5px] text-white/50 truncate transition-all duration-500">{SPOTIFY_TRACKS[spotifyTrackIdx].artist}</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="flex flex-col gap-1 mt-0.5">
                  <div className="w-full h-1 bg-white/15 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: SPOTIFY_TRACKS[spotifyTrackIdx].percent }} />
                  </div>
                  <div className="flex justify-between text-[7px] text-white/40 font-mono">
                    <span>{SPOTIFY_TRACKS[spotifyTrackIdx].progress}</span>
                    <span>{SPOTIFY_TRACKS[spotifyTrackIdx].duration}</span>
                  </div>
                </div>

                {/* Mini Playlist list */}
                <div className="flex flex-col gap-2 border-t border-white/5 pt-2.5 mt-0.5">
                  {SPOTIFY_TRACKS.map((track, idx) => (
                    <div key={idx} className={`flex items-center justify-between text-[9px] transition-colors duration-300 ${idx === spotifyTrackIdx ? "text-green-400 font-bold" : "text-white/60"}`}>
                      <div className="flex items-center gap-2 min-w-0">
                        {idx === spotifyTrackIdx ? (
                          <span className="text-green-400 font-mono text-[7px]">▶</span>
                        ) : (
                          <span className="text-white/30">{idx + 1}</span>
                        )}
                        <div className="w-6 h-6 rounded-md border border-white/5 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                          <img src={track.coverImg} alt="cover" className="w-full h-full object-cover" />
                        </div>
                        <span className="truncate">{track.title}</span>
                      </div>
                      <span className={idx === spotifyTrackIdx ? "text-green-400" : "text-white/30 font-mono"}>{track.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Commit Badge */}
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-between mt-1 shrink-0 shadow-[0_2px_8px_rgba(16,185,129,0.05)]">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span className="text-[9.5px] font-mono text-emerald-400 truncate max-w-[155px]">
                  Build deployed: {currentCommit.message}
                </span>
              </div>
              <span className="text-[8px] font-mono text-white/40 shrink-0 pl-1">#{currentCommit.hash}</span>
            </div>
            
            <div className="h-36 shrink-0" /> {/* Large Spacer for scroll-end visibility */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#05080c] border border-white/5 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#090d16] border-b border-white/5 select-none shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <div className="text-[10px] font-mono tracking-wider font-semibold text-white/50 flex items-center gap-1">
          <span>github.com/Jitarth-web</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-green-400 font-mono font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span>origin/main</span>
        </div>
      </div>

      {/* Terminal logs content */}
      <div 
        ref={scrollRef} 
        className="flex-1 p-4 overflow-y-auto scrollbar-thin select-text text-left"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none"
        }}
      >
        {terminalLines.map((line, idx) => renderLine(line, idx))}

        {/* Current prompt typing */}
        {(phase.includes("typing") || phase === "push_output" || phase === "vercel_output") && (
          <div className="font-mono text-xs text-white flex items-center flex-wrap">
            <span className="text-white/60">jitarth@git-console:~/portfolio$&nbsp;</span>
            <span className="text-white font-semibold">{currentInput}</span>
            <span className="w-1.5 h-3.5 bg-white ml-0.5 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}
