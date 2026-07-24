# Maurique Labs Engineering Guide

This repository belongs to Maurique Labs.

Maurique Labs builds software for the Music Tech industry. Every decision in this repository should reinforce that mission.

Our goal is not simply to ship features, but to build software that empowers artists, promoters, communities and music organizations.

---

# Core Principles

## Solve real problems first

Never build features because they are technically interesting.

Every feature must answer:

- Who is this helping?
- What problem does it solve?
- Why is this better than existing workflows?

If a feature cannot answer those questions, challenge the implementation before writing code.

## Product before technology

Technology is a tool. Avoid unnecessary complexity.

Prefer:

- simple architecture
- maintainable code
- boring technologies
- iterative improvements

over clever implementations.

## Build for validation

Maurique Labs validates ideas through real users.

Always optimize for:

- shipping quickly
- measuring usage
- learning
- iterating

Do not prematurely optimize.

---

# Product Context

Maurique Labs creates products that connect technology, music, and communities. Every product should strengthen at least one of those dimensions.

**Current flagship product:** Mind the Beat — the discovery and community platform for purpose-driven electronic music experiences.

Future products may integrate with Mind the Beat but should remain independently scalable.

**This repository today:** the Maurique Labs company marketing website (landing page, services, contact), not the Mind the Beat product app.

---

# Design Principles

Interfaces should feel clean, calm, premium, and minimal.

- Avoid dashboards full of unnecessary information.
- Users should understand the purpose of every screen in less than 10 seconds.
- Whitespace is preferred over density.

For colors, typography, buttons, section theming, motion, and brand tokens, follow [`.cursor/rules/brand-design-system.mdc`](.cursor/rules/brand-design-system.mdc). Do not invent parallel visual systems.

---

# This Repository

## Stack

- **Package manager:** pnpm (prefer over npm/yarn)
- **Frontend:** React 18 + React Router 6 (SPA) + TypeScript + Vite + TailwindCSS 3
- **Backend:** Express integrated with the Vite dev server (single port `8080`)
- **UI:** Radix UI + Lucide React icons
- **Testing:** Vitest
- **Validation:** Zod

## Project structure

```
client/                 # React SPA frontend
├── pages/              # Route components (Index.tsx = home)
├── components/         # Section and shared UI components
│   └── ui/             # Pre-built Radix/shadcn-style primitives
├── App.tsx             # SPA routing entry
└── global.css          # Theme tokens and global styles

server/                 # Express API backend
├── index.ts            # Server setup + route registration
└── routes/             # API handlers

shared/                 # Types shared by client and server
└── api.ts
```

Keep this marketing-site layout. When product features land later, prefer organizing by feature (e.g. `client/features/...`) rather than large type-based folders — do not invent that tree for this site today.

## Path aliases

- `@/*` → `client/`
- `@shared/*` → `shared/`

## Routing

Routes live in `client/App.tsx` via React Router 6. Add custom routes above the catch-all `*` route. Page components live in `client/pages/`.

## API

- Endpoints are prefixed with `/api/`
- Shared response/request types belong in `shared/`
- Only create backend endpoints when necessary (database writes, auth, secrets, integrations, payments, webhooks). Do not proxy requests without a reason.

## Theme and styling

- Primary styling: Tailwind utility classes
- Design tokens: `client/global.css` and `tailwind.config.ts`
- Prefer semantic tokens (`bg-background`, `text-foreground`, `border-border`, etc.) and existing component classes (`.btn-primary`, `.card-base`, `.section`, `.section-container`)
- Use `cn()` (`clsx` + `tailwind-merge`) for conditional classes
- Avoid inline styles

## Development commands

```bash
pnpm dev        # Start dev server (client + server)
pnpm build      # Production build
pnpm start      # Start production server
pnpm typecheck  # TypeScript validation
pnpm test       # Run Vitest tests
```

---

# Engineering Principles

## TypeScript

Avoid `any`. Prefer strict types, inferred types, and reusable interfaces. Rare exceptions at external boundaries must be justified.

## Components

Keep components small. Split UI and business logic whenever practical. Aim to stay under ~250 lines; split sooner when a file mixes unrelated concerns.

Prefer composing existing UI components in `client/components/ui/` before creating new primitives.

## State

Prefer local state, context, and server state. Avoid global state unless justified.

## Dependencies

Before introducing a new dependency ask:

1. Can this be implemented with existing code?
2. Is this dependency actively maintained?
3. Does it significantly reduce complexity?

Prefer fewer dependencies.

## Accessibility

Every UI should support keyboard navigation, semantic HTML, screen readers, and sufficient contrast.

## Performance

Prioritize lazy loading, code splitting, and image optimization. Avoid unnecessary renders.

## Testing

Write tests for business logic, utilities, and critical flows. UI snapshots are lower priority.

## Git

Small commits. Clear commit messages. One logical change per commit.

---

# AI Assistant Guidelines

When contributing to this repository:

- challenge unclear requirements
- suggest simpler alternatives
- explain architectural tradeoffs
- preserve consistency with existing code
- never introduce unnecessary abstractions

If a proposed implementation conflicts with Maurique Labs principles, explain why before implementing it.

---

# Current Mission

Maurique Labs is building the infrastructure that empowers the next generation of electronic music communities.

Every line of code should contribute to that vision.
