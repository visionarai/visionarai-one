# Visionarai-one: AI Agent Coding Guide

## Project Architecture

- **Monorepo**: Managed by Nx (`nx.json`), with a single root `package.json` and Yarn v4. All commands should use `yarn`.
- **Directory Structure**:
  - `apps/`: Frontend Next.js apps (e.g., `apps/website`)
  - `libs/`: Shared React UI components (`ui/`), utilities (`utils/`)
  - `domains/`: Domain-driven modules (e.g., `access-control` for ABAC)
- **Styling**: Tailwind CSS v4 and shadcn/ui. Global styles in `libs/ui/src/globals.css` and imported in app-level `global.css`.
- **i18n**: Uses `next-intl` with locale-aware routing and translation files in `messages/`.
- **TypeScript**: Strict, with shared configs in `tsconfig.base.json` and per-app overrides.

## Developer Workflows

- **Build/Test/Lint**: Use Nx tasks (e.g., `yarn nx build <project>`, `yarn nx test <project>`, `yarn nx lint <project>`). See `package.json` scripts for helpers.
- **Formatting**: Enforced by `ultracite format` (see `lefthook.yml` for pre-commit hooks).
- **Dependency Graph**: Visualize with `yarn nx dep-graph`.
- **Vite**: Used for local dev in some domains/libs (see `vite.config.ts`).

## Conventions & Patterns

- **UI**: All UI primitives and forms are in `libs/ui/src/components/ui/` and `libs/ui/src/components/functional/`.
- **Forms**: Use Zod schemas and metadata for validation and rendering (see `FormRenderer`).
- **No direct `<img>` in Next.js apps**: Use Next.js image components.
- **No direct `<head>` usage**: Use Next.js metadata APIs.
- **No TypeScript enums**: Use union types or `as const` arrays.
- **Accessibility**: Follow strict ARIA and accessibility rules (see below).

## Integration Points

- **External**: Integrates with `next-intl`, `shadcn/ui`, `lucide-react`, and Radix UI primitives.
- **Internal**: Cross-app/lib imports use path aliases defined in `tsconfig.json`.
