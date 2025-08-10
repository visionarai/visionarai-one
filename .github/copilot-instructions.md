# Visionarai-one: AI Agent Coding Guide

## Big picture

- Nx monorepo (Yarn v4). One Next.js 15 App Router app: `apps/website` (depends on `libs/ui`, `libs/utils`, `domains/access-control`).
- Shared libs live in `libs/` (UI primitives + functional components, utilities). Business domains in `domains/` (e.g., `access-control` ABAC). Integrations in `packages/` (e.g., `connectors` for Mongoose/MongoDB).
- Styling: Tailwind v4 + shadcn/ui. Global styles at `libs/ui/src/globals.css` and imported by `apps/website/src/app/global.css`.
- i18n: `next-intl` with file-based locales in `messages/` and routing defined in `apps/website/src/i18n/routing.ts`.

## Developer workflows

- Run website locally: `yarn nx run @visionarai-one/website:dev` (continuous). Build: `yarn nx run @visionarai-one/website:build`. Start static: `yarn nx run @visionarai-one/website:serve-static`.
- Format/lint: `yarn format` / `yarn lint` (Ultracite). Pre-commit runs `ultracite format` (see `lefthook.yml`).
- Graph and housekeeping: `yarn dep-graph` (Nx graph), `yarn sync:project` (Nx sync), cleaning via `clean:*` scripts in root `package.json`.
- Some libs/domains use Vite for local dev/tests; see each package `vite.config.ts` and `vitest.workspace.ts` at repo root.

## Conventions and patterns

- Next.js app rules: use App Router, no direct `<img>` or `<head>`; prefer `next/image` and metadata APIs. Locale segment lives under `apps/website/src/app/[locale]/...`.
- TypeScript style: strict types, no enums (use unions or `as const`). Cross-package imports use TS path aliases from root `tsconfig.base.json`.
- UI library (`libs/ui`):
  - Primitives in `components/ui/*` are thin shadcn wrappers (Button, Input, Select, Dialog, Calendar, MultiSelect, etc.).
  - Functional components in `components/functional/*` (NavBar, Footer, ThemeSwitcher, Forms).
  - Forms: render from Zod metadata. Add `schema.describe(JSON.stringify(FieldMetadata))` or use `stringifyFieldMetadata` from `@visionarai-one/ui` to embed per-field UI config. `FormRenderer` auto-extracts fields and chooses widgets.
- Choice input heuristics (single vs multiple): Radio/Checkbox for small option sets, Select/Combobox/MultiSelect as options grow (see `ChoiceFormField`).
- Password inputs: enhanced field supports localized requirements; derive with helpers from `@visionarai-one/utils`.

## ABAC domain (domains/access-control)

- Policy evaluation: `evaluatePolicy` checks globalConditions and per-action conditions using operation handlers in `policy/operators.ts`.
- Repository factory: `createPolicyRepository(mongooseConnection)` loads latest MasterData and exposes `getPolicyById(id).isPermissionGranted(subject, resourceType, action)` with guardrails for allowed resource types.
- Subject schema supports dot-path fields like `subject._id`, `subject.currentWorkspaceId` (see `policy.zod.ts`). Extend via Master Data and policy schema if needed.

## Connectors (packages/connectors)

- Connector factory pattern with health checks. MongoDB connector built on Mongoose; instantiate via exported factory and manage lifecycle + health.

## Where things live

- App: `apps/website/src/app/[locale]/(public)/page.tsx`, `middleware.ts` (locale-aware), API routes under `apps/website/src/api/*`.
- i18n: `messages/*.json`, routing at `apps/website/src/i18n/routing.ts`.
- UI: `libs/ui/src/components/ui/*`, `libs/ui/src/components/functional/*`, re-exported via `libs/ui/src/index.ts`.
- Access control: `domains/access-control/src/policy/*`, `domains/access-control/src/master_data/*`, entrypoint `domains/access-control/src/index.ts`.

If anything above is unclear or you need more concrete examples (e.g., a minimal `FormRenderer` or ABAC check wiring), say which section to expand and I’ll refine it.
