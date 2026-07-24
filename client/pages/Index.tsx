import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Methodology from "@/components/Methodology";
import Portfolio from "@/components/Portfolio";
import Manifesto from "@/components/Manifesto";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

type Language = "en" | "es";

/**
 * Section rhythm — white → dark → white → gradient-CTA.
 * Each section accepts `theme` ("dark" | "light") that toggles the `.light`
 * class; Contact adds an intentional gradient wash on the dark CTA surface.
 * Header/Footer stay dark (light logo asset only).
 */
const SECTION_THEME = {
  methodology: "light",
  portfolio: "dark",
  manifesto: "light",
  contact: "dark",
} as const;

export default function Index() {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLanguage = localStorage.getItem(
      "maurique-language",
    ) as Language | null;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("maurique-language", lang);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header language={language} onLanguageChange={handleLanguageChange} />
      <main>
        <Hero language={language} />
        <Methodology language={language} theme={SECTION_THEME.methodology} />
        <Portfolio language={language} theme={SECTION_THEME.portfolio} />
        <Manifesto language={language} theme={SECTION_THEME.manifesto} />
        <Contact language={language} theme={SECTION_THEME.contact} />
      </main>
      <Footer language={language} />
    </div>
  );
}
