import { describe, expect, it } from "vitest";
import {
  getAllPosts,
  getFeaturedPost,
  getPostBySlug,
  metaFromFrontmatter,
  parseFrontmatter,
} from "./journal";

describe("parseFrontmatter", () => {
  it("parses key-value frontmatter and body", () => {
    const raw = `---
title: Example Post
slug: example-post
featured: true
readingTime: 5
---

Body paragraph.
`;
    const { data, content } = parseFrontmatter(raw);
    expect(data.title).toBe("Example Post");
    expect(data.slug).toBe("example-post");
    expect(data.featured).toBe(true);
    expect(data.readingTime).toBe(5);
    expect(content.trim()).toBe("Body paragraph.");
  });

  it("returns full text when frontmatter is missing", () => {
    const { data, content } = parseFrontmatter("Just text");
    expect(data).toEqual({});
    expect(content).toBe("Just text");
  });
});

describe("metaFromFrontmatter", () => {
  it("validates required fields", () => {
    expect(() =>
      metaFromFrontmatter(
        {
          title: "T",
          slug: "s",
          date: "2026-01-01",
          pillar: "exploration",
          type: "perspective",
          excerpt: "E",
          status: "published",
          readingTime: 3,
        },
        "test.md",
      ),
    ).not.toThrow();
  });

  it("rejects invalid pillar", () => {
    expect(() =>
      metaFromFrontmatter(
        {
          title: "T",
          slug: "s",
          date: "2026-01-01",
          pillar: "wrong",
          type: "perspective",
          excerpt: "E",
          status: "published",
          readingTime: 3,
        },
        "test.md",
      ),
    ).toThrow(/invalid pillar/);
  });
});

describe("journal content corpus", () => {
  it("loads markdown posts from content/journal", () => {
    const posts = getAllPosts();
    expect(posts.length).toBeGreaterThanOrEqual(5);
  });

  it("exposes the featured communities article", () => {
    const featured = getFeaturedPost();
    expect(featured?.slug).toBe("best-product-ideas-come-from-communities");
    expect(featured?.status).toBe("published");
    expect(featured?.content.length).toBeGreaterThan(500);
  });

  it("resolves posts by slug", () => {
    const post = getPostBySlug("ai-native-product-builder");
    expect(post?.status).toBe("coming-soon");
    expect(post?.pillar).toBe("building");
  });
});
