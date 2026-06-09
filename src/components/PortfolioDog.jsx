import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./PortfolioDog.module.css";

// --- Color Constants matching the Bernese Mountain Dog sprite ---
const BLK = "#1c1c1c"; // Black coat
const WHT = "#f0ede6"; // White chest/face blaze/paws
const RST = "#9e4e18"; // Rust cheeks/legs (near)
const BROWN2 = "#7a3a0f"; // Darker rust (far legs)
const CREAM = "#fdf6e3"; // Cream/belly
const PNK = "#ff6b8b"; // Light tongue/blush
const COL = "#e11d48"; // Collar / deep tongue
const BLUSH = "#ffb3c6"; // Blush cheeks
const EYE_GRN = "#5a8a3a"; // Dog pupil color (greenish)

// --- Physics Constants ---
const MAX_SPEED = 300; // max pixels per second
const FIXED_DT = 1 / 120;

// Helper function to draw pixel rectangles
const rect = (ctx, x, y, w, h, col) => {
  ctx.fillStyle = col;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
};

// Draw walking/running leg with natural hip/knee rotation
const drawWalkLeg = (ctx, S, hipX, hipY, phase, near, isFront) => {
  const scale = near ? 1 : 0.82;
  const thighLen = 3.2 * S * scale;
  const shinLen = 3.0 * S * scale;
  const pawW = 3.0 * S * scale;
  const pawH = 1.2 * S * scale;

  const hipAngle = Math.sin(phase) * 0.45;
  const kneeAngle = Math.max(0, -Math.cos(phase) * 0.7 + 0.15);

  const thighX = Math.round(hipX * S);
  const thighY = Math.round(hipY * S);
  const kneeX = thighX + Math.round(Math.sin(hipAngle) * thighLen);
  const kneeY = thighY + Math.round(Math.cos(hipAngle) * thighLen);

  const shinAngle = hipAngle + kneeAngle;
  const footX = kneeX + Math.round(Math.sin(shinAngle) * shinLen);
  const footY = kneeY + Math.round(Math.cos(shinAngle) * shinLen);

  const thighW = Math.max(2, Math.round(2.5 * S * scale));
  const steps = 4;
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    const tx = thighX + Math.round((kneeX - thighX) * t) - Math.round(thighW * 0.3);
    const ty = thighY + Math.round((kneeY - thighY) * t);
    rect(ctx, tx, ty, thighW, Math.round(thighLen / steps) + 1, near ? RST : BROWN2);
  }
  rect(ctx, thighX - Math.round(thighW * 0.3), thighY, 1, Math.round(thighLen * 0.8), BLK);
  rect(ctx, thighX - Math.round(thighW * 0.3) + thighW - 1, thighY + 1, 1, Math.round(thighLen * 0.7), BLK);

  const shinW = Math.max(2, Math.round(2.0 * S * scale));
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    const sx = kneeX + Math.round((footX - kneeX) * t) - Math.round(shinW * 0.3);
    const sy = kneeY + Math.round((footY - kneeY) * t);
    rect(ctx, sx, sy, shinW, Math.round(shinLen / steps) + 1, near ? RST : BROWN2);
  }
  rect(ctx, kneeX - Math.round(shinW * 0.3), kneeY + 1, 1, Math.round(shinLen * 0.8), BLK);
  rect(ctx, kneeX - Math.round(shinW * 0.3) + shinW - 1, kneeY + 2, 1, Math.round(shinLen * 0.7), BLK);

  const pawX = footX - Math.round(pawW * 0.4);
  const pawY = footY;
  rect(ctx, pawX, pawY, Math.round(pawW), Math.round(pawH), WHT);
  rect(ctx, pawX, pawY + Math.round(pawH) - 1, Math.round(pawW), 1, BLK);
  rect(ctx, pawX + Math.round(pawW * 0.45), pawY, 1, Math.round(pawH), BLK);
};

// Zzz letter pixel pattern helper constants
const Z_PATTERN = [
  [1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 0],
  [0, 0, 0, 1, 0, 0],
  [0, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1],
];

// Draw Zzz for sleeping state
const drawPixelZ = (ctx, ox, oy, ps, alpha) => {
  const p = Math.max(2, Math.round(ps));
  const ox0 = Math.round(ox), oy0 = Math.round(oy);
  ctx.save();
  ctx.globalAlpha = alpha;
  const pad = Math.round(p * 0.8);
  ctx.fillStyle = WHT;
  ctx.fillRect(ox0 - pad, oy0 - pad, 6 * p + pad * 2, 5 * p + pad * 2);
  ctx.strokeStyle = BLK;
  ctx.lineWidth = Math.max(1, Math.round(p * 0.4));
  ctx.strokeRect(ctx, ox0 - pad, oy0 - pad, 6 * p + pad * 2, 5 * p + pad * 2);
  ctx.fillStyle = BLK;
  for (let row = 0; row < Z_PATTERN.length; row++) {
    for (let col = 0; col < Z_PATTERN[row].length; col++) {
      if (Z_PATTERN[row][col]) rect(ctx, ox0 + col * p, oy0 + row * p, p, p, BLK);
    }
  }
  ctx.restore();
};

