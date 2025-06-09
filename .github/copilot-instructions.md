# Visionarai Project Copilot Instructions

**Objectives:** This document outlines the objectives and guidelines for the Copilot in the Visionarai project, the project structure, and the expected contributions from the Copilot.

We use the [nx](https://nx.dev/getting-started/intro) monorepo tool to manage our project structure.

Visionarai is a monorepo project for running all projects in the visionar.ai ecosystem. It is designed to be modular, scalable, and easy to maintain. The project is structured to support multiple applications and services, each with its own set of features and functionalities.

We use `yarn` as the package manager for the entire project. So all commands should be run using `yarn` instead of `npm` or `pnpm`.

## Monorepo Structure Explained

Visionarai follows a true monorepo architecture with a single `package.json` at the root level that manages all dependencies and scripts for the entire project.

## Directory Overview

1. **apps/**: Contains all the front-end applications in the Visionarai ecosystem.
2. **libs/**: Contains shared libraries and utilities that can be used across different front-end applications.

## Frontend Applications

- **tailwindcss v.4.\*:** All front-end applications use Tailwind CSS version 4.\* for styling.
- **shadcn/ui:** All front-end applications use the shadcn/ui library for UI components.
  - The [**ui**](../libs/ui) library is a shared library that contains the shadcn/ui components used across all front-end applications.
  - Use `yarn shadcn@latest add <component-name>` to add new components to the `ui` library.
  - New components land in the [`libs/ui/src/components/ui`](../libs/ui/src/components/ui) directory.
  - Use [@visionarai-one/ui index.ts file](../libs/ui/src/index.ts) to export components from the `ui` library, e.g. `export * from './components/ui/button';`.
  - Use these components by importing them from the `@visionarai-one/ui` package, e.g. `import { Button } from '@visionarai-one/ui';`.

## Additional Key Files in the Monorepo

In addition to the directory structure, the following files are critical for the monorepo's configuration and operation:

- [**nx.json**](../nx.json): Located at the root of the project, this file contains the NX workspace configuration, including project dependencies and task runners.
- [**package.json**](../package.json): Located at the root of the project, this file manages all dependencies and scripts for the entire monorepo.
- [**tsconfig.base.json**](../tsconfig.base.json): This file contains the base TypeScript configuration for the entire monorepo, ensuring consistent TypeScript settings across all projects.
- [**tsconfig.json**](../tsconfig.json): This file extends the base TypeScript configuration and is used for the root project settings.
- [**eslint.config.mjs**](../eslint.config.mjs): Configures linting rules for the entire workspace. **Ensure generated code adheres to these rules.**
- [**.prettierrc.js**](../.prettierrc.js): Configures Prettier for code formatting across the monorepo. **Ensure generated code adheres to these rules.**

## Formatting and Code Style

The monorepo uses Prettier for code formatting. The configuration is defined in the [`.prettierrc.js`](../.prettierrc.js) file. To format your code, run the following command:

```bash
yarn run format
```

**Always ensure code is formatted according to `.prettierrc.js` before finalizing suggestions.**

Make use of the NX MCP server and contex7 MCP server when needed.
