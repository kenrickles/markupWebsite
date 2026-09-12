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
    if (isStatic) {
      document.documentElement.classList.add("static-mode");
      return;
    }
    document.documentElement.classList.remove("static-mode");
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        syncTouch: false,
        anchors: { offset: -88 },
      });
      const tick = (time: number) => lenis.raf(time * 1000);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.from(".hero-line", {
        y: 52,
        opacity: 0,
        duration: 1.1,
        stagger: 0.13,
        ease: "power3.out",
      });
      gsap.from(".hero-enter", {
        y: 18,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        delay: 0.2,
      });
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        // Keep deep-linked / already-visible content readable before the enhancement runs.
        gsap.from(el, {
          y: 28,
          duration: 0.85,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 94%", once: true },
        });
      });
      gsap.to(".orbit-group", {
        rotation: 180,
        transformOrigin: "50% 50%",
        duration: 55,
        repeat: -1,
        ease: "none",
      });
      gsap.to(".orbit-dot", {
        rotation: 360,
        svgOrigin: "250 250",
        duration: 24,
        repeat: -1,
        ease: "none",
      });
      const refresh = () => ScrollTrigger.refresh();
      document.addEventListener("toggle", refresh, true);
      // Safety net: if rAF is throttled (occluded tab) tweens freeze at their first frame.
      // After 4s snap all intro elements to their final state so content is never stuck hidden.
      const safety = setTimeout(() => {
        document.querySelectorAll<HTMLElement>(".hero-line, .hero-enter, .reveal").forEach((el) => {
          el.style.opacity = "1";
          el.style.transform = "none";
        });
        gsap.globalTimeline.getChildren(true, true, false).forEach((t) => {
          if (t.progress() < 1 && t.repeat() === -1) return; // leave infinite loops alone
          if (t.progress() < 1) t.progress(1);
        });
        ScrollTrigger.refresh();
      }, 4000);
      return () => {
        clearTimeout(safety);
        document.removeEventListener("toggle", refresh, true);
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    });
    return () => media.revert();
  }, [pathname, isStatic]);
  return null;
}
