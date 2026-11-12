---
'@stonecrop/graphql-middleware': patch
---

Finding a row by its id no longer reads the whole table. The middleware compared a key column as text (`"id"::text = $1`), which Postgres cannot answer from the column's index, so loading a record, its link display values, a one-to-many link, or a guarded state transition scanned every row. Ids are now compared by the column's own type, and an id that type cannot hold (`abc` for a `uuid`, an empty string) matches nothing instead of failing the query. An id still names a record only when it is spelled the way the server serves it: `01` for record `1`, or an upper-case uuid, is a miss on read, save and action alike.

This needs PostgreSQL 16 or later, which added `pg_input_is_valid`. On 15 or older every record read and action fails with `function pg_input_is_valid(text, unknown) does not exist`.
