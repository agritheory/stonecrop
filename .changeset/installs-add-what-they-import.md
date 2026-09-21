---
'@stonecrop/nuxt': patch
---

The setup tool installs every package the files it copies import: the GraphQL server install now adds `@stonecrop/schema` and `temporal-polyfill`, and the frontend install adds `@stonecrop/graphql-client`, which apps built with pnpm could not otherwise resolve.
