---
'@stonecrop/graphql-middleware': patch
---

A save no longer writes a column the database fills itself (a generated column, or an identity generated always), which Postgres refused, and PostGraphile's generated mutations stop offering generated columns as inputs too.
