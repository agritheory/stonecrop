---
'@stonecrop/nuxt-grafserv': patch
'@stonecrop/nuxt': patch
---

`@stonecrop/nuxt-grafserv` no longer depends on `@graphql-tools/stitch`, which it never imported, so an app installing it stops getting the `@graphql-tools/utils` that GHSA-7mx3-vvmw-hjmv and GHSA-c4qx-w738-7hr3 affect. The scaffolded `server/resolvers.ts` declares the type of an action's reply, which the newer Grafast's `loadOne` no longer infers.
