---
'@stonecrop/graphql-middleware': patch
---

A Save on a doctype with no identity field (no field declaring `primaryKey` and none named `id`) now fails with an error naming both repairs, instead of reporting success with no record the page can file.
