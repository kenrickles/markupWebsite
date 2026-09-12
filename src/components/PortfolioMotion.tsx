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
      return () => {
        document.removeEventListener("toggle", refresh, true);
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    });
    return () => media.revert();
  }, [pathname, isStatic]);
  return null;
}
