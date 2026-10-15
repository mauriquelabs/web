import { useEffect, useState } from "react";

interface IdeasSpaceProps {
  language: "en" | "es";
  theme?: "dark" | "light";
}

export default function IdeasSpace({
  language,
  theme = "light",
}: IdeasSpaceProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 },
    );

    const element = document.getElementById("ideas");
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const content = {
    en: {
      sectionTitle: "Give your ideas space to grow",
      lead: "An idea you keep coming back to. A challenge your team has been putting off. A community with talent, curiosity and nowhere to experiment together.",
      body: "Maurique Labs creates the space, structure and technical support to take that first step—bringing people with different perspectives together to learn, explore and make something tangible.",
    },
    es: {
      sectionTitle: "Dale a tus ideas espacio para crecer",
      lead: "Una idea a la que vuelves una y otra vez. Un reto que tu equipo lleva aplazando. Una comunidad con talento, curiosidad y sin un lugar donde experimentar juntas.",
      body: "Maurique Labs crea el espacio, la estructura y el apoyo técnico para dar ese primer paso: reunir a personas con perspectivas distintas para aprender, explorar y hacer algo tangible.",
    },
  };

  const copy = content[language];
  const show = isVisible || reduceMotion;

  return (
    <section
      id="ideas"
      className={`section bg-background text-foreground ${
        theme === "light" ? "light" : ""
      }`}
    >
      <div className="section-container">
        <div className="content-narrow mx-auto text-center">
          <h2
            className={`mb-8 transition-opacity duration-300 ${
              show ? "opacity-100" : "opacity-0"
            }`}
          >
            {copy.sectionTitle}
          </h2>

          <p
            className={`text-lg sm:text-xl text-foreground/70 leading-relaxed mb-6 transition-opacity duration-300 ${
              show ? "opacity-100" : "opacity-0"
            }`}
            style={{
              transitionDelay: show && !reduceMotion ? "80ms" : "0ms",
            }}
          >
            {copy.lead}
          </p>

          <p
            className={`text-base sm:text-lg text-foreground/60 leading-relaxed transition-opacity duration-300 ${
              show ? "opacity-100" : "opacity-0"
            }`}
            style={{
              transitionDelay: show && !reduceMotion ? "140ms" : "0ms",
            }}
          >
            {copy.body}
          </p>
        </div>
      </div>
    </section>
  );
}
