import { useEffect, useState } from "react";
import { Mail, MapPin } from "lucide-react";
import ContactForm from "./ContactForm";

interface CollaborateProps {
  language: "en" | "es";
}

export default function Collaborate({ language }: CollaborateProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    const element = document.getElementById("collaborate");
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const content = {
    en: {
      sectionTitle: "Let's Build Something Real",
      sectionDesc:
        "Whether you're an independent creative who needs a digital presence, a venue wanting to build community through events, or a brand looking for a hybrid experience — we're your single partner for technology and culture.",
      contactTitle: "Get in Touch",
      location: "Barcelona",
      email: "hello@mauriquelabs.com",
    },
    es: {
      sectionTitle: "Construyamos Algo Real",
      sectionDesc:
        "Seas un creativo independiente que necesita presencia digital, un espacio que quiere construir comunidad con eventos, o una marca que busca una experiencia híbrida — somos tu partner único para tecnología y cultura.",
      contactTitle: "Ponte en Contacto",
      location: "Barcelona",
      email: "hello@mauriquelabs.com",
    },
  };

  const copy = content[language];

  return (
    <section id="collaborate" className="section">
      <div className="section-container">
        <h2
          className={`mb-6 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {copy.sectionTitle}
        </h2>

        <p
          className={`text-lg sm:text-xl text-foreground/70 max-w-3xl mb-16 leading-relaxed transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: isVisible ? "150ms" : "0ms" }}
        >
          {copy.sectionDesc}
        </p>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div
            className={`transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: isVisible ? "300ms" : "0ms" }}
          >
            <h3 className="text-2xl font-bold mb-8">{copy.contactTitle}</h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">
                    {copy.location}
                  </p>
                  <p className="text-foreground/60 text-sm">Spain</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <a
                  href={`mailto:${copy.email}`}
                  className="font-semibold text-foreground hover:text-accent transition-colors"
                >
                  {copy.email}
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div
            className={`transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: isVisible ? "450ms" : "0ms" }}
          >
            <ContactForm language={language} />
          </div>
        </div>
      </div>
    </section>
  );
}
