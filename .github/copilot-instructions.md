## Visionarai-one: High-Signal Guide for AI Coding Agents

Deliver changes that fit existing patterns. Keep diffs small, typed, and localized. Prefer enhancing existing modules over new abstractions.

### 1. Architecture (Orient Fast)

- Monorepo: Nx 21 + Yarn 4 (strict). Core Next.js 15 App Router app `apps/website` consumes shared libs.
- Shared libs: `libs/ui` (shadcn + metadata-driven form system), `libs/utils` (DOM + password helpers), `domains/abac` (ABAC evaluator), `packages/connectors` (connector factory + MongoDB/Mongoose).
- i18n: `next-intl` with required `[locale]` segment: `apps/website/src/app/[locale]/...`; messages in `messages/*.json`.
- Styling: Tailwind v4; only global entry is `libs/ui/src/globals.css` imported once by `apps/website/src/app/global.css`.

### 2. Core Workflows

- Dev: `yarn nx run @visionarai-one/website:dev`.
- Build + static preview: `yarn nx run @visionarai-one/website:build` then `yarn nx run @visionarai-one/website:serve-static`.
- Lint / format: `yarn lint` / `yarn format` (lefthook enforces on commit).
- Project sync / graph: `yarn sync:project`, `yarn dep-graph`.
- Tests (where defined): `yarn nx run <project>:test` (e.g. `abac:test`).
- Avoid `yarn clean:all` unless cache or deps corrupt (destructive reinstall).

### 3. TypeScript & Conventions

- Strict TS; avoid `any`, avoid enums (use union literals + `as const`).
- Cross-package imports via path aliases (`tsconfig.base.json`), e.g.: `import { FormRenderer } from '@visionarai-one/ui'`.
- UI components functional + side-effect free; confine side-effects to API routes, connector factories, or explicit server modules.
- Use `next/image` & metadata API instead of raw `<img>` or `<head>`.

### 4. UI & Form System

- Primitives: `libs/ui/src/components/ui/*`—mirrors shadcn API (thin wrappers, keep behavior minimal).
- Functional: `components/functional/*` (NavBar, Footer, ThemeSwitcher, FormRenderer, field-level form inputs).
- Form contract: embed field metadata via `schema.describe(stringifyFieldMetadata({...}))`; `FormRenderer` auto-selects widget.
- Choice heuristics: single (<5 RadioGroup, 5–9 Select, >=10 Combobox); multiple (<10 Checkbox group, >=10 MultiSelect).
- Password helpers from `@visionarai-one/utils` (`getPasswordRequirements`, `passwordZod`). Don’t reimplement complexity rules.

### 5. Access Control (ABAC)

- Core logic: `domains/abac/src/policy/*` (evaluator, operators, schemas).
- Repository: `createPolicyRepository(connection)` → `getPolicyById(id).isPermissionGranted(subject, resourceType, action)`.
- Extend operators: add in `operators.ts` + update related schema/types; include targeted tests.
- Subject/resource attributes use dot-paths—keep schema + master data aligned.

### 6. Connectors

- Pattern: factory returns connector with `connect()`, `disconnect()`, and `healthCheck()` via returned info object.
- MongoDB: Mongoose wrapper; ensure proper teardown (avoid leaking connections in tests or dev).
- New connector: implement in `src/lib/`, export in package `index.ts`, supply health details (`status`, `connected`, optional diagnostics).

### 7. File Landmarks

- Routes (localized): `apps/website/src/app/[locale]/(public|private)`.
- i18n helpers: `apps/website/src/i18n/{routing,navigation}.ts`.
- API / RPC: `apps/website/src/app/api/*`, `src/app/rpc/*` (if present) – keep server boundaries clear.
- ABAC: `domains/abac/src/policy/` & `.../master_data/`.
- UI exports: `libs/ui/src/index.ts` re-exports all primitives + functional components.

### 8. Safe Change Playbook

- Add form field: update Zod schema + metadata; let `FormRenderer` pick control (only override if necessary).
- New operator (ABAC): implement in `operators.ts`, update schema/types, add minimal test; avoid breaking existing operator contracts.
- New connector: follow existing factory shape; include `healthCheck` returning stable shape.
- Styling: extend via component-level classes; do not add new global CSS files.
- Localization: add `messages/<locale>.json` and ensure new routes live under `[locale]` segment.

### 9. Example (Field Metadata)

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

### 10. Collaboration Protocol

- If intent is ambiguous (e.g., “add policy condition”), state 1–2 assumptions before edits.
- Keep diffs minimal: only touched regions; no broad reformatting.
- Reference impacted files explicitly in summaries.

Need deeper detail (operator contract, password requirement integration, connector health schema)? Ask with the section title.
