import SectionHeading from "../components/SectionHeading";
import { profile } from "../data/portfolio";

export default function About() {
  return (
    <section id="about" className="content-section">
      <div className="section-inner two-column">
        <SectionHeading label="About" title="CSE student building modern digital experiences." />
        <div className="glass-card about-card reveal">
          <p>{profile.education}</p>
          <p>
            I focus on Web Development, Artificial Intelligence, Problem Solving, and
            Software Development. I enjoy turning ideas into clean interfaces, reliable
            software flows, and practical solutions that can help people in the real world.
          </p>
          <div className="about-tags">
            <span>NIT Delhi</span>
            <span>Computer Science Engineering</span>
            <span>Problem Solving</span>
          </div>
        </div>
      </div>
    </section>
  );
}
