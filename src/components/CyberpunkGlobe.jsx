import { useEffect, useRef, useState } from "react";

// Coordinates translated to U, V percentages (0 to 1) on equirectangular projection
const MARKERS_DATA = [
  {
    id: "home",
    u: (82.9739 + 180) / 360,
    v: (90 - 25.3176) / 180,
    title: "Home Node",
    desc: "Varanasi, India\nInitiation point of developer core.",
    size: 4
  },
  {
    id: "nitd",
    u: (77.1049 + 180) / 360,
    v: (90 - 28.8427) / 180,
    title: "NIT Delhi Node",
    desc: "National Institute of Technology Delhi\nActive Hub: Systems & AI Research.",
    size: 5.5
  }
];

// Connection paths from India to global hubs
const TARGETS_DATA = [
  { name: "Bangalore", u: (77.5946 + 180) / 360, v: (90 - 12.9716) / 180 },
  { name: "Singapore", u: (103.8198 + 180) / 360, v: (90 - 1.3521) / 180 },
  { name: "Tokyo", u: (139.6503 + 180) / 360, v: (90 - 35.6762) / 180 },
  { name: "London", u: (-0.1278 + 180) / 360, v: (90 - 51.5074) / 180 },
  { name: "Sydney", u: (151.2093 + 180) / 360, v: (90 - -33.8688) / 180 },
  { name: "San Francisco", u: (-122.4194 + 180) / 360, v: (90 - 37.7749) / 180 }
];

// Detailed coordinates for world continents (0-100 scale) for high fidelity
const CONTINENTS = {
  northAmerica: [
    [2, 22], [8, 18], [15, 14], [25, 12], [35, 11], [37, 18], [33, 24], [37, 28], 
    [31, 38], [28, 45], [26, 46], [22, 40], [17, 38], [10, 36], [5, 29]
  ],
  greenland: [
    [34, 7], [40, 8], [38, 15], [33, 13]
  ],
  southAmerica: [
    [26, 46], [32, 48], [35, 54], [37, 62], [35, 72], [31, 82], 
    [28, 86], [26, 80], [24, 70], [22, 60], [23, 52]
  ],
  africa: [
    [41, 42], [54, 40], [59, 44], [62, 50], [61, 58], [58, 68], 
    [54, 78], [51, 80], [49, 72], [47, 65], [42, 58], [40, 52], [41, 46]
  ],
  eurasia: [
    [42, 25], [48, 18], [55, 15], [68, 12], [80, 14], [88, 16], [94, 20], 
    [92, 32], [88, 38], [82, 42], [79, 48], [75, 52], [73, 47], [70, 48], 
    [66, 45], [62, 46], [58, 42], [52, 43], [46, 38], [42, 35]
  ],
  australia: [
    [80, 64], [86, 62], [92, 65], [94, 72], [90, 78], [84, 79], [79, 72]
  ]
};

// Procedural map generator function
const drawProceduralWorldMap = (ctx, w, h) => {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, w, h);
  
  ctx.fillStyle = "#ffffff";
  const scaleX = w / 100;
  const scaleY = h / 100;
  
  const drawPolygon = (points) => {
    ctx.beginPath();
    ctx.moveTo(points[0][0] * scaleX, points[0][1] * scaleY);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i][0] * scaleX, points[i][1] * scaleY);
    }
    ctx.closePath();
    ctx.fill();
  };
  
  // Render continents
  drawPolygon(CONTINENTS.northAmerica);
  drawPolygon(CONTINENTS.greenland);
  drawPolygon(CONTINENTS.southAmerica);
  drawPolygon(CONTINENTS.africa);
  drawPolygon(CONTINENTS.eurasia);
  drawPolygon(CONTINENTS.australia);
  
  // Draw islands as crisp square points
  ctx.fillRect(40.5 * scaleX, 19.5 * scaleY, 1.5 * scaleX, 1.5 * scaleY); // UK
  ctx.fillRect(92.5 * scaleX, 24.5 * scaleY, 1.5 * scaleX, 2 * scaleY); // Japan
  ctx.fillRect(60 * scaleX, 69 * scaleY, 1.2 * scaleX, 2 * scaleY); // Madagascar
  ctx.fillRect(94 * scaleX, 81 * scaleY, 1.2 * scaleX, 2.5 * scaleY); // New Zealand
};

