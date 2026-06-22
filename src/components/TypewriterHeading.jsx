import { useState, useEffect, useRef } from "react";

export default function TypewriterHeading({ text, typingSpeed = 80 }) {
  const [currentText, setCurrentText] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const containerRef = useRef(null);

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

  useEffect(() => {
    if (!hasStarted) return;

    let timer;
    if (currentText !== text) {
      timer = setTimeout(() => {
        setCurrentText(text.substring(0, currentText.length + 1));
      }, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [currentText, hasStarted, text, typingSpeed]);

  return (
    <span ref={containerRef} style={{ display: "inline-block" }}>
      {currentText}
      <span className="typewriter-cursor">|</span>
    </span>
  );
}
