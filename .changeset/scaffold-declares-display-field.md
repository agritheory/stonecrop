---
'@stonecrop/nuxt': patch
---

The server schema the CLI scaffolds declares `displayField`, which the client asks for when it loads a doctype, so an app scaffolded earlier adds `displayField: String` to `DoctypeMeta` in its own `server/schema.graphql`.
