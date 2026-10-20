---
'@stonecrop/schema': minor
'@stonecrop/graphql-middleware': patch
---

An action now reduces a link picked inside the rows of a declared relation, such as a job's tasks, to its id before any handler sees it, as it already did for a record's own links; `unwrapInlineLinks` now takes the doctype's meta rather than its fields, plus an optional lookup for each relation's target.
