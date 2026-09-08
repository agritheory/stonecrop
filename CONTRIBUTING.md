# Contributing

Setup is in the [README](./README.md). This file covers working in the repo once it builds.

## Working on a package

The Nuxt apps import each package's built `dist`, so editing a package's `src` while a dev server runs changes nothing on screen. Rebuild the package and the open page updates itself, with no need to restart the server.

```bash
# One terminal: serve the playground
pnpm --filter @stonecrop/nuxt run dev

# Another: rebuild the package you are editing, on every save
pnpm --parallel --filter @stonecrop/aform run dev
```

- Name only the packages you are editing. `--parallel` is required whenever more than one is named, or the filters run one after another and only the last one starts.
- Do not start every package's watcher at once. They clear each other's `dist` on startup, and a package that resolves types from a sibling then fails to compile.
- A dependency does not need its own watcher. The packages are rollup externals to each other, so editing `schema` means rebuilding `schema` alone even though `aform` and `desktop` use it.
- `dev` reruns the bundle step only. Declarations, the API report and `api.md` stay stale until a full `pnpm run build`.

## Commands

```bash
# Lint and format the whole workspace
pnpm run lint
pnpm run format

# Rebuild everything, ignoring the task cache
pnpm run build --no-cache

# When a cached result is itself wrong. `--no-cache` skips the cache, it does not repair it
pnpm exec vp cache clean

# When changing branches or updating dependencies leaves the tree inconsistent
pnpm install --force
```

Flags go before the task name in a `vp run`. Anything after it is passed to the task itself, so `vp run -r build --no-cache` runs `vite build --no-cache`, which clears every `dist` and then fails.

Always build through `pnpm run build`, never `vp run -r build` directly. `dev:prepare` leaves `nuxt/dist/runtime` as a symlink into `nuxt/src/runtime`, and a warm cache replays real files through it, overwriting tracked sources with generated output. `pnpm run build` removes that symlink first; a bare `vp run` does not, and the damage looks like an unexplained diff across several `.vue` files.

## Changesets

A changeset is a short note describing a change worth releasing. Add one in the same commit as the change it describes.

```bash
# Pick the packages and a bump level, then write the summary
pnpm exec changeset

# The same thing in one line
pnpm exec changeset --minor @stonecrop/aform -m "What changed, in one sentence"

# For a change that releases nothing
pnpm exec changeset --empty
```

That writes a file to `.changeset/`, which you can equally well write by hand:

```markdown
---
'@stonecrop/aform': minor
---

What changed, in one sentence.
```

- One file per reason, not per package or per commit. Every package the file names shares its summary, so two reasons need two files.
- All publishable packages are one lockstep group, so the bump level applies to every one of them. Naming a package decides whose changelog gets your summary, not who gets released.
- `git add` new files before running it. It finds changed packages with `git diff`, which does not report untracked files, so a new file's package is offered as unchanged.
- It compares against the merge base with `development`. On a branch that has diverged far every package reads as changed, so pass `--since` a nearer ref when the grouping stops being useful.
- CI fails when a pull request changes packages and has no changeset at all. It does not check that the package you touched has one.

## Releases

- Merging to `development` runs the publish workflow: it versions the packages, writes the changelogs, publishes to npm and pushes tags.
- `changeset version` consumes the files in `.changeset/`, so a changeset lives only until the next release. The changelog entry is what survives.
- Every publishable package comes out on the same version, whichever packages the changesets named.
