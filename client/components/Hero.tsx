import { motion } from "framer-motion";
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

  return (
    <section
      id="home"
      className="section min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Acid Lime — top center */}
        <motion.div
          className="absolute rounded-full blur-3xl opacity-25"
          style={{ backgroundColor: "#B9F01F", width: 600, height: 400, top: -128, left: "calc(50% - 300px)" }}
          animate={{ x: [0, 50, -35, 0], y: [0, 30, -20, 0], scale: [1, 1.08, 0.94, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Bright Teal — top right */}
        <motion.div
          className="absolute rounded-full blur-3xl opacity-30"
          style={{ backgroundColor: "#2BC9A3", width: 500, height: 400, top: -64, right: 0 }}
          animate={{ x: [0, -50, 25, 0], y: [0, 45, -30, 0], scale: [1, 0.91, 1.07, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Electric Orange — bottom center */}
        <motion.div
          className="absolute rounded-full blur-3xl opacity-35"
          style={{ backgroundColor: "#FF5714", width: 700, height: 400, bottom: -128, left: "calc(50% - 350px)" }}
          animate={{ x: [0, -45, 40, 0], y: [0, -35, 20, 0], scale: [1, 1.1, 0.92, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="section-container relative z-10 text-center">
        <h1 className="animate-slide-up mb-4 text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight">
          {copy.h1}
        </h1>

        <p
          className="text-lg sm:text-xl font-semibold tracking-widest text-accent uppercase mb-8 animate-slide-up opacity-0"
          style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
        >
          {copy.subheadline}
        </p>

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

      {/* Scroll indicator */}
      <div aria-hidden="true" className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
        <ChevronDown className="w-6 h-6 text-white" />
      </div>
    </section>
  );
}
