---
'@stonecrop/graphql-middleware': minor
---

A server-side handler registered on a Save (a `selfTransition`) is now that save's whole write: it runs on a record not created yet and creates it, the adapter no longer writes the form's values after it on a saved record, and it must return the record it saved or the save fails.
