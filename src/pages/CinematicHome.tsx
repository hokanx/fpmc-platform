/* FPMC cinematic storefront (Track 2 masterpiece) — standalone one-pager with
 * its own chrome. Lenis + GSAP ScrollTrigger scroll choreography; every
 * section carries its own experience. prefers-reduced-motion → static. */
import { useEffect } from "react";

import { useI18n } from "../i18n";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { BeamRule, Cursor, Marquee } from "../cinematic/motion";
import { ScrubHero } from "../cinematic/scrub-hero";
import {
  Connect,
  Footer,
  Header,
  Manifesto,
  Numbers,
  Portfolio,
  ReleaseTeaser,
  Services,
  WorkSection,
} from "../cinematic/sections";
import "../cinematic/cinematic.css";

export function CinematicHome() {
  const { locale } = useI18n();
  useDocumentTitle("");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    void (async () => {
      const [{ default: Lenis }, gsapMod, stMod] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      const gsap = gsapMod.gsap ?? gsapMod.default;
      const ScrollTrigger = stMod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({ autoRaf: false, lerp: 0.09 });
      lenis.on("scroll", ScrollTrigger.update);
      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-manifesto-line]").forEach((line, i) => {
          gsap.fromTo(
            line,
            { yPercent: 34, xPercent: i % 2 ? 4 : -4, opacity: 0.15 },
            {
              yPercent: 0,
              xPercent: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: { trigger: line, start: "top 94%", end: "top 42%", scrub: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-split-title]").forEach((title) => {
          const words = title.querySelectorAll<HTMLElement>("[data-split-word]");
          if (!words.length) return;
          const variant = title.dataset.splitTitle || "rise";
          const st = { trigger: title, start: "top 95%", end: "top 55%", scrub: true } as const;
          if (variant === "slide") {
            words.forEach((w, i) => {
              gsap.fromTo(
                w,
                { xPercent: i % 2 ? 60 : -60, opacity: 0.22 },
                { xPercent: 0, opacity: 1, ease: "none", scrollTrigger: { ...st } },
              );
            });
          } else if (variant === "flip") {
            gsap.set(title, { perspective: 600 });
            gsap.fromTo(
              words,
              { rotateX: -68, yPercent: 34, opacity: 0.22, transformOrigin: "50% 0%" },
              { rotateX: 0, yPercent: 0, opacity: 1, ease: "none", stagger: 0.09, scrollTrigger: st },
            );
          } else if (variant === "spread") {
            gsap.fromTo(
              words,
              { scale: 1.28, yPercent: 22, opacity: 0.2 },
              { scale: 1, yPercent: 0, opacity: 1, ease: "none", stagger: 0.07, scrollTrigger: st },
            );
          } else {
            gsap.fromTo(
              words,
              { yPercent: 62, opacity: 0.22 },
              { yPercent: 0, opacity: 1, ease: "none", stagger: 0.08, scrollTrigger: st },
            );
          }
        });

        gsap.utils.toArray<HTMLElement>("[data-eyebrow]").forEach((eb) => {
          gsap.fromTo(
            eb,
            { x: -28, opacity: 0.3 },
            {
              x: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: { trigger: eb, start: "top 96%", end: "top 70%", scrub: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-beam-sweep]").forEach((beam) => {
          gsap.fromTo(
            beam,
            { xPercent: -110 },
            {
              xPercent: 480,
              ease: "none",
              scrollTrigger: {
                trigger: beam.parentElement,
                start: "top 105%",
                end: "top 25%",
                scrub: true,
              },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const amount = parseFloat(el.dataset.parallax || "8");
          gsap.fromTo(
            el,
            { yPercent: amount },
            {
              yPercent: -amount,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-work-row]").forEach((row, i) => {
          gsap.fromTo(
            row,
            { x: i % 2 ? 36 : -36, opacity: 0.35 },
            {
              x: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: { trigger: row, start: "top 96%", end: "top 68%", scrub: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-folio-card]").forEach((card, i) => {
          gsap.fromTo(
            card,
            { y: 70 + i * 26, rotate: i % 2 ? 0.8 : -0.8, opacity: 0.4 },
            {
              y: 0,
              rotate: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: { trigger: card, start: "top 102%", end: "top 55%", scrub: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-service-card]").forEach((card, i) => {
          gsap.fromTo(
            card,
            { y: 46 + (i % 4) * 14, scale: 0.965, opacity: 0.45 },
            {
              y: 0,
              scale: 1,
              opacity: 1,
              ease: "none",
              scrollTrigger: { trigger: card, start: "top 100%", end: "top 62%", scrub: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-number-cell]").forEach((cell, i) => {
          gsap.fromTo(
            cell,
            { y: 40 + i * 12, opacity: 0.35 },
            {
              y: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: { trigger: cell, start: "top 98%", end: "top 66%", scrub: true },
            },
          );
        });

        const footerLogo = document.querySelector<HTMLElement>("[data-footer-logo]");
        if (footerLogo) {
          gsap.fromTo(
            footerLogo,
            { yPercent: 24, scale: 0.96 },
            {
              yPercent: 0,
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: footerLogo, start: "top 105%", end: "top 55%", scrub: true },
            },
          );
        }
      });

      const onAnchorClick = (e: MouseEvent) => {
        const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
        if (!a) return;
        const target = document.querySelector(a.getAttribute("href") || "");
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target as HTMLElement, { offset: -20, duration: 1.6 });
      };
      document.addEventListener("click", onAnchorClick);

      cleanup = () => {
        document.removeEventListener("click", onAnchorClick);
        ctx.revert();
        gsap.ticker.remove(raf);
        lenis.destroy();
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [locale]);

  return (
    <div className="fpmc">
      <Header />
      <main>
        <ScrubHero />
        <Manifesto />
        <BeamRule />
        <ReleaseTeaser />
        <BeamRule />
        <WorkSection />
        <BeamRule />
        <Portfolio />
        <BeamRule />
        <Services />
        <BeamRule />
        <Numbers />
        <BeamRule />
        <Connect />
      </main>
      <Marquee />
      <Footer />
      <Cursor />
      <div className="fpmc-vignette" aria-hidden />
      <div className="fpmc-grain" aria-hidden />
    </div>
  );
}
