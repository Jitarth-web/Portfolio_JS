import { useEffect, useRef, useState } from "react";
import { 
  FigmaMark, 
  HtmlIcon, 
  CssIcon, 
  JsIcon, 
  ReactIcon, 
  NodeIcon, 
  PythonIcon, 
  GithubIcon, 
  GitIcon, 
  VsCodeIcon,
  ThreeJsIcon,
  GsapIcon,
  MongodbIcon,
  SqlIcon,
  CppIcon,
  LeetcodeIcon,
  LinkedinIcon,
  MailIcon
} from "./Icons";

// Tech brand glows color map
const GLOW_COLOR_MAP = {
  "HTML": "#f2672e",
  "CSS": "#2277ef",
  "JavaScript": "#f7df1e",
  "React": "#61dafb",
  "Node.js": "#72b942",
  "Three.js": "#ffffff",
  "GSAP": "#88ce02",
  "MongoDB": "#47a248",
  "SQL": "#00758f",
  "C++": "#00599c",
  "LeetCode": "#ffa116",
  "Python": "#ffd43b",
  "GitHub": "#ffffff",
  "Git": "#f05032",
  "Figma": "#f24e1e",
  "VS Code": "#007acc",
  "LinkedIn": "#0a66c2",
  "Mail": "#ff6a21"
};

const iconMap = {
  "HTML": <HtmlIcon />,
  "CSS": <CssIcon />,
  "JavaScript": <JsIcon />,
  "React": <ReactIcon />,
  "Node.js": <NodeIcon />,
  "Three.js": <ThreeJsIcon />,
  "GSAP": <GsapIcon />,
  "MongoDB": <MongodbIcon />,
  "SQL": <SqlIcon />,
  "C++": <CppIcon />,
  "LeetCode": <LeetcodeIcon />,
  "Python": <PythonIcon />,
  "GitHub": <GithubIcon />,
  "Git": <GitIcon />,
  "Figma": <FigmaMark />,
  "VS Code": <VsCodeIcon />,
  "LinkedIn": <LinkedinIcon />,
  "Mail": <MailIcon />
};

// 5 expanded orbits configuration (Rx, Ry, Tilt, Speed, Direction)
const ORBITS_CONFIG = [
  { rx: 240, ry: 220, tilt: 5, speed: 24, direction: 1, rotSpeed: 50, rotDir: 1, strokeWidth: 1.5, baseOpacity: 0.20 },    // Orbit 1: Circular core
  { rx: 340, ry: 260, tilt: 15, speed: 32, direction: -1, rotSpeed: 65, rotDir: -1, strokeWidth: 1.0, baseOpacity: 0.14 }, // Orbit 2: Medium horizontal ellipse
  { rx: 440, ry: 340, tilt: -18, speed: 40, direction: 1, rotSpeed: 80, rotDir: 1, strokeWidth: 0.8, baseOpacity: 0.10 }, // Orbit 3: Large tilted ellipse
  { rx: 550, ry: 240, tilt: 10, speed: 48, direction: -1, rotSpeed: 55, rotDir: -1, strokeWidth: 0.7, baseOpacity: 0.08 }, // Orbit 4: Wide horizontal ellipse
  { rx: 280, ry: 540, tilt: -12, speed: 46, direction: 1, rotSpeed: 70, rotDir: 1, strokeWidth: 0.5, baseOpacity: 0.06 }   // Orbit 5: Tall vertical ellipse
];

