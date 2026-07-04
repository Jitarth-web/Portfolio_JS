import { useState, useEffect } from "react";
import image164 from "../assets/figma/image 164.png";

export default function Footer() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <footer className="w-full py-8 border-t border-[rgba(255,255,255,0.05)] relative overflow-hidden min-h-[180px] flex items-center">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 w-full">
        
        <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left z-20 pl-0 md:pl-28">
          <p className="text-gray-400 text-sm tracking-wide">
            Made with love by <span className="text-[#ff6a21] font-semibold">Jitarth Singh</span>. All rights reserved 2026.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 z-20">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <span className="text-gray-300 text-xs tracking-widest uppercase font-semibold">System is under control</span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]"></span>
          </div>
          
          <img src={image164} alt="Decorative Footer Element" className="w-16 md:w-20 opacity-80 float-anim-2" />
        </div>
      </div>

      {/* Cyberpunk 3D Helmet iframe positioned in the left corner */}
      <div 
          style={{
              position: 'absolute',
              bottom: isMobile ? '-30px' : '-65px',
              left: isMobile ? '-15px' : '-10px',
              width: isMobile ? '140px' : '320px',
              height: isMobile ? '140px' : '320px',
              zIndex: 1,
              overflow: 'visible',
              pointerEvents: 'none'
          }}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
      >
          <iframe 
              src="/cyber_punk/index.html" 
              title="Cyberpunk 3D Element" 
              style={{ width: '100%', height: '100%', border: 'none', position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'auto' }} 
          />
      </div>
    </footer>
  );
}
