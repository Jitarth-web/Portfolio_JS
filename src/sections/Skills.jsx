import SectionHeading from "../components/SectionHeading";
import { skills } from "../data/portfolio";
import image41 from "../assets/figma/image 41.png";

export default function Skills() {
  const getIcon = (group) => {
    switch (group) {
      case "Frontend": return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>;
      case "Backend": return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>;
      case "AI": return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
      case "Tools": return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>;
      default: return null;
    }
  };

  return (
    <section id="skills" className="content-section">
      <div className="section-inner relative z-10 flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-16">
        
        {/* Left Column: Heading and Image */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center relative reveal">
          <SectionHeading label="Skills" title="Crafting beautiful interfaces and powerful backends." />
          <div className="mt-12 flex justify-center lg:justify-start">
            <img src={image41} alt="Skills visualization" className="w-[80%] max-w-[350px] lg:max-w-[400px] h-auto object-contain float-anim-2" style={{ filter: 'drop-shadow(0px 20px 30px rgba(0,0,0,0.5))' }} />
          </div>
        </div>

        {/* Right Column: Skills Panel */}
        <div className="w-full lg:w-[50%] flex justify-end reveal">
          <div className="glass-card w-full p-8 lg:p-12 shadow-2xl" style={{
            background: "rgba(10, 25, 15, 0.45)",
            border: "1px solid rgba(255, 106, 33, 0.2)",
            borderRadius: "24px"
          }}>
            <div className="flex flex-col gap-10">
              {skills.map((group) => (
                <div key={group.group} className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                      {getIcon(group.group)}
                    </div>
                    <h3 className="text-2xl font-bold tracking-wide" style={{ textTransform: "uppercase" }}>
                      {group.group}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {group.items.map((item) => (
                      <span 
                        key={item} 
                        className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
                        style={{
                          background: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
          </div>
        </div>
        
      </div>
    </section>
  );
}
