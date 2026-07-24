# Maurique Labs — Website Design System

Maurique Labs is a **software company** (not a creative agency). Every UI decision should
favor clarity over decoration, products over marketing, and confidence without arrogance.
Think "software company first, creative industry second."

## Typography

- **Bricolage Grotesque** (heading font, `font-heading` / applied automatically to `h1`-`h6`
  in `client/global.css`): hero titles, section titles, card titles, large statements,
  numbers, CTAs.
- **Urbanist** (body font, default `font-sans`): body text, nav, buttons, forms, labels,
  captions, UI components.
- Both are loaded via Google Fonts in `client/global.css`. Don't introduce other typefaces.

## Color System

Defined as HSL CSS variables in `client/global.css` (`:root` = dark surface, `.light` = white
surface — see "Section theming" below) and as raw hex under `tailwind.config.ts` → `theme.colors.brand.*`.

| Color | Hex | Token(s) | Use for |
|---|---|---|---|
| Deep Pine | `#0D2626` | `brand.pine`, `--foreground` (light surface), `--background`/`--primary` (dark surface) | Headlines, nav, icons, dark backgrounds, `.btn-secondary` fill |
| Bright Teal | `#2BC9A3` | `brand.teal`, `--secondary` / `--accent2` | Links, highlights, active states, button hovers |
| Electric Orange | `#FF5714` | `brand.orange`, `--accent` | Primary CTA / main conversion actions (`.btn-primary`) only |
| Acid Lime | `#B9F01F` | `brand.lime` | **Sparingly** — small accents, badges, decorative marks only |
| Rich Black | `#000000` | `brand.black` | Large dark sections / hero backgrounds only, not body text |
| Pure White | `#FFFFFF` | `brand.white`, `--background` (light surface) | Main page background |
| Pale Iris | `#C7B9F0` | `brand.iris` | Reserved for future products/editorial graphics — avoid in website UI |

