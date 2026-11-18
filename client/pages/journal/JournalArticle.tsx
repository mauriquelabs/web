import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { JournalShell } from "@/components/journal/JournalShell";
import { MarkdownBody } from "@/components/journal/MarkdownBody";
import {
  formatJournalDate,
  getPostBySlug,
  PILLAR_LABELS,
  TYPE_LABELS,
} from "@/lib/journal";

export default function JournalArticle() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post || post.status !== "published") {
    return <Navigate to="/journal" replace />;
  }

  return (
    <JournalShell>
      <article className="light bg-background text-foreground">
        <div className="section-container section">
          <div className="content-narrow animate-fade-in">
            <Link
              to="/journal"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground/60 hover:text-secondary transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Back to Journal
            </Link>

            <header className="mt-10 animate-slide-up">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold tracking-wide uppercase text-foreground/50">
                <span className="text-secondary">
                  {PILLAR_LABELS[post.pillar]}
                </span>
                <span aria-hidden="true">·</span>
                <span>{TYPE_LABELS[post.type]}</span>
                <span aria-hidden="true">·</span>
                <span>{post.readingTime} min read</span>
              </div>
              <h1 className="mt-4 font-heading text-3xl sm:text-4xl lg:text-5xl text-foreground leading-tight">
                {post.title}
              </h1>
              <p className="mt-6 text-lg text-foreground/70 leading-relaxed">
                {post.excerpt}
              </p>
              <p className="mt-4 text-sm text-foreground/45">
                {formatJournalDate(post.date)}
              </p>
            </header>

            <div className="mt-12 border-t border-border pt-10 animate-slide-up">
              <MarkdownBody content={post.content} />
            </div>

            <footer className="mt-16 pt-8 border-t border-border">
              <p className="text-foreground/60 leading-relaxed">
                Maurique Labs explores opportunities where technology meets
                community. If this resonates,{" "}
                <Link
                  to="/#contact"
                  className="text-secondary font-semibold hover:text-accent transition-colors duration-200"
                >
                  tell us what you are building
                </Link>
                .
              </p>
            </footer>
          </div>
        </div>
      </article>
    </JournalShell>
  );
}
