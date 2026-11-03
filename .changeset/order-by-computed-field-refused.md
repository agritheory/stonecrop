---
'@stonecrop/graphql-middleware': patch
---

A list ordered by a computed field is refused by name, before the query reaches Postgres, where it failed on a missing column.
