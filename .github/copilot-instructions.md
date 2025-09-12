## Visionarai-one: Focused Coding Guide for AI Agents

Concise project intelligence so you can contribute immediately. Keep edits minimal, type-safe, and aligned with existing patterns.

### 1. Architecture Snapshot

- Nx (v21) + Yarn 4 workspaces. Core Next.js 15 App Router app: `apps/website`.
- Shared concerns: `libs/ui` (shadcn wrappers + form system), `libs/utils` (DOM + password helpers), domain logic in `domains/access-control` (ABAC), integrations in `packages/connectors` (connector factory + MongoDB).
- i18n via `next-intl`: locale segment `[locale]` in `apps/website/src/app/[locale]/...`; messages in `messages/*.json`.
- Styling: Tailwind v4. Global CSS chain: `libs/ui/src/globals.css` -> imported by `apps/website/src/app/global.css`.

### 2. Essential Workflows

- Dev server: `yarn nx run @visionarai-one/website:dev` (App Router).
- Build / static preview: `yarn nx run @visionarai-one/website:build` then `...:serve-static`.
- Lint / format (Ultracite): `yarn lint` / `yarn format` (auto-run via lefthook pre-commit).
- Sync Nx metadata: `yarn sync:project`; visualize deps: `yarn dep-graph`.
- Clean (destructive): `yarn clean:all` (reinstalls). Use sparingly.

### 3. TypeScript & Code Style Conventions

- Strict TS; avoid enums -> use unions or `as const`. Do not add loose `any`.
- Cross-package imports rely on path aliases from `tsconfig.base.json` (e.g., `import { FormRenderer } from '@visionarai-one/ui'`).
- Prefer functional, stateless components; keep side-effects at boundaries (API routes, connector factories).
- No direct `<img>`/`<head>`; use `next/image` + metadata APIs.

### 4. UI & Form System (libs/ui)

- Primitives: thin wrappers under `components/ui/*` (match shadcn API names).
- Functional components under `components/functional/*` (e.g., NavBar, Footer, ThemeSwitcher, FormRenderer, field-level inputs).
- Form rendering contract: embed JSON field metadata via `schema.describe(stringifyFieldMetadata({...}))`; `FormRenderer` inspects schema and auto-picks widgets.
- Choice heuristics (single): <5 RadioGroup, 5–9 Select, >=10 Combobox. (multiple): <10 Checkbox group, >=10 MultiSelect.
- Password field: localized requirements provided by helpers in `@visionarai-one/utils` (`getPasswordRequirements`, `passwordZod`).

### 5. ABAC Domain (domains/access-control)

- Policy evaluation in `policy-evaluator.ts` using operation handlers in `policy/operators.ts`.
- `createPolicyRepository(connection)` -> `getPolicyById(id).isPermissionGranted(subject, resourceType, action)`; guards allowed resource types.
- Subject attributes support dot-paths (see `policy.zod.ts`). Extend by updating master data & schema together.

### 6. Connectors (packages/connectors)

- Factory pattern: create connector -> `connect()` returns info with `healthCheck()`; `disconnect()` for cleanup.
- MongoDB connector wraps Mongoose lifecycle; ensure proper teardown in tests or server shutdown.

### 7. File/Directory Landmarks

- App routes & layouts: `apps/website/src/app/[locale]/(public|private)`.
- API routes: `apps/website/src/api/*`.
- i18n helpers: `apps/website/src/i18n/{routing,navigation}.ts`.
- UI exports: `libs/ui/src/index.ts` (re-export primitives + functional components).
- ABAC internals: `domains/access-control/src/policy/*`, master data in `master_data/*`.

### 8. Safe Change Guidelines

- When adding form fields: update Zod schema + metadata; let `FormRenderer` choose component—avoid hardcoding field components unless customizing.
- When extending ABAC: add operator in `operators.ts` + tests; update schema typings if new subject/resource attributes.
- When adding a connector: implement factory, expose in `src/lib`, export via package `index.ts`; include health check.
- Avoid introducing new global styles—extend existing utility classes or component styles.

### 9. Quick Example (Form Field Metadata)

```ts
email: z.string()
  .email()
  .describe(
    stringifyFieldMetadata({
      name: "email",
      type: "email",
      label: "Email",
      placeholder: "you@example.com",
    })
  );
```

### 10. Ask / Iterate

If intent is ambiguous (new operator? new field type?), emit a short assumption note before coding. Keep edits narrow and reference impacted files explicitly.

---

Need more detail (e.g., policy operator contract, connector health shape, or adding a new choice heuristic)? Reply with the section name and I’ll expand it.
