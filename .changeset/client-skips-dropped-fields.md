---
'@stonecrop/graphql-client': patch
---

`StonecropClient.runAction` no longer asks for `droppedFields`, which the in-memory servers `@stonecrop/nuxt` scaffolds do not declare, so actions against them are no longer refused.
