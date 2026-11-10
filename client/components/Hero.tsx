import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";

interface HeroProps {
  language: "en" | "es";
}

export default function Hero({ language }: HeroProps) {
  const content = {
    en: {
      eyebrow: "Creative Innovation Studio",
      brand: "Maurique Labs",
      h1: "Bring people together. Turn ideas into something real.",
      ctaPrimary: "Let's create an experience",
      ctaSecondary: "See our projects",
    },
    es: {
      eyebrow: "Estudio de innovación creativa",
      brand: "Maurique Labs",
      h1: "Reúne a las personas. Convierte las ideas en algo real.",
      ctaPrimary: "Creemos una experiencia",
      ctaSecondary: "Ver nuestros proyectos",
    },
  };

  const copy = content[language];

  const sectionRef = useRef<HTMLElement>(null);
  const washRef = useRef<HTMLDivElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const section = sectionRef.current;
    if (!section) return;

    let rafId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      targetX = (e.clientX - rect.left - rect.width / 2) / rect.width;
      targetY = (e.clientY - rect.top - rect.height / 2) / rect.height;
    };

    const onMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;

      if (washRef.current) {
        washRef.current.style.transform = `translate(${currentX * 18}px, ${currentY * 12}px)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    section.addEventListener("mousemove", onMouseMove);
    section.addEventListener("mouseleave", onMouseLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      section.removeEventListener("mousemove", onMouseMove);
      section.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, [reduceMotion]);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="section bg-brand-black text-foreground min-h-[calc(100svh-4rem)] flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Outer: ambient breath. Inner: mouse parallax (separate transforms). */}
      <div
        aria-hidden="true"
        className={`absolute inset-[-12%] pointer-events-none ${
          reduceMotion ? "" : "animate-stage-breathe"
        }`}
      >
        <div
          ref={washRef}
          className="absolute inset-0 will-change-transform"
          style={{
            background: `
              radial-gradient(ellipse 55% 45% at 18% 78%, rgba(43, 201, 163, 0.28) 0%, transparent 70%),
              radial-gradient(ellipse 50% 40% at 88% 18%, rgba(255, 87, 20, 0.2) 0%, transparent 65%),
              radial-gradient(ellipse 65% 55% at 50% 40%, rgba(43, 201, 163, 0.08) 0%, transparent 55%),
              radial-gradient(ellipse 70% 50% at 50% 100%, rgba(13, 38, 38, 0.9) 0%, transparent 60%)
            `,
          }}
        />
      </div>

      <div className="section-container relative z-10 text-center">
        <img
          src="/logo-mark.png"
          alt=""
          width={96}
          height={93}
          className={`mx-auto mb-5 sm:mb-8 h-16 w-auto sm:h-24 ${
            reduceMotion ? "" : "animate-slide-up"
          }`}
          aria-hidden="true"
        />

        <p
          className={`mb-3 sm:mb-4 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-foreground/50 ${
            reduceMotion ? "" : "animate-slide-up opacity-0"
          }`}
          style={
            reduceMotion
              ? undefined
              : { animationDelay: "0.04s", animationFillMode: "forwards" }
          }
        >
          {copy.eyebrow}
        </p>

        <p
          className={`font-heading text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-4 sm:mb-6 ${
            reduceMotion ? "" : "animate-slide-up opacity-0"
          }`}
          style={
            reduceMotion
              ? undefined
              : { animationDelay: "0.08s", animationFillMode: "forwards" }
          }
        >
          {copy.brand}
        </p>

        <h1
          className={`text-lg sm:text-2xl lg:text-3xl font-medium tracking-tight text-foreground/75 mb-8 sm:mb-12 max-w-3xl mx-auto ${
            reduceMotion ? "" : "animate-slide-up opacity-0"
          }`}
          style={
            reduceMotion
              ? undefined
              : { animationDelay: "0.16s", animationFillMode: "forwards" }
          }
        >
          {copy.h1}
        </h1>

        <div
          className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center ${
            reduceMotion ? "" : "animate-slide-up opacity-0"
          }`}
          style={
            reduceMotion
              ? undefined
              : { animationDelay: "0.24s", animationFillMode: "forwards" }
          }
        >
          <a
            href="#contact"
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            {copy.ctaPrimary}
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#projects"
            className="btn-outline inline-flex items-center justify-center gap-2"
          >
            {copy.ctaSecondary}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div
        aria-hidden="true"
        className={`absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 ${
          reduceMotion ? "opacity-40" : "animate-drift"
        }`}
      >
        <ChevronDown className="w-6 h-6 text-foreground/70" />
      </div>
    </section>
  );
}
