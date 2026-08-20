---
title: App Examples
description: Full working Nuxt applications demonstrating Stonecrop end-to-end
---

# App Examples

These are full, runnable Nuxt applications wiring several Stonecrop packages together — the shape of a real app built on the framework, not just a piece of one.

> **Coming Soon**
>
> Walkthroughs are planned for the two example apps already in the monorepo (`nuxt/playground/` and `nuxt/fullstack/`):
>
> - **Playground** (`nuxt/playground/`) — doctypes introspected from a live GraphQL API, browsed through the generic Desktop shell, and refined in the built-in DocBuilder. Covers the `stonecrop-schema generate` CLI, the DocBuilder workflow, and `@stonecrop/nuxt`'s generic `routeStrategy` list/detail pages.
> - **Fullstack** (`nuxt/fullstack/`) — `nuxt-grafserv` wired up with every middleware package (`@stonecrop/graphql-middleware`, `@stonecrop/casl-middleware`) alongside the Stonecrop frontend, as a complete users/orders application.
>
> Until then, both apps can be run directly from the `nuxt/` package root — `rushx dev` for Playground, `rushx dev:full` for Fullstack.

## Related Documentation

- [Setting Up the GraphQL Middleware](./graphql-middleware-setup) — The middleware Fullstack builds on
- [Doctypes](/explanation/doctype) — The document type system both example apps are built around
