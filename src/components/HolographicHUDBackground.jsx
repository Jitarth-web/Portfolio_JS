import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HolographicHUDBackground() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = containerRef.current.offsetWidth);
    let height = (canvas.height = containerRef.current.offsetHeight);

    const handleResize = () => {
      if (!canvas || !containerRef.current) return;
      width = canvas.width = containerRef.current.offsetWidth;
      height = canvas.height = containerRef.current.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle dust class
    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * height; // initial distribution
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + 10;
        this.vx = (Math.random() - 0.5) * 0.12;
        this.vy = -(Math.random() * 0.18 + 0.06);
        this.radius = Math.random() * 1.5 + 0.5;
        this.alpha = Math.random() * 0.08 + 0.04;
        this.color = ["#00C8FF", "#8A2BE2", "#FF3CAC", "#00F5FF"][
          Math.floor(Math.random() * 4)
        ];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < -10) this.reset();
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    // Connecting Network Nodes
    class Node {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.18;
        this.vy = (Math.random() - 0.5) * 0.18;
        this.color = ["#00C8FF", "#00F5FF"][Math.floor(Math.random() * 2)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
    }

    // Drifting Numbers and Strings
    class DriftingText {
      constructor() {
        this.reset();
        this.y = Math.random() * height;
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + 15;
        this.vy = -(Math.random() * 0.15 + 0.05);
        this.text = [
          "0F", "7A", "E8", "1011", "0010", "SYS_ACTIVE", "HUD_V2", "9X", "A4", "HEX_7F", "NET_C"
        ][Math.floor(Math.random() * 11)];
        this.alpha = Math.random() * 0.06 + 0.03;
      }

      update() {
        this.y += this.vy;
        if (this.y < -20) this.reset();
      }

      draw() {
        ctx.save();
        ctx.font = "8px monospace";
        ctx.fillStyle = "#00C8FF";
        ctx.globalAlpha = this.alpha;
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
      }
    }

    const particles = Array.from({ length: 30 }, () => new Particle());
    const nodes = Array.from({ length: 10 }, () => new Node());
    const texts = Array.from({ length: 6 }, () => new DriftingText());

    let waveTime = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connection lines
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].update();
        for (let j = i + 1; j < nodes.length; j++) {
          const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (dist < 160) {
            ctx.save();
            ctx.strokeStyle = "#00C8FF";
            ctx.globalAlpha = (1 - dist / 160) * 0.07;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }

        // Draw node points
        ctx.save();
        ctx.fillStyle = nodes[i].color;
        ctx.globalAlpha = 0.08;
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw dust particles
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      // Draw drifting digital telemetry
      texts.forEach((t) => {
        t.update();
        t.draw();
      });

      // Waveform simulated graph (Bottom Right)
      waveTime += 0.04;
      ctx.save();
      ctx.strokeStyle = "#FF3CAC";
      ctx.globalAlpha = 0.09;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      const waveX = width - 110;
      const waveY = height - 20;
      ctx.moveTo(waveX, waveY);
      for (let x = 0; x < 80; x += 4) {
        const y = Math.sin(waveTime + x * 0.12) * 5 * Math.cos(waveTime * 0.25);
        ctx.lineTo(waveX + x, waveY + y);
      }
      ctx.stroke();
      ctx.restore();

      // Mini-histogram / bar graph (Bottom Left)
      ctx.save();
      ctx.fillStyle = "#00F5FF";
      ctx.globalAlpha = 0.07;
      const barX = 24;
      const barY = height - 20;
      for (let i = 0; i < 6; i++) {
        const barHeight = 4 + Math.sin(waveTime * 1.5 + i) * 6 + Math.cos(waveTime * 0.8) * 3;
        ctx.fillRect(barX + i * 5, barY - barHeight, 3, barHeight);
      }
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Subtle parallax shifts
    gsap.to(containerRef.current.querySelectorAll(".hud-parallax"), {
      x: x * -18,
      y: y * -18,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.03,
      overwrite: "auto",
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none"
      style={{ background: "#050816" }}
    >
      <style>{`
        @keyframes spin-cw {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes spin-ccw {
          from { transform: translate(-50%, -50%) rotate(360deg); }
          to { transform: translate(-50%, -50%) rotate(0deg); }
        }
        @keyframes neon-scan {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        @keyframes radar-pulse-anim {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
          15% { opacity: 0.08; }
          75% { opacity: 0.05; }
          100% { transform: translate(-50%, -50%) scale(1.35); opacity: 0; }
        }
        @keyframes ui-float-1 {
          0%, 100% { transform: translateY(0) rotate(0.2deg); }
          50% { transform: translateY(-6px) rotate(-0.2deg); }
        }
        @keyframes ui-float-2 {
          0%, 100% { transform: translateY(0) rotate(-0.3deg); }
          50% { transform: translateY(-8px) rotate(0.3deg); }
        }
        @keyframes hud-blink {
          0%, 100% { opacity: 0.04; }
          50% { opacity: 0.12; }
        }

        .hud-spin-cw {
          animation: spin-cw 38s linear infinite;
        }
        .hud-spin-ccw {
          animation: spin-ccw 52s linear infinite;
        }
        .hud-scan-line {
          animation: neon-scan 14s linear infinite;
        }
        .hud-radar-pulse {
          animation: radar-pulse-anim 10s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
        }
        .hud-float-tl {
          animation: ui-float-1 12s ease-in-out infinite;
        }
        .hud-float-tr {
          animation: ui-float-2 15s ease-in-out infinite;
        }
        .hud-pulse-glow {
          animation: hud-blink 4s ease-in-out infinite;
        }
      `}</style>

      {/* HTML5 Canvas for dust, connecting lines, drifting codes, and graphs */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none hud-parallax"
        style={{ opacity: 0.95 }}
      />

      {/* Concentric Holographic SVG Rings (Center Background) */}
      <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] pointer-events-none -translate-x-1/2 -translate-y-1/2 hud-parallax">
        {/* Outermost dotted scale */}
        <svg
          className="absolute top-1/2 left-1/2 w-[550px] h-[550px] -translate-x-1/2 -translate-y-1/2 hud-spin-cw"
          viewBox="0 0 100 100"
          style={{ opacity: 0.07 }}
        >
          <circle cx="50" cy="50" r="48" fill="none" stroke="#00C8FF" strokeWidth="0.3" strokeDasharray="1 3" />
        </svg>

        {/* Tech ring with notches */}
        <svg
          className="absolute top-1/2 left-1/2 w-[460px] h-[460px] -translate-x-1/2 -translate-y-1/2 hud-spin-ccw"
          viewBox="0 0 100 100"
          style={{ opacity: 0.08 }}
        >
          <circle cx="50" cy="50" r="46" fill="none" stroke="#8A2BE2" strokeWidth="0.8" strokeDasharray="10 25 5 10" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="#FF3CAC" strokeWidth="0.3" strokeDasharray="2 4" />
        </svg>

        {/* Inner radar pulses */}
        <div
          className="absolute top-1/2 left-1/2 w-[380px] h-[380px] rounded-full border border-[#00F5FF] pointer-events-none hud-radar-pulse"
          style={{ opacity: 0 }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-[380px] h-[380px] rounded-full border border-[#8A2BE2] pointer-events-none hud-radar-pulse"
          style={{ opacity: 0, animationDelay: "5s" }}
        />

        {/* Fine crosshairs & measurement axes */}
        <svg
          className="absolute top-1/2 left-1/2 w-[320px] h-[320px] -translate-x-1/2 -translate-y-1/2"
          viewBox="0 0 100 100"
          style={{ opacity: 0.09 }}
        >
          <line x1="50" y1="5" x2="50" y2="25" stroke="#00C8FF" strokeWidth="0.4" />
          <line x1="50" y1="75" x2="50" y2="95" stroke="#00C8FF" strokeWidth="0.4" />
          <line x1="5" y1="50" x2="25" y2="50" stroke="#00C8FF" strokeWidth="0.4" />
          <line x1="75" y1="50" x2="95" y2="50" stroke="#00C8FF" strokeWidth="0.4" />
          <circle cx="50" cy="50" r="1.5" fill="#FF3CAC" />
        </svg>
      </div>

      {/* Neon Sweeping Scanner Line */}
      <div
        className="absolute left-0 right-0 h-[2px] pointer-events-none hud-scan-line"
        style={{
          background: "linear-gradient(90deg, transparent, #00F5FF 20%, #FF3CAC 50%, #8A2BE2 80%, transparent)",
          boxShadow: "0 0 8px rgba(0, 245, 255, 0.4), 0 0 15px rgba(255, 60, 172, 0.2)",
          opacity: 0.1,
        }}
      />

      {/* HUD Overlay corner panels */}

      {/* Top-Left Telemetry panel */}
      <div
        className="absolute top-5 left-5 pointer-events-none select-none font-mono text-[8px] text-[#00C8FF] border border-[#00C8FF]/15 p-2 rounded bg-[#050816]/30 backdrop-blur-[2px] z-10 flex flex-col gap-1 hud-float-tl hud-parallax"
        style={{ opacity: 0.11 }}
      >
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00F5FF] inline-block animate-pulse"></span>
          <span>SYS.ONLINE: HUD_V4.92</span>
        </div>
        <div>GRID_INDEX: IX-9941</div>
        <div>PARALLAX_X: AUTO</div>
        <div className="text-[#8A2BE2]">LINK_STABILITY: 99.8%</div>
      </div>

      {/* Top-Right Target acquisition panel */}
      <div
        className="absolute top-5 right-5 pointer-events-none select-none font-mono text-[8px] text-[#FF3CAC] border border-[#FF3CAC]/15 p-2 rounded bg-[#050816]/30 backdrop-blur-[2px] z-10 flex flex-col gap-1 hud-float-tr hud-parallax"
        style={{ opacity: 0.11 }}
      >
        <div>TARGET: PROJECT_CYLINDER</div>
        <div>ROTATION: 1.20 RAD/S</div>
        <div className="text-[#00F5FF] hud-pulse-glow">BLOOM_INTENSITY: 1.50</div>
        <div>FIELD_DEPTH: 7.50m</div>
      </div>

      {/* Wireframe grids in corners */}
      <svg
        className="absolute bottom-5 left-5 w-12 h-12 pointer-events-none"
        viewBox="0 0 40 40"
        style={{ opacity: 0.08 }}
      >
        <rect x="0.5" y="0.5" width="39" height="39" fill="none" stroke="#8A2BE2" strokeWidth="0.5" strokeDasharray="2 4" />
        <line x1="0" y1="0" x2="40" y2="40" stroke="#8A2BE2" strokeWidth="0.3" />
        <circle cx="20" cy="20" r="10" fill="none" stroke="#00C8FF" strokeWidth="0.4" />
      </svg>

      <svg
        className="absolute bottom-5 right-5 w-12 h-12 pointer-events-none"
        viewBox="0 0 40 40"
        style={{ opacity: 0.08 }}
      >
        <rect x="0.5" y="0.5" width="39" height="39" fill="none" stroke="#00F5FF" strokeWidth="0.5" strokeDasharray="1 2" />
        <line x1="40" y1="0" x2="0" y2="40" stroke="#00F5FF" strokeWidth="0.3" />
        <circle cx="20" cy="20" r="10" fill="none" stroke="#FF3CAC" strokeWidth="0.4" />
      </svg>
    </div>
  );
}
