import { useState } from "react";
import { Check, AlertCircle } from "lucide-react";

interface ContactFormProps {
  language: "en" | "es";
}

export default function ContactForm({ language }: ContactFormProps) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const content = {
    en: {
      nameLabel: "Name",
      emailLabel: "Email",
      messageLabel: "Message",
      successMessage: "Thank you! We'll be in touch soon.",
      errorMessage: "Something went wrong. Please try again.",
      namePlaceholder: "Your name",
      emailPlaceholder: "your@email.com",
      messagePlaceholder:
        "Tell us about the challenge, idea or community you have in mind...",
      sendButton: "Let's talk about your idea",
    },
    es: {
      nameLabel: "Nombre",
      emailLabel: "Email",
      messageLabel: "Mensaje",
      sendButton: "Hablemos de tu idea",
      successMessage: "¡Gracias! Nos pondremos en contacto pronto.",
      errorMessage: "Algo salió mal. Por favor intenta de nuevo.",
      namePlaceholder: "Tu nombre",
      emailPlaceholder: "tu@email.com",
      messagePlaceholder:
        "Cuéntanos el reto, la idea o la comunidad que tienes en mente...",
    },
  };

  const labels = content[language];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("loading");

    try {
      const response = await fetch("https://formspree.io/f/xzzybyza", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormState({ name: "", email: "", message: "" });
        setTimeout(() => setSubmitStatus("idle"), 3000);
      } else {
        setSubmitStatus("error");
        setTimeout(() => setSubmitStatus("idle"), 3000);
      }
    } catch (error) {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          {labels.nameLabel}
        </label>
        <input
          type="text"
          name="name"
          value={formState.name}
          onChange={handleChange}
          placeholder={labels.namePlaceholder}
          required
          className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          {labels.emailLabel}
        </label>
        <input
          type="email"
          name="email"
          value={formState.email}
          onChange={handleChange}
          placeholder={labels.emailPlaceholder}
          required
          className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          {labels.messageLabel}
        </label>
        <textarea
          name="message"
          value={formState.message}
          onChange={handleChange}
          placeholder={labels.messagePlaceholder}
          required
          rows={4}
          className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={submitStatus === "loading"}
        className="w-full btn-primary disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {submitStatus === "loading" ? (
          <span className="inline-block animate-spin">⚙️</span>
        ) : (
          labels.sendButton
        )}
      </button>

      {submitStatus === "success" && (
        <div className="flex items-center gap-2 text-accent bg-accent/10 p-3 rounded-lg">
          <Check className="w-4 h-4" />
          <p className="text-sm">{labels.successMessage}</p>
        </div>
      )}

      {submitStatus === "error" && (
        <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <p className="text-sm">{labels.errorMessage}</p>
        </div>
      )}
    </form>
  );
}
