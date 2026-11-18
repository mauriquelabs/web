import { useEffect, useMemo, useState } from "react";
import { FeaturedArticle } from "@/components/journal/FeaturedArticle";
import { ArticleList } from "@/components/journal/ArticleList";
import { JournalShell } from "@/components/journal/JournalShell";
import {
  PillarFilter,
  PillarFilterValue,
} from "@/components/journal/PillarFilter";
import { getFeaturedPost, getPublishedPosts } from "@/lib/journal";

export default function JournalIndex() {
  const [pillar, setPillar] = useState<PillarFilterValue>("all");
  const featured = getFeaturedPost();
  const posts = getPublishedPosts();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filtered = useMemo(() => {
    const withoutFeaturedDup =
      pillar === "all" && featured
        ? posts.filter((p) => p.slug !== featured.slug)
        : posts;
    if (pillar === "all") return withoutFeaturedDup;
    return posts.filter((p) => p.pillar === pillar);
  }, [pillar, posts, featured]);

  const showFilters = posts.length > 1;
  const showList = filtered.length > 0 || pillar !== "all";

  return (
    <JournalShell>
      <section className="light bg-background text-foreground">
        <div className="section-container section">
          <header className="content-narrow mx-0 max-w-3xl animate-fade-in">
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-secondary">
              Maurique Labs
            </p>
            <h1 className="mt-4 font-heading text-4xl sm:text-5xl lg:text-6xl text-foreground">
              Journal
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-foreground/70 leading-relaxed">
              Ideas, experiments, and lessons from building products and
              communities.
            </p>
          </header>

          {featured && pillar === "all" && (
            <div className="mt-16 lg:mt-24 border-t border-border pt-12 lg:pt-16">
              <FeaturedArticle post={featured} />
            </div>
          )}

          {(showFilters || showList) && (
            <div className="mt-16 lg:mt-24 space-y-8">
              {showFilters && (
                <PillarFilter value={pillar} onChange={setPillar} />
              )}
              {showList && <ArticleList posts={filtered} />}
            </div>
          )}
        </div>
      </section>
    </JournalShell>
  );
}
