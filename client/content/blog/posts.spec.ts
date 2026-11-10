import { describe, expect, it } from "vitest";
import { getPostBySlug, posts } from "./posts";

function chapterTimeToSeconds(time: string): number {
  const [minutes, seconds] = time.split(":").map(Number);
  return minutes * 60 + seconds;
}

describe("blog posts registry", () => {
  it("has unique slugs", () => {
    const slugs = posts.map((post) => post.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("includes required fields on every post", () => {
    expect(posts.length).toBeGreaterThan(0);

    for (const post of posts) {
      expect(post.slug.length).toBeGreaterThan(0);
      expect(post.title.length).toBeGreaterThan(0);
      expect(post.description.length).toBeGreaterThan(0);
      expect(post.series.name.length).toBeGreaterThan(0);
      expect(post.series.episodeLabel.length).toBeGreaterThan(0);
      expect(post.duration.length).toBeGreaterThan(0);
      expect(post.format.length).toBeGreaterThan(0);
      expect(post.level.length).toBeGreaterThan(0);
      expect(post.context.length).toBeGreaterThan(0);
      expect(post.objectives.length).toBeGreaterThan(0);
      expect(post.objectiveCloser.length).toBeGreaterThan(0);
      expect(post.chapters.length).toBeGreaterThan(0);
      expect(post.prompt.kicker.length).toBeGreaterThan(0);
      expect(post.prompt.title.length).toBeGreaterThan(0);
      expect(post.prompt.body.length).toBeGreaterThan(0);
      expect(post.prompt.note.length).toBeGreaterThan(0);
      expect(post.later.episodeLabel.length).toBeGreaterThan(0);
      expect(post.later.futureLabel.length).toBeGreaterThan(0);
      expect(post.later.rows.length).toBeGreaterThan(0);

      for (const chapter of post.chapters) {
        expect(chapter.time.length).toBeGreaterThan(0);
        expect(chapter.title.length).toBeGreaterThan(0);
        expect(chapter.body.length).toBeGreaterThan(0);
      }

      for (const row of post.later.rows) {
        expect(row.now.length).toBeGreaterThan(0);
        expect(row.later.length).toBeGreaterThan(0);
      }
    }
  });

  it("keeps chapters in time order", () => {
    for (const post of posts) {
      const times = post.chapters.map((chapter) =>
        chapterTimeToSeconds(chapter.time),
      );
      const sorted = [...times].sort((a, b) => a - b);
      expect(times).toEqual(sorted);
    }
  });

  it("looks up posts by slug", () => {
    const first = posts[0];
    expect(getPostBySlug(first.slug)).toEqual(first);
    expect(getPostBySlug("does-not-exist")).toBeUndefined();
    expect(getPostBySlug(undefined)).toBeUndefined();
  });
});
