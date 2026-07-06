import { useEffect, useState, useRef } from "react";

export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  const activeRef = useRef(active);

  // Keep activeRef in sync with state
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const idsKey = ids.join(",");

  useEffect(() => {
    const handleScroll = () => {
      // Check if we are at the bottom of the page
      const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
      if (isBottom) {
        const lastId = ids[ids.length - 1];
        if (activeRef.current !== lastId) {
          setActive(lastId);
        }
        return;
      }

      const centerY = window.innerHeight / 3;
      let currentSection = activeRef.current;

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        if (rect.top <= centerY && rect.bottom >= centerY) {
          currentSection = id;
          break;
        }
      }

      if (currentSection !== activeRef.current) {
        setActive(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once initially to set the correct active section
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [idsKey]);

  return active;
}