export default function CyberpunkGlobe() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const dotsRef = useRef([]);
  
  const [tooltip, setTooltip] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Load and sample the procedural world map immediately on mount (100% offline & CORS safe)
  useEffect(() => {
    // LED grid resolution (110 horizontal x 55 vertical dots)
    const w = 110;
    const h = 55;
    
    const helperCanvas = document.createElement("canvas");
    const helperCtx = helperCanvas.getContext("2d");
    helperCanvas.width = w;
    helperCanvas.height = h;
    
    // Draw vectors
    drawProceduralWorldMap(helperCtx, w, h);
    
    const data = helperCtx.getImageData(0, 0, w, h).data;
    const sampledDots = [];
    
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        if (data[idx] > 120) { // Landmask check
          sampledDots.push({ u: x / w, v: y / h });
        }
      }
    }
    
    dotsRef.current = sampledDots;
  }, []);

  // Render and animation loops
  useEffect(() => {
    let frameId;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const handleResize = () => {
      if (!canvas || !containerRef.current) return;
      canvas.width = containerRef.current.clientWidth || 380;
      canvas.height = containerRef.current.clientHeight || 340;
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;

      // Extract the active theme color dynamically from the DOM (User chosen)
      const style = getComputedStyle(document.documentElement);
      const themeColor = style.getPropertyValue('--theme-color').trim() || '#ff6a21';

      ctx.clearRect(0, 0, w, h);

      // --- 1. Draw Dotted World Map (Silver/Gray dots exactly like the photo) ---
      const dots = dotsRef.current;
      if (dots.length > 0) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.28)"; // Silver/gray LED grid
        
        dots.forEach((dot) => {
          const dx = dot.u * w;
          const dy = dot.v * h;
          // Draw square pixel dots
          ctx.fillRect(dx - 1.3, dy - 1.3, 2.6, 2.6);
        });
      }

      // --- 2. Draw Volumetric Radial Background Glow Behind India ---
      const ax = MARKERS_DATA[1].u * w;
      const ay = MARKERS_DATA[1].v * h;
      
      const radGlow = ctx.createRadialGradient(ax, ay, 2, ax, ay, 40);
      radGlow.addColorStop(0, themeColor);
      radGlow.addColorStop(1, "transparent");
      
      ctx.beginPath();
      ctx.arc(ax, ay, 40, 0, Math.PI * 2);
      ctx.fillStyle = radGlow;
      ctx.globalAlpha = 0.22; // Subtle ambient backing glow
      ctx.fill();

      // --- 3. Draw Global Neural Arcs & Flowing Packets (Themed) ---
      const time = Date.now() * 0.001;

      // Varanasi (Home) to NIT Delhi (Active Hub) connection
      const hx = MARKERS_DATA[0].u * w;
      const hy = MARKERS_DATA[0].v * h;

      ctx.beginPath();
      ctx.moveTo(hx, hy);
      const cxH = (hx + ax) / 2;
      const cyH = (hy + ay) / 2 - 12; // Hugs curvature
      ctx.quadraticCurveTo(cxH, cyH, ax, ay);
      ctx.strokeStyle = themeColor;
      ctx.globalAlpha = 0.65; // Luminous connection line
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Flowing packet Home -> Delhi
      const tH = (time * 0.25) % 1.0;
      const pxH = (1 - tH) * (1 - tH) * hx + 2 * (1 - tH) * tH * cxH + tH * tH * ax;
      const pyH = (1 - tH) * (1 - tH) * hy + 2 * (1 - tH) * tH * cyH + tH * tH * ay;
      ctx.beginPath();
      ctx.arc(pxH, pyH, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = themeColor;
      ctx.globalAlpha = Math.sin(tH * Math.PI) * 0.9;
      ctx.fill();

      // Extended connections
      ctx.lineWidth = 1.0;
      TARGETS_DATA.forEach((target, index) => {
        const tx = target.u * w;
        const ty = target.v * h;

        ctx.beginPath();
        ctx.moveTo(ax, ay);
        const cx = (ax + tx) / 2;
        const dx = tx - ax;
        const dy = ty - ay;
        const dist = Math.hypot(dx, dy);
        const cy = (ay + ty) / 2 - dist * 0.24; // Curve upward

        ctx.quadraticCurveTo(cx, cy, tx, ty);
        ctx.strokeStyle = themeColor;
        ctx.globalAlpha = 0.08; // Faint animated connection
        ctx.stroke();

        // Staggered flowing particles along arcs
        const t = (time * 0.22 + index / TARGETS_DATA.length) % 1.0;
        const px = (1 - t) * (1 - t) * ax + 2 * (1 - t) * t * cx + t * t * tx;
        const py = (1 - t) * (1 - t) * ay + 2 * (1 - t) * t * cy + t * t * ty;

        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = themeColor;
        ctx.globalAlpha = Math.sin(t * Math.PI) * 0.55;
        ctx.fill();
      });

      // --- 4. Draw Markers & Concentric Pulsing Radar Rings (Themed) ---
      MARKERS_DATA.forEach((marker) => {
        const mx = marker.u * w;
        const my = marker.v * h;

        // Concentric expanding radar rings
        ctx.strokeStyle = themeColor;
        ctx.lineWidth = 0.85;
        for (let i = 0; i < 2; i++) {
          const progress = (time * 0.75 + i * 0.5) % 1.0;
          const radius = progress * 22;
          const alpha = 1.0 - progress;

          ctx.beginPath();
          ctx.arc(mx, my, radius, 0, Math.PI * 2);
          ctx.globalAlpha = alpha * 0.45;
          ctx.stroke();
        }

        // Active node core dot (Pulsing)
        const pulse = 1.0 + 0.16 * Math.sin(time * 5.5);
        ctx.beginPath();
        ctx.arc(mx, my, marker.size * pulse, 0, Math.PI * 2);
        ctx.fillStyle = themeColor;
        ctx.globalAlpha = 0.9;
        ctx.fill();

        // Inner white core for high-end luxury styling
        ctx.beginPath();
        ctx.arc(mx, my, marker.size * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.globalAlpha = 0.95;
        ctx.fill();
      });

      frameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  // 3. Pointer event listener for hover tooltips
  const handlePointerMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let active = null;
    MARKERS_DATA.forEach((marker) => {
      const mx = marker.u * rect.width;
      const my = marker.v * rect.height;
      const dist = Math.hypot(mouseX - mx, mouseY - my);
      if (dist < 15) {
        active = marker;
      }
    });

    if (active) {
      setTooltip({
        title: active.title,
        desc: active.desc
      });
      setTooltipPos({
        x: mouseX,
        y: mouseY
      });
    } else {
      setTooltip(null);
    }
  };

  const handlePointerLeave = () => {
    setTooltip(null);
  };

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full relative" 
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ 
        minHeight: "340px",
        cursor: tooltip ? "pointer" : "default",
        background: "radial-gradient(circle at center, color-mix(in srgb, var(--theme-color) 4%, #08080a) 0%, #030305 100%)",
        backgroundImage: `
          radial-gradient(circle at center, color-mix(in srgb, var(--theme-color) 4%, #08080a) 0%, #030305 100%),
          linear-gradient(color-mix(in srgb, var(--theme-color) 1.5%, transparent) 1px, transparent 1px),
          linear-gradient(90deg, color-mix(in srgb, var(--theme-color) 1.5%, transparent) 1px, transparent 1px)
        `,
        backgroundSize: "100% 100%, 20px 20px, 20px 20px" // HUD holographic grid
      }}
    >
      {/* Sci-Fi HUD Corner Brackets (Uses var(--theme-color)) */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[var(--theme-color)] opacity-50 pointer-events-none z-20" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[var(--theme-color)] opacity-50 pointer-events-none z-20" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[var(--theme-color)] opacity-50 pointer-events-none z-20" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[var(--theme-color)] opacity-50 pointer-events-none z-20" />

      {/* Sci-Fi HUD Monospace Titles (Uses var(--theme-color)) */}
      <div className="absolute top-4 left-4 z-10 font-mono text-[9px] tracking-wider text-[var(--theme-color)] flex items-center gap-1.5 pointer-events-none select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-color)] animate-pulse" />
        NEURAL NETWORK MAP
      </div>
      <div className="absolute top-4 right-4 z-10 font-mono text-[9px] tracking-wider text-[var(--theme-color)] opacity-70 pointer-events-none select-none">
        SECURE_NODE_02
      </div>

      <canvas ref={canvasRef} className="w-full h-full block" />
      
      {/* HTML tooltip absolute positioned over canvas */}
      {tooltip && (
        <div
          className="absolute z-30 pointer-events-none bg-[#09090b]/95 border border-[var(--theme-color)] text-white p-3 rounded font-mono text-[10px] leading-relaxed shadow-lg shadow-black/85 transition-opacity duration-150"
          style={{
            left: `${tooltipPos.x + 14}px`,
            top: `${tooltipPos.y + 14}px`,
            transform: "translate(-20%, -100%)",
            whiteSpace: "pre-line"
          }}
        >
          <div className="font-bold text-[var(--theme-color)] text-[11px] mb-0.5">{tooltip.title}</div>
          <div className="text-gray-300">{tooltip.desc}</div>
        </div>
      )}
    </div>
  );
}
