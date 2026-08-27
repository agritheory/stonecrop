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
2. Aggregates all `api.md` files to `docs/reference/` with VitePress frontmatter

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

- **Purpose**: Aggregates all package `api.md` files to `docs/reference/`
- **Features**:
  - Adds VitePress frontmatter automatically
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
  2. Runs aggregation to copy to `docs/reference/`

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

### Full Documentation Generation

To generate and aggregate all documentation, run:

```bash
node --run docs:full
```

## Integration with VitePress

The docs are aggregated to `docs/reference/` where VitePress can serve them:

```bash
# After generating docs
vp -C docs run build:site
vp -C docs run dev
```

The site's build script is named `build:site`, not `build`. A package opts into the repo-wide
build by defining `build` — as a `vite.config.ts` task in the libraries, or a package.json script
in the Nuxt modules — so naming it `build` would rebuild the whole VitePress site on every
`node --run build`, including inside the pre-commit hook. Aggregation into `docs/reference/`
happens inside `build:site`, and the pre-commit hook runs it separately.

## Workflow Examples

### Developer working on single package

```bash
cd aform
node --run docs    # Generate api.md for aform only
```

### Before committing changes

The pre-commit hook aggregates and stages `docs/reference/` automatically. To do it by hand:

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
vp -C docs run build:site    # aggregates, then builds the VitePress site
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

The aggregation script automatically adds VitePress frontmatter. If you see issues:

1. Check `docs-aggregate.mjs` for the package configuration
2. Verify the package is listed in the `packages` array
3. Ensure title and description are correct

## Architecture Notes

The documentation generation is a two-phase process:

1. **Generation Phase**: Each package independently generates its `api.md` from TypeScript source during build
2. **Aggregation Phase**: All `api.md` files are copied to a central location with VitePress frontmatter

This separation allows:

- Fast incremental docs for single packages
- Parallel generation across packages
- Single source of truth (package folder) for API docs
- Automatic aggregation for documentation site deployment
