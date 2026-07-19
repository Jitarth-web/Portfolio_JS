import SectionHeading from "../components/SectionHeading";
import FloatingSticker from "../components/FloatingSticker";
import { experience } from "../data/portfolio";
import astronaut from "../assets/figma/astronaut-space-suit-white-background-3d-illustration 1.png";
import image34 from "../assets/figma/image 34.png";
import image35 from "../assets/figma/image 35.png";

export default function Experience() {
  return (
    <section id="experience" className="content-section relative overflow-hidden">
      <FloatingSticker text="Fixing typo in prod" theme="cyan" size="md" top="15%" right="3%" rotation={10} />
      <FloatingSticker text="Senior Copy Paster" theme="purple" size="md" top="28%" right="12%" rotation={-6} allowCenter={true} className="hidden lg:block" />
      <FloatingSticker text="Git Push. Hope." theme="pink" size="md" top="42%" left="2%" rotation={-9} className="hidden lg:block" />
      <FloatingSticker text="It worked yesterday" theme="blue" size="md" top="56%" left="15%" rotation={8} allowCenter={true} />
      <FloatingSticker text="TODO: Delete this." theme="cyber-glass" size="md" top="70%" right="2%" rotation={7} allowCenter={true} className="hidden lg:block" />
      <FloatingSticker text="Rubber Duck Approved" theme="orange" size="sm" top="80%" right="8%" rotation={-8} allowCenter={true} />
      <FloatingSticker text="Is it coffee time?" theme="green" size="md" top="90%" left="4%" rotation={-6} />
      
      <div className="section-inner relative z-10">
        <SectionHeading label="Experience" title="A Focused {Software Development} Path." />
        
        <div className="experience-timeline relative mt-16 pl-8 md:pl-0">
          {/* Scroll Animated Timeline Line */}
          <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-[2px] bg-[rgba(255,255,255,0.1)] transform md:-translate-x-1/2 rounded-full hidden sm:block">
            <div className="timeline-line-progress absolute left-0 top-0 w-full rounded-full" style={{ height: "0%", backgroundColor: "var(--theme-color)" }}></div>
          </div>

          <div className="flex flex-col gap-12">
            {experience.map((item, index) => {
              let imgSrc = null;
              let imgClass = "";
              let floatClass = "";
              
              if (index === 0) {
                imgSrc = astronaut;
                imgClass = "absolute right-[-15%] md:right-[-25%] top-[-25%] w-28 md:w-56 z-20";
                floatClass = "float-anim-1";
              } else if (index === 1) {
                imgSrc = image34;
                imgClass = "absolute left-[-15%] md:left-[-25%] bottom-4 w-24 md:w-44 z-20";
                floatClass = "float-anim-2";
              } else if (index === 2) {
                imgSrc = image35;
                imgClass = "absolute right-[-15%] md:right-[-25%] bottom-[-15%] w-28 md:w-48 z-20";
                floatClass = "float-anim-3";
              }

              return (
                <article className={`timeline-box relative w-full md:w-[45%] ${index % 2 === 0 ? 'md:ml-auto md:pl-12' : 'md:mr-auto md:pr-12 text-left md:text-right'} reveal-timeline`} key={item.title}>
                  
                  {/* Timeline Dot connecting to the line */}
                  <div className={`absolute top-6 ${index % 2 === 0 ? 'left-[-40px] md:left-[-12px]' : 'left-[-40px] md:right-[-12px] md:left-auto'} w-6 h-6 rounded-full border-4 z-20 hidden sm:block`}
                       style={{
                         ...(index % 2 === 0 ? { transform: 'translateX(-50%)' } : { transform: 'translateX(50%)' }),
                         backgroundColor: 'var(--theme-color)',
                         boxShadow: '0 0 15px var(--theme-color)',
                         borderColor: 'var(--bg-color-1)'
                       }} />

                  {imgSrc && (
                    <img src={imgSrc} alt="Decorative" className={`${imgClass} ${floatClass} pointer-events-none`} style={{ filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.6))' }} />
                  )}

                  <div className="glass-card p-8 rounded-2xl hover:bg-[rgba(255,255,255,0.05)] transition-colors duration-300 relative overflow-hidden group z-10" style={{ background: "var(--bg-nav)", backdropFilter: "blur(12px)" }}>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ backgroundImage: 'linear-gradient(135deg, color-mix(in srgb, var(--theme-color) 10%, transparent), transparent)' }}></div>
                    <p className="font-semibold text-sm tracking-widest uppercase mb-2" style={{ color: 'var(--theme-color)' }}>{item.meta}</p>
                    <h3 className="text-2xl font-bold mb-4 text-white">{item.title}</h3>
                    <span className="text-white leading-relaxed text-sm block">{item.detail}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