// 18 skills distributed across 5 orbits
const ICONS_CONFIG = [
  // Orbit 1 (3 icons)
  { name: "React", orbitIndex: 0, startAngle: (0 / 3) * 2 * Math.PI, globalIndex: 3 },
  { name: "GSAP", orbitIndex: 0, startAngle: (1 / 3) * 2 * Math.PI, globalIndex: 6 },
  { name: "Three.js", orbitIndex: 0, startAngle: (2 / 3) * 2 * Math.PI, globalIndex: 5 },
  
  // Orbit 2 (4 icons)
  { name: "JavaScript", orbitIndex: 1, startAngle: (0 / 4) * 2 * Math.PI, globalIndex: 2 },
  { name: "HTML", orbitIndex: 1, startAngle: (1 / 4) * 2 * Math.PI, globalIndex: 0 },
  { name: "CSS", orbitIndex: 1, startAngle: (2 / 4) * 2 * Math.PI, globalIndex: 1 },
  { name: "Node.js", orbitIndex: 1, startAngle: (3 / 4) * 2 * Math.PI, globalIndex: 4 },
  
  // Orbit 3 (4 icons)
  { name: "C++", orbitIndex: 2, startAngle: (0 / 4) * 2 * Math.PI, globalIndex: 9 },
  { name: "Python", orbitIndex: 2, startAngle: (1 / 4) * 2 * Math.PI, globalIndex: 11 },
  { name: "SQL", orbitIndex: 2, startAngle: (2 / 4) * 2 * Math.PI, globalIndex: 8 },
  { name: "MongoDB", orbitIndex: 2, startAngle: (3 / 4) * 2 * Math.PI, globalIndex: 7 },
  
  // Orbit 4 (4 icons)
  { name: "Git", orbitIndex: 3, startAngle: (0 / 4) * 2 * Math.PI, globalIndex: 13 },
  { name: "GitHub", orbitIndex: 3, startAngle: (1 / 4) * 2 * Math.PI, globalIndex: 12 },
  { name: "VS Code", orbitIndex: 3, startAngle: (2 / 4) * 2 * Math.PI, globalIndex: 15 },
  { name: "LeetCode", orbitIndex: 3, startAngle: (3 / 4) * 2 * Math.PI, globalIndex: 10 },
  
  // Orbit 5 (3 icons)
  { name: "Figma", orbitIndex: 4, startAngle: (0 / 3) * 2 * Math.PI, globalIndex: 14 },
  { name: "LinkedIn", orbitIndex: 4, startAngle: (1 / 3) * 2 * Math.PI, globalIndex: 16 },
  { name: "Mail", orbitIndex: 4, startAngle: (2 / 3) * 2 * Math.PI, globalIndex: 17 }
];

export default function OrbitSystem() {
  const containerRef = useRef(null);
  const iconRefs = useRef([]);
  const ellipseRefs = useRef([]);

  const [scale, setScale] = useState(1);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const hoveredIndexRef = useRef(null);

  // Theme color tracking state
  const [themeColor, setThemeColor] = useState("#077e7e");

  // Energy Dots and trails elements references
  const dotRefs = useRef([]);
  const trail1Refs = useRef([]);
  const trail2Refs = useRef([]);
  const sparkleRefs = useRef([]);

  // Generate random starting angles for the 5 energy dots on mount
  const dotStartAngles = useRef(Array.from({ length: 5 }, () => Math.random() * 2 * Math.PI));
  
  // Sparkle particle emitter state pool
  const sparklesPool = useRef(
    Array.from({ length: 15 }, () => ({ x: 0, y: 0, opacity: 0, size: 0, vx: 0, vy: 0 }))
  );
  const frameCounter = useRef(0);

  // MutationObserver to track active theme class changes
  useEffect(() => {
    const getThemeColor = () => {
      const className = document.documentElement.className || "";
      const match = className.match(/theme-([a-z]+)/);
      const themeName = match ? match[1] : "teal";

      const themeColors = {
        teal: "#077e7e",
        blue: "#085ece",
        red: "#ff2121",
        orange: "#ff6a21",
        green: "#43a047",
        purple: "#8e44ad",
        pink: "#e83e8c",
        yellow: "#f1c40f",
        indigo: "#4f46e5",
        black: "#333333"
      };

      return themeColors[themeName] || "#077e7e";
    };

    setThemeColor(getThemeColor());

    const observer = new MutationObserver(() => {
      setThemeColor(getThemeColor());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });

    return () => observer.disconnect();
  }, []);

  // Keep hover ref in sync for 60fps rendering loop checks
  useEffect(() => {
    hoveredIndexRef.current = hoveredIndex;
  }, [hoveredIndex]);

  // ResizeObserver to scale orbits relative to a 900px base width
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        setScale(width / 900);
      }
    });
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // requestAnimationFrame animation loop for 60fps performance
  useEffect(() => {
    let animationFrameId;
    const startTime = performance.now();

    // Helper to calculate rotated coordinate positions (fixed 900px space)
    const getCoords = (orbit, theta, elapsed, currentScale, pulseScale) => {
      const currentTilt = orbit.tilt + (elapsed * 360 / orbit.rotSpeed) * orbit.rotDir;
      const rx = orbit.rx * currentScale * pulseScale;
      const ry = orbit.ry * currentScale * pulseScale;

      const xRaw = rx * Math.cos(theta);
      const yRaw = ry * Math.sin(theta);

      const tiltRad = (currentTilt * Math.PI) / 180;
      const x = xRaw * Math.cos(tiltRad) - yRaw * Math.sin(tiltRad);
      const y = xRaw * Math.sin(tiltRad) + yRaw * Math.cos(tiltRad);

      const bobY = Math.sin(elapsed * 2.2 + theta) * 6 * currentScale;
      return { x, y: y + bobY };
    };

    const update = () => {
      const elapsed = (performance.now() - startTime) / 1000; 
      frameCounter.current += 1;

      const containerWidth = containerRef.current ? containerRef.current.clientWidth : 900;
      const currentScale = containerWidth / 900;

      // Calculate breathing pulse factor (subtle 1.5% pulse)
      const pulseScale = 1.0 + Math.sin(elapsed * 1.5) * 0.015;

      // 1. Update SVG Orbit Lines (rotate slow tilt in place)
      ORBITS_CONFIG.forEach((orbit, index) => {
        const ellipseEl = ellipseRefs.current[index];
        if (!ellipseEl) return;

        const currentTilt = orbit.tilt + (elapsed * 360 / orbit.rotSpeed) * orbit.rotDir;
        ellipseEl.setAttribute("transform", `rotate(${currentTilt} 450 450)`);
      });



      // 3. Update Energy Orbit Dots and Fading Trails
      const currentDotCoords = [];
      
      ORBITS_CONFIG.forEach((orbit, index) => {
        const dotEl = dotRefs.current[index];
        const trail1El = trail1Refs.current[index];
        const trail2El = trail2Refs.current[index];
        if (!dotEl) return;

        const dotSpeed = orbit.speed * 0.55; 
        const startAngle = dotStartAngles.current[index];

        // Core Dot
        const thetaDot = startAngle + orbit.direction * ((2 * Math.PI * elapsed) / dotSpeed);
        const posDot = getCoords(orbit, thetaDot, elapsed, currentScale, pulseScale);
        currentDotCoords.push(posDot);

        // Trail Segment 1 (50ms lag)
        const thetaTrail1 = startAngle + orbit.direction * ((2 * Math.PI * (elapsed - 0.04)) / dotSpeed);
        const posTrail1 = getCoords(orbit, thetaTrail1, elapsed - 0.04, currentScale, pulseScale);

        // Trail Segment 2 (100ms lag)
        const thetaTrail2 = startAngle + orbit.direction * ((2 * Math.PI * (elapsed - 0.08)) / dotSpeed);
        const posTrail2 = getCoords(orbit, thetaTrail2, elapsed - 0.08, currentScale, pulseScale);

        const depthSin = Math.sin(thetaDot);
        const zIndex = depthSin < 0 ? 12 : 42; 

        dotEl.style.transform = `translate(calc(-50% + ${posDot.x}px), calc(-50% + ${posDot.y}px))`;
        dotEl.style.zIndex = zIndex;

        if (trail1El) {
          trail1El.style.transform = `translate(calc(-50% + ${posTrail1.x}px), calc(-50% + ${posTrail1.y}px))`;
          trail1El.style.zIndex = zIndex - 1;
        }

        if (trail2El) {
          trail2El.style.transform = `translate(calc(-50% + ${posTrail2.x}px), calc(-50% + ${posTrail2.y}px))`;
          trail2El.style.zIndex = zIndex - 2;
        }
      });

      // 4. Sparkle Particle Pool Emission
      if (frameCounter.current % 15 === 0 && currentDotCoords.length > 0) {
        const sourceDot = currentDotCoords[Math.floor(Math.random() * currentDotCoords.length)];
        const inactiveSparkleIndex = sparklesPool.current.findIndex(s => s.opacity <= 0);
        if (inactiveSparkleIndex !== -1) {
          sparklesPool.current[inactiveSparkleIndex] = {
            x: sourceDot.x,
            y: sourceDot.y,
            opacity: 0.95,
            size: 3 + Math.random() * 4,
            vx: (Math.random() - 0.5) * 1.5 * currentScale,
            vy: (Math.random() - 0.5) * 1.5 * currentScale
          };
        }
      }

      // Update and draw active sparkles
      sparklesPool.current.forEach((sparkle, index) => {
        const sparkleEl = sparkleRefs.current[index];
        if (!sparkleEl) return;

        if (sparkle.opacity > 0) {
          sparkle.x += sparkle.vx;
          sparkle.y += sparkle.vy;
          sparkle.opacity -= 0.022;

          sparkleEl.style.transform = `translate(calc(-50% + ${sparkle.x}px), calc(-50% + ${sparkle.y}px))`;
          sparkleEl.style.opacity = sparkle.opacity;
          sparkleEl.style.width = `${sparkle.size}px`;
          sparkleEl.style.height = `${sparkle.size}px`;
          sparkleEl.style.display = "block";
        } else {
          sparkleEl.style.display = "none";
        }
      });

      // 5. Update Tech Icons positioning
      ICONS_CONFIG.forEach((icon, index) => {
        const el = iconRefs.current[index];
        if (!el) return;

        const orbit = ORBITS_CONFIG[icon.orbitIndex];
        const currentTilt = orbit.tilt + (elapsed * 360 / orbit.rotSpeed) * orbit.rotDir;
        const theta = icon.startAngle + orbit.direction * ((2 * Math.PI * elapsed) / orbit.speed);

        const rx = orbit.rx * currentScale * pulseScale;
        const ry = orbit.ry * currentScale * pulseScale;

        const xRaw = rx * Math.cos(theta);
        const yRaw = ry * Math.sin(theta);

        const tiltRad = (currentTilt * Math.PI) / 180;
        const x = xRaw * Math.cos(tiltRad) - yRaw * Math.sin(tiltRad);
        const y = xRaw * Math.sin(tiltRad) + yRaw * Math.cos(tiltRad);

        const bobY = Math.sin(elapsed * 2.2 + icon.startAngle) * 6 * currentScale;
        const finalY = y + bobY;

        const depthSin = Math.sin(theta);
        const isBehind = depthSin < 0;

        let zIndex, opacity, depthScale, blurVal;

        if (hoveredIndexRef.current === index) {
          zIndex = 50;
          opacity = 1.0;
          depthScale = 1.35;
          blurVal = 0;
        } else {
          zIndex = isBehind ? 10 : 40;
          opacity = 0.75 + (depthSin + 1) * 0.125; 
          depthScale = 0.8 + (depthSin + 1) * 0.15; 
          blurVal = isBehind ? Math.abs(depthSin) * 2 : 0; 
        }

        const selfRotate = (theta * 180 / Math.PI) * 0.05;

        el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${finalY}px)) scale(${depthScale})`;
        el.style.zIndex = zIndex;
        el.style.opacity = opacity;
        el.style.filter = blurVal > 0 ? `blur(${blurVal}px)` : "none";

        const inner = el.querySelector(".orbit-icon-inner");
        if (inner) {
          inner.style.transform = `rotate(${selfRotate}deg)`;
        }
      });

      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Styles for the energy dots, lag trails, and comets sparkles
  const inlineStyles = `
    @keyframes dotPulse {
      0%, 100% { transform: scale(0.85); box-shadow: 0 0 10px 2px ${themeColor}; }
      50% { transform: scale(1.15); box-shadow: 0 0 16px 4px ${themeColor}; }
    }
    
    .orbit-dot {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: ${themeColor};
      z-index: 42;
      animation: dotPulse 1.5s ease-in-out infinite;
      pointer-events: none;
      will-change: transform;
      transition: background-color 0.4s ease;
    }
    
    .orbit-dot-trail {
      position: absolute;
      left: 50%;
      top: 50%;
      border-radius: 50%;
      background-color: ${themeColor};
      pointer-events: none;
      will-change: transform;
      transition: background-color 0.4s ease;
    }
    
    .orbit-dot-trail.trail-1 {
      width: 6px;
      height: 6px;
      opacity: 0.45;
      z-index: 41;
    }
    
    .orbit-dot-trail.trail-2 {
      width: 4px;
      height: 4px;
      opacity: 0.22;
      z-index: 40;
    }
    
    .orbit-sparkle {
      position: absolute;
      left: 50%;
      top: 50%;
      border-radius: 50%;
      background-color: #ffffff;
      box-shadow: 0 0 6px 1.5px ${themeColor};
      pointer-events: none;
      will-change: transform;
      z-index: 39;
    }
  `;

  return (
    <div ref={containerRef} className="orbit-system" aria-hidden="true" style={{ overflow: "visible" }}>
      <style dangerouslySetInnerHTML={{ __html: inlineStyles }} />
      
      {/* SVG Canvas for Orbit Lines & Holographic curved text */}
      {/* SVG Canvas for Orbit Lines */}
      <svg 
        viewBox="0 0 900 900" 
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" }}
      >
        {/* Orbit Ellipse Lines */}
        {ORBITS_CONFIG.map((orbit, index) => {
          return (
            <ellipse
              key={index}
              ref={el => ellipseRefs.current[index] = el}
              cx="450"
              cy="450"
              rx={orbit.rx}
              ry={orbit.ry}
              fill="none"
              stroke={themeColor}
              strokeWidth={orbit.strokeWidth}
              transform={`rotate(${orbit.tilt} 450 450)`}
              style={{ 
                opacity: orbit.baseOpacity,
                transition: "stroke 0.4s ease" 
              }}
            />
          );
        })}
      </svg>

      {/* Glowing Energy Dots and Lag Trails */}
      {ORBITS_CONFIG.map((_, index) => (
        <div key={`dots-${index}`}>
          {/* Main Glowing Dot */}
          <div 
            ref={el => dotRefs.current[index] = el} 
            className="orbit-dot"
          />
          {/* Lag Trail 1 */}
          <div 
            ref={el => trail1Refs.current[index] = el} 
            className="orbit-dot-trail trail-1"
          />
          {/* Lag Trail 2 */}
          <div 
            ref={el => trail2Refs.current[index] = el} 
            className="orbit-dot-trail trail-2"
          />
        </div>
      ))}

      {/* Sparkle Emitter Pool */}
      {Array.from({ length: 15 }).map((_, index) => (
        <div 
          key={`sparkle-${index}`}
          ref={el => sparkleRefs.current[index] = el}
          className="orbit-sparkle"
          style={{ display: "none" }}
        />
      ))}

      {/* Distributed Tech Icons */}
      {ICONS_CONFIG.map((icon, index) => {
        const glowColor = GLOW_COLOR_MAP[icon.name] || "#ffffff";
        return (
          <div
            key={icon.name}
            ref={el => iconRefs.current[index] = el}
            className={`orbit-icon tech-${icon.globalIndex}`}
            style={{ "--glow-color": glowColor }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="orbit-icon-inner">
              {iconMap[icon.name] || <span>{icon.name}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
