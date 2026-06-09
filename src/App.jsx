import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "./components/Navbar";
import HomePage from "./sections/HomePage";
import TerminalBoot from "./components/terminalboot";
import PortfolioDog from "./components/PortfolioDog";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const appRef = useRef(null);
  const [booting, setBooting] = useState(true);
  const [showBoot, setShowBoot] = useState(true);

  useEffect(() => {
    if (booting) return;

    const root = appRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".topbar", { y: -92, opacity: 0, duration: 0.85 })
        .from(".hero-copy > *", { y: 30, opacity: 0, duration: 0.8, stagger: 0.13 }, "-=0.35")
        .fromTo(
          ".avatar-main",
          { y: "120vh", opacity: 0, scale: 0.94 },
          {
            keyframes: [
              { y: -22, opacity: 1, scale: 1.03, duration: 1.15, ease: "power3.out" },
              { y: 0, scale: 1, duration: 0.35, ease: "bounce.out" }
            ]
          },
          "-=0.12"
        )
        .from(".avatar-shadow", { opacity: 0, scaleX: 0.55, duration: 0.55 }, "-=0.35")
        .from(".orbit", { opacity: 0, scale: 0.92, duration: 0.7, stagger: 0.08 }, "-=0.2")
        .from(".orbit-icon", { opacity: 0, scale: 0, duration: 0.42, stagger: 0.08, ease: "back.out(1.9)" }, "-=0.18")
        .from(".bolt", { opacity: 0, scale: 0.9, duration: 0.55, stagger: 0.12 }, "-=0.15");

      gsap.to(".orbit-system", { rotate: 360, duration: 28, repeat: -1, ease: "none" });
      gsap.to(".orbit-icon", {
        y: -9,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.2
      });
      gsap.to(".figma-spin", { rotate: -360, duration: 12, repeat: -1, ease: "none" });
      gsap.to(".avatar-main", {
        y: -12,
        duration: 3.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2.1
      });
      gsap.to(".bolt", {
        y: -18,
        filter: "drop-shadow(0 0 40px rgba(255, 106, 33, 0.9)) brightness(1.32)",
        duration: 2.25,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.28
      });
      gsap.to(".doll-large", { x: 12, y: -10, duration: 3.4, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".particle", {
        x: "random(-36, 36)",
        y: "random(-42, 42)",
        opacity: "random(0.12, 0.36)",
        duration: "random(3.2, 5.8)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.15
      });

      gsap.utils.toArray(".reveal").forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: 56,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 86%" }
        });
      });

      gsap.utils.toArray(".orbit-icon").forEach((icon) => {
        icon.addEventListener("mouseenter", () => gsap.to(icon, { scale: 1.16, duration: 0.22, ease: "power2.out" }));
        icon.addEventListener("mouseleave", () => gsap.to(icon, { scale: 1, duration: 0.24, ease: "power2.out" }));
      });
    }, root);

    const hero = root.querySelector(".figma-hero");
    const handleMove = (event) => {
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      gsap.to(".avatar-main", { x: x * 26, duration: 0.55, ease: "power2.out" });
      gsap.to(".avatar-shadow", { x: x * 12, duration: 0.55, ease: "power2.out" });
      gsap.to(".orbit-system", { x: x * 16, y: y * 12, duration: 0.7, ease: "power2.out" });
      gsap.to(".bolt", { x: x * -10, duration: 0.75, ease: "power2.out" });
    };

    hero?.addEventListener("mousemove", handleMove);

    return () => {
      hero?.removeEventListener("mousemove", handleMove);
      ctx.revert();
    };
  }, [booting]);

  return (
    <>
      {showBoot && (
        <TerminalBoot
          onFadeStart={() => setBooting(false)}
          onComplete={() => setShowBoot(false)}
        />
      )}
      <div ref={appRef} className="app-shell" style={{ opacity: booting ? 0 : 1 }}>
        <Navbar />
        <HomePage />
        <PortfolioDog booting={booting} />
      </div>
    </>
  );
}
