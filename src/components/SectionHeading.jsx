import { useState, useEffect, useRef } from "react";
import TypewriterHeading from "./TypewriterHeading";

const headingMap = {
  "About": { outline: "ABOUT", solid: "ME" },
  "Skills": { outline: "SKILLS", solid: "TECH" },
  "Projects": { outline: "PROJECTS", solid: "SHOWCASE" },
  "Experience": { outline: "EXPERIENCE", solid: "JOURNEY" },
  "Credentials": { outline: "CERTIFICATIONS", solid: "CREDENTIALS" },
  "Contact": { outline: "CONTACT", solid: "ME" }
};

export default function SectionHeading({ label, title }) {
  const mapped = headingMap[label] || { outline: label?.toUpperCase() || "", solid: "" };

  const len = mapped.outline.length;
  let sizeClass = "";
  if (len > 12) {
    sizeClass = "heading-xl";
  } else if (len > 8) {
    sizeClass = "heading-lg";
  }

  // Typewriter state
  const [typedLength, setTypedLength] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isDeletingHeading, setIsDeletingHeading] = useState(false);
  const containerRef = useRef(null);

  const outlineText = mapped.outline;
  const solidText = mapped.solid;
  const hasSolid = !!solidText;
  const totalLength = outlineText.length + (hasSolid ? 1 + solidText.length : 0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Reset state when outlineText or solidText changes
  useEffect(() => {
    setTypedLength(0);
    setIsDeletingHeading(false);
  }, [outlineText, solidText]);

  useEffect(() => {
    if (!hasStarted) return;

    let timer;
    if (!isDeletingHeading) {
      if (typedLength < totalLength) {
        timer = setTimeout(() => {
          setTypedLength((prev) => prev + 1);
        }, 25); // increased speed of heading typing
      } else {
        // Hold for 2.5 seconds at the end
        timer = setTimeout(() => {
          setIsDeletingHeading(true);
        }, 2500);
      }
    } else {
      if (typedLength > 0) {
        timer = setTimeout(() => {
          setTypedLength((prev) => prev - 1);
        }, 12); // backspace twice as fast
      } else {
        // Hold for 0.5 seconds at the beginning
        timer = setTimeout(() => {
          setIsDeletingHeading(false);
        }, 500);
      }
    }

    return () => clearTimeout(timer);
  }, [typedLength, hasStarted, totalLength, isDeletingHeading]);

  // Compute currently typed outline and solid texts
  const currentOutline = outlineText.substring(0, Math.min(typedLength, outlineText.length));
  const currentSolid = hasSolid 
    ? solidText.substring(0, Math.max(0, typedLength - outlineText.length - 1))
    : "";

  const isOutlineTyping = typedLength <= outlineText.length;
  const isSolidTyping = hasSolid && typedLength > outlineText.length && typedLength <= totalLength;

  return (
    <div ref={containerRef} className="premium-heading-container">
      <div className="premium-heading">
        <span className={`heading-outline ${sizeClass}`} data-text={currentOutline || "\u00A0"}>
          {currentOutline || "\u00A0"}
          {(isOutlineTyping || (!hasSolid && typedLength === totalLength)) && <span className="typewriter-cursor">|</span>}
        </span>
        {hasSolid && (currentSolid || !isOutlineTyping) && (
          <span className={`heading-solid ${sizeClass}`}>
            {currentSolid || "\u00A0"}
            {isSolidTyping && <span className="typewriter-cursor">|</span>}
          </span>
        )}
      </div>
      <h3 className="premium-subheading">
        <TypewriterHeading text={title} infinite={true} typingSpeed={40} />
      </h3>
    </div>
  );
}

