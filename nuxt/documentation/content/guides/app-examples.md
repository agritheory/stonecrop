---
title: App Examples
description: Full working Nuxt applications demonstrating Stonecrop end-to-end
---

# App Examples

The documentation site includes a unified **public playground** at [`/playground`](/playground) — one Desktop shell, two backends:

## Workflow (local grafserv)

- **Grafserv backend** — custom GraphQL server with Stonecrop APIs (`stonecropRecord`, `stonecropRecords`, `stonecropAction`)
- **Session-scoped data** — each visitor gets isolated ephemeral in-memory stores (Users/Orders)
- **Rail panels** — ActionSet slots on order records (chat, email, files, approvals, reports)
- **DocBuilder** — public doctype prototyping at [`/docbuilder`](/docbuilder)
- **GraphiQL** — interactive API explorer at [`/graphql/`](/graphql/)

Browse at [`/playground/order`](/playground/order) and [`/playground/user`](/playground/user).

## Countries (live GraphQL API)

Doctypes **introspected from** [countries.trevorblades.com](https://countries.trevorblades.com/graphql), browsed through the same Desktop shell:

- [`/playground/country`](/playground/country) — list + detail (e.g. [`/playground/country/US`](/playground/country/US))
- [`/playground/continent`](/playground/continent)
- [`/playground/language`](/playground/language)

Hand-authored workflow fixtures (`issue`, `assignment`) are available in DocBuilder only — the countries API is read-only.

## Run locally

From the repository root:

```bash
pnpm --filter @stonecrop/nuxt run dev:documentation
```

Then open [http://localhost:3002/playground](http://localhost:3002/playground).

## Related Documentation

- [Setting Up the GraphQL Middleware](./graphql-middleware-setup) — The middleware the countries section builds on
- [Doctypes](/explanation/doctype) — The document type system the playground is built around
- [nuxt-grafserv](/reference/nuxt-grafserv) — Grafserv module configuration reference
