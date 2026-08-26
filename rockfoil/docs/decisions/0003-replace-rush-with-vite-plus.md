---
status: accepted
date: "2026-08-26"
deciders: ['Rohan Bansal']
supersedes: "[ADR-0002](0002-use_rush.md)"
---

# Replace Rush with a pnpm workspace driven by Vite+

## Context and Problem Statement

[ADR-0002](0002-use_rush.md) chose Rush in 2022 because the team already knew it. Since then the repo's
toolchain has moved out from under it: builds are Vite, linting is oxlint, and Rush's own layers had
become a wrapper around pnpm rather than a thing anyone used directly. Rush also has no OIDC support, so
trusted publishing already ran through pnpm underneath it, and its pnpm 11 support was incomplete enough
that several config keys it generated were silently ignored.

The question was not whether to leave Rush, but what replaces each band it occupied: dependency
installation, the task graph, builds, type generation, formatting, and publishing.

## Considered Options

* **Vite+** over a plain pnpm workspace, with `tsc` + api-extractor for types, Oxfmt, and Changesets
* **Turborepo** for the task graph, everything else identical
* **Nx** for the task graph, everything else identical

## Decision Outcome

Chosen option: **Vite+**. Turborepo and Nx were each only a swap of the orchestration band — the other
five bands came out identical under all three — so neither offered anything to weigh against the fact
that Vite+ already ships the build, test, lint and format tools this repo had converged on separately.

Consequences:

* pnpm is the only package manager. Members are enumerated in `pnpm-workspace.yaml`; nothing is globbed.
* `vp run -r <script>` orders packages by the workspace dependency graph, replacing Rush's phase graph.
  A package joins a repo-wide task by *having* that script.
* Changesets replaces `rush change`, with all publishable packages in one `fixed` lockstep group.
* **Version consistency is the one thing lost.** `rush check` enforced a single SemVer range per
  dependency across every project and nothing in pnpm or Vite+ replaces it directly; pnpm catalogs are
  the intended successor.
