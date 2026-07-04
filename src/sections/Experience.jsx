import SectionHeading from "../components/SectionHeading";
import { experience } from "../data/portfolio";
import astronaut from "../assets/figma/astronaut-space-suit-white-background-3d-illustration 1.png";
import image34 from "../assets/figma/image 34.png";
import image35 from "../assets/figma/image 35.png";

export default function Experience() {
  return (
    <section id="experience" className="content-section relative overflow-hidden">
      <div className="section-inner relative z-10">
        <SectionHeading label="Experience" title="A Focused Software Development Path." />
        
        <div className="experience-timeline relative mt-16 pl-8 md:pl-0">
          {/* Scroll Animated Timeline Line */}
          <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-[2px] bg-[rgba(255,255,255,0.1)] transform md:-translate-x-1/2 rounded-full hidden sm:block">
            <div className="timeline-line-progress absolute left-0 top-0 w-full bg-[#ff6a21] rounded-full" style={{ height: "0%" }}></div>
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
                  <div className={`absolute top-6 ${index % 2 === 0 ? 'left-[-40px] md:left-[-12px]' : 'left-[-40px] md:right-[-12px] md:left-auto'} w-6 h-6 rounded-full border-4 border-[#0a190f] bg-[#ff6a21] z-20 shadow-[0_0_15px_rgba(255,106,33,0.6)] hidden sm:block`}
                       style={index % 2 === 0 ? { transform: 'translateX(-50%)' } : { transform: 'translateX(50%)' }} />

                  {imgSrc && (
                    <img src={imgSrc} alt="Decorative" className={`${imgClass} ${floatClass} pointer-events-none`} style={{ filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.6))' }} />
                  )}

                  <div className="glass-card p-8 rounded-2xl hover:bg-[rgba(255,255,255,0.05)] transition-colors duration-300 relative overflow-hidden group z-10" style={{ background: "rgba(10, 25, 15, 0.45)", backdropFilter: "blur(12px)" }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#ff6a21]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <p className="text-[#ff6a21] font-semibold text-sm tracking-widest uppercase mb-2">{item.meta}</p>
                    <h3 className="text-2xl font-bold mb-4 text-white">{item.title}</h3>
                    <span className="text-gray-400 leading-relaxed text-sm block">{item.detail}</span>
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
