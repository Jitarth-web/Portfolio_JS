import { useRef, useEffect } from 'react';
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
import { ExternalLink, Play, Lock } from "lucide-react";
import FloatingSticker from "../components/FloatingSticker";

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



// Official Chromium 44x47 Pixel-Grid Chrome Dino Renderer
const drawChromeDinoOfficial = (ctx, x, y, isDucking, isJumping, frame, color) => {
  ctx.save();
  ctx.fillStyle = color;
  const s = 0.52; // Scale factor matching official 44x47 Chrome Dino

  if (isDucking) {
    // Official Chrome Ducking Dino (59x26 grid, connected body & grounded feet)
    const dy = y + 10;
    // 1. Continuous Connected Body & Head (X=6..54, Y=10..21)
    ctx.fillRect(x + 6 * s, dy + 10 * s, 48 * s, 11 * s);
    // Snout extension
    ctx.fillRect(x + 48 * s, dy + 12 * s, 8 * s, 7 * s);

    // Eye cutout
    ctx.fillStyle = 'rgba(8, 8, 12, 0.95)';
    ctx.fillRect(x + 44 * s, dy + 12 * s, 4 * s, 4 * s);
    ctx.fillStyle = color;

    // 2. Connected Tail (X=0..8, Y=10..16)
    ctx.fillRect(x + 0 * s, dy + 10 * s, 8 * s, 6 * s);

    // 3. Grounded Sliding Feet (Y=21..27)
    const runAnim = Math.floor(frame / 4) % 2 === 0;
    ctx.fillRect(x + 14 * s, dy + 21 * s, runAnim ? 6 * s : 10 * s, 6 * s);
    ctx.fillRect(x + 28 * s, dy + 21 * s, runAnim ? 10 * s : 6 * s, 6 * s);
  } else {
    // Official Standing / Running Chrome Dino (44x47 pixel grid)
    // 1. Skull & Snout
    ctx.fillRect(x + 22 * s, y + 0 * s, 22 * s, 14 * s);

    // Eye cutout
    ctx.fillStyle = 'rgba(8, 8, 12, 0.95)';
    ctx.fillRect(x + 26 * s, y + 3 * s, 4 * s, 4 * s);
    ctx.fillStyle = color;

    // Mouth slit cutout
    ctx.fillStyle = 'rgba(8, 8, 12, 0.95)';
    ctx.fillRect(x + 34 * s, y + 9 * s, 10 * s, 2 * s);
    ctx.fillStyle = color;

    // 2. Neck & Torso
    ctx.fillRect(x + 22 * s, y + 14 * s, 12 * s, 8 * s); // Neck
    ctx.fillRect(x + 12 * s, y + 22 * s, 22 * s, 12 * s); // Torso

    // 3. Tail (Extends horizontally to the left behind hip)
    ctx.fillRect(x + 6 * s, y + 24 * s, 6 * s, 6 * s);
    ctx.fillRect(x + 2 * s, y + 22 * s, 4 * s, 6 * s);
    ctx.fillRect(x + 0 * s, y + 20 * s, 2 * s, 4 * s);

    // 4. Front T-Rex Arm
    ctx.fillRect(x + 32 * s, y + 26 * s, 6 * s, 2 * s);
    ctx.fillRect(x + 36 * s, y + 28 * s, 2 * s, 3 * s);

    // 5. Legs & Feet
    if (isJumping) {
      ctx.fillRect(x + 16 * s, y + 34 * s, 4 * s, 10 * s);
      ctx.fillRect(x + 16 * s, y + 42 * s, 6 * s, 2 * s);
      ctx.fillRect(x + 26 * s, y + 34 * s, 4 * s, 10 * s);
      ctx.fillRect(x + 26 * s, y + 42 * s, 6 * s, 2 * s);
    } else {
      const runAnim = Math.floor(frame / 4) % 2 === 0;
      if (runAnim) {
        // Left leg down
        ctx.fillRect(x + 16 * s, y + 34 * s, 4 * s, 10 * s);
        ctx.fillRect(x + 16 * s, y + 42 * s, 6 * s, 2 * s);
        // Right leg bent back
        ctx.fillRect(x + 26 * s, y + 34 * s, 8 * s, 4 * s);
      } else {
        // Left leg bent back
        ctx.fillRect(x + 14 * s, y + 34 * s, 8 * s, 4 * s);
        // Right leg down
        ctx.fillRect(x + 26 * s, y + 34 * s, 4 * s, 10 * s);
        ctx.fillRect(x + 26 * s, y + 42 * s, 6 * s, 2 * s);
      }
    }
  }
  ctx.restore();
};

