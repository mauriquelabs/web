import { Link, useParams } from "react-router-dom";
import BlogLayout from "@/components/blog/BlogLayout";
import ChapterList from "@/components/blog/ChapterList";
import CopyPromptCard from "@/components/blog/CopyPromptCard";
import LaterComparison from "@/components/blog/LaterComparison";
import PostMeta from "@/components/blog/PostMeta";
import { getPostBySlug } from "@/content/blog/posts";
import NotFound from "@/pages/NotFound";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = getPostBySlug(slug);

  if (!post) {
    return <NotFound />;
  }

  return (
    <BlogLayout title={`${post.title} — Maurique Labs`}>
      <article className="section">
        <div className="section-container">
          <div className="content-narrow">
            <p className="mb-8">
              <Link
                to="/blog"
                className="text-sm font-medium text-accent2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent2"
              >
                All episodes
              </Link>
            </p>

            <header className="mb-16">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-accent2">
                {post.series.name} · {post.series.episodeLabel}
              </p>
              <h1 className="mb-6">{post.title}</h1>
              <p className="mb-8 text-lg leading-relaxed text-foreground/70">
                {post.description}
              </p>
              <PostMeta
                duration={post.duration}
                format={post.format}
                level={post.level}
              />
              {post.videoUrl ? (
                <p className="mt-6">
                  <a
                    href={post.videoUrl}
                    className="text-sm font-medium text-accent2 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Watch the recording
                  </a>
                </p>
              ) : null}
            </header>

            <p className="mb-16 text-lg leading-relaxed text-foreground">
              {post.context}
            </p>

            <section className="mb-16">
              <h2 className="mb-6 text-2xl sm:text-3xl">
                What viewers should learn
              </h2>
              <p className="mb-6 leading-relaxed text-foreground/70">
                By the end of the video, viewers should understand how to:
              </p>
              <ol className="mb-8 list-decimal space-y-4 pl-6 leading-relaxed text-foreground">
                {post.objectives.map((objective) => (
                  <li key={objective}>{objective}</li>
                ))}
              </ol>
              <p className="leading-relaxed text-foreground/70">
                {post.objectiveCloser}
              </p>
            </section>

            <section className="mb-16">
              <h2 className="mb-8 text-2xl sm:text-3xl">The video structure</h2>
              <ChapterList chapters={post.chapters} />
            </section>

            <section className="mb-16">
              <h2 className="mb-4 text-2xl sm:text-3xl">
                The first agent task
              </h2>
              <p className="mb-8 leading-relaxed text-foreground/70">
                {post.prompt.title}
              </p>
              <CopyPromptCard prompt={post.prompt} />
              <p className="mt-6 leading-relaxed text-foreground/70">
                {post.prompt.note}
              </p>
            </section>

            <section>
              <h2 className="mb-8 text-2xl sm:text-3xl">
                What we deliberately leave for later
              </h2>
              <LaterComparison later={post.later} />
            </section>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
