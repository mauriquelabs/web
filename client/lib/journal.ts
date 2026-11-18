export type JournalPillar =
  | "exploration"
  | "building"
  | "community"
  | "lab";

export type JournalContentType = "perspective" | "practice" | "experiment";

export type JournalStatus = "published" | "coming-soon";

export interface JournalPostMeta {
  title: string;
  slug: string;
  date: string;
  pillar: JournalPillar;
  type: JournalContentType;
  excerpt: string;
  featured?: boolean;
  status: JournalStatus;
  readingTime: number;
}

export interface JournalPost extends JournalPostMeta {
  content: string;
}

export const PILLAR_LABELS: Record<JournalPillar, string> = {
  exploration: "Exploration",
  building: "Building",
  community: "Community",
  lab: "Inside the Lab",
};

export const TYPE_LABELS: Record<JournalContentType, string> = {
  perspective: "Perspective",
  practice: "Practice",
  experiment: "Experiment",
};

const PILLARS = new Set<JournalPillar>([
  "exploration",
  "building",
  "community",
  "lab",
]);

const TYPES = new Set<JournalContentType>([
  "perspective",
  "practice",
  "experiment",
]);

const STATUSES = new Set<JournalStatus>(["published", "coming-soon"]);

/** Minimal YAML-ish frontmatter parser (key: value lines only). */
export function parseFrontmatter(raw: string): {
  data: Record<string, string | boolean | number>;
  content: string;
} {
  const trimmed = raw.replace(/^\uFEFF/, "");
  if (!trimmed.startsWith("---")) {
    return { data: {}, content: trimmed };
  }

  const end = trimmed.indexOf("\n---", 3);
  if (end === -1) {
    return { data: {}, content: trimmed };
  }

  const fmBlock = trimmed.slice(4, end).trim();
  const content = trimmed.slice(end + 4).replace(/^\n/, "");
  const data: Record<string, string | boolean | number> = {};

  for (const line of fmBlock.split("\n")) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    let value = line.slice(colon + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (value === "true") data[key] = true;
    else if (value === "false") data[key] = false;
    else if (/^\d+$/.test(value)) data[key] = Number(value);
    else data[key] = value;
  }

  return { data, content };
}

function requireString(
  data: Record<string, string | boolean | number>,
  key: string,
  file: string,
): string {
  const value = data[key];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Journal post ${file}: missing string field "${key}"`);
  }
  return value.trim();
}

export function metaFromFrontmatter(
  data: Record<string, string | boolean | number>,
  file: string,
): JournalPostMeta {
  const pillar = requireString(data, "pillar", file) as JournalPillar;
  const type = requireString(data, "type", file) as JournalContentType;
  const status = requireString(data, "status", file) as JournalStatus;

  if (!PILLARS.has(pillar)) {
    throw new Error(`Journal post ${file}: invalid pillar "${pillar}"`);
  }
  if (!TYPES.has(type)) {
    throw new Error(`Journal post ${file}: invalid type "${type}"`);
  }
  if (!STATUSES.has(status)) {
    throw new Error(`Journal post ${file}: invalid status "${status}"`);
  }

  const readingTime = data.readingTime;
  if (typeof readingTime !== "number" || readingTime <= 0) {
    throw new Error(`Journal post ${file}: readingTime must be a positive number`);
  }

  return {
    title: requireString(data, "title", file),
    slug: requireString(data, "slug", file),
    date: requireString(data, "date", file),
    pillar,
    type,
    excerpt: requireString(data, "excerpt", file),
    featured: data.featured === true,
    status,
    readingTime,
  };
}

const markdownModules = import.meta.glob("../content/journal/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function loadPosts(): JournalPost[] {
  const posts: JournalPost[] = [];

  for (const [path, raw] of Object.entries(markdownModules)) {
    const file = path.split("/").pop() ?? path;
    if (!file.endsWith(".md") || file.toLowerCase() === "readme.md") continue;
    const { data, content } = parseFrontmatter(raw);
    const meta = metaFromFrontmatter(data, file);
    posts.push({ ...meta, content: content.trim() });
  }

  return posts.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.date.localeCompare(a.date);
  });
}

let cachedPosts: JournalPost[] | null = null;

export function getAllPosts(): JournalPost[] {
  if (!cachedPosts) cachedPosts = loadPosts();
  return cachedPosts;
}

export function getPublishedPosts(): JournalPost[] {
  return getAllPosts().filter((p) => p.status === "published");
}

export function getFeaturedPost(): JournalPost | undefined {
  return getAllPosts().find((p) => p.featured && p.status === "published");
}

export function getPostBySlug(slug: string): JournalPost | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function formatJournalDate(date: string): string {
  const parsed = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
