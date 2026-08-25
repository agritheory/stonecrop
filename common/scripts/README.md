# Documentation Generation

This directory contains tools for generating API documentation from TypeScript source code.

## Quick Start

### Generate All Documentation (Individual + Aggregated)

```bash
# From repository root
bash common/scripts/docs-full.sh
```

This script:
1. Runs `rush docs` to generate `api.md` files for all packages
2. Aggregates all `api.md` files to `docs/reference/` with VitePress frontmatter

**Note**: This must be run directly as a bash script (not through `rush docs:full`) to avoid Rush lock conflicts.

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
  - Graceful handling of packages without API exports

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
- **Called by**: `rush docs:full` command
- **Steps**:
  1. Runs `rush docs` to generate all individual package docs
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

The `_phase:build` script should also call `node --run docs`:

```json
{
  "scripts": {
    "_phase:build": "rm -rf dist && tsc -b --force && api-extractor run --local -c config/api-extractor.json && vite build && node --run docs"
  }
}
```

## Rush Commands

### `rush docs`

Bulk command that runs `rushx docs` in each package in parallel.

**When to use**: Generate docs for all packages (but don't aggregate yet)

### Full Documentation Generation

To generate and aggregate all documentation, run:

```bash
bash common/scripts/docs-full.sh
```

**Note**: This cannot be run as a Rush command due to lock conflicts when calling `rush docs` recursively.

## Integration with VitePress

The docs are aggregated to `docs/reference/` where VitePress can serve them:

```bash
# After generating docs
cd docs
rushx build    # Build VitePress site (includes aggregation)
rushx dev      # Development server with hot reload
```

## Workflow Examples

### Developer working on single package

```bash
cd aform
rushx docs    # Generate api.md for aform only
```

### Before committing changes

```bash
bash common/scripts/docs-full.sh    # Ensure all docs are up to date
git add -u
git commit -m "Update API documentation"
```

### CI/CD Pipeline

```bash
# Generate all docs as part of build
rush build    # This calls rushx docs for each package

# Before deploying docs site
bash common/scripts/docs-full.sh    # Ensure aggregation is current
cd docs
rushx build       # Build VitePress site
```

## Troubleshooting

### Docs not generated for a package

1. Ensure the package has a `docs` script in `package.json`
2. Check that API Extractor ran during build (`rushx build`)
3. Verify `temp/<package-name>.api.json` exists
4. Check for TypeScript errors that might prevent API extraction

### Aggregation not finding api.md files

1. Run `rush docs` first to generate individual files
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
- Parallel generation using Rush's build system
- Single source of truth (package folder) for API docs
- Automatic aggregation for documentation site deployment
