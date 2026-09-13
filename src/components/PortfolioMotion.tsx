"use client";
import { useEffect } from "react";
import { useStaticMode } from "./useStaticMode";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);
export default function PortfolioMotion() {
  const pathname = usePathname();
  const isStatic = useStaticMode();
  useEffect(() => {
    document.documentElement.classList.toggle("static-mode", isStatic);
    if (isStatic)
      return () => document.documentElement.classList.remove("static-mode");
    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      syncTouch: false,
      anchors: { offset: -88 },
    });
    const tick = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    const ctx = gsap.context(() => {
      // Animate only position: even a throttled/occluded tab never hides content.
      if (!document.hidden) {
        gsap.from(".hero-line", {
          y: 42,
          duration: 1.1,
          stagger: 0.14,
          ease: "power3.out",
        });
        gsap.from(".hero-enter", {
          y: 20,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
        });
      }
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.from(el, {
          y: 56,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 96%", once: true },
        });
      });
      gsap.utils.toArray<HTMLElement>(".work-graphic").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 24, scale: 0.9, rotation: i % 2 ? 3 : -3 },
          {
            y: -18,
            scale: 1.04,
            rotation: 0,
            ease: "none",
            scrollTrigger: {
              trigger: el.closest(".work-card"),
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          },
        );
      });
      gsap.fromTo(
        ".reading-progress",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: 0.2 },
        },
      );
    });
    const refresh = () => ScrollTrigger.refresh();
    const sync = () => {
      if (document.hidden || document.querySelector("dialog[open]"))
        lenis.stop();
      else {
        lenis.start();
        ScrollTrigger.refresh();
      }
    };
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("portfolio-modal", sync);
    document.addEventListener("toggle", refresh, true);
    sync();
    return () => {
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("portfolio-modal", sync);
      document.removeEventListener("toggle", refresh, true);
      gsap.ticker.remove(tick);
      ctx.revert();
      lenis.destroy();
    };
  }, [pathname, isStatic]);
  return <div className="reading-progress" aria-hidden="true" />;
}
