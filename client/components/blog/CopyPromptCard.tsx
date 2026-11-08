import { useEffect, useState } from "react";
import type { BlogPrompt } from "@/content/blog/types";
import { cn } from "@/lib/utils";

interface CopyPromptCardProps {
  prompt: BlogPrompt;
}

async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to the execCommand path when the Clipboard API is blocked.
    }
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export default function CopyPromptCard({ prompt }: CopyPromptCardProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeoutId = window.setTimeout(() => setCopied(false), 2500);
    return () => window.clearTimeout(timeoutId);
  }, [copied]);

  const copyPrompt = () => {
    setCopied(true);
    void copyToClipboard(prompt.body);
  };

  return (
    <div className="card-base">
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-accent2">
        {prompt.kicker}
      </p>
      <p className="mb-6 whitespace-pre-line leading-relaxed text-foreground">
        {prompt.body}
      </p>
      <button
        type="button"
        className={cn(
          "btn-outline min-w-[10rem] text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent2",
          copied &&
            "border-brand-pine bg-brand-pine text-white hover:border-brand-pine hover:bg-brand-pine hover:text-white",
        )}
        onClick={copyPrompt}
        aria-live="polite"
      >
        {copied ? "Copied" : "Copy prompt"}
      </button>
    </div>
  );
}
