# Visionarai-one

AI for Visionaries — this repository is the monorepo powering the visionar.ai ecosystem. It uses Nx with Yarn v4 to manage one Next.js application and multiple shared libraries/domains in a clean, scalable architecture.

[!NOTE]
This is an Nx workspace (v21) using Yarn v4. All commands below use yarn and Nx targets.

## Quickstart

1) Install dependencies

```bash
yarn install
```

2) Run the website (Next.js App Router)

```bash
yarn nx run @visionarai-one/website:dev
```

3) Build and preview static output

```bash
yarn nx run @visionarai-one/website:build
yarn nx run @visionarai-one/website:serve-static
```

[!TIP]
Use `yarn dep-graph` to open the interactive Nx project graph and explore dependencies.

## Monorepo at a glance

- apps/website — Next.js 15 App Router app (depends on libs/ui, libs/utils, domains/abac)
- libs/ui — UI primitives (shadcn/ui wrappers) and functional components
- libs/utils — framework-agnostic utilities (e.g., DOM helpers, password helpers)
- domains/abac — ABAC policy evaluation domain
- packages/connectors — integrations (e.g., MongoDB/Mongoose connector)

Condensed tree:

```
apps/
	website/
		src/app/[locale]/...        # Locale-aware routes (public/private)
		src/i18n/                   # next-intl routing/navigation helpers
libs/
	ui/                           # shadcn wrappers + functional components
	utils/                        # shared utilities (DOM, password)
domains/
	abac/               # ABAC policies, operators, schemas
packages/
	connectors/                   # connector factory + MongoDB connector
messages/                       # i18n message catalogs (JSON per locale)
```

## Tech stack

- Nx 21, Yarn 4 workspaces
- Next.js 15 (App Router), React 19
- Tailwind CSS v4, shadcn/ui
- TypeScript (strict), Zod
- Vite/Vitest in selected libraries
- Mongoose/MongoDB connector

## Common tasks

- Format code

```bash
yarn format
```

- Lint code

```bash
yarn lint
```

- Sync Nx project configuration

```bash
yarn sync:project
```

- Visualize dependency graph

```bash
yarn dep-graph
```

- Clean workspace (cache, dist, dependencies)

```bash
# DANGER: removes node_modules and reinstalls
yarn clean:all
```

[!NOTE]
Some libraries use Vite/Vitest. When a project exposes a `test` target, you can run it via Nx, for example:

```bash
yarn nx run abac:test
```

## Internationalization (next-intl)

- Locale segment lives under `apps/website/src/app/[locale]/...`.
- Message catalogs are in `messages/<locale>.json`.
- Routing helpers: `apps/website/src/i18n/routing.ts` and navigation helpers in `apps/website/src/i18n/navigation.ts`.

[!TIP]
Add new locales by creating `messages/<locale>.json` and wiring routes via the routing helpers.

## UI library (libs/ui)

- Primitives (`components/ui/*`) are thin shadcn/ui wrappers (Button, Input, Select, Dialog, Calendar, MultiSelect, etc.).
- Functional components live in `components/functional/*` (e.g., NavBar, Footer, ThemeSwitcher, forms).
- Forms render from Zod metadata; use `schema.describe(JSON.stringify(FieldMetadata))` or helpers from `@visionarai-one/ui` to embed per-field UI config.
- Choice inputs auto-switch between Radio/Checkbox vs Select/Combobox/MultiSelect based on option size.

## Access Control (ABAC)

- Policy evaluation: see `domains/abac/src/policy/*.ts`.
- `evaluatePolicy` checks global and per-action conditions using operation handlers in `operators.ts`.
- Repository factory `createPolicyRepository(mongooseConnection)` loads master data and exposes:
	`getPolicyById(id).isPermissionGranted(subject, resourceType, action)`.
- Subject fields support dot-paths like `subject._id`, `subject.currentWorkspaceId`.

## Connectors

- Connector factory pattern with health checks in `packages/connectors`.
- MongoDB connector is built on Mongoose. Instantiate via the factory and manage lifecycle/health.

## Conventions

- App Router rules: use `next/image`, metadata APIs; avoid direct `<img>`/`<head>`.
- TypeScript: strict, no enums (prefer unions or `as const`).
- Cross-package imports use path aliases from `tsconfig.base.json`.
- Styling: Tailwind v4 with global styles from `libs/ui/src/globals.css` imported by the app.

[!WARNING]
If you add new pages, keep them under the locale segment (`src/app/[locale]/...`) and follow Next.js App Router conventions.

## Troubleshooting

- Yarn 4 workspaces are already configured. Always use `yarn` (not npm/pnpm).
- If Nx tasks don’t show up or feel out of sync, run `yarn sync:project`.
- For dependency graph issues, open the Nx graph (`yarn dep-graph`) to verify relationships.

## What’s next

- Add features in `apps/website/src/app/[locale]/(public|private)`.
- Extend UI primitives or functional components in `libs/ui`.
- Add or refine ABAC policies and operators under `domains/abac`.
- Add new connectors under `packages/connectors`.

[!TIP]
Prefer Nx targets for builds, tests, and dev for consistent caching and dependency awareness.

