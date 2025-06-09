# Visionarai-one

## AI for Visionaries

Vision-one is the monorepo for all application in the [visionar.ai](https://visionar.ai) ecosystem. It is designed to be modular, scalable, and easy to maintain. The project is structured to support multiple applications and services, each with its own set of features and functionalities.

| Feature | Description |
| --- | --- |
| Monorepo Structure | Vision-One follows a true monorepo architecture with a single `package.json` at the root level that manages all dependencies and scripts for the entire project. |
| Package Manager | We use `pnpm` as the package manager for the entire project. All commands should be run using `pnpm` instead of `npm` or `yarn`. |
| Directory Structure | The project is organized into `apps/` for front-end applications and `libs/` for shared libraries and utilities. |
| Frontend Applications | All front-end applications use Tailwind CSS version 4.\* for styling and the shadcn/ui library for UI components. |
| Key Configuration Files | Important files include `nx.json`, `package.json`, `tsconfig.base.json`, `tsconfig.json`, `eslint.config.mjs`, and `.prettierrc.js` for configuration and code style. |
