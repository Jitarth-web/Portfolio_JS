import { useState, useEffect } from "react";
import avatarMain from "../assets/figma/avatar-main.png";
import avatarSmall from "../assets/figma/avatar-small.png";
import boltSmall from "../assets/figma/bolt-small.png";
import boltLarge from "../assets/figma/bolt-large.png";
import dollLarge from "../assets/figma/doll-large.png";
import OrbitSystem from "../components/OrbitSystem";
import { MailIcon } from "../components/Icons";
import { profile } from "../data/portfolio";
import TypewriterHeading from "../components/TypewriterHeading";

export default function Hero() {
  const titles = [
    "FULL STACK {DEVELOPER}",
    "AI {ENGINEER}",
    "MACHINE LEARNING {ENTHUSIAST}",
    "SOFTWARE {DEVELOPER}",
    "PROBLEM {SOLVER}",
    "OPEN SOURCE {CONTRIBUTOR}",
    "CSE STUDENT @ {NIT DELHI}"
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentText, setCurrentText] = useState("FULL STACK DEVELOPER");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const fullWord = titles[currentIdx].replace(/[{}]/g, "");

    if (!isDeleting) {
      if (currentText !== fullWord) {
        timer = setTimeout(() => {
          setCurrentText(fullWord.substring(0, currentText.length + 1));
        }, 80); // Typing speed
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2000); // Hold time
      }
    } else {
      if (currentText !== "") {
        timer = setTimeout(() => {
          setCurrentText(fullWord.substring(0, currentText.length - 1));
        }, 40); // Deleting speed
      } else {
        setIsDeleting(false);
        setCurrentIdx((prev) => (prev + 1) % titles.length);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentIdx]);

  const parseSegments = (str) => {
    const regex = /\{([^{}]+)\}/g;
    const segments = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(str)) !== null) {
      if (match.index > lastIndex) {
        segments.push({
          text: str.substring(lastIndex, match.index),
          highlight: false,
        });
      }
      segments.push({
        text: match[1],
        highlight: true,
      });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < str.length) {
      segments.push({
        text: str.substring(lastIndex),
        highlight: false,
      });
    }

    if (segments.length === 0) {
      segments.push({ text: str, highlight: false });
    }

    return segments;
  };

  const renderTypedTitle = () => {
    const fullWordWithMarkup = titles[currentIdx];
    const segments = parseSegments(fullWordWithMarkup);
    let remaining = currentText.length;

    let outlineText = "";
    let solidText = "";

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      if (remaining <= 0) break;

      const chunk = seg.text.substring(0, remaining);
      remaining -= seg.text.length;

      if (seg.highlight) {
        solidText += chunk;
      } else {
        outlineText += chunk;
      }
    }

    return { outlineText, solidText };
  };

  const typed = renderTypedTitle();

  const fullOutlineWord = titles[currentIdx].split("{")[0].trim().replace(/[{}]/g, "");
  const outlineLen = fullOutlineWord.length;
  let heroSizeClass = "";
  if (outlineLen > 12) {
    heroSizeClass = "hero-xl";
  } else if (outlineLen > 8) {
    heroSizeClass = "hero-lg";
  }

  return (
    <section id="home" className="figma-hero section-panel">
      <span className="particle p1" />
      <span className="particle p2" />
      <span className="particle p3" />
      <span className="particle p4" />
      <span className="particle p5" />

      <div className="hero-content-wrapper">
        <div className="hero-copy">
          <p className="eyebrow">Hey, I am <span className="hero-name">{profile.name}</span></p>
          <h1 className={`hero-premium-title ${heroSizeClass}`}>
            <span className={`hero-outline ${heroSizeClass}`} data-text={typed.outlineText || "\u00A0"}>
              {typed.outlineText || "\u00A0"}
            </span>
            <span className={`hero-solid ${heroSizeClass}`}>
              {typed.solidText || "\u00A0"}
              <span className="typewriter-cursor">|</span>
            </span>
          </h1>
          <h3 className="premium-subheading hero-desc-subheading">
            <TypewriterHeading text="CSE student at {National Institute of Technology Delhi} passionate about {Web Development}, {Software Engineering}, {Artificial Intelligence}, and {Problem Solving}. I enjoy building {modern digital experiences} and solving {real-world problems} through technology." typingSpeed={15} />
          </h3>
          <div className="hero-actions">
            <a className="hire-btn" href="#contact">Hire me</a>
            <a className="mail-btn" href={`mailto:${profile.email}`} aria-label="Contact by email">
              <MailIcon />
            </a>
          </div>
        </div>
        <aside className="testimonial-card">
          <p className="card-title">Education</p>
          <div className="testimonial-person">
            <img src={avatarSmall} alt="" />
            <div>
              <p>B.Tech CSE</p>
              <span>National Institute of Technology Delhi</span>
            </div>
          </div>
        </aside>
      </div>

      <div className="hero-visual-wrapper">
        <img className="doll doll-large" src={dollLarge} alt="" />
        <img className="bolt bolt-left" src={boltSmall} alt="" />
        <img className="bolt bolt-right" src={boltSmall} alt="" />
        <OrbitSystem />
        <div className="avatar-shadow" />
        <img className="avatar-main" src={avatarMain} alt="Jitarth Singh avatar" />
      </div>
    </section>
  );
}
