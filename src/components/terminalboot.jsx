import { useEffect, useState, useRef } from "react";

const BOOT_LINES = [  { text: "JITARTH BIOS v2.0.26", instant: true },
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

  const hasRun = useRef(false);
  const cleanupTimeoutRef = useRef(null);

  // Keep references to current callbacks to prevent stale closures
  // and avoid re-running the effect when they change.
  const onFadeStartRef = useRef(onFadeStart);
  const onCompleteRef = useRef(onComplete);

  onFadeStartRef.current = onFadeStart;
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current);
      cleanupTimeoutRef.current = null;
    }

    if (hasRun.current) {
      return;
    }
    hasRun.current = true;

    let active = true;
    let timer;

    const run = async () => {
      for (let i = 0; i < BOOT_LINES.length; i++) {
        if (!active) return;
        const line = BOOT_LINES[i];

        if (line.instant) {
          setDisplayedLines((prev) => {
            if (prev.includes(line.text)) return prev;
            return [...prev, line.text];
          });
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
          setDisplayedLines((prev) => {
            if (prev.includes(line.text)) return prev;
            return [...prev, line.text];
          });
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
      if (active) onFadeStartRef.current();

      await new Promise((resolve) => {
        timer = setTimeout(resolve, 800);
      });
      if (active) onCompleteRef.current();
    };

    run();

    return () => {
      // Defer actual cleanup to handle React Strict Mode's synchronous remounting
      cleanupTimeoutRef.current = setTimeout(() => {
        active = false;
        clearTimeout(timer);
      }, 0);
    };
  }, []);

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