const drawPixelHeart = (ctx, cx, cy, size, alpha) => {
  ctx.save();
  ctx.globalAlpha = alpha;
  const s = Math.max(1, Math.round(size));
  const r = Math.round;
  const heart = [
    [0, 1, 1, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
  ];
  const ox = r(cx - 3.5 * s), oy = r(cy - 3 * s);
  ctx.fillStyle = COL;
  for (let row = 0; row < heart.length; row++) {
    for (let col = 0; col < heart[row].length; col++) {
      if (heart[row][col]) rect(ctx, ox + col * s, oy + row * s, s, s, COL);
    }
  }
  rect(ctx, ox + 1 * s, oy + 1 * s, s, s, PNK);
  rect(ctx, ox + 2 * s, oy + 1 * s, s, s, PNK);
  ctx.restore();
};

const drawPixelSparkle = (ctx, cx, cy, size, alpha, rot) => {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(Math.round(cx), Math.round(cy));
  ctx.rotate(rot);
  const s = Math.max(1, Math.round(size));
  rect(ctx, -s, -s * 0.3, s * 2, s * 0.6, WHT);
  rect(ctx, -s * 0.3, -s, s * 0.6, s * 2, WHT);
  rect(ctx, -1, -1, 2, 2, "#ffe");
  ctx.restore();
};

export default function PortfolioDog({ booting = false }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  
  // React-managed state for UI overlays
  const [bubbleText, setBubbleText] = useState("");
  const [pawPrints, setPawPrints] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const isHoveredRef = useRef(false);

  // --- Animation Refs (avoid triggers of render loops) ---
  const stateRef = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight * 0.75,
    px: window.innerWidth / 2,
    py: window.innerHeight * 0.75,
    tx: window.innerWidth / 2,
    ty: window.innerHeight * 0.75,
    vx: 0,
    vy: 0,
    size: 50,
    dir: 1,
    state: "IDLE", // Strict states: WALKING, SITTING, LYING, IDLE, HAPPY (clicked)
    phase: 0,
    animSpeed: 0,
    idleT: 0,
    earWiggle: 0,
    tongueOut: 0,
    headTilt: 0,
    happyBounce: 0,
    tailPhase: 0,
    breathePhase: 0,
    dreamPhase: 0,
    pawTwitch: 0,
    lookX: 0,
    lookY: 0,
    scratchT: 0,
    stretchT: 0,
    particles: [], // local particles: sparkles, hearts, dust
    _scratched: false,
    continuousWag: false
  });

  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight * 0.75 });
  const isMouseActiveRef = useRef(false);
  const lastMouseMoveTimeRef = useRef(Date.now());
  const activeSectionRef = useRef("home");

  // Autoplay scripts for portfolio interactions
  const autoplayRef = useRef(null);

  // Long press timer ref
  const longPressTimeoutRef = useRef(null);
  
  // Easter egg
  const typedBufferRef = useRef("");
  const easterEggActiveRef = useRef(false);

  // Spawns canvas-based local particles
  const spawnCanvasParticle = (x, y, type) => {
    stateRef.current.particles.push({
      x,
      y,
      type,
      vx: (Math.random() - 0.5) * (type === "heart" ? 1.5 : 2.5),
      vy: type === "heart" ? -1.2 - Math.random() * 1.5 : -0.4 - Math.random() * 1.0,
      life: 1.0,
      maxLife: type === "heart" ? 1.8 : type === "dust" ? 0.7 : 1.2,
      size: type === "heart" ? 4 + Math.random() * 2 : type === "sparkle" ? 2 + Math.random() * 2 : 2.5 + Math.random() * 2,
      rot: Math.random() * Math.PI * 2,
      rotSpd: (Math.random() - 0.5) * 2
    });
  };

  // Helper to show bubble text inside React state
  const showSpeechBubble = (text, duration = 2.0) => {
    setBubbleText(text);
    if (window.bubbleTimeout) clearTimeout(window.bubbleTimeout);
    window.bubbleTimeout = setTimeout(() => {
      setBubbleText("");
    }, duration * 1000);
  };

  // Trigger random dog barks
  const bark = () => {
    const barks = ["WOOF!", "WUF!", "BORK!", "WEF!", "🐾 WOOF 🐾", "RUFF!"];
    showSpeechBubble(barks[Math.floor(Math.random() * barks.length)]);
    stateRef.current.state = "HAPPY";
    stateRef.current.idleT = 0;
    
    // Spawn hearts on barks
    for (let i = 0; i < 4; i++) {
      spawnCanvasParticle(80 + (Math.random() - 0.5) * 30, 80 + (Math.random() - 0.5) * 15, "heart");
    }
    
    setTimeout(() => {
      if (stateRef.current.state === "HAPPY" && !easterEggActiveRef.current) {
        stateRef.current.state = "IDLE";
        stateRef.current.idleT = 0;
      }
    }, 1200);
  };

  // Trigger dog spin
  const triggerSpin = () => {
    setIsSpinning(true);
    stateRef.current.state = "HAPPY";
    stateRef.current.idleT = 0;
    for (let i = 0; i < 8; i++) {
      spawnCanvasParticle(80 + (Math.random() - 0.5) * 40, 80 + (Math.random() - 0.5) * 20, "heart");
    }
    setTimeout(() => {
      setIsSpinning(false);
      if (stateRef.current.state === "HAPPY" && !easterEggActiveRef.current) {
        stateRef.current.state = "IDLE";
      }
    }, 600);
  };

  // --- Click / Hover Handlers ---
  const handleClick = (e) => {
    e.stopPropagation();
    bark();
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    triggerSpin();
  };

  const handlePointerDown = (e) => {
    // Start long-press detection
    longPressTimeoutRef.current = setTimeout(() => {
      stateRef.current.state = "LYING";
      stateRef.current.idleT = 0;
      showSpeechBubble("*sighs happily* 💤");
      for (let i = 0; i < 5; i++) {
        spawnCanvasParticle(80 + (Math.random() - 0.5) * 30, 80 + (Math.random() - 0.5) * 15, "sparkle");
      }
    }, 600);
  };

  const handlePointerUp = () => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
    }
  };

  // --- Global Keyboard Listener (Easter Egg) ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (booting) return;

      typedBufferRef.current = (typedBufferRef.current + e.key.toLowerCase()).slice(-8);
      if (typedBufferRef.current === "good dog" && !easterEggActiveRef.current) {
        easterEggActiveRef.current = true;
        autoplayRef.current = null; // Interrupt any autoplay
        isMouseActiveRef.current = false;

        const dog = stateRef.current;
        dog.state = "WALKING";
        dog.tx = window.innerWidth / 2;
        dog.ty = window.innerHeight / 2 - 30; // Center screen
        showSpeechBubble("🐾 GOOD BOY ACTIVATED! 🐾", 1.5);

        setTimeout(() => {
          triggerSpin();
          dog.state = "HAPPY";
          showSpeechBubble("Woof! Thanks for visiting Jitarth's portfolio 🐾", 4.0);
          
          const interval = setInterval(() => {
            for (let i = 0; i < 3; i++) {
              spawnCanvasParticle(80 + (Math.random() - 0.5) * 40, 80 + (Math.random() - 0.5) * 20, "heart");
            }
          }, 150);

          setTimeout(() => {
            clearInterval(interval);
            easterEggActiveRef.current = false;
            dog.state = "IDLE";
            dog.idleT = 0;
          }, 4000);
        }, 1200);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [booting]);

  // --- Scroll Section Tracker ---
  useEffect(() => {
    if (booting) return;

    const sections = ["home", "skills", "projects", "contact"];
    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSectionRef.current = entry.target.id;
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.22,
      rootMargin: "-10% 0px -10% 0px"
    });

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [booting]);

  const isCoordOverDog = (clientX, clientY) => {
    if (booting) return false;
    const dog = stateRef.current;
    const isMobile = window.innerWidth < 768;
    const scale = isMobile ? 0.483 : 0.733;
    
    const halfW = 50 * scale;
    const topOffset = 75 * scale;
    const bottomOffset = 10 * scale;

    return (
      clientX >= dog.x - halfW &&
      clientX <= dog.x + halfW &&
      clientY >= dog.y - topOffset &&
      clientY <= dog.y + bottomOffset
    );
  };

  // --- Mouse / Touch Coordinates Listener ---
  useEffect(() => {
    if (booting) return;

    const updateCoords = (clientX, clientY) => {
      const dog = stateRef.current;
      const dx = clientX - dog.x;
      const dy = (clientY + 30) - dog.y;
      const distance = Math.hypot(dx, dy);

      // Mouse movements must exceed 15px to break sitting/lying states (eliminating hand tremors)
      const significantThreshold = (dog.state === "SITTING" || dog.state === "LYING") ? 15 : 5;

      if (distance > significantThreshold) {
        isMouseActiveRef.current = true;
        lastMouseMoveTimeRef.current = Date.now();
        mouseRef.current = { x: clientX, y: clientY };

        if (dog.state !== "WALKING" && !easterEggActiveRef.current) {
          dog.state = "WALKING";
          dog.idleT = 0;
          dog.continuousWag = false;
        }

        // Clear current element-autoplay if user takes mouse control
        if (autoplayRef.current && !autoplayRef.current.type.startsWith("startup")) {
          autoplayRef.current = null;
        }
      }
    };

    const handleMouseMove = (e) => {
      updateCoords(e.clientX, e.clientY);
      isHoveredRef.current = isCoordOverDog(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        updateCoords(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleGlobalClick = (e) => {
      if (isCoordOverDog(e.clientX, e.clientY)) {
        bark();
      }
    };

    const handleGlobalDblClick = (e) => {
      if (isCoordOverDog(e.clientX, e.clientY)) {
        triggerSpin();
      }
    };

    const handleGlobalPointerDown = (e) => {
      if (isCoordOverDog(e.clientX, e.clientY)) {
        longPressTimeoutRef.current = setTimeout(() => {
          stateRef.current.state = "LYING";
          stateRef.current.idleT = 0;
          showSpeechBubble("*sighs happily* 💤");
          for (let i = 0; i < 5; i++) {
            spawnCanvasParticle(80 + (Math.random() - 0.5) * 30, 80 + (Math.random() - 0.5) * 15, "sparkle");
          }
        }, 600);
      }
    };

    const handleGlobalPointerUp = () => {
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("click", handleGlobalClick);
    window.addEventListener("dblclick", handleGlobalDblClick);
    window.addEventListener("pointerdown", handleGlobalPointerDown);
    window.addEventListener("pointerup", handleGlobalPointerUp);
    window.addEventListener("pointercancel", handleGlobalPointerUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("click", handleGlobalClick);
      window.removeEventListener("dblclick", handleGlobalDblClick);
      window.removeEventListener("pointerdown", handleGlobalPointerDown);
      window.removeEventListener("pointerup", handleGlobalPointerUp);
      window.removeEventListener("pointercancel", handleGlobalPointerUp);
    };
  }, [booting]);

  // --- Autoplay Sequences Manager (Hero, Skills, Projects, Contact) ---
  useEffect(() => {
    if (booting) return;

    const triggerStartupSequence = () => {
      const nameEl = document.querySelector(".hero-name");
      if (nameEl) {
        autoplayRef.current = { type: "startup-name", step: 1, targetEl: nameEl };
      } else {
        const descEl = document.querySelector(".desc");
        if (descEl) {
          autoplayRef.current = { type: "startup-desc", step: 2, targetEl: descEl };
        }
      }
    };

    const startTimeout = setTimeout(triggerStartupSequence, 1200);

    const idleChecker = setInterval(() => {
      if (autoplayRef.current || easterEggActiveRef.current) return;

      const idleDuration = Date.now() - lastMouseMoveTimeRef.current;
      if (idleDuration > 4500) {
        isMouseActiveRef.current = false;
        const currentSec = activeSectionRef.current;

        if (currentSec === "skills") {
          const cards = document.querySelectorAll("#skills .skill-group");
          if (cards.length > 0) {
            const randomCard = cards[Math.floor(Math.random() * cards.length)];
            autoplayRef.current = { type: "skills", targetEl: randomCard };
          }
        } else if (currentSec === "projects") {
          const cards = document.querySelectorAll("#projects .project-card");
          if (cards.length > 0) {
            const randomCard = cards[Math.floor(Math.random() * cards.length)];
            autoplayRef.current = { type: "projects", targetEl: randomCard };
          }
        } else if (currentSec === "contact") {
          const form = document.querySelector("#contact .contact-form");
          if (form) {
            autoplayRef.current = { type: "contact", targetEl: form };
          }
        }
      }
    }, 2000);

    return () => {
      clearTimeout(startTimeout);
      clearInterval(idleChecker);
    };
  }, [booting]);

  // --- Animation and Loop integration ---
  useEffect(() => {
    if (booting) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const dpr = window.devicePixelRatio || 1;
    canvas.width = 160 * dpr;
    canvas.height = 160 * dpr;
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = false;

    let animId;
    let lastT = performance.now();
    let accumulator = 0;
    let lastPawPrintX = 0;
    let lastPawPrintY = 0;

    const dog = stateRef.current;

    const updatePhysics = (dt) => {
      const isAutoplay = autoplayRef.current !== null;
      let targetX = mouseRef.current.x;
      let targetY = mouseRef.current.y + 30; // Standard cursor bottom-offset

      // Autoplay target coordinates resolver
      if (isAutoplay && !isMouseActiveRef.current) {
        const ap = autoplayRef.current;
        if (ap.targetEl) {
          const rect = ap.targetEl.getBoundingClientRect();
          if (ap.type === "startup-name") {
            targetX = rect.right + 25;
            targetY = rect.bottom - 10;
          } else if (ap.type === "startup-desc") {
            targetX = rect.left - 25;
            targetY = rect.bottom - 15;
          } else if (ap.type === "skills" || ap.type === "projects") {
            targetX = rect.left + rect.width / 2;
            targetY = rect.bottom + 8;
          } else if (ap.type === "contact") {
            targetX = rect.left - 35;
            targetY = rect.bottom - 20;
          }
        }
      }

      dog.tx = targetX;
      dog.ty = targetY;

      const dx = dog.tx - dog.x;
      const dy = dog.ty - dog.y;
      const dist = Math.hypot(dx, dy);

      const isMobile = window.innerWidth < 768;
      const S = isMobile ? 1.45 : 2.2;

      // --- STATE MACHINE UPDATE ---
      if (dog.state === "WALKING") {
        if (dist <= 5) {
          // 1. Clamping destination directly and zeroing velocity to completely eliminate jitter
          dog.x = dog.tx;
          dog.y = dog.ty;
          dog.vx = 0;
          dog.vy = 0;
          dog.state = "IDLE";
          dog.idleT = 0;

          // Autoplay arrivals execution
          if (isAutoplay && !isMouseActiveRef.current) {
            const ap = autoplayRef.current;
            if (ap.type === "startup-name") {
              autoplayRef.current = null;
              dog.state = "SITTING";
              dog.idleT = 0;
              showSpeechBubble("Hi! 🐾 Welcome!", 1.8);
              setTimeout(() => {
                const descEl = document.querySelector(".desc");
                if (descEl) {
                  autoplayRef.current = { type: "startup-desc", step: 2, targetEl: descEl };
                }
              }, 2000);
            } else if (ap.type === "startup-desc") {
              autoplayRef.current = null;
              dog.state = "SITTING";
              dog.idleT = 0;
              showSpeechBubble("I'm your guide! Scroll to explore.", 2.5);
            } else if (ap.type === "skills") {
              autoplayRef.current = null;
              dog.state = "LYING"; // Sniffs as lying down
              dog.idleT = 0;
              showSpeechBubble("*sniff sniff* Cool skills!", 2.0);
            } else if (ap.type === "projects") {
              autoplayRef.current = null;
              dog.state = "SITTING";
              dog.idleT = 0;
              showSpeechBubble("This project is awesome! 🚀", 2.2);
            } else if (ap.type === "contact") {
              autoplayRef.current = null;
              dog.state = "SITTING";
              dog.idleT = 0;
              dog.continuousWag = true;
              showSpeechBubble("Let's stay in touch! ✉️", 2.2);
            }
          }
        } else {
          // 2. Velocity-based proportional approach
          const approachSpeed = Math.min(dist * 2.8, MAX_SPEED); // Damping speed close to target
          const angle = Math.atan2(dy, dx);
          
          const targetVx = Math.cos(angle) * approachSpeed;
          const targetVy = Math.sin(angle) * approachSpeed;

          // Smooth interpolation of velocity to prevent sudden jumps
          dog.vx += (targetVx - dog.vx) * 0.15;
          dog.vy += (targetVy - dog.vy) * 0.15;

          const stepX = dog.vx * dt;
          const stepY = dog.vy * dt;
          const stepDist = Math.hypot(stepX, stepY);

          // 3. Overshoot protection
          if (stepDist >= dist) {
            dog.x = dog.tx;
            dog.y = dog.ty;
            dog.vx = 0;
            dog.vy = 0;
            dog.state = "IDLE";
            dog.idleT = 0;
          } else {
            dog.x += stepX;
            dog.y += stepY;
          }

          // 4. Direction Hysteresis: prevent rapid sprite-flipping. Only change facing if horizontal target delta exceeds 10px
          if (Math.abs(dx) > 10) {
            dog.dir = dx > 0 ? 1 : -1;
          }

          // Spawns dust particles
          if (approachSpeed > 80 && Math.random() < 0.22) {
            spawnCanvasParticle(80 + (Math.random() - 0.5) * 12, 120, "dust");
          }

          // Paw print generation at distance interval
          const distFromLastPaw = Math.hypot(dog.x - lastPawPrintX, dog.y - lastPawPrintY);
          if (distFromLastPaw > (isMobile ? 28 : 36)) {
            lastPawPrintX = dog.x;
            lastPawPrintY = dog.y;
            
            const newPaw = {
              id: Date.now() + Math.random(),
              x: dog.x + window.scrollX,
              y: dog.y + window.scrollY,
              rot: dog.dir === 1 ? 24 : -24,
              opacity: 0.55
            };

            setPawPrints((prev) => [...prev.slice(-10), newPaw]);
            setTimeout(() => {
              setPawPrints((prev) => prev.filter((p) => p.id !== newPaw.id));
            }, 3000);
          }
        }
      } else {
        // Static states loops: SITTING, LYING, IDLE, HAPPY (clicked)
        dog.vx = 0;
        dog.vy = 0;
        dog.idleT += dt;

        if (dog.state === "IDLE") {
          // Transition standing IDLE to SITTING after 2 seconds
          if (dog.idleT >= 2.0) {
            dog.state = "SITTING";
            dog.idleT = 0;
          }
        } else if (dog.state === "SITTING") {
          // Transition SITTING to LYING after 5 seconds
          if (dog.idleT >= 5.0 && !dog.continuousWag) {
            dog.state = "LYING";
            dog.idleT = 0;
          }
        }
      }


      const actualSpd = Math.hypot(dog.vx, dog.vy);
      dog.animSpeed += (actualSpd - dog.animSpeed) * Math.min(1, dt * 10);

      if (dog.state === "WALKING") {
        const rate = 1.15 + (dog.animSpeed / MAX_SPEED) * 5.0;
        dog.phase += dt * rate * Math.PI * 2;
        if (dog.phase > Math.PI * 2) dog.phase %= Math.PI * 2;
      }

      if (dog.state === "LYING") {
        dog.pawTwitch = Math.sin(performance.now() * 0.0025);
        dog.dreamPhase += dt;
      }

      dog.breathePhase += dt;
      dog.tailPhase += dt;
    };

    const updateAndDrawParticles = (ctx, dt) => {
      for (let i = dog.particles.length - 1; i >= 0; i--) {
        const p = dog.particles[i];
        p.x += p.vx * dt * 60;
        p.y += p.vy * dt * 60;
        
        if (p.type === "heart") {
          p.vy -= 0.012 * dt * 60;
        } else {
          p.vy += 0.02 * dt * 60;
        }
        
        p.rot += p.rotSpd * dt;
        p.life -= dt / p.maxLife;

        if (p.life <= 0) {
          dog.particles.splice(i, 1);
          continue;
        }

        const alpha = Math.max(0, p.life);
        if (p.type === "heart") {
          drawPixelHeart(ctx, p.x, p.y, p.size, alpha * 0.9);
        } else if (p.type === "sparkle") {
          drawPixelSparkle(ctx, p.x, p.y, p.size, alpha, p.rot);
        } else if (p.type === "dust") {
          ctx.save();
          ctx.globalAlpha = alpha * 0.5;
          ctx.fillStyle = "#ff6a21";
          ctx.fillRect(Math.round(p.x), Math.round(p.y), Math.round(p.size), Math.round(p.size));
          ctx.restore();
        }
      }
    };

    const drawZzz = (ctx) => {
      const t = performance.now() * 0.001;
      const cx = 80;
      const cy = 60;
      const configs = [
        { delay: 0.0, maxSize: 3, offsetX: 10 },
        { delay: 1.0, maxSize: 3.5, offsetX: 22 },
        { delay: 2.0, maxSize: 4, offsetX: 35 },
      ];
      const cycle = 3.0;
      for (const cfg of configs) {
        const phase = ((t + cfg.delay * (cycle / configs.length)) % cycle) / cycle;
        if (phase < 0.04) continue;
        const eased = 1 - Math.pow(1 - phase, 2);
        const floatY = -eased * 45;
        const alpha = Math.sin(phase * Math.PI);
        const ps = cfg.maxSize * (0.7 + eased * 0.6);
        drawPixelZ(ctx, cx + cfg.offsetX, cy + floatY, ps, alpha * 0.95);
      }
    };

    const loop = (now) => {
      const frame = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;
      accumulator += frame;

      while (accumulator >= FIXED_DT) {
        updatePhysics(FIXED_DT);
        accumulator -= FIXED_DT;
      }

      ctx.clearRect(0, 0, 160, 160);

      // Particle system drawing
      updateAndDrawParticles(ctx, frame);

      // Dog drawing properties mapping
      const isMobile = window.innerWidth < 768;
      const S = isMobile ? 1.45 : 2.2;

      const time = performance.now() * 0.001;
      const gaitStr = Math.min(1, dog.animSpeed / MAX_SPEED);
      
      // Strict mappings to original drawing states:
      const isMoving = dog.state === "WALKING";
      const isSitting = dog.state === "SITTING";
      const isSleeping = dog.state === "LYING"; // sleeping curled-up pose
      const isResting = false;
      const isHappy = dog.state === "HAPPY";
      const isScratching = dog.state === "scratching";
      const isStretching = dog.state === "stretching";

      let bodyBob = 0;
      let headBob = 0;
      let tailWag = 0;
      let pawLL = 0;
      let pawLR = 0;

      if (isMoving) {
        const s = Math.sin(dog.phase);
        const lL = Math.max(0, s);
        const lR = Math.max(0, -s);
        bodyBob = Math.abs(s) * (0.055 + gaitStr * 0.14) * dog.size;
        headBob = s * (0.028 + gaitStr * 0.06) * dog.size;
        tailWag = Math.sin(dog.phase * 0.78) * (0.05 + gaitStr * 0.16);
        pawLL = lL * lL * (0.16 + gaitStr * 0.2) * dog.size;
        pawLR = lR * lR * (0.16 + gaitStr * 0.2) * dog.size;
        dog.earWiggle = Math.abs(s) * 0.3;
      } else if (isHappy) {
        bodyBob = Math.abs(Math.sin(time * 7.0)) * 0.35 * dog.size;
        tailWag = Math.sin(time * 10) * 0.42;
        dog.earWiggle = Math.abs(Math.sin(time * 8)) * 0.4;
      } else if (isSleeping) {
        bodyBob = Math.sin(time * 1.3) * 0.04 * dog.size;
        dog.earWiggle = 0;
      } else {
        // IDLE standing or SITTING breathing bob
        const bSpeed = isSitting ? 1.5 : 1.7;
        bodyBob = Math.sin(time * bSpeed) * 0.055 * dog.size;
        headBob = Math.sin(time * (bSpeed * 0.6)) * 0.025 * dog.size;
        
        // SITTING has occasional tail wagging
        if (isSitting) {
          tailWag = dog.continuousWag 
            ? Math.sin(time * 8) * 0.35 
            : (Math.sin(time * 1.2) > 0.7 ? Math.sin(time * 6) * 0.12 : 0);
        } else {
          tailWag = 0;
        }
        dog.earWiggle = Math.sin(time * 0.5) * 0.02;
      }

      bodyBob = Math.round(bodyBob);
      headBob = Math.round(headBob);

      if (isMoving || isHappy) {
        dog.tongueOut = Math.min(1, dog.tongueOut + 0.05);
      } else {
        dog.tongueOut = Math.max(0, dog.tongueOut - 0.02);
      }

      if (isHoveredRef.current) {
        dog.earWiggle = 0.75;
      }

      const lookDx = mouseRef.current.x - dog.x;
      const lookDy = mouseRef.current.y - dog.y;
      dog.lookX += (Math.sign(lookDx) * Math.min(1, Math.abs(lookDx) / 100) - dog.lookX) * 0.08;
      dog.lookY += (Math.sign(lookDy) * Math.min(1, Math.abs(lookDy) / 100) - dog.lookY) * 0.08;

      ctx.save();
      ctx.translate(80, 120);

      if (dog.dir === -1) {
        ctx.scale(-1, 1);
      }

      if (isMoving) {
        const bb = bodyBob / dog.size;

        // Tail
        ctx.save();
        ctx.translate(Math.round(-10.0 * S), Math.round(-(3.8 + bb) * S));
        ctx.rotate(-0.52 + tailWag * 2.8);
        rect(ctx, -S, -4.0 * S, 2.0 * S, 4.0 * S, BLK);
        rect(ctx, -0.36 * S, -3.4 * S, 0.72 * S, 3.0 * S, WHT);
        rect(ctx, -1.2 * S, -4.8 * S, 2.4 * S, 1.2 * S, WHT);
        ctx.restore();

        // Back legs
        drawWalkLeg(ctx, S, 4.8, -bb, dog.phase + Math.PI, false, false);
        drawWalkLeg(ctx, S, -8.2, -bb, dog.phase, false, true);

        // Body
        rect(ctx, -10.2 * S, -(5.6 + bb) * S, 20.0 * S, 5.6 * S, BLK);
        rect(ctx, -10.2 * S, -(5.6 + bb) * S, 7.0 * S, 4.8 * S, RST);
        rect(ctx, -3.2 * S, -(5.6 + bb) * S, 7.0 * S, 5.6 * S, BLK);
        rect(ctx, 3.8 * S, -(5.6 + bb) * S, 5.8 * S, 3.8 * S, RST);
        rect(ctx, -5.2 * S, -(2.9 + bb) * S, 9.8 * S, 2.9 * S, WHT);
        rect(ctx, -2.0 * S, -(2.2 + bb) * S, 4.0 * S, 1.0 * S, CREAM);

        // Head
        const hx = 8.5;
        const hy = -(8.8 + bb + headBob / dog.size);
        rect(ctx, (hx - 1.0) * S, (hy - 2.6) * S, 4.0 * S, 6.2 * S, BLK);
        rect(ctx, (hx - 0.3) * S, (hy - 2.1) * S, 3.1 * S, 5.4 * S, RST);
        rect(ctx, hx * S, (hy + 0.5) * S, 5.6 * S, 5.8 * S, BLK);
        rect(ctx, (hx + 0.4) * S, (hy + 1.1) * S, 2.3 * S, 1.7 * S, RST);
        rect(ctx, (hx + 2.7) * S, (hy + 1.7) * S, 3.3 * S, 3.8 * S, WHT);
        rect(ctx, (hx + 4.7) * S, (hy + 2.1) * S, 1.3 * S, 1.0 * S, BLK);

        // Eyes
        rect(ctx, (hx + 0.6) * S, (hy + 1.9) * S, 1.8 * S, 1.8 * S, "#111");
        rect(ctx, (hx + 0.6) * S, (hy + 1.9) * S, 0.75 * S, 0.75 * S, EYE_GRN);
        rect(ctx, (hx + 0.6) * S, (hy + 1.9) * S, 0.4 * S, 0.4 * S, WHT);

        const earOff = dog.earWiggle * S * 1.5;
        rect(ctx, (hx - 1.2) * S, (hy - 3.0) * S - earOff, 2.0 * S, 2.5 * S, BLK);
        rect(ctx, (hx - 0.8) * S, (hy - 2.6) * S - earOff, 1.2 * S, 1.8 * S, RST);

        if (dog.tongueOut > 0.3) {
          const tLen = dog.tongueOut * 2.0;
          rect(ctx, (hx + 0.4) * S, (hy + 5.0) * S, 4.0 * S, 1.1 * S, COL);
          rect(ctx, (hx + 1.5) * S, (hy + 6.0) * S, tLen * S, 0.8 * S, PNK);
        } else {
          rect(ctx, (hx + 0.4) * S, (hy + 5.0) * S, 4.0 * S, 1.1 * S, COL);
        }

        rect(ctx, (hx - 0.5) * S, (hy + 4.0) * S, 1.8 * S, 0.6 * S, BLUSH);
        rect(ctx, (hx + 5.0) * S, (hy + 4.0) * S, 1.5 * S, 0.6 * S, BLUSH);

        drawWalkLeg(ctx, S, 6.2, -bb, dog.phase, true, true);
        drawWalkLeg(ctx, S, -9.2, -bb, dog.phase + Math.PI, true, false);

      } else {
        // Sitting/Lying/Standing Idle poses
        const left = -10.5 * S;
        const top = -22.0 * S;
        const bb = bodyBob;
        const hb = headBob;

        const px = (gx, gy, w, h, col) => rect(ctx, left + gx * S, top + gy * S - bb, w * S, h * S, col);
        const ph = (gx, gy, w, h, col) => rect(ctx, left + gx * S, top + gy * S - bb - hb, w * S, h * S, col);

        // Tail
        ctx.save();
        ctx.translate(Math.round(left + 18.6 * S), Math.round(top + 15.5 * S - bb));
        ctx.rotate(0.25 + tailWag * 4.5);
        rect(ctx, -S, -4.0 * S, 2.0 * S, 4.5 * S, BLK);
        rect(ctx, -0.32 * S, -3.4 * S, 0.64 * S, 3.2 * S, WHT);
        rect(ctx, -1.2 * S, -5.2 * S, 2.4 * S, 1.5 * S, WHT);
        ctx.restore();

        // Body
        px(3.0, 12, 15.0, 11, BLK);
        px(5.8, 15, 9.4, 8, WHT);
        px(3.0, 13, 3.8, 9, RST);
        px(14.2, 13, 3.8, 9, RST);
        px(5.5, 14.0, 10.0, 1.3, COL);
        px(7.5, 18, 6.0, 1.5, CREAM);

        if (isSleeping) {
          // sleeping curled-up pose
          px(2.0, 19, 6.0, 4.0, BLK);
          px(2.5, 20, 5.0, 3.0, RST);
          px(3.5, 21, 3.5, 2.0, WHT);
          px(13.0, 19, 5.0, 3.5, BLK);
          px(13.2, 20, 4.0, 2.5, RST);
          px(13.8, 21, 2.5, 1.5, WHT);
          px(5.0, 22, 10.0, 2.0, BLK);
          px(5.5, 23, 9.0, 1.5, RST);
          px(6.0, 24, 4.0, 1.0, WHT);
          px(10.5, 24, 4.0, 1.0, WHT);
        } else if (isSitting) {
          // sitting pose
          px(1.0, 15, 5.0, 9, BLK);
          px(15.0, 15, 5.0, 9, BLK);
          px(1.5, 16, 4.0, 8, RST);
          px(15.5, 16, 4.0, 8, RST);
          px(6.0, 20, 3.2, 4, BLK);
          px(11.8, 20, 3.2, 4, BLK);
          px(5.2, 23.2, 5.0, 1.2, WHT);
          px(10.8, 23.2, 5.0, 1.2, WHT);
        } else {
          // standing idle pose
          px(5.8, 20, 3.2, 4, BLK);
          px(12.0, 20, 3.2, 4, BLK);
          px(4.8, 23.4 - pawLL / S, 5.2, 1.3, WHT);
          px(11.0, 23.4 - pawLR / S, 5.2, 1.3, WHT);
        }

        if (isSleeping) {
          const sleepHeadBob = Math.sin(time * 1.3) * 0.8;
          const sTop = 10 + sleepHeadBob;
          ph(-0.2, sTop - 2, 3.0, 3.0, BLK);
          ph(0.3, sTop - 1.2, 2.2, 2.2, RST);
          ph(16.2, sTop - 2, 3.0, 3.0, BLK);
          ph(16.5, sTop - 1.2, 2.2, 2.2, RST);
          ph(3.8, sTop, 13.4, 10, BLK);
          ph(4.8, sTop + 1, 11.4, 9, BLK);
          ph(8.0, sTop, 5.0, 9, WHT);
          ph(8.5, sTop - 1, 4.0, 2, WHT);
          ph(4.0, sTop + 4, 4.2, 2.5, RST);
          ph(12.8, sTop + 4, 4.2, 2.5, RST);
          rect(ctx, left + 4.8 * S, top + (sTop + 5.2) * S - bb, 3.2 * S, 0.7 * S, BLK);
          rect(ctx, left + 13.0 * S, top + (sTop + 5.2) * S - bb, 3.2 * S, 0.7 * S, BLK);
          ph(7.2, sTop + 7.5, 6.6, 4.5, WHT);
          ph(6.8, sTop + 8, 7.4, 4.0, WHT);
          ph(8.8, sTop + 7.5, 3.4, 2.0, BLK);
        } else {
          const earOff = dog.earWiggle * S * 1.2;
          ph(-0.2, 2, 5.5, 10.0, BLK);
          ph(0.5, 2.5, 4.2, 9.0, RST);
          ph(-0.6, 0 - dog.earWiggle * 2, 3.0, 2.5, BLK);
          ph(0.2, 0.5 - dog.earWiggle * 2, 2.0, 1.8, RST);
          ph(15.7, 2, 5.5, 10.0, BLK);
          ph(15.9, 2.5, 4.2, 9.0, RST);
          ph(16.5, 0 - dog.earWiggle * 2, 3.0, 2.5, BLK);
          ph(16.8, 0.5 - dog.earWiggle * 2, 2.0, 1.8, RST);

          ph(3.8, 2, 13.4, 12, BLK);
          ph(4.8, 3, 11.4, 11, BLK);
          ph(8.0, 2, 5.0, 11, WHT);
          ph(8.5, 1, 4.0, 2, WHT);
          ph(4.0, 6, 4.2, 2.8, RST);
          ph(12.8, 6, 4.2, 2.8, RST);

          const bc = (performance.now() * 0.001) % 4.0;
          const blink = bc > 3.82;
          const lookOffX = dog.lookX * 0.3;
          const lookOffY = dog.lookY * 0.2;

          if (isResting || blink) {
            rect(ctx, left + 4.8 * S, top + 8.2 * S - bb - hb, 3.2 * S, 0.7 * S, BLK);
            rect(ctx, left + 13.0 * S, top + 8.2 * S - bb - hb, 3.2 * S, 0.7 * S, BLK);
          } else {
            ph(4.8, 7.2, 3.4, 3.4, BLK);
            ph(12.8, 7.2, 3.4, 3.4, BLK);
            rect(ctx, left + (5.2 + lookOffX) * S, top + (7.6 + lookOffY) * S - bb - hb, 1.1 * S, 1.1 * S, EYE_GRN);
            rect(ctx, left + (13.2 + lookOffX) * S, top + (7.6 + lookOffY) * S - bb - hb, 1.1 * S, 1.1 * S, EYE_GRN);
            rect(ctx, left + (5.2 + lookOffX) * S, top + (7.6 + lookOffY) * S - bb - hb, 0.5 * S, 0.5 * S, WHT);
            rect(ctx, left + (13.2 + lookOffX) * S, top + (7.6 + lookOffY) * S - bb - hb, 0.5 * S, 0.5 * S, WHT);
          }

          ph(7.2, 11.0, 6.6, 5.5, WHT);
          ph(6.8, 11.5, 7.4, 5.0, WHT);
          ph(8.8, 11.0, 3.4, 2.2, BLK);

          if (dog.tongueOut > 0.3) {
            const tLen = dog.tongueOut * 2.5;
            ph(9.2, 15.0, tLen, 0.8, PNK);
            ph(9.4, 15.7, tLen * 0.7, 0.6, PNK);
          }

          if (!isSleeping) {
            ph(3.5, 10.0, 2.0, 0.8, BLUSH);
            ph(15.0, 10.0, 2.0, 0.8, BLUSH);
          }

          if (isHappy) {
            ph(9.0, 14.8, 3.0, 3.2, PNK);
          }

          if (dog.state === "IDLE" && dog.headTilt > 0.3) {
            ph(3.0, 4, 1.5, 1.0, "#ffd");
          }
        }
      }

      ctx.restore();

      if (dog.state === "LYING") {
        drawZzz(ctx);
      }

      if (containerRef.current) {
        containerRef.current.style.left = `${dog.x - 80}px`;
        containerRef.current.style.top = `${dog.y - 120}px`;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      if (window.bubbleTimeout) clearTimeout(window.bubbleTimeout);
    };
  }, [booting]);

  if (booting) return null;

  return (
    <>

      {/* Page-anchored Paw Print Particles */}
      {pawPrints.map((paw) => (
        <div
          key={paw.id}
          className={styles.pawParticle}
          style={{
            left: paw.x - 6,
            top: paw.y - 6,
            transform: `rotate(${paw.rot}deg)`
          }}
        >
          <svg width="12" height="12" viewBox="0 0 6 6" fill="currentColor">
            <rect x="1" y="1" width="1" height="1" />
            <rect x="4" y="1" width="1" height="1" />
            <rect x="2" y="0" width="1" height="1" />
            <rect x="3" y="0" width="1" height="1" />
            <rect x="2" y="3" width="2" height="2" />
            <rect x="1" y="4" width="4" height="1" />
          </svg>
        </div>
      ))}

      {/* Floating Dog Container */}
      <div
        ref={containerRef}
        className={`${styles.dogContainer} ${isSpinning ? styles.spinAnimation : ""}`}
      >
        {/* Soft shadow under dog */}
        <div 
          className={styles.dogShadow} 
          style={{
            transform: `translateX(-50%) scale(${
              stateRef.current.state === "HAPPY" 
                ? 1 - Math.abs(Math.sin(performance.now() * 0.007)) * 0.25 
                : 1
            })`,
            opacity: stateRef.current.state === "LYING" ? 0.45 : 0.75
          }}
        />

        {/* Crisp pixelated canvas for dog and internal particles */}
        <canvas ref={canvasRef} className={styles.dogCanvas} />

        {/* Speech Bubble */}
        <AnimatePresence>
          {bubbleText && (
            <motion.div
              initial={{ opacity: 0, scale: 0.75, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
              className={styles.speechBubble}
            >
              {bubbleText}
            </motion.div>
          )}
        </AnimatePresence>


      </div>
    </>
  );
}

