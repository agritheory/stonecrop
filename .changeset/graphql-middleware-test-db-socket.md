---
---

The graphql-middleware integration tests now serve their PGlite databases with `@electric-sql/pglite-socket` instead of `pglite-server`, which after a failed query with parameters answered every later query on that connection one step late (#544). Test setup and dev dependencies only; nothing is released.
