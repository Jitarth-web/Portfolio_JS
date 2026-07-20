import { useEffect, useRef } from "react";
import image164 from "../assets/figma/image 164.png";
import FloatingSticker from "./FloatingSticker";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Mouse movement tracking for background spotlight glow
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      container.style.setProperty("--mouse-x", `${x}px`);
      container.style.setProperty("--mouse-y", `${y}px`);
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    // GSAP ScrollTrigger for introductory reveal light sweep
    const container = containerRef.current;
    if (!container) return;

    const letters = container.querySelectorAll(".footer-letter");
    
    // We create a timeline that triggers when the footer text is in view
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 95%",
        toggleActions: "play none none none"
      }
    });

    tl.to(letters, {
      className: "footer-letter active-fill",
      duration: 0.4,
      stagger: 0.08,
      ease: "power2.out"
    }).to(letters, {
      className: "footer-letter",
      duration: 0.5,
      stagger: 0.06,
      ease: "power2.inOut"
    }, "+=0.2");

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  const word = "Jitarth";

  return (
    <footer className="w-full pt-6 pb-2 border-t border-[rgba(255,255,255,0.05)] relative overflow-hidden flex flex-col gap-4 section-panel">
      <FloatingSticker text="thankyou" theme="red" size="md" top="30%" left="15%" rotation={-5} allowCenter={true} />
      
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center gap-4 relative z-10 w-full text-center">
        
        <div className="flex flex-col items-center justify-center text-center z-20">
          <p className="footer-copyright">
            Made with love by <span className="footer-author-name">Jitarth Singh</span>. All rights reserved 2026.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 z-20">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <span className="text-white text-xs tracking-widest uppercase font-semibold">System is under control</span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]"></span>
          </div>
          
          {/* Group decorative element and 3D helmet on mobile */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <img src={image164} alt="Decorative Footer Element" className="md:hidden w-24 opacity-85 float-anim-2" />
            
            {/* Mobile-only Cyberpunk 3D Helmet iframe (hidden on desktop) */}
            <div 
                className="md:hidden relative w-[160px] h-[160px] z-10 pointer-events-none overflow-visible"
                onClick={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
            >
                <iframe 
                    src="/cyber_punk/index.html" 
                    title="Cyberpunk 3D Element (Mobile)" 
                    style={{ width: '100%', height: '100%', border: 'none', position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'auto' }} 
                />
            </div>
          </div>
        </div>
      </div>

      {/* Giant Jitarth Text with hover fill and moving background spotlight */}
      <div 
        ref={containerRef}
        className="footer-text-container relative z-10"
      >
        {/* Background Spotlight Glow */}
        <div className="footer-bg-glow absolute inset-0 pointer-events-none" />

        <h2 className="footer-big-text relative z-10 select-none">
          {word.split("").map((letter, idx) => (
            <span key={idx} className="footer-letter">
              {letter}
            </span>
          ))}
        </h2>
      </div>

      {/* Desktop-only Cyberpunk 3D Helmet iframe (original position & styling, hidden on mobile) */}
      <div 
          className="hidden md:block"
          style={{
              position: 'absolute',
              top: '-30px',
              left: '-30px',
              width: '360px',
              height: '360px',
              zIndex: 1,
              overflow: 'visible',
              pointerEvents: 'none'
          }}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
      >
          <iframe 
              src="/cyber_punk/index.html" 
              title="Cyberpunk 3D Element (Desktop)" 
              style={{ width: '100%', height: '100%', border: 'none', position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'auto' }} 
          />
      </div>

      {/* Desktop-only Decorative Image (hidden on mobile, shifted to right corner) */}
      <div 
          className="hidden md:block"
          style={{
              position: 'absolute',
              top: '30px',
              right: '-30px',
              width: '300px',
              height: '300px',
              zIndex: 1,
              overflow: 'visible',
              pointerEvents: 'none'
          }}
      >
          <img 
              src={image164} 
              alt="Decorative Footer Element" 
              className="w-full h-full object-contain opacity-85 float-anim-2" 
          />
      </div>
    </footer>
  );
}

