import { Link } from "react-router-dom";
import BlogLayout from "@/components/blog/BlogLayout";
import PostMeta from "@/components/blog/PostMeta";
import { posts } from "@/content/blog/posts";

export default function BlogIndexPage() {
  return (
    <BlogLayout title="Inside the Lab — Maurique Labs">
      <section className="section">
        <div className="section-container">
          <div className="content-narrow">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-accent2">
              Inside the Lab
            </p>
            <h1 className="mb-6">Episodes from the workbench</h1>
            <p className="mb-16 text-lg leading-relaxed text-foreground/70">
              Practical write-ups from how we set up tools, run cloud agents,
              and ship the work.
            </p>

            <ul className="space-y-8">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="card-base card-hover block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent2"
                  >
                    <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-accent2">
                      {post.series.name} · {post.series.episodeLabel}
                    </p>
                    <h2 className="mb-3 text-2xl sm:text-3xl">{post.title}</h2>
                    <p className="mb-6 leading-relaxed text-foreground/70">
                      {post.description}
                    </p>
                    <PostMeta
                      duration={post.duration}
                      format={post.format}
                      level={post.level}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </BlogLayout>
  );
}
