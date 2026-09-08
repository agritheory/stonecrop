# Workspace scripts

This directory holds the scripts the workspace runs outside any one package: the build wrapper, the dependency, publish and trusted-publishing checks, and the documentation pipeline. The rest of this file covers the documentation pipeline, which generates API reference from TypeScript source.

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
bash tools/scripts/run-docs.sh <package-name>
```

### Aggregate Only (Skip Generation)

If you've already generated individual package docs and just want to aggregate:

```bash
bash tools/scripts/run-docs.sh --aggregate
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

Located in `tools/scripts/docs-aggregate.mjs`

- **Purpose**: Aggregates all package `api.md` files to `nuxt/documentation/content/reference/`
- **Features**:
  - Adds frontmatter (title/description) automatically
  - Creates placeholders for packages without docs
  - Handles package name normalization (underscore to hyphen)

### `run-docs.sh`

Located in `tools/scripts/run-docs.sh`

- **Purpose**: Wrapper script that orchestrates documentation generation
- **Usage**:
  ```bash
  run-docs.sh <package-name>          # Generate for single package
  run-docs.sh --aggregate             # Aggregate all docs
  run-docs.sh <package> --aggregate   # Generate + aggregate
  ```

### `docs-full.sh`

Located in `tools/scripts/docs-full.sh`

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
    "docs": "bash ../tools/scripts/run-docs.sh <package-folder-name>"
  }
}
```

Generating `api.md` is the last step of each package's `build`, which is a Vite+ task rather than a
package.json script. `buildTask()` in `tools/vite/build-task.ts` defines it for every package, so a
new package inherits the step by calling that helper from its `vite.config.ts`:

```ts
export default defineConfig({
  run: { tasks: buildTask('vue-tsc') },
})
```

`vite build` runs first so `emptyOutDir` clears `dist`. A leading `rm -rf dist` is its own cached
sub-task, and a cache hit replays a snapshot instead of deleting, which ships stale chunks.

## Repo-wide Commands

### `node --run docs`

Runs `vp run -r docs`, which invokes each package's `docs` script in dependency order and skips
packages that define none.

**When to use**: Generate docs for all packages (but don't aggregate yet)

### Why the root build guards on `VP_RUN`, and aggregation is a task

The workspace root is itself a member, so a root script sharing a name with a per-package task
gets selected by `vp run -r <name>` and runs itself again. A bare `vp run` recognises the nesting
and plans nothing, which is why `docs`, `lint`, `test` and `test:types` can keep their names. Two
things break that:

- Anything chained after the inner run with `&&` executes twice. Aggregation was chained that way
  and ran twice per build, the first time part-way through against the previous run's `api.md`.
- Anything that is not a `vp run` gets no such recognition. A wrapper script re-entered as a task
  starts a second run inside the first, which planned 19 of the 58 tasks and killed four of them
  with "Failed to spawn process: Invalid argument".

So `run-build.mjs` exits immediately when `VP_RUN` is set, which Vite+ exports into every task's
environment alongside the IPC socket path the nested run would otherwise inherit. Any future
wrapper on a colliding script name needs the same first line.

Aggregation is a task in `tools/doc-gen` that `dependsOn` every package supplying an `api.md`. The
graph orders it after them, it caches on those files, and it runs exactly once.

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
in `themes`), so naming it `build` would render the whole site on every `node --run build`,
including inside the pre-commit hook. Aggregation is doc-gen's own task instead, so the reference
tree is current without the site being rendered.

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
2. Check package folder names match the entries in `doc-packages.mjs`
3. Look for api.md files in package root directories

### Frontmatter not added correctly

The aggregation script automatically adds frontmatter (title/description). If you see issues:

1. Check `doc-packages.mjs` for the package configuration
2. Verify the package is listed in the `docPackages` array
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
