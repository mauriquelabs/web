import { settingUpCursorCloudAgents } from "./setting-up-cursor-cloud-agents";
import type { BlogPost } from "./types";

export type { BlogPost } from "./types";

/** Newest first. Add a new episode file and insert it at the top. */
export const posts: BlogPost[] = [settingUpCursorCloudAgents];

export function getPostBySlug(slug: string | undefined): BlogPost | undefined {
  if (!slug) {
    return undefined;
  }

  return posts.find((post) => post.slug === slug);
}
