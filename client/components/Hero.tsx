import { ArrowRight } from "lucide-react";

interface HeroProps {
  language: "en" | "es";
}

export default function Hero({ language }: HeroProps) {
  const content = {
    en: {
      h1: "Maurique Labs",
      subheadline:
        "Technology · Culture · Community",
      description:
        "We help entrepreneurs, artists, brands, and small businesses transform ideas into real projects — and build active communities around them. One partner bridging the gap between digital and culture.",
      ctaPrimary: "See Our Work",
      ctaSecondary: "Let's Collaborate",
    },
    es: {
      h1: "Maurique Labs",
      subheadline:
        "Tecnología · Cultura · Comunidad",
      description:
        "Ayudamos a emprendedores, artistas, marcas y pequeñas empresas a transformar ideas en proyectos reales — y a construir comunidades activas alrededor de ellas. Un partner único entre lo digital y la cultura.",
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
      {/* Subtle background gradient */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent2 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="section-container relative z-10 text-center">
        <h1 className="animate-slide-up mb-4 text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight">
          {copy.h1}
        </h1>

        <p
          className="text-lg sm:text-xl font-semibold tracking-widest text-accent uppercase mb-6 animate-slide-up opacity-0"
          style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
        >
          {copy.subheadline}
        </p>

        <p
          className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up opacity-0"
          style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
        >
          {copy.description}
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up opacity-0"
          style={{ animationDelay: "0.55s", animationFillMode: "forwards" }}
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
            className="btn-secondary inline-flex items-center justify-center gap-2"
          >
            {copy.ctaSecondary}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
