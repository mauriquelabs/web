import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";

interface HeroProps {
  language: "en" | "es";
}

export default function Hero({ language }: HeroProps) {
  const content = {
    en: {
      brand: "Maurique Labs",
      h1: "Software for the music industry.",
      slogan:
        "We partner with artists, promoters and music tech companies to discover real problems and build software that strengthens the music ecosystem.",
      ctaPrimary: "Explore our work",
      ctaSecondary: "Let's talk",
    },
    es: {
      brand: "Maurique Labs",
      h1: "Software para la industria musical.",
      slogan:
        "Colaboramos con artistas, promotores y empresas de tecnología musical para descubrir problemas reales y construir software que fortalece el ecosistema musical.",
      ctaPrimary: "Explora nuestro trabajo",
      ctaSecondary: "Hablemos",
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
      className="section bg-brand-black text-foreground min-h-[100svh] flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Stage atmosphere — intentional hero gradient (not a photo stand-in) */}
      <div
        ref={washRef}
        aria-hidden="true"
        className="absolute inset-[-10%] pointer-events-none will-change-transform"
        style={{
          background: `
            radial-gradient(ellipse 55% 45% at 18% 78%, rgba(43, 201, 163, 0.28) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 88% 18%, rgba(255, 87, 20, 0.2) 0%, transparent 65%),
            radial-gradient(ellipse 70% 50% at 50% 100%, rgba(13, 38, 38, 0.9) 0%, transparent 60%)
          `,
        }}
      />

      <div className="section-container relative z-10 text-center">
        <img
          src="/logo-mark.png"
          alt=""
          width={96}
          height={93}
          className={`mx-auto mb-8 h-20 w-auto sm:h-24 ${
            reduceMotion ? "" : "animate-slide-up"
          }`}
          aria-hidden="true"
        />

        <p
          className={`font-heading text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 ${
            reduceMotion ? "" : "animate-slide-up opacity-0"
          }`}
          style={
            reduceMotion
              ? undefined
              : { animationDelay: "0.1s", animationFillMode: "forwards" }
          }
        >
          {copy.brand}
        </p>

        <h1
          className={`text-xl sm:text-2xl lg:text-3xl font-medium tracking-tight text-foreground/75 mb-8 max-w-2xl mx-auto ${
            reduceMotion ? "" : "animate-slide-up opacity-0"
          }`}
          style={
            reduceMotion
              ? undefined
              : { animationDelay: "0.2s", animationFillMode: "forwards" }
          }
        >
          {copy.h1}
        </h1>

        <p
          className={`text-base sm:text-lg text-foreground/55 max-w-xl mx-auto mb-12 leading-relaxed ${
            reduceMotion ? "" : "animate-slide-up opacity-0"
          }`}
          style={
            reduceMotion
              ? undefined
              : { animationDelay: "0.28s", animationFillMode: "forwards" }
          }
        >
          {copy.slogan}
        </p>

        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center ${
            reduceMotion ? "" : "animate-slide-up opacity-0"
          }`}
          style={
            reduceMotion
              ? undefined
              : { animationDelay: "0.36s", animationFillMode: "forwards" }
          }
        >
          <a
            href="#portfolio"
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            {copy.ctaPrimary}
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#contact"
            className="btn-outline inline-flex items-center justify-center gap-2"
          >
            {copy.ctaSecondary}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div
        aria-hidden="true"
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 ${
          reduceMotion ? "opacity-40" : "animate-drift"
        }`}
      >
        <ChevronDown className="w-6 h-6 text-foreground/70" />
      </div>
    </section>
  );
}
