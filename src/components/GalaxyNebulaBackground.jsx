import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function GalaxyNebulaBackground() {
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

    // Stars class
    class Star {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.2 + 0.3;
        this.speed = Math.random() * 0.02 + 0.005;
        this.angle = Math.random() * Math.PI * 2;
        this.twinkleSpeed = Math.random() * 0.03 + 0.01;
        this.twinklePhase = Math.random() * Math.PI;
        this.color = ["#ffffff", "#e0f7fa", "#f3e5f5", "#fffde7"][
          Math.floor(Math.random() * 4)
        ];
      }

      update() {
        // Slowly drift stars to create passive parallax panning
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        // Wrap around borders
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        this.twinklePhase += this.twinkleSpeed;
      }

      draw() {
        const opacity = 0.2 + Math.abs(Math.sin(this.twinklePhase)) * 0.7;
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = this.size * 3;
        ctx.shadowColor = "#ffffff";
        ctx.fill();
        ctx.restore();
      }
    }

    // Large floating space dust particles
    class Dust {
      constructor() {
        this.reset();
        this.y = Math.random() * height;
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + 10;
        this.vx = (Math.random() - 0.5) * 0.06;
        this.vy = -(Math.random() * 0.12 + 0.04);
        this.size = Math.random() * 2.5 + 0.8;
        this.alpha = Math.random() * 0.15 + 0.05;
        this.color = ["#da70d6", "#8a2be2", "#00ffff", "#ffffff"][
          Math.floor(Math.random() * 4)
        ];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < -10 || this.x > width + 10) this.vx *= -1;
        if (this.y < -10) this.reset();
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    const stars = Array.from({ length: 110 }, () => new Star());
    const dust = Array.from({ length: 25 }, () => new Dust());

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach((s) => {
        s.update();
        s.draw();
      });

      dust.forEach((d) => {
        d.update();
        d.draw();
      });

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

    // Smooth cosmic parallax translation
    gsap.to(containerRef.current.querySelectorAll(".nebula-parallax"), {
      x: x * -25,
      y: y * -25,
      duration: 1.2,
      ease: "power1.out",
      stagger: 0.05,
      overwrite: "auto",
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none"
      style={{ background: "#020208" }} // absolute pitch-black space base
    >
      <style>{`
        @keyframes float-nebula-1 {
          0%, 100% { transform: translate(-30%, -40%) scale(1); opacity: 0.18; }
          50% { transform: translate(-20%, -30%) scale(1.1); opacity: 0.25; }
        }
        @keyframes float-nebula-2 {
          0%, 100% { transform: translate(-60%, -50%) scale(1.2); opacity: 0.15; }
          50% { transform: translate(-50%, -60%) scale(1); opacity: 0.22; }
        }
        @keyframes float-nebula-3 {
          0%, 100% { transform: translate(-20%, -60%) scale(1.1); opacity: 0.12; }
          50% { transform: translate(-30%, -50%) scale(0.95); opacity: 0.18; }
        }
        @keyframes rotating-rays {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .nebula-purple {
          animation: float-nebula-1 25s ease-in-out infinite;
        }
        .nebula-magenta {
          animation: float-nebula-2 35s ease-in-out infinite;
        }
        .nebula-cyan {
          animation: float-nebula-3 28s ease-in-out infinite;
        }
        .cosmic-rays {
          animation: rotating-rays 80s linear infinite;
        }
      `}</style>

      {/* Layered Nebula Gas Clouds (Huge blurred radial gradients) */}

      {/* Purple Nebula (Dominant) */}
      <div
        className="absolute top-[40%] left-[30%] w-[550px] h-[550px] rounded-full pointer-events-none blur-[110px] nebula-purple nebula-parallax"
        style={{
          background: "radial-gradient(circle, rgba(138, 43, 226, 0.24) 0%, rgba(138, 43, 226, 0.08) 50%, transparent 100%)",
          mixBlendMode: "screen",
        }}
      />

      {/* Magenta Nebula (Accent) */}
      <div
        className="absolute top-[60%] left-[60%] w-[480px] h-[480px] rounded-full pointer-events-none blur-[100px] nebula-magenta nebula-parallax"
        style={{
          background: "radial-gradient(circle, rgba(255, 60, 172, 0.18) 0%, rgba(255, 60, 172, 0.04) 50%, transparent 100%)",
          mixBlendMode: "screen",
        }}
      />

      {/* Cyan Nebula (Contrast glow) */}
      <div
        className="absolute top-[30%] left-[70%] w-[450px] h-[450px] rounded-full pointer-events-none blur-[105px] nebula-cyan nebula-parallax"
        style={{
          background: "radial-gradient(circle, rgba(0, 245, 255, 0.14) 0%, rgba(0, 245, 255, 0.03) 50%, transparent 100%)",
          mixBlendMode: "screen",
        }}
      />

      {/* Volumetric Cosmic Light Rays (Slowly spinning behind cylinders) */}
      <svg
        className="absolute w-[900px] h-[900px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.14] mix-blend-screen cosmic-rays pointer-events-none nebula-parallax"
        viewBox="0 0 100 100"
      >
        <defs>
          <radialGradient id="nebula-ray-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0, 200, 255, 0.35)" />
            <stop offset="15%" stopColor="rgba(138, 43, 226, 0.18)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill="url(#nebula-ray-grad)" />
        {/* Cinematic light beams */}
        <path d="M50 50 L10 12 L22 4 Z" fill="rgba(138, 43, 226, 0.16)" />
        <path d="M50 50 L88 24 L78 6 Z" fill="rgba(255, 60, 172, 0.12)" />
        <path d="M50 50 L18 84 L38 94 Z" fill="rgba(0, 245, 255, 0.14)" />
        <path d="M50 50 L82 78 L68 92 Z" fill="rgba(138, 43, 226, 0.16)" />
        <path d="M50 50 L95 50 L92 38 Z" fill="rgba(255, 255, 255, 0.08)" />
        <path d="M50 50 L5 52 L8 62 Z" fill="rgba(0, 245, 255, 0.12)" />
      </svg>

      {/* Canvas Layer for stars and dust particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none nebula-parallax"
        style={{ mixBlendMode: "screen" }}
      />
    </div>
  );
}
