---
'@stonecrop/graphql-middleware': minor
---

`createStonecropPreset()` turns off the create, update and delete mutations PostGraphile generates for every table, so `stonecropAction` is the only write an app's API offers; an app calling one of them should dispatch an action instead.
