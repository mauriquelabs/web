# Journal articles

Markdown posts for the Maurique Labs Journal (`/journal`).

## Frontmatter

```yaml
---
title: Article title
slug: url-slug
date: YYYY-MM-DD
pillar: exploration | building | community | lab
type: perspective | practice | experiment
excerpt: One or two sentences for the listing.
featured: false
status: published | coming-soon
readingTime: 5
---
```

- `pillar` maps to Exploration, Building, Community, Inside the Lab.
- `type` is Perspective, Practice, or Experiment.
- Only `status: published` posts appear on `/journal` or at `/journal/:slug`.
- Use `status: coming-soon` for private drafts/outlines in the repo; they are not listed publicly.
- At most one `featured: true` published post should exist for the index hero.

## Writing notes

- Prefer 4 to 7 minute reads.
- No em dashes or en dashes in public copy.
- English first; Spanish can land later as separate files or a future i18n field.
- Before drafting, editing, or publishing, follow the
  [Journal Writer skill](../../../.agents/skills/journal-writer/SKILL.md)
  (brand voice + gatekeeper checklist). Invoke with `/journal-writer` in Cursor.
