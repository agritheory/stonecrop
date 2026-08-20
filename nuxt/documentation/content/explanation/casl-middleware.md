---
title: CASL Middleware
description: Architecture and design of @stonecrop/casl-middleware
---

# CASL Middleware

This document explains how `@stonecrop/casl-middleware` works and why it is built the way it is. If you want step-by-step setup instructions, see [Setting Up the CASL Middleware](../guides/casl-middleware-setup.md).

## Two integration points, not one

The package ships two genuinely different ways to enforce authorization, because it targets two genuinely different execution models.

`createCaslMiddleware` wraps an ordinary GraphQL resolver — a function called at request time with resolved arguments, where an `await` and a thrown `GraphQLError` behave exactly as you'd expect. This is the right shape for a conventional resolver-per-field GraphQL server (e.g. graphql-yoga), and it's what the test suite exercises directly: call the wrapped function with a mock `resolve`, `context`, and `info`, and assert it either calls through or throws.

`pglCaslPlugin` targets [PostGraphile](/reference/graphql-middleware)'s Grafast query-planning engine instead, where — as explained in [GraphQL Middleware](./graphql-middleware)'s own architecture notes — fields are Grafast *plan steps*, not resolvers, built during planning rather than executed per-request. A `resolve`-wrapping middleware has no meaningful hook into that model: there is no `resolve` function to wrap, only a plan function that returns step objects synchronously. This is why `pglCaslPlugin` is a separate plugin composed into the same PostGraphile preset as `@stonecrop/graphql-middleware`'s own plugin, rather than a configuration option on `createCaslMiddleware` — the two enforcement points can't share one implementation without one side faking the other's execution model, the same tension `graphql-middleware`'s own explanation describes for a promise-based `DataAdapter`.

## Field and conditions matching is intentionally simple

CASL's `PureAbility` needs a `fieldMatcher` and `conditionsMatcher` to evaluate rules — functions that decide whether a requested field or a record's values satisfy a rule's constraints. The middleware's matchers (in `ability.ts`) do plain array-membership and strict-equality checks, not a query language. This is a real limit, not an oversight still to be filled in: CASL's more expressive matchers (e.g. MongoDB-style query operators) are a deliberate choice to add later if a rule genuinely needs `$gt`/`$in`-style conditions — until then, the simple matchers keep rule evaluation easy to reason about and fast, at the cost of only supporting equality-shaped conditions.

## The ability builder is a function, not a config format

`createAbility(user, builderFn)` takes a plain function — `AbilityBuilderFunction` — rather than a declarative rules format the package parses. Where the rules come from (a database table of role assignments, a JWT's claims, a static file) is left entirely to that function; the middleware's own contract ends at "give me an `AppAbility`". This mirrors CASL's own design (`AbilityBuilder` is imperative, not a schema you declare), and avoids the middleware needing to anticipate every shape a rule source might take — a database-backed ability lookup and a static role-to-permissions map are both just functions matching the same type, with no separate code path in the middleware itself for either.

## Why `getSecretData` isn't actually protected

`pglCaslPlugin`'s built-in `getSecretData` query and `createAbility` mutation exist so a new integration can be exercised end-to-end in GraphiQL — create an ability, then query the protected-in-name field — without first writing any application schema. In the current source, the actual permission check inside `getSecretData`'s plan function is commented out with a `// TODO`, so as shipped it returns its demo content unconditionally. This is worth knowing before treating the demo query as a security boundary: it demonstrates the *shape* of ability-gated access (how you'd call `context<Context>().get('ability')` from inside a plan step), not a working example of it.

## Related Documentation

- [Setting Up the CASL Middleware](../guides/casl-middleware-setup.md) — Step-by-step configuration guide
- [GraphQL Middleware](./graphql-middleware.md) — Architecture of the Grafast-based layer `pglCaslPlugin` composes with
- [CASL Middleware API Reference](/reference/casl-middleware) — Full exported API
