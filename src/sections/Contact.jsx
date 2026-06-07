import SectionHeading from "../components/SectionHeading";
import { profile } from "../data/portfolio";

export default function Contact() {
  return (
    <section id="contact" className="content-section contact-section">
      <div className="section-inner two-column">
        <div>
          <SectionHeading label="Contact" title="Let us connect and build something useful." />
          <div className="contact-links reveal">
            <a href={profile.github}>GitHub</a>
            <a href={profile.linkedin}>LinkedIn</a>
            <a href={`mailto:${profile.email}`}>Email</a>
            <a href={profile.resume} download>Resume Download</a>
          </div>
        </div>
        <form className="glass-card contact-form reveal">
          <input type="text" placeholder="Name" aria-label="Name" />
          <input type="email" placeholder="Email" aria-label="Email" />
          <textarea placeholder="Message" aria-label="Message" />
          <button type="submit">Send Message</button>
        </form>
      </div>
    </section>
  );
}
