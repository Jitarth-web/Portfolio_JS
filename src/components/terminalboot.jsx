import { useEffect, useState } from "react";

const BOOT_LINES = [
  { text: "JITARTH BIOS v2.0.26", instant: true },
  { text: "Copyright (C) 2026 Jitarth Singh. All Rights Reserved.", instant: true },
  { text: "NIT Delhi Systems Division", instant: true },
  { text: "--------------------------------------------------", instant: true },
  { text: "Initializing CPU: Full Stack AI Web Developer...", delay: 400 },
  { text: "Checking memory bank... 16384MB OK", delay: 200 },
  { text: "Loading Core Modules: React, GSAP, CSS, Flask, Node...", delay: 500 },
  { text: "Establishing secure link to portfolio assets...", delay: 350 },
  { text: "Loading portfolio content...", delay: 300 },
  { text: "Welcome to my portfolio!", delay: 200 },
  { text: "Initializing responsive interface elements...", delay: 250 },
  { text: "Boot completed. Redirecting to workspace...", delay: 500 }
];

export default function TerminalBoot({ onFadeStart, onComplete }) {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    let active = true;
    let timer;

    const run = async () => {
      for (let i = 0; i < BOOT_LINES.length; i++) {
        if (!active) return;
        const line = BOOT_LINES[i];

        if (line.instant) {
          setDisplayedLines((prev) => [...prev, line.text]);
        } else {
          setCurrentLineIdx(i);
          let typed = "";
          for (let j = 0; j < line.text.length; j++) {
            if (!active) return;
            await new Promise((resolve) => {
              timer = setTimeout(resolve, 20);
            });
            typed += line.text[j];
            setCurrentText(typed);
          }
          setDisplayedLines((prev) => [...prev, line.text]);
          setCurrentText("");

          if (!active) return;
          await new Promise((resolve) => {
            timer = setTimeout(resolve, line.delay || 300);
          });
        }
      }

      if (!active) return;
      await new Promise((resolve) => {
        timer = setTimeout(resolve, 500);
      });

      setIsFading(true);
      if (active) onFadeStart();

      await new Promise((resolve) => {
        timer = setTimeout(resolve, 800);
      });
      if (active) onComplete();
    };

    run();

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [onFadeStart, onComplete]);

  return (
    <div className={`terminal-overlay ${isFading ? "fade-out" : ""}`}>
      <div className="terminal-content">
        {displayedLines.map((line, idx) => (
          <div key={idx} className="terminal-line">
            {line}
          </div>
        ))}
        {currentLineIdx < BOOT_LINES.length && !BOOT_LINES[currentLineIdx].instant && (
          <div className="terminal-line">
            {currentText}
            <span className="terminal-cursor" />
          </div>
        )}
      </div>
    </div>
  );
}