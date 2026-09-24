---
'@stonecrop/graphql-middleware': minor
---

Record reads and save replies return each column as PostGraphile serves it (a `date` as `YYYY-MM-DD`, a `timestamptz` ending `+00:00`), except a zone-free `timestamp` and an `interval`, and throw on a table or column PostGraphile did not introspect or a table name two schemas share.
