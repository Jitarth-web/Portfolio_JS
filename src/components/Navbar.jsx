import { useState } from "react";
import { DownloadIcon } from "./Icons";
import { navItems, profile } from "../data/portfolio";
import { useActiveSection } from "../hooks/useActiveSection";
import { GithubIcon, LinkedinIcon, MailIcon } from "./Icons";
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const ids = navItems.map((item) => item.toLowerCase());
  const active = useActiveSection(ids);

  const goTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <header className="topbar">
      <button className="brand" onClick={() => goTo("home")} aria-label="Go to home">
        Jitarth.
      </button>

      <nav className={`nav-pill ${open ? "open" : ""}`} aria-label="Primary navigation">
        {navItems.map((item) => {
          const id = item.toLowerCase();
          return (
            <button
              key={item}
              className={active === id ? "active" : ""}
              onClick={() => goTo(id)}
            >
              {item}
            </button>
          );
        })}
        <div className="mobile-socials">
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <LinkedinIcon />
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <GithubIcon />
          </a>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=jitarthsingh@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Email"
          >
            <MailIcon />
          </a>
        </div>
      </nav>

     <div className="top-actions">
  <a className="resume-btn" href={profile.resume} download>
    <span className="resume-icon">
      <DownloadIcon />
    </span>
    <span>Download Resume</span>
  </a>

  <a
    className="social-btn"
    href={profile.linkedin}
    target="_blank"
    rel="noopener noreferrer"
  >
    <LinkedinIcon />
  </a>

  <a
    className="social-btn"
    href={profile.github}
    target="_blank"
    rel="noopener noreferrer"
  >
    <GithubIcon />
  </a>

  <a
  className="social-btn"
  href="https://mail.google.com/mail/?view=cm&fs=1&to=jitarthsingh@gmail.com"
  target="_blank"
  rel="noopener noreferrer"
>
  <MailIcon />
</a>
</div>

      <button
        className={`menu-btn ${open ? "active" : ""}`}
        onClick={() => setOpen((value) => !value)}
        aria-label="Toggle navigation"
      >
        <span />
        <span />
      </button>
    </header>
  );
}
