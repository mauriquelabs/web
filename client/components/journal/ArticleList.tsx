import { Link } from "react-router-dom";
import {
  formatJournalDate,
  JournalPost,
  PILLAR_LABELS,
  TYPE_LABELS,
} from "@/lib/journal";

interface ArticleListProps {
  posts: JournalPost[];
}

export function ArticleList({ posts }: ArticleListProps) {
  if (posts.length === 0) {
    return (
      <p className="text-foreground/60 text-base py-8">
        No articles in this pillar yet.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border border-t border-border">
      {posts.map((post) => {
        const isComingSoon = post.status === "coming-soon";
        const inner = (
          <>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold tracking-wide uppercase text-foreground/50">
              <span className="text-secondary">{PILLAR_LABELS[post.pillar]}</span>
              <span aria-hidden="true">·</span>
              <span>{TYPE_LABELS[post.type]}</span>
              {isComingSoon ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-foreground/70">Coming soon</span>
                </>
              ) : (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{post.readingTime} min read</span>
                </>
              )}
            </div>
            <h3 className="mt-3 font-heading text-xl sm:text-2xl text-foreground group-hover:text-secondary transition-colors duration-200">
              {post.title}
            </h3>
            <p className="mt-2 text-foreground/65 leading-relaxed max-w-3xl">
              {post.excerpt}
            </p>
            {!isComingSoon && (
              <p className="mt-3 text-sm text-foreground/45">
                {formatJournalDate(post.date)}
              </p>
            )}
          </>
        );

        return (
          <li key={post.slug}>
            {isComingSoon ? (
              <div className="block py-8 opacity-80">{inner}</div>
            ) : (
              <Link
                to={`/journal/${post.slug}`}
                className="group block py-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-btn"
              >
                {inner}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
