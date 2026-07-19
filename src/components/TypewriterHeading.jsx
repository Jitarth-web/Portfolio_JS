import { useState, useEffect, useRef } from "react";

export default function TypewriterHeading({ text, typingSpeed = 80, infinite = false }) {
  const [typedLength, setTypedLength] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const containerRef = useRef(null);

  // Parse the segments from the text (e.g. "Let us {Connect}")
  const segments = [];
  const regex = /\{([^{}]+)\}/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        text: text.substring(lastIndex, match.index),
        highlight: false,
      });
    }
    segments.push({
      text: match[1],
      highlight: true,
    });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({
      text: text.substring(lastIndex),
      highlight: false,
    });
  }

  if (segments.length === 0) {
    segments.push({ text, highlight: false });
  }

  const cleanText = segments.map((s) => s.text).join("");

  // Reset state if text changes
  useEffect(() => {
    setTypedLength(0);
    setIsDeleting(false);
  }, [text]);

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
    const cleanTextLength = cleanText.length;

    if (!infinite) {
      if (typedLength < cleanTextLength) {
        timer = setTimeout(() => {
          setTypedLength((prev) => prev + 1);
        }, typingSpeed);
      }
    } else {
      if (!isDeleting) {
        if (typedLength < cleanTextLength) {
          timer = setTimeout(() => {
            setTypedLength((prev) => prev + 1);
          }, typingSpeed);
        } else {
          timer = setTimeout(() => {
            setIsDeleting(true);
          }, 2000); // Wait 2 seconds at the end
        }
      } else {
        if (typedLength > 0) {
          timer = setTimeout(() => {
            setTypedLength((prev) => prev - 1);
          }, typingSpeed / 2); // Backspace twice as fast
        } else {
          timer = setTimeout(() => {
            setIsDeleting(false);
          }, 500); // Wait 0.5 seconds at the beginning
        }
      }
    }

    return () => clearTimeout(timer);
  }, [typedLength, hasStarted, cleanText, typingSpeed, infinite, isDeleting]);

  // Construct the visible typed elements
  const renderTypedContent = () => {
    const elements = [];
    let currentLength = 0;
    let cursorRendered = false;

    // Special case: cursor at the very beginning
    if (typedLength === 0) {
      elements.push(<span key="cursor-start" className="typewriter-cursor">|</span>);
      cursorRendered = true;
    }

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      const start = currentLength;
      const end = currentLength + seg.text.length;

      if (typedLength >= end) {
        // Entirely typed
        elements.push(
          <span
            key={i}
            style={seg.highlight ? { color: "var(--theme-color)" } : {}}
          >
            {seg.text}
          </span>
        );
        // If cursor is exactly at the end of this segment
        if (typedLength === end && !cursorRendered) {
          elements.push(<span key={`cursor-${i}`} className="typewriter-cursor">|</span>);
          cursorRendered = true;
        }
      } else if (typedLength <= start) {
        // Entirely untyped (hidden to reserve layout space)
        elements.push(
          <span
            key={i}
            style={{
              ...(seg.highlight ? { color: "var(--theme-color)" } : {}),
              visibility: "hidden",
            }}
          >
            {seg.text}
          </span>
        );
      } else {
        // Partially typed
        const typedPart = seg.text.substring(0, typedLength - start);
        const untypedPart = seg.text.substring(typedLength - start);
        elements.push(
          <span
            key={i}
            style={seg.highlight ? { color: "var(--theme-color)" } : {}}
          >
            <span>{typedPart}</span>
            <span className="typewriter-cursor" style={{ visibility: "visible" }}>|</span>
            <span style={{ visibility: "hidden" }}>{untypedPart}</span>
          </span>
        );
        cursorRendered = true;
      }

      currentLength = end;
    }

    // fallback cursor if not rendered
    if (!cursorRendered) {
      elements.push(<span key="cursor-end" className="typewriter-cursor">|</span>);
    }

    return elements;
  };

  return (
    <span ref={containerRef} style={{ display: "inline-block" }}>
      {renderTypedContent()}
    </span>
  );
}