function AutomaticDinoGame() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    canvas.width = 240;
    canvas.height = 90;

    // Theme color helper
    const getThemeColor = () => {
      return getComputedStyle(document.documentElement).getPropertyValue('--theme-color').trim() || '#00d2ff';
    };

    let themeColor = getThemeColor();

    const observer = new MutationObserver(() => {
      themeColor = getThemeColor();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'class'] });

    // Audio Synthesizer (Web Audio API) - Disabled as requested
    const initAudio = () => {};
    const playSound = (type) => {};

    // Parallax objects
    let clouds = [
      { x: 40, y: 15, w: 20, speed: 0.12 },
      { x: 140, y: 10, w: 28, speed: 0.08 },
      { x: 220, y: 18, w: 16, speed: 0.15 }
    ];

    let mountains = [
      { x: 0, w: 80, h: 22, speed: 0.25 },
      { x: 120, w: 60, h: 16, speed: 0.25 },
      { x: 200, w: 90, h: 28, speed: 0.25 }
    ];

    // Day/Night Cycle & Weather
    let skyCycle = 0; // 0 to 2000
    let weatherType = 'clear'; // 'clear' | 'rain' | 'snow'
    let weatherTimer = 0;
    let weatherParticles = [];

    // Particle system
    let particles = [];
    const spawnParticle = (x, y, vx, vy, size, life, color) => {
      particles.push({ x, y, vx, vy, size, maxLife: life, life, color });
    };

    // Float score tags
    let floatingTexts = [];
    const spawnFloatText = (x, y, text) => {
      floatingTexts.push({ x, y, text, life: 40, maxLife: 40 });
    };

    // Game variables
    let controlMode = 'auto'; // 'auto' | 'manual'
    let autoTimeout = 0;
    let score = 0;
    let highScore = 0;
    let isGameOver = false;
    let gameOverTimer = 0;
    let currentThemeColor = themeColor;

    let dino = {
      x: 25,
      y: 48,
      w: 24,
      h: 24,
      vy: 0,
      gravity: 0.65,
      jumpStrength: -7.6,
      isJumping: false,
      isDucking: false,
      duckTimer: 0,
      frame: 0
    };

    let obstacles = [];
    let gameSpeed = 3.2;
    let spawnTimer = 0;

    // Achievement alerts
    let achievement = null;
    let achievementTimer = 0;
    const triggerAchievement = (title) => {
      achievement = title;
      achievementTimer = 120; // 2 seconds at 60fps
      playSound('achievement');
    };

    // Input handlers
    const handleJumpInput = () => {
      initAudio();
      controlMode = 'manual';
      autoTimeout = 480; // 8 seconds at 60fps

      if (isGameOver) {
        resetGame();
        return;
      }

      if (!dino.isJumping && !dino.isDucking) {
        dino.vy = dino.jumpStrength;
        dino.isJumping = true;
        playSound('jump');
        // Spawn jump dust
        for (let i = 0; i < 6; i++) {
          spawnParticle(dino.x + 8, dino.y + 24, (Math.random() - 0.5) * 1.5, Math.random() * -1, 2 + Math.random() * 2, 20 + Math.random() * 15, `${themeColor}aa`);
        }
      }
    };

    const handleDuckInput = (ducking) => {
      initAudio();
      controlMode = 'manual';
      autoTimeout = 480;

      if (isGameOver) return;

      if (ducking) {
        if (!dino.isJumping) {
          if (!dino.isDucking) playSound('duck');
          dino.isDucking = true;
          dino.duckTimer = 1; // hold duck
        }
      } else {
        dino.isDucking = false;
      }
    };

    // Keyboard bindings
    const handleKeyDown = (e) => {
      if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        handleJumpInput();
      }
      if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        handleDuckInput(true);
      }
    };

    const handleKeyUp = (e) => {
      if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        handleDuckInput(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const resetGame = () => {
      dino.y = 48;
      dino.vy = 0;
      dino.isJumping = false;
      dino.isDucking = false;
      obstacles = [];
      score = 0;
      gameSpeed = 3.2;
      spawnTimer = 0;
      isGameOver = false;
    };

    // Main loops
    const update = () => {
      dino.frame++;

      // Day / Night sky color calculation
      skyCycle = (skyCycle + 0.5) % 2000;
      let isNight = skyCycle > 1000;

      let skyBg = 'rgba(8, 8, 12, 0.9)'; // Default
      let drawColor = themeColor;

      if (isNight) {
        currentThemeColor = `color-mix(in srgb, ${themeColor} 85%, #ffffff)`;
      } else {
        currentThemeColor = themeColor;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render Parallax Mountains
      ctx.fillStyle = isNight ? `${themeColor}0f` : `${themeColor}08`;
      mountains.forEach(mt => {
        mt.x -= mt.speed;
        if (mt.x + mt.w < 0) mt.x = canvas.width;

        ctx.beginPath();
        ctx.moveTo(mt.x, 72);
        ctx.lineTo(mt.x + mt.w / 2, 72 - mt.h);
        ctx.lineTo(mt.x + mt.w, 72);
        ctx.fill();

        // Wrap drawing around edges
        if (mt.x + mt.w > canvas.width) {
          ctx.beginPath();
          ctx.moveTo(mt.x - canvas.width, 72);
          ctx.lineTo(mt.x - canvas.width + mt.w / 2, 72 - mt.h);
          ctx.lineTo(mt.x - canvas.width + mt.w, 72);
          ctx.fill();
        }
      });

      // Render Clouds
      ctx.fillStyle = isNight ? `${themeColor}22` : `${themeColor}12`;
      clouds.forEach(cl => {
        cl.x -= cl.speed;
        if (cl.x + cl.w < 0) cl.x = canvas.width;

        // Draw bubble cloud
        ctx.beginPath();
        ctx.arc(cl.x, cl.y, 6, 0, Math.PI * 2);
        ctx.arc(cl.x + 8, cl.y - 2, 8, 0, Math.PI * 2);
        ctx.arc(cl.x + 16, cl.y, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      // Twinkling Stars (Night only)
      if (isNight) {
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 5; i++) {
          const starX = (skyCycle * (i + 1) * 3) % canvas.width;
          const starY = (i * 12 + 10) % 35;
          const blink = Math.sin(dino.frame * 0.1 + i) > 0;
          if (blink) {
            ctx.fillRect(starX, starY, 1.2, 1.2);
          }
        }
      }

      // Draw Ground line
      ctx.strokeStyle = `${currentThemeColor}55`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 72);
      ctx.lineTo(canvas.width, 72);
      ctx.stroke();



      // Score logic
      if (!isGameOver) {
        score += 0.15;
        if (score > highScore) highScore = Math.floor(score);

        // Score milestones (sound effects)
        if (Math.floor(score) > 0 && Math.floor(score) % 100 === 0 && Math.floor(score - 0.15) % 100 !== 0) {
          playSound('score');
          spawnFloatText(dino.x + 8, dino.y - 12, '100 pts!');
        }

        // Achievements triggers
        if (Math.floor(score) === 150) triggerAchievement('SPEED DEMON');
        if (Math.floor(score) === 400) triggerAchievement('DINO DASH');
      }

      // Autoplay controller logic
      if (controlMode === 'auto') {
        let nextObstacle = obstacles.find(obs => obs.x > dino.x);
        if (nextObstacle) {
          const dist = nextObstacle.x - dino.x;
          const triggerDist = gameSpeed * 15.5 + 8; // Adaptive autopilot distance

          if (dist > 0 && dist < triggerDist) {
            if (nextObstacle.type === 'cactus') {
              if (!dino.isJumping && !dino.isDucking) {
                dino.vy = dino.jumpStrength;
                dino.isJumping = true;
                playSound('jump');
                // Spawn jump dust
                for (let i = 0; i < 4; i++) {
                  spawnParticle(dino.x + 8, dino.y + 24, (Math.random() - 0.5) * 1.2, Math.random() * -1, 1.5, 20, `${themeColor}88`);
                }
              }
            } else if (nextObstacle.type === 'bird') {
              if (!dino.isJumping) {
                dino.isDucking = true;
                dino.duckTimer = 18; // auto duck duration
                playSound('duck');
              }
            }
          }
        }
      } else {
        // Decrement manual override timer
        autoTimeout--;
        if (autoTimeout <= 0) {
          controlMode = 'auto';
          triggerAchievement('AUTOPILOT ON');
        }
      }

      // Spawner logic
      if (!isGameOver) {
        spawnTimer++;
        if (spawnTimer > 38 + Math.random() * 24) {
          const rType = Math.random();
          const obstacleType = rType > 0.45 ? 'cactus' : 'bird';
          obstacles.push({
            x: canvas.width,
            y: obstacleType === 'cactus' ? 48 : 28, // Height placement
            w: obstacleType === 'cactus' ? (Math.random() > 0.6 ? 18 : 12) : 16, // Single or double cacti
            h: obstacleType === 'cactus' ? 24 : 12,
            type: obstacleType,
            closePassed: false
          });
          spawnTimer = 0;
        }

        // Slowly accelerate game speed
        gameSpeed = Math.min(5.5, 3.2 + score * 0.002);
      }

      // Update & Draw Obstacles
      obstacles.forEach((obs) => {
        if (!isGameOver) obs.x -= gameSpeed;

        // Perfect dodge calculation (only when player is in manual mode)
        if (controlMode === 'manual' && !obs.closePassed && obs.x < dino.x + 4) {
          obs.closePassed = true;
          // Trigger a spark score popup
          spawnFloatText(dino.x + 8, dino.y - 14, '+200 DODGE');
          playSound('score');
          score += 20;

          // Spawn sparkle debris
          for (let i = 0; i < 8; i++) {
            spawnParticle(obs.x + obs.w / 2, obs.y + obs.h / 2, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, 2, 30, '#ffffff');
          }
        }

        // Draw obstacle (Original Clean Pixel Design)
        ctx.fillStyle = currentThemeColor;
        if (obs.type === 'cactus') {
          // Pixel Cactus
          ctx.fillRect(obs.x + 5, obs.y, 5, 24); // Trunk
          ctx.fillRect(obs.x + 1, obs.y + 6, 4, 4); // Left branch
          ctx.fillRect(obs.x + 1, obs.y + 3, 3, 3);
          ctx.fillRect(obs.x + 10, obs.y + 9, 4, 4); // Right branch
          ctx.fillRect(obs.x + 11, obs.y + 6, 3, 3);
        } else {
          // Pixel Bird
          ctx.fillRect(obs.x + 3, obs.y + 3, 10, 6); // Body
          ctx.fillRect(obs.x + 11, obs.y, 5, 4); // Head
          // Wing flapping
          const flap = Math.floor(dino.frame / 4) % 2 === 0;
          if (flap) {
            ctx.fillRect(obs.x + 6, obs.y - 4, 4, 7); // Wing up
          } else {
            ctx.fillRect(obs.x + 6, obs.y + 6, 4, 7); // Wing down
          }
        }

        // Collision Check (only check if NOT gameover already)
        if (!isGameOver) {
          const boxDino = {
            x: dino.x + 4,
            y: dino.isDucking ? dino.y + 8 : dino.y + 2,
            w: dino.isDucking ? dino.w - 6 : dino.w - 8,
            h: dino.isDucking ? dino.h - 8 : dino.h - 4
          };

          const boxObs = {
            x: obs.x + 2,
            y: obs.y + 2,
            w: obs.w - 4,
            h: obs.h - 4
          };

          if (
            boxDino.x < boxObs.x + boxObs.w &&
            boxDino.x + boxDino.w > boxObs.x &&
            boxDino.y < boxObs.y + boxObs.h &&
            boxDino.y + boxDino.h > boxObs.y
          ) {
            // Collision!
            isGameOver = true;
            gameOverTimer = 240; // 4 seconds screen time
            playSound('crash');

            // Spawn explosion particles
            for (let i = 0; i < 20; i++) {
              spawnParticle(
                dino.x + 12,
                dino.y + 12,
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 4,
                3,
                40,
                themeColor
              );
            }
          }
        }
      });

      // Clear offscreen obstacles
      obstacles = obstacles.filter(obs => obs.x + obs.w > 0);

      // Dino Physics
      if (dino.isJumping) {
        dino.y += dino.vy;
        dino.vy += dino.gravity;
        if (dino.y >= 48) {
          dino.y = 48;
          dino.isJumping = false;
          dino.vy = 0;
          // Spawn landing splash particles
          for (let i = 0; i < 5; i++) {
            spawnParticle(dino.x + 4, dino.y + 24, -1 - Math.random() * 0.8, -0.2, 1.5, 15, `${themeColor}aa`);
            spawnParticle(dino.x + 20, dino.y + 24, 1 + Math.random() * 0.8, -0.2, 1.5, 15, `${themeColor}aa`);
          }
        }
      }

      if (dino.isDucking) {
        dino.duckTimer--;
        if (dino.duckTimer <= 0) {
          dino.isDucking = false;
        }
      }

      // Spawning footsteps dust particles when running
      if (!dino.isJumping && !dino.isDucking && !isGameOver && dino.frame % 8 === 0) {
        spawnParticle(dino.x + 4, dino.y + 24, -0.5 - Math.random() * 0.5, 0, 1.5, 15, `${themeColor}44`);
      }

      // Draw Official Chromium Chrome Dino
      if (!isGameOver) {
        drawChromeDinoOfficial(ctx, dino.x, dino.y, dino.isDucking, dino.isJumping, dino.frame, currentThemeColor);
      }

      // Update Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });
      particles = particles.filter(p => p.life > 0);

      // Update Floating score labels
      floatingTexts.forEach((ft) => {
        ft.y -= 0.6;
        ft.life--;
        ctx.font = '7px monospace';
        ctx.fillStyle = `${themeColor}${Math.floor((ft.life / ft.maxLife) * 255).toString(16).padStart(2, '0')}`;
        ctx.fillText(ft.text, ft.x, ft.y);
      });
      floatingTexts = floatingTexts.filter(ft => ft.life > 0);

      // HUD info - Compiling status & Score
      ctx.fillStyle = currentThemeColor;
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('COMPILING: 56% DONE', 8, 14);

      ctx.textAlign = 'right';
      ctx.fillText(`SCORE ${Math.floor(score).toString().padStart(5, '0')}`, canvas.width - 8, 14);

      // Achievement popups sliding in
      if (achievementTimer > 0) {
        achievementTimer--;
        ctx.save();
        ctx.fillStyle = 'rgba(8, 8, 12, 0.92)';
        ctx.strokeStyle = themeColor;
        ctx.lineWidth = 1;
        // Slide in from top-right corner
        const achY = 16;
        ctx.fillRect(canvas.width - 110, achY, 104, 18);
        ctx.strokeRect(canvas.width - 110, achY, 104, 18);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 6px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('ACHIEVEMENT UNLOCKED!', canvas.width - 105, achY + 7);
        ctx.fillStyle = themeColor;
        ctx.font = '7px monospace';
        ctx.fillText(achievement, canvas.width - 105, achY + 15);
        ctx.restore();
      }

      // Game Over Screen (with auto-restart timer)
      if (isGameOver) {
        gameOverTimer--;
        if (gameOverTimer <= 0) {
          // Autoplay auto-restart fallback
          resetGame();
          controlMode = 'auto';
          triggerAchievement('AUTOPILOT RE-ACTIVATED');
        }

        ctx.save();
        ctx.fillStyle = 'rgba(8, 8, 12, 0.85)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = themeColor;
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('INTERFACE OFFLINE', canvas.width / 2, canvas.height / 2 - 10);

        ctx.font = '7px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('TAP TO RECONNECT INTERFACE', canvas.width / 2, canvas.height / 2 + 6);
        ctx.fillStyle = `${themeColor}99`;
        ctx.fillText(`Auto-Restarting in ${Math.ceil(gameOverTimer / 60)}s...`, canvas.width / 2, canvas.height / 2 + 18);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(update);
    };

    const handleContainerClick = (e) => {
      e.stopPropagation();
      handleJumpInput();
    };

    const handleTouchStart = (e) => {
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
      handleJumpInput();
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('click', handleContainerClick);
      container.addEventListener('touchstart', handleTouchStart, { passive: false });
    }

    update();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (container) {
        container.removeEventListener('click', handleContainerClick);
        container.removeEventListener('touchstart', handleTouchStart);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{ 
        width: '100%', 
        height: '90px', 
        margin: '6px 0 10px 0', 
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        touchAction: 'none', // Mobile touch optimization: prevents page scrolling on canvas tap
        background: 'rgba(8, 8, 12, 0.96)', // Solid dark screen background blocks background description text
        border: '1.5px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        boxShadow: 'inset 0 0 15px rgba(0, 0, 0, 0.9), 0 0 10px rgba(0, 0, 0, 0.5)'
      }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="content-section">
      <FloatingSticker text="git push --force" theme="red" size="md" top="12%" left="2%" rotation={-7} />
      <FloatingSticker text="Fixing prod" theme="green" size="sm" top="25%" right="3%" rotation={-8} className="hidden lg:block" />
      <FloatingSticker text="Works on My Machine" theme="orange" size="md" top="38%" right="2%" rotation={9} allowCenter={true} className="hidden lg:block" />
      <FloatingSticker text="Spaghetti Code Chef" theme="cyber-glass" size="md" top="48%" right="10%" rotation={5} allowCenter={true} />
      <FloatingSticker text="Clean coder... jk" theme="purple" size="md" top="58%" left="4%" rotation={7} allowCenter={true} className="hidden lg:block" />
      <FloatingSticker text="LGTM! (Didn't read)" theme="lime" size="md" top="65%" right="18%" rotation={-6} allowCenter={true} />
      <FloatingSticker text="One more bug..." theme="blue" size="md" top="72%" left="3%" rotation={-10} allowCenter={true} className="hidden lg:block" />
      <FloatingSticker text="It compiled on Sunday" theme="green" size="md" top="78%" right="14%" rotation={11} allowCenter={true} className="hidden lg:block" />
      <FloatingSticker text="git merge --doom" theme="pink" size="md" top="84%" right="25%" rotation={-9} allowCenter={true} className="hidden lg:block" />
      <FloatingSticker text="Deploy > Pray" theme="pink" size="md" top="89%" right="2%" rotation={8} allowCenter={true} />
      
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
            <article 
              className={`glass-card project-card reveal ${project.underBuild ? 'project-card-locked' : ''}`} 
              key={project.title}
            >
              {project.underBuild && (
                <>
                  <div className="scan-line"></div>
                  <div className="lock-overlay">
                    <div className="lock-box">
                      <div className="lock-icon-wrapper">
                        <Lock className="w-8 h-8" />
                      </div>
                      <span className="lock-badge">Under Build</span>
                      <AutomaticDinoGame />
                      <span className="lock-loading-text">LOADING...</span>
                    </div>
                  </div>
                </>
              )}
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
                {project.underBuild ? (
                  <span className="project-btn locked-btn cursor-not-allowed">
                    <Lock className="w-3.5 h-3.5" />
                    GitHub
                  </span>
                ) : (
                  <a href={project.github} className="project-btn" target="_blank" rel="noopener noreferrer">
                    <span className="w-4 h-4 inline-flex items-center justify-center"><GithubIcon /></span>
                    GitHub
                  </a>
                )}
                {project.underBuild ? (
                  <span className="project-btn locked-btn cursor-not-allowed">
                    <Lock className="w-3.5 h-3.5" />
                    Coming Soon
                  </span>
                ) : (
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
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
