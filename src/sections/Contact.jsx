import { useState, useEffect, useRef } from "react";
import SectionHeading from "../components/SectionHeading";
import { profile } from "../data/portfolio";
import ringImg from "../assets/figma/image 163.png";
import womanImg from "../assets/figma/3d-rendering-cartoon-like-woman-working-computer 2.png";

export default function Contact() {
  const [status, setStatus] = useState("idle");
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const turnstileRef = useRef(null);
  const widgetIdRef = useRef(null);

  // Check rate limit cooldown on mount
  useEffect(() => {
    const lastSubmit = localStorage.getItem("last_contact_submission");
    if (lastSubmit) {
      const elapsed = (Date.now() - parseInt(lastSubmit, 10)) / 1000;
      if (elapsed < 60) {
        setCooldown(Math.ceil(60 - elapsed));
      }
    }
  }, []);

  // Cooldown timer countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => {
      setCooldown((c) => c - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Load and render Cloudflare Turnstile widget dynamically
  useEffect(() => {
    const scriptId = "cloudflare-turnstile-script";
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    const renderWidget = () => {
      if (window.turnstile && turnstileRef.current && !widgetIdRef.current) {
        try {
          widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
            sitekey: import.meta.env.VITE_TURNSTILE_SITEKEY || "1x00000000000000000000AA",
            theme: "dark",
            callback: (token) => {
              setTurnstileToken(token);
              setValidationError("");
            },
            "expired-callback": () => {
              setTurnstileToken(null);
            },
            "error-callback": () => {
              setTurnstileToken(null);
            },
          });
        } catch (e) {
          console.error("Error rendering Turnstile:", e);
        }
      }
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      script.addEventListener("load", renderWidget);
    }

    return () => {
      if (window.turnstile && widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        } catch (e) {
          console.error("Error removing Turnstile:", e);
        }
      }
      if (script) {
        script.removeEventListener("load", renderWidget);
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    // 1. Rate Limit check
    if (cooldown > 0) {
      setValidationError(`Please wait ${cooldown}s before submitting another message.`);
      return;
    }

    const form = e.target;
    const formData = new FormData(form);
    const email = formData.get("email");

    // 2. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError("Please enter a valid email address.");
      return;
    }

    // 3. Turnstile check
    if (!turnstileToken) {
      setValidationError("Please complete the Turnstile bot verification.");
      return;
    }

    setStatus("submitting");

    // Append Turnstile response to form data
    formData.append("cf-turnstile-response", turnstileToken);

    try {
      const response = await fetch("https://formsubmit.co/ajax/jitarthgpt@gmail.com", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setStatus("success");
        // Start cooldown
        localStorage.setItem("last_contact_submission", Date.now().toString());
        setCooldown(60);
        setTurnstileToken(null);
        if (window.turnstile && widgetIdRef.current) {
          window.turnstile.reset(widgetIdRef.current);
        }
        form.reset();
      } else {
        setStatus("error");
        if (window.turnstile && widgetIdRef.current) {
          window.turnstile.reset(widgetIdRef.current);
        }
        setTurnstileToken(null);
      }
    } catch (error) {
      setStatus("error");
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current);
      }
      setTurnstileToken(null);
    }
  };

  return (
    <section id="contact" className="content-section contact-section relative overflow-hidden">
      
      {/* Background / Side elements */}
      <img src={ringImg} alt="Ring Element" className="absolute left-[-15%] top-[5%] w-[350px] md:w-[600px] opacity-40 pointer-events-none spin-anim z-0" />
      <img src={womanImg} alt="Woman working" className="hidden md:block absolute right-[-3.6%] bottom-[5vh] w-[250px] md:w-[450px] opacity-90 pointer-events-none float-anim-1 z-0" style={{ filter: 'drop-shadow(0px 20px 30px rgba(0,0,0,0.5))' }} />

      <div className="section-inner two-column relative z-10">
        <div>
          <SectionHeading label="Contact" title="Let us Connect and {Build something} useful." />
          <div className="contact-links reveal">
            <a href={profile.github}>GitHub</a>
            <a href={profile.linkedin}>LinkedIn</a>
            <a href={`mailto:${profile.email}`}>Email</a>
            <a href={profile.resume} download>Resume Download</a>
          </div>
        </div>
        
        <div>
          {status === "success" ? (
            <div className="glass-card contact-form reveal" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '3rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--theme-color)' }}>Thank You!</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Thank you for showing your interest. I will reach you shortly.</p>
              <button type="button" style={{ marginTop: '2rem' }} onClick={() => setStatus("idle")}>Send Another Message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-card contact-form reveal">
              <input type="hidden" name="_captcha" value="false" />
              <input type="text" name="name" placeholder="Name" aria-label="Name" />
              <input type="email" name="email" placeholder="Email" aria-label="Email" required />
              <textarea name="message" placeholder="Message" aria-label="Message" required />
              
              {/* Cloudflare Turnstile widget container */}
              <div 
                ref={turnstileRef} 
                style={{ 
                  margin: "6px 0", 
                  minHeight: "65px", 
                  display: "flex", 
                  justifyContent: "flex-start" 
                }}
              />

              {validationError && (
                <p style={{ color: "#ff4444", fontSize: "0.9rem", marginTop: "0.2rem", textAlign: "left" }}>
                  {validationError}
                </p>
              )}

              <button 
                type="submit" 
                disabled={status === "submitting" || cooldown > 0}
                style={{
                  opacity: (status === "submitting" || cooldown > 0) ? 0.6 : 1,
                  cursor: (status === "submitting" || cooldown > 0) ? "not-allowed" : "pointer"
                }}
              >
                {status === "submitting" 
                  ? "Sending..." 
                  : cooldown > 0 
                    ? `Wait ${cooldown}s` 
                    : "Send Message"}
              </button>
              {status === "error" && <p style={{ color: '#ff4444', marginTop: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>Oops! Something went wrong. Please try again.</p>}
            </form>
          )}
          
          {/* Mobile-only inline woman image, shown below the card */}
          <img src={womanImg} alt="Woman working" className="md:hidden w-56 mx-auto mt-8 opacity-90 pointer-events-none float-anim-1 block" style={{ filter: 'drop-shadow(0px 20px 30px rgba(0,0,0,0.5))' }} />
        </div>
      </div>
    </section>
  );
}
