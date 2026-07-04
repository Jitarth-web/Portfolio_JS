import { useState } from "react";
import SectionHeading from "../components/SectionHeading";
import { profile } from "../data/portfolio";
import ringImg from "../assets/figma/image 163.png";
import womanImg from "../assets/figma/3d-rendering-cartoon-like-woman-working-computer 2.png";

export default function Contact() {
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    const form = e.target;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://formsubmit.co/ajax/jitarthgpt@gmail.com", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="content-section contact-section relative overflow-hidden">
      
      {/* Background / Side elements */}
      <img src={ringImg} alt="Ring Element" className="absolute left-[-15%] top-[5%] w-[350px] md:w-[600px] opacity-40 pointer-events-none spin-anim z-0" />
      <img src={womanImg} alt="Woman working" className="absolute right-[-2%] bottom-[0%] w-64 md:w-[450px] opacity-90 pointer-events-none float-anim-1 z-0" style={{ filter: 'drop-shadow(0px 20px 30px rgba(0,0,0,0.5))' }} />

      <div className="section-inner two-column relative z-10">
        <div>
          <SectionHeading label="Contact" title="Let us Connect and Build something useful." />
          <div className="contact-links reveal">
            <a href={profile.github}>GitHub</a>
            <a href={profile.linkedin}>LinkedIn</a>
            <a href={`mailto:${profile.email}`}>Email</a>
            <a href={profile.resume} download>Resume Download</a>
          </div>
        </div>
        
        {status === "success" ? (
          <div className="glass-card contact-form reveal" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '3rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#ff6a21' }}>Thank You!</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Thank you for showing your interest. I will reach you shortly.</p>
            <button type="button" style={{ marginTop: '2rem' }} onClick={() => setStatus("idle")}>Send Another Message</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-card contact-form reveal">
            <input type="hidden" name="_captcha" value="false" />
            <input type="text" name="name" placeholder="Name" aria-label="Name" />
            <input type="email" name="email" placeholder="Email" aria-label="Email" required />
            <textarea name="message" placeholder="Message" aria-label="Message" required />
            <button type="submit" disabled={status === "submitting"}>
              {status === "submitting" ? "Sending..." : "Send Message"}
            </button>
            {status === "error" && <p style={{ color: '#ff4444', marginTop: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>Oops! Something went wrong. Please try again.</p>}
          </form>
        )}
      </div>
    </section>
  );
}
