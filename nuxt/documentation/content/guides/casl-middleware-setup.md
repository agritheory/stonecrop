---
title: Setting Up the CASL Middleware
description: How to configure @stonecrop/casl-middleware for GraphQL authorization
---

# Setting Up the CASL Middleware

This guide walks through configuring `@stonecrop/casl-middleware` — a [CASL](https://casl.js.org/) authorization layer for GraphQL servers, with specific integration support for PostGraphile.

---

## Install the package

```bash
pnpm add @stonecrop/casl-middleware
```

---

## Core middleware

`createCaslMiddleware` wraps a single GraphQL resolver's `resolve` function with an authorization check — it's a `(resolve, root, args, context, info) => Promise<any>` shaped function, meant to be composed onto resolvers by whatever resolver-wrapping mechanism your GraphQL server exposes (e.g. `@graphql-tools/utils`'s `mapSchema`, or wiring it directly per-resolver).

```typescript
import { createCaslMiddleware } from '@stonecrop/casl-middleware'

const middleware = createCaslMiddleware({
  subjectMap: {
    User: 'User',
    Item: 'Item',
  },
  fieldPermissions: {
    'Item.price': [{ action: 'read', subject: 'item' }],
  },
})
```

On each call, the middleware builds (or reuses) a CASL ability from `context.ability`/`context.user`, maps the resolved GraphQL type and operation (query/mutation/subscription) to a CASL action via `actionMap`, and throws a `GraphQLError` if the ability disallows it — before ever calling the wrapped resolver.

---

## Configuring the middleware

### subjectMap

Maps a GraphQL type name to the CASL subject name used in ability rules, when they differ:

```typescript
createCaslMiddleware({ subjectMap: { Item: 'item' } })
```

If a type has no entry, the GraphQL type name itself is used as the subject.

### actionMap

Maps a GraphQL operation to a CASL action. The default is:

```typescript
{ query: 'read', mutation: 'update', subscription: 'read' }
```

Override any of these to match your own ability vocabulary.

### fieldPermissions

Field-level rules, keyed by `Type.fieldName`. Each field can require one of several permissions (`some`, not `every`) to pass:

```typescript
createCaslMiddleware({
  fieldPermissions: {
    'Item.cost': [{ action: 'read', subject: 'item' }],
  },
})
```

### debug

Set `debug: true` to log each permission check (`action`, `subject`, field path) to the console as it happens.

---

## Building an ability

`createAbility(user, builderFn)` produces the CASL `AppAbility` instance the middleware checks against. Without a `builderFn`, every user gets a minimal built-in default — `can('read', 'Query')` and nothing else. For anything more, write your own function matching the exported `AbilityBuilderFunction` type, using CASL's own `AbilityBuilder`:

```typescript
import { AbilityBuilder, PureAbility } from '@casl/ability'
import type { AppAbility, AbilityBuilderFunction, Context } from '@stonecrop/casl-middleware'

const buildAbility: AbilityBuilderFunction = async (user?: Context['user']) => {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(PureAbility)

  if (user?.roles?.includes('admin')) {
    can('manage', 'all')
  } else if (user) {
    can('read', 'Item')
    cannot('read', 'Item', ['cost'])
  }

  return build()
}
```

Pass it to the middleware via `abilityBuilder`:

```typescript
createCaslMiddleware({ abilityBuilder: buildAbility })
```

Where the ability comes from — a database of roles, a JWT's claims, a static config file — is entirely up to your `builderFn`; the middleware only needs the resulting `AppAbility`.

---

## PostGraphile integration

`pglCaslPlugin` is a PostGraphile v5 plugin — add it to the same `plugins` array as [`@stonecrop/graphql-middleware`](/reference/graphql-middleware)'s `createStonecropPlugin`:

```typescript
import { createStonecropPreset, createStonecropPlugin, makePgService } from '@stonecrop/graphql-middleware'
import { pglCaslPlugin } from '@stonecrop/casl-middleware'

export default {
  extends: [createStonecropPreset()],
  plugins: [createStonecropPlugin(), pglCaslPlugin],
  pgServices: [makePgService({ connectionString: process.env.DATABASE_URL })],
}
```

The plugin extends the schema with a `createAbility(input: { userId, roles })` mutation and a demo `getSecretData` query, useful for confirming the wiring works end-to-end in GraphiQL. In the current source, `getSecretData`'s own permission check is left as a `// TODO` — the plugin gives you the schema shape and the ability-creation flow, but enforcing a check inside a Grafast plan step is left to you (via `context<Context>().get('ability')` inside the plan function). If you need enforcement on ordinary resolvers rather than Grafast plan steps, use `createCaslMiddleware` directly instead.

---

## Related Documentation

- [CASL Middleware API Reference](/reference/casl-middleware) — Full exported API
- [GraphQL Middleware](/explanation/graphql-middleware) — Architecture of the PostGraphile layer this composes with
- [Setting Up the GraphQL Middleware](./graphql-middleware-setup) — Configuring `@stonecrop/graphql-middleware` itself
