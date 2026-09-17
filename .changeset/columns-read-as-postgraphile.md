---
'@stonecrop/graphql-middleware': patch
---

Record reads and save replies return each column as PostGraphile serves it, so `date` and `timestamp` values no longer shift when the server runs outside UTC.
