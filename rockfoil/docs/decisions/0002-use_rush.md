---
status: superseded
date: "2022-12-17"
deciders: ['Tyler Matteson']
consulted: ['Rohan Bansal']
superseded_by: "[ADR-0003](0003-replace-rush-with-vite-plus.md) — Rush replaced by a pnpm workspace driven by Vite+"
---

# Use Rush

> **Superseded.** Rush was removed in 2026; the repo is a plain pnpm workspace whose tasks run under
> Vite+. See [ADR-0003](0003-replace-rush-with-vite-plus.md). Nothing below still describes the build.

## Context and Problem Statement

As this project grows, it will benefit from a the monorepo-style modular approach. Many extensions and middlewares _could_ be implemented, many are desired, but in implementation its unlikely that one size will fit everyone.

## Considered Options

* Rush
* Lerna
* Others

## Decision Outcome

Chosen option: "Rush", because we already familiar with its use on other projects. Lerna is now deprecated. Other options exist and are documented at [https://monorepo.tools/](https://monorepo.tools/) and/or [https://github.com/korfuri/awesome-monorepo](https://github.com/korfuri/awesome-monorepo). Choosing a second monorepo manager was deemed not worth the time invested for essentially the same features and parallel, but distinct workflows.
