import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Language = "en" | "es";

interface JournalShellProps {
  children: React.ReactNode;
}

export function JournalShell({ children }: JournalShellProps) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("maurique-language") as Language | null;
    if (saved === "en" || saved === "es") setLanguage(saved);
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("maurique-language", lang);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header language={language} onLanguageChange={handleLanguageChange} />
      <main>{children}</main>
      <Footer language={language} />
    </div>
  );
}
