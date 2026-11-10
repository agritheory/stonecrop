---
'@stonecrop/graphql-middleware': patch
---

Finding a row by its id no longer reads the whole table. The middleware compared a key column as text (`"id"::text = $1`), which Postgres cannot answer from the column's index, so loading a record, its link display values, a one-to-many link, or a guarded state transition scanned every row. Ids are now compared by the column's own type, and an id that type cannot hold (`abc` for a `uuid`, an empty string) matches nothing instead of failing the query.
