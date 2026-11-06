---
'@stonecrop/graphql-middleware': minor
---

A Save writes only the fields whose value changed, so a Save that changes nothing issues no `UPDATE` and fires no update trigger.
