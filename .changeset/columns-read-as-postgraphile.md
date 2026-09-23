---
'@stonecrop/graphql-middleware': patch
---

Record reads and save replies return each column as PostGraphile serves it, except a zone-free `timestamp` and an `interval`, so `date` values no longer shift when the server runs outside UTC.
