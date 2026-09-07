# Documentation Generation

This directory contains tools for generating API documentation from TypeScript source code.

## Quick Start

### Generate All Documentation (Individual + Aggregated)

```bash
# From repository root
node --run docs:full
```

This script:

1. Runs the repo-wide `docs` script to generate `api.md` files for all packages
2. Aggregates all `api.md` files to `nuxt/documentation/content/reference/` with frontmatter

### Generate Documentation for Specific Package

```bash
# From repository root
cd <package-folder>
node --run docs

# Or use the script directly
bash common/scripts/run-docs.sh <package-name>
```

### Aggregate Only (Skip Generation)

If you've already generated individual package docs and just want to aggregate:

```bash
bash common/scripts/run-docs.sh --aggregate
```

## Tools Overview

### `generate-docs.cjs`

Located in `tools/doc-gen/generate-docs.cjs`

- **Purpose**: Generates API documentation from TypeScript API Extractor models
- **Input**: `temp/<package-name>.api.json` (created by API Extractor during build)
- **Output**: `<package>/api.md`
- **Features**:
  - Extracts TSDoc comments with proper formatting
  - Generates markdown tables for functions, interfaces, types, etc.
  - Handles Vue components, classes, enums, and more
  - Fails loudly when the API model is missing, rather than overwriting `api.md` with a placeholder

### `docs-aggregate.mjs`

Located in `common/scripts/docs-aggregate.mjs`

- **Purpose**: Aggregates all package `api.md` files to `nuxt/documentation/content/reference/`
- **Features**:
  - Adds frontmatter (title/description) automatically
  - Creates placeholders for packages without docs
  - Handles package name normalization (underscore to hyphen)

### `run-docs.sh`

Located in `common/scripts/run-docs.sh`

- **Purpose**: Wrapper script that orchestrates documentation generation
- **Usage**:
  ```bash
  run-docs.sh <package-name>          # Generate for single package
  run-docs.sh --aggregate             # Aggregate all docs
  run-docs.sh <package> --aggregate   # Generate + aggregate
  ```

### `docs-full.sh`

Located in `common/scripts/docs-full.sh`

- **Purpose**: Complete workflow script that generates all docs and aggregates
- **Called by**: the root `docs:full` script
- **Steps**:
  1. Generates all individual package docs
  2. Runs aggregation to copy to `nuxt/documentation/content/reference/`

## Package Configuration

Each package should have a `docs` script in `package.json`:

```json
{
  "scripts": {
    "docs": "bash ../common/scripts/run-docs.sh <package-folder-name>"
  }
}
```

The `build` script should also call `node --run docs`:

```json
{
  "scripts": {
    "build": "rm -rf dist && tsc -b --force && api-extractor run --local -c config/api-extractor.json && vite build && node --run docs"
  }
}
```

## Repo-wide Commands

### `node --run docs`

Runs `vp run -r docs`, which invokes each package's `docs` script in dependency order and skips
packages that define none.

**When to use**: Generate docs for all packages (but don't aggregate yet)

### Why the root `build` filters instead of using `-r`

The workspace root is itself a member, and it has a script named `build`, so `vp run -r build`
selects the root and runs the root's own `build` script a second time. The inner `vp run` plans no
tasks, but the `&& run-docs.sh --aggregate` after it still executes: aggregation ran twice per
build, once part-way through against the previous run's `api.md` files.

`--filter '!stonecrop-monorepo'` selects the same packages without the root. Do not "simplify" it
back to `-r`, and note that the two cannot be combined. If the root package is ever renamed the
filter stops excluding anything, which is not merely a return to the old behaviour: `-r` has a
recursion guard that `--filter` does not, so the root's script re-runs the whole workspace and the
task count goes from 57 to 115.

The same collision exists for `docs`, `lint`, `test` and `test:types`, where it costs one no-op
process rather than duplicated work, because none of them chain a second command.

### Full Documentation Generation

To generate and aggregate all documentation, run:

```bash
node --run docs:full
```

## Integration with the Docs Site

The docs are aggregated to `nuxt/documentation/content/reference/`, where the Nuxt + @nuxt/content
docs site (`nuxt/documentation/`) serves them:

```bash
# After generating docs
pnpm --filter @stonecrop/nuxt run generate:documentation    # Static-build the docs site
pnpm --filter @stonecrop/nuxt run dev:documentation         # Development server with hot reload
```

The site's script is named `generate:documentation`, not `build`. A package opts into the repo-wide
build by defining `build` (as a `vite.config.ts` task in the libraries, or a package.json script
in the Nuxt modules), so naming it `build` would render the whole site on every `node --run build`,
including inside the pre-commit hook. Aggregation is the last step of the root `build` instead, so
the reference tree is current without the site being rendered.

## Workflow Examples

### Developer working on single package

```bash
cd aform
node --run docs    # Generate api.md for aform only
```

### Before committing changes

The pre-commit hook builds and stages `nuxt/documentation/content/reference/` automatically. To do it by hand:

```bash
node --run docs:full
git add -u
git commit -m "Update API documentation"
```

### CI/CD Pipeline

```bash
# Generate all docs as part of build
node --run build    # from the repo root; each package's build runs its own docs step

# Before deploying docs site
pnpm --filter @stonecrop/nuxt run generate:documentation    # the build above already aggregated
```

## Troubleshooting

### Docs not generated for a package

1. Ensure the package has a `docs` script in `package.json`
2. Check that API Extractor ran during build (`pnpm exec vp run build` in the package)
3. Verify `temp/<package-name>.api.json` exists
4. Check for TypeScript errors that might prevent API extraction

### Aggregation not finding api.md files

1. Run `node --run docs` first to generate individual files
2. Check package folder names match configuration in `docs-aggregate.mjs`
3. Look for api.md files in package root directories

### Frontmatter not added correctly

The aggregation script automatically adds frontmatter (title/description). If you see issues:

1. Check `docs-aggregate.mjs` for the package configuration
2. Verify the package is listed in the `packages` array
3. Ensure title and description are correct

## Architecture Notes

The documentation generation is a two-phase process:

1. **Generation Phase**: Each package independently generates its `api.md` from TypeScript source during build
2. **Aggregation Phase**: All `api.md` files are copied to a central location with frontmatter

This separation allows:

- Fast incremental docs for single packages
- Parallel generation across packages
- Single source of truth (package folder) for API docs
- Automatic aggregation for documentation site deployment
