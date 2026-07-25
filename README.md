# Maurique Labs

**Software for the music industry.**

Maurique Labs builds software for the music tech industry. We partner with artists, promoters, and music tech companies to discover real problems and build software that strengthens the music ecosystem.

This repository is the Maurique Labs company marketing website — landing page, services, and contact flows.

## Features

- Bilingual landing page (English / Spanish) with persisted language preference
- Homepage sections: Hero, Methodology, Portfolio, Manifesto, and Contact
- Dedicated `/services` page with quote request flow
- Contact and quote forms backed by Express API routes
- Responsive, accessible UI built on Radix primitives and Tailwind CSS
- Shared TypeScript types between client and server



## Tech stack


| Layer           | Tools                                                    |
| --------------- | -------------------------------------------------------- |
| Frontend        | React 18, React Router 6, TypeScript, Vite, Tailwind CSS |
| UI              | Radix UI, Lucide icons, Framer Motion                    |
| Backend         | Express 5 (integrated with Vite in development)          |
| Validation      | Zod                                                      |
| Testing         | Vitest                                                   |
| Package manager | pnpm                                                     |




## Prerequisites

- [Node.js](https://nodejs.org/) 22+
- [pnpm](https://pnpm.io/) 10+



## Getting started

```bash
# Install dependencies
pnpm install

# Start the dev server (client + API on a single port)
pnpm dev
```

Open [http://localhost:5000](http://localhost:5000). The Vite dev server serves the React app and mounts the Express API as middleware, so both frontend and `/api/*` routes are available on the same origin.

### Environment variables

Create a `.env` file in the project root if you need to override defaults. See `.env.example` for all variables.

### Supabase authentication (CMS admin)

Admin auth uses [Supabase Auth](https://supabase.com/docs/guides/auth). To set it up:

1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Copy `.env.example` values into `.env` and fill in your project URL and anon key from **Project Settings → API**.
3. In Supabase **Authentication → Providers**, enable Email and **disable public signups** unless you intend to open registration.
4. Create an admin user under **Authentication → Users**, then grant access using **either**:
   - set `app_metadata.role` to `"admin"` on the user in Supabase, **or**
   - add the user's email to `ADMIN_EMAILS` / `VITE_ADMIN_EMAILS` in `.env`.
5. Run `pnpm dev` and open [`/admin/login`](http://localhost:5000/admin/login).

Protected routes live under `/admin`. The server verifies JWTs and admin access on `GET /api/auth/me` — the same pattern will protect future CMS write endpoints.


| Variable       | Description                          | Default |
| -------------- | ------------------------------------ | ------- |
| `PORT`         | Production server port               | `5000`  |
| `PING_MESSAGE` | Response message for `GET /api/ping` | `ping`  |
| `VITE_SUPABASE_URL` | Supabase project URL (client) | — |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key (client) | — |
| `SUPABASE_URL` | Supabase project URL (server JWT verification) | same as `VITE_SUPABASE_URL` |
| `SUPABASE_ANON_KEY` | Supabase anon/public key (server) | same as `VITE_SUPABASE_ANON_KEY` |
| `ADMIN_EMAILS` | Comma-separated emails allowed to access `/admin` (server) | — |
| `VITE_ADMIN_EMAILS` | Same allowlist for the client route guard | same as `ADMIN_EMAILS` |




## Scripts


| Command           | Description                            |
| ----------------- | -------------------------------------- |
| `pnpm dev`        | Start development server               |
| `pnpm build`      | Build client and server for production |
| `pnpm start`      | Run the production Node server         |
| `pnpm typecheck`  | Run TypeScript validation              |
| `pnpm test`       | Run Vitest tests                       |
| `pnpm format.fix` | Format code with Prettier              |




## Project structure

```text
client/                 # React SPA
├── pages/              # Route components (Index, ServicesPage, NotFound)
├── components/         # Section and shared UI components
│   └── ui/             # Radix/shadcn-style primitives
├── App.tsx             # Router entry
└── global.css          # Theme tokens and global styles

server/                 # Express API
├── index.ts            # Server setup and route registration
├── node-build.ts       # Production entry (serves built SPA)
└── routes/             # API handlers

shared/                 # Types shared by client and server
└── api.ts

docs/
└── brand-design-system.md   # Colors, typography, and UI conventions
```



### Path aliases

- `@/*` → `client/*`
- `@shared/*` → `shared/*`

Add new routes in `client/App.tsx` above the catch-all `*` route.

## API

All endpoints are prefixed with `/api/`.


| Method | Path           | Description              |
| ------ | -------------- | ------------------------ |
| `GET`  | `/api/ping`    | Health check             |
| `GET`  | `/api/demo`    | Demo endpoint            |
| `GET`  | `/api/auth/me` | Current user (Bearer JWT) |
| `POST` | `/api/contact` | Contact form submission  |
| `POST` | `/api/quote`   | Quote request submission |


Request and response types live in `shared/api.ts`.

## Production

Build both the SPA and the Node server, then start the combined server:

```bash
pnpm build
pnpm start
```

The production server serves static assets from `dist/spa` and falls back to `index.html` for client-side routing.

## Design system

Before changing UI or styling, read `[docs/brand-design-system.md](docs/brand-design-system.md)`. Use semantic tokens (`bg-background`, `text-foreground`, …) and existing utility classes (`.btn-primary`, `.card-base`, `.section`, `.section-container`) rather than inventing parallel visual patterns.

## Contributing

Engineering conventions, product context, and development guidelines are documented in `[AGENTS.md](AGENTS.md)`.

## License

Private — © Maurique Labs. All rights reserved.