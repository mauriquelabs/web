import { useEffect, useState, type ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Language = "en" | "es";

interface BlogLayoutProps {
  children: ReactNode;
  title: string;
}

export default function BlogLayout({ children, title }: BlogLayoutProps) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("maurique-language") as Language | null;
    if (saved === "en" || saved === "es") {
      setLanguage(saved);
    }
  }, []);

  useEffect(() => {
    const previous = document.title;
    document.title = title;
    return () => {
      document.title = previous;
    };
  }, [title]);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("maurique-language", lang);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header language={language} onLanguageChange={handleLanguageChange} />
      <main className="light flex-1 bg-background text-foreground">
        {children}
      </main>
      <Footer language={language} />
    </div>
  );
}
