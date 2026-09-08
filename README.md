# Stonecrop

![PR Checks](https://github.com/agritheory/stonecrop/actions/workflows/pr.yml/badge.svg)

This repository contains all the packages used in the Stonecrop project. It is a [pnpm](https://pnpm.io/) workspace whose tasks are run by [Vite+](https://viteplus.dev).

### What is it?

These packages in combination create an application that creates a schema driven UI and system of event driven hooks (actual hooks, not the React kind which are not hooks at all). These are available in both the UI and as server middleware.

### Getting Started

This project has the following system dependencies:

- [`pnpm`](https://pnpm.io/) (using yarn or npm will break packages). The version is pinned in the root
  `package.json`, so `corepack enable` is enough to get the right one.
- Node 24 or newer ([installation instructions](https://nodejs.org/en/download/package-manager))

```bash
git clone stonecrop
# or
git pull

# install dependencies
cd stonecrop
pnpm install
pnpm run build

# Work on aform, for example
cd aform
pnpm run test
```

The Nuxt apps import each package's built `dist`, so editing a package's `src` while a dev server
runs changes nothing on screen. Rebuild the package instead and the open page updates itself; there
is no need to restart the server.

```bash
# One terminal: serve the playground
pnpm --filter @stonecrop/nuxt run dev

# Another: rebuild on every save, which the running server picks up. Name only the packages you
# are editing; `--parallel` is required, or several filters run one after another and you silently
# get just the last one.
pnpm --parallel --filter @stonecrop/aform run dev
```

A dependency never needs its own watcher: the packages are rollup externals to each other, so
editing `schema` means rebuilding `schema` alone even though `aform` and `desktop` use it. Starting
all of them at once is worse than useless, because they clear each other's `dist` on startup and a
package that resolves types from a sibling fails to compile.

`dev` reruns only the bundle step, not `vue-tsc`, API Extractor or `api.md`. The app sees your
changes, but declarations stay stale until a full `pnpm run build`.

```bash

# sometimes, when changing branches or updating dependencies you may have issues
# this removes and re-links all dependencies
pnpm install --force

# Rebuild everything, ignoring the task cache
pnpm run build --no-cache

# When a cached result is itself wrong; --no-cache skips the cache, it does not repair it
pnpm exec vp cache clean

# Describe a release-worthy change; one file per reason, since its body becomes the changelog entry
pnpm exec changeset

# Lint and format the whole workspace
pnpm run lint
pnpm run format
```

### Projects

- [`@stonecrop/aform`](./aform/CHANGELOG.md) — Schema-driven form components with validation
- [`@stonecrop/atable`](./atable/README.md) — Advanced data table with Excel-like navigation and editing
- [`@stonecrop/beam`](./beam/README.md) — UI component library with consistent theming
- [`@stonecrop/casl-middleware`](./casl_middleware/README.md) — CASL-based authorization middleware
- [`@stonecrop/code-editor`](./code_editor/CHANGELOG.md) — Code editor component
- [`@stonecrop/desktop`](./desktop/README.md) — Desktop-specific UI patterns and command palette
- [`@stonecrop/graphql-client`](./graphql_client/README.md) — Vue composables for GraphQL data fetching
- [`@stonecrop/graphql-middleware`](./graphql_middleware/README.md) — GraphQL query/mutation middleware using doctype schemas
- [`@stonecrop/node-editor`](./node_editor/README.md) — Visual FSM editor with Vue Flow integration
- [`@stonecrop/nuxt-grafserv`](./nuxt_grafserv/README.md) — PostGraphile/Grafserv integration for Nuxt
- [`@stonecrop/nuxt`](./nuxt/README.md) — Nuxt module: schema-driven routing, pages, and layouts
- [`@stonecrop/rockfoil`](./rockfoil/CHANGELOG.md) — GraphQL authorization server
- [`@stonecrop/schema`](./schema/README.md) — Doctype and field schema definitions, naming utilities, and GraphQL → doctype converter
- [`@stonecrop/stonecrop`](./stonecrop/README.md) — Core orchestration: Registry, HST state management, and workflow engine
- [`@stonecrop/themes`](./themes/README.md) — The shared `--sc-*` CSS token floor
- [`@stonecrop/utilities`](./utilities/README.md) — Shared helper functions and type utilities
