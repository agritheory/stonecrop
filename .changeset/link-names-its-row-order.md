---
'@stonecrop/schema': minor
'@stonecrop/graphql-middleware': minor
---

A many-side link can name the order of its rows with `orderBy`, a field of the target and an optional direction (`{ "fieldname": "rowOrder" }`), so rows that keep their own position, such as an order's lines, load in that order instead of by id. Identity breaks ties. Building the schema refuses an `orderBy` naming a field the target lacks or one with no database column, and an `orderBy` on a one-side link, which reads one row.
