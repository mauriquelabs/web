import { ArrowRight, ChevronDown } from "lucide-react";

interface HeroProps {
  language: "en" | "es";
}

export default function Hero({ language }: HeroProps) {
  const content = {
    en: {
      h1: "Maurique Labs",
      subheadline: "Technology · Creativity · Culture",
      description:
        "From digital products to live events — we help entrepreneurs, artists, and brands turn ideas into real projects and build active communities around them.",
      tags: ["Digital Products", "Event Production", "Brand Strategy", "Community Building"],
      ctaPrimary: "See Our Work",
      ctaSecondary: "Let's Collaborate",
    },
    es: {
      h1: "Maurique Labs",
      subheadline: "Tecnología · Creatividad · Cultura",
      description:
        "De productos digitales a eventos en vivo — ayudamos a emprendedores, artistas y marcas a convertir ideas en proyectos reales y construir comunidades activas a su alrededor.",
      tags: ["Productos Digitales", "Producción de Eventos", "Estrategia de Marca", "Comunidad"],
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
      {/* Background gradient glows — matching brand visual identity */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Acid Lime — top center */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl opacity-25" style={{ backgroundColor: "#B9F01F" }}></div>
        {/* Bright Teal — top right */}
        <div className="absolute -top-16 right-0 w-[500px] h-[400px] rounded-full blur-3xl opacity-30" style={{ backgroundColor: "#2BC9A3" }}></div>
        {/* Electric Orange — bottom center */}
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-3xl opacity-35" style={{ backgroundColor: "#FF5714" }}></div>
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

        {/* Service tags */}
        <div
          className="flex flex-wrap gap-2 justify-center mb-8 animate-slide-up opacity-0"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          {copy.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-sm font-medium border border-white/20 text-white/70 bg-white/5 backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        <p
          className="text-base sm:text-lg text-foreground/70 max-w-xl mx-auto mb-12 leading-relaxed animate-slide-up opacity-0"
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
