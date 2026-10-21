---
'@stonecrop/graphql-middleware': patch
---

A Save sent with the id of a record that no longer exists now reports `Save failed: record <id> no longer exists.`, in place of a longer message written for developers.
