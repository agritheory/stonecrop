---
'@stonecrop/graphql-client': minor
---

An app that loads doctypes with `client.getMeta` or `getAllMeta` against its own copy of the server schema adds `parts: JSON` to `StonecropField`, or loading a doctype fails.
