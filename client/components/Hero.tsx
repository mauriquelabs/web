import { ArrowRight } from "lucide-react";

interface HeroProps {
  language: "en" | "es";
}

export default function Hero({ language }: HeroProps) {
  const content = {
    en: {
      h1: "Maurique Labs",
      subheadline:
        "Technology · Creativity · Culture",
      description:
        "A hybrid agency combining digital projects and event production. We help entrepreneurs, artists, brands, and small businesses transform ideas into real projects and build active communities around them — with flexible, accessible solutions that bridge technology and the cultural ecosystem.",
      ctaPrimary: "See Our Work",
      ctaSecondary: "Let's Collaborate",
    },
    es: {
      h1: "Maurique Labs",
      subheadline:
        "Tecnología · Creatividad · Cultura",
      description:
        "Una agencia híbrida de proyectos digitales y organización de eventos. Ayudamos a emprendedores, artistas, marcas y pequeñas empresas a transformar ideas en proyectos reales y construir comunidades activas alrededor de sus marcas — con soluciones flexibles y accesibles que actúan como puente entre la tecnología y el ecosistema cultural.",
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
