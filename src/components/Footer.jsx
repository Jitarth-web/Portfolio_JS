import image164 from "../assets/figma/image 164.png";

export default function Footer() {
  return (
    <footer className="w-full py-8 border-t border-[rgba(255,255,255,0.05)] relative overflow-hidden min-h-[180px] flex items-center">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 w-full">
        
        <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left z-20 pl-0 md:pl-28">
          <p className="text-gray-400 text-sm tracking-wide">
            Made with love by <span className="text-[var(--theme-color)] font-semibold">Jitarth Singh</span>. All rights reserved 2026.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 z-20">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <span className="text-gray-300 text-xs tracking-widest uppercase font-semibold">System is under control</span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]"></span>
          </div>
          
          {/* Group decorative element and 3D helmet side-by-side on mobile */}
          <div className="flex flex-row items-center gap-4">
            <img src={image164} alt="Decorative Footer Element" className="w-16 md:w-20 opacity-80 float-anim-2" />
            
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

      {/* Desktop-only Cyberpunk 3D Helmet iframe (original position & styling, hidden on mobile) */}
      <div 
          className="hidden md:block"
          style={{
              position: 'absolute',
              bottom: '-65px',
              left: '-10px',
              width: '320px',
              height: '320px',
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
    </footer>
  );
}
