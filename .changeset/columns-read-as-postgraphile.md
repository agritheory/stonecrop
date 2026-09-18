---
'@stonecrop/graphql-middleware': patch
---

Record reads and save replies return each column as PostGraphile serves it, except a zone-free `timestamp`, so `date` values no longer shift when the server runs outside UTC.
