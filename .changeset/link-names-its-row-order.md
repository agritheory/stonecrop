---
'@stonecrop/schema': minor
'@stonecrop/graphql-middleware': minor
---

A many-side link can name the order of its rows with `orderBy`, a field of the target and an optional direction (`{ "fieldname": "rowOrder" }`), so rows that keep their own position, such as an order's lines, load in that order instead of by id. The target's identity breaks ties. Building the schema refuses an `orderBy` naming a field the target lacks or one with no database column, except on a custom link, whose handler applies its own order, and an `orderBy` on any one-side link, which reads one row.
