import { useEffect, useRef } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";

interface HeroProps {
  language: "en" | "es";
}

export default function Hero({ language }: HeroProps) {
  const content = {
    en: {
      h1: "Maurique Labs",
      subheadline: "Technology · Creativity · Culture",
      slogan: "A unique partner bridging technology and culture — built for the long run.",
      ctaPrimary: "See Our Work",
      ctaSecondary: "Let's Collaborate",
    },
    es: {
      h1: "Maurique Labs",
      subheadline: "Tecnología · Creatividad · Cultura",
      slogan: "Un partner único que une tecnología y cultura, con visión de continuidad.",
      ctaPrimary: "Ver Nuestro Trabajo",
      ctaSecondary: "Colaboremos",
    },
  };

  const copy = content[language];

  const sectionRef = useRef<HTMLElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let rafId: number;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

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
      currentX += (targetX - currentX) * 0.07;
      currentY += (targetY - currentY) * 0.07;

      if (layer1Ref.current)
        layer1Ref.current.style.transform = `translate(${currentX * 6}px, ${currentY * 6}px)`;
      if (layer2Ref.current)
        layer2Ref.current.style.transform = `translate(${currentX * 13}px, ${currentY * 13}px)`;
      if (layer3Ref.current)
        layer3Ref.current.style.transform = `translate(${currentX * 20}px, ${currentY * 20}px)`;

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
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="section min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Dot grid background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.09) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="section-container relative z-10 text-center">
        {/* Layer 1 — least movement */}
        <div ref={layer1Ref}>
          <h1 className="animate-slide-up mb-4 text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight">
            {copy.h1}
          </h1>
        </div>

        {/* Layer 2 — medium movement */}
        <div ref={layer2Ref}>
          <p
            className="text-lg sm:text-xl font-semibold tracking-widest text-accent uppercase mb-8 animate-slide-up opacity-0"
            style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
          >
            {copy.subheadline}
          </p>
        </div>

        {/* Layer 3 — most movement */}
        <div ref={layer3Ref}>
          <p
            className="text-base sm:text-lg text-foreground/60 max-w-lg mx-auto mb-12 leading-relaxed animate-slide-up opacity-0"
            style={{ animationDelay: "0.30s", animationFillMode: "forwards" }}
          >
            {copy.slogan}
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up opacity-0"
            style={{ animationDelay: "0.45s", animationFillMode: "forwards" }}
          >
            <a
              href="#showcase"
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              {copy.ctaPrimary}
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#collaborate"
              className="btn-outline inline-flex items-center justify-center gap-2"
            >
              {copy.ctaSecondary}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div aria-hidden="true" className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
        <ChevronDown className="w-6 h-6 text-white" />
      </div>
    </section>
  );
}
