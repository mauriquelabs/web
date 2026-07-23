import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Methodology from "@/components/Methodology";
import Portfolio from "@/components/Portfolio";
import Manifesto from "@/components/Manifesto";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

type Language = "en" | "es";

export default function Index() {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    // Persist language preference
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
        <Methodology language={language} />
        <Portfolio language={language} />
        <Manifesto language={language} />
        <Contact language={language} />
      </main>
      <Footer language={language} />
    </div>
  );
}
