---
'@stonecrop/graphql-middleware': minor
'@stonecrop/graphql-client': minor
'@stonecrop/schema': minor
'@stonecrop/stonecrop': minor
'@stonecrop/nuxt': patch
---

An action's result carries `record`, the record as a read returns it after the action, and the client stores that in place of `data`, which stays whatever the action's handler returned, so a `DataClient.runAction` must now return `record`.
