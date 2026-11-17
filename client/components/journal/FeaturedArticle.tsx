import { Link } from "react-router-dom";
import {
  formatJournalDate,
  JournalPost,
  PILLAR_LABELS,
} from "@/lib/journal";

interface FeaturedArticleProps {
  post: JournalPost;
}

export function FeaturedArticle({ post }: FeaturedArticleProps) {
  return (
    <article className="animate-slide-up">
      <p className="text-xs font-semibold tracking-[0.14em] uppercase text-secondary">
        Featured · {PILLAR_LABELS[post.pillar]}
      </p>
      <h2 className="mt-4 font-heading text-3xl sm:text-4xl lg:text-5xl text-foreground max-w-4xl leading-tight">
        <Link
          to={`/journal/${post.slug}`}
          className="hover:text-secondary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-btn"
        >
          {post.title}
        </Link>
      </h2>
      <p className="mt-6 text-lg sm:text-xl text-foreground/70 leading-relaxed max-w-2xl">
        {post.excerpt}
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-foreground/50">
        <span>{formatJournalDate(post.date)}</span>
        <span aria-hidden="true">·</span>
        <span>{post.readingTime} min read</span>
        <Link
          to={`/journal/${post.slug}`}
          className="text-secondary font-semibold hover:text-accent transition-colors duration-200"
        >
          Read article
        </Link>
      </div>
    </article>
  );
}
