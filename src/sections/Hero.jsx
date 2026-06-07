import { useState, useEffect } from "react";
import avatarMain from "../assets/figma/avatar-main.png";
import avatarSmall from "../assets/figma/avatar-small.png";
import boltSmall from "../assets/figma/bolt-small.png";
import boltLarge from "../assets/figma/bolt-large.png";
import dollLarge from "../assets/figma/doll-large.png";
import OrbitSystem from "../components/OrbitSystem";
import { MailIcon } from "../components/Icons";
import { profile } from "../data/portfolio";

export default function Hero() {
  const titles = [
    "FULL STACK DEVELOPER",
    "AI ENGINEER",
    "MACHINE LEARNING ENTHUSIAST",
    "SOFTWARE DEVELOPER",
    "PROBLEM SOLVER",
    "OPEN SOURCE CONTRIBUTOR",
    "CSE STUDENT @ NIT DELHI"
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentText, setCurrentText] = useState(titles[0]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const fullWord = titles[currentIdx];

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
          <h1>
            {currentText}
            <span className="typewriter-cursor">|</span>
          </h1>
          <p className="desc">{profile.description}</p>
          <div className="hero-actions">
            <a className="hire-btn" href="#contact">Hire me</a>
            <a className="mail-btn" href={`mailto:${profile.email}`} aria-label="Contact by email">
              <MailIcon />
            </a>
          </div>
        </div>

        <div className="card-line" />
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