**Color hierarchy** (don't use all colors equally on one screen): ~80% white/Deep Pine,
~15% Bright Teal, ~5% Orange/Acid Lime. Icons should be monochrome/outline (Lucide), never
multi-colored.

## Section theming (light/dark rhythm)

The design system wants alternating white → dark → white → gradient-CTA section rhythm
instead of one flat background. This is implemented so it's **cheap to try different
combinations**:

- `client/global.css` defines `:root` (dark: Deep Pine bg / white text) and `.light`
  (white bg / Deep Pine text) as two complete sets of the same semantic tokens
  (`--background`, `--foreground`, `--card`, `--border`, `--muted`, etc).
- Every component styles itself with those semantic Tailwind classes (`bg-background`,
  `text-foreground`, `bg-card`, `border-border`, `text-foreground/70`...) — never hardcoded
  colors like `text-white` or `bg-[#0D2626]`. Because of that, wrapping a `<section>` in the
  `.light` class re-themes everything inside it automatically.
- Section components that support theming (`Methodology`, `Portfolio`, `Manifesto`,
  `Contact`) accept a `theme?: "dark" | "light"` prop that toggles this class.
- The active rhythm is a single config object, `SECTION_THEME`, at the top of
  `client/pages/Index.tsx`. Change it there to try a different look.
- `Header` and `Footer` intentionally stay on the dark surface always — see "Known asset
  gaps" below.

When adding a new marketing section, follow this pattern (semantic tokens + optional
`theme` prop) rather than hardcoding colors.

## Layout & Spacing

- Container: `.section-container` (`max-w-[1200px]`, in `client/global.css`).
- Narrow editorial text column: `.content-narrow` (`max-w-[760px]`, ~75 characters per line)
  for body copy under headlines — don't let paragraphs stretch full-width.
- Vertical rhythm: `.section` = `py-16 sm:py-24 lg:py-32` (64/96/128px).
- Use the 8pt spacing scale (8, 16, 24, 32, 48, 64, 96, 128px) for custom spacing — avoid
  arbitrary values like `py-5` or `gap-7`.
- Generous whitespace; content should feel editorial, not dense/corporate.

## Border Radius

Named Tailwind tokens in `tailwind.config.ts` (`borderRadius.btn/card/pill`), backed by CSS
vars in `client/global.css` (`--radius-btn: 12px`, `--radius-card: 16px`,
`--radius-pill: 999px`). Use `rounded-btn` / `rounded-card` / `rounded-pill` — don't fall
back to generic `rounded-lg` for new brand components (that token stays 8px for the
shadcn/ui component library in `client/components/ui/`).

## Buttons

Defined in `client/global.css` `@layer components`:

- `.btn-primary` — Electric Orange fill. The **only** button style for primary CTAs /
  main conversion actions (e.g. "Explore our work", "Let's talk", form submit).
- `.btn-secondary` — Deep Pine fill / white text / hover Bright Teal. Use for
  neutral/secondary actions that shouldn't compete with the primary CTA.
- `.btn-outline` — transparent, adaptive border (`border-foreground/30`), hover fills Deep
  Pine + white text. Use for lower-emphasis secondary actions.
- Never introduce a 4th button color; never use raw `bg-[#...]` for buttons.

## Cards

`.card-base` + `.card-hover` in `client/global.css`: clean surface (`bg-card`), subtle
1px border (`border-border`), `rounded-card` (16px), generous padding
(`p-6 sm:p-8`). Hover uses a small lift + border color change, not heavy shadow
(`hover:shadow-sm` max — prefer borders over elevation everywhere).

## Icons

Lucide React only, outline style, consistent stroke weight. Keep icons monochrome
(`text-foreground` or a single brand color) — never mix two colors on the same icon or
swap hue on hover.

## Motion

- Transitions: 150–250ms for interactive/UI elements (hover, toggle, tap) — use Tailwind
  `duration-200`/`duration-300`. One-time large "hero statement" reveals (e.g. `Manifesto`)
  may run a bit longer (~400–500ms) for dramatic effect, but never beyond that. Staggered
  scroll reveals (e.g. `Methodology` steps, `Portfolio` cards) can delay each item's start,
  but each item's own transition duration should still stay short.
- Allowed: fade, slide, scale (e.g. `.btn-primary`'s `hover:scale-[1.02]`).
- Never use bounce/overshoot easing (e.g. avoid Tailwind's `animate-bounce`) — the drifting
  scroll indicator in `Hero.tsx` uses a custom `animate-drift` keyframe instead, which is
  the pattern to copy for similar ambient/looping motion.

## Gradients & Photography

- Gradients are on-brand but should be intentional: hero/CTA sections/cover images only.
  Most sections should stay flat white or flat Deep Pine — don't add a gradient background
  to every section.
- Prefer real photography (artists, promoters, workshops, events, product demos) over
  stock/generic imagery. See "Known asset gaps" — none exist in the repo yet, so
  `Portfolio.tsx` cards currently use a very subtle (8–16% opacity) brand-color gradient
  wash as a placeholder. Replace with real photography before shipping if it becomes
  available, and lower/remove the gradient once a photo is in place.
- Illustrations (if ever added) should stay abstract/geometric — no cartoon style.

## Known asset gaps (flag, don't assume these exist)

- **No real photography** anywhere in the repo — every visual is a gradient/icon
  placeholder.
- **No abstract/geometric illustration assets.**
- **Only one logo file**, `public/logo-maurique-labs.png`, and it's a light/white
  logotype meant for dark backgrounds — there is no dark/Deep-Pine variant for use on
  light sections or a white header. This is why `Header`/`Footer` are pinned to the dark
  surface regardless of the section rhythm below them.
- No brand asset source files (e.g. original brandbook/Manual de Marca PDF, logo `.svg`,
  photography library) are checked into this repo.

If you're asked to build something that needs one of these assets, say so explicitly
rather than inventing a placeholder that looks final.
