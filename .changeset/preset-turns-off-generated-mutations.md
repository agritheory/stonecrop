---
'@stonecrop/graphql-middleware': minor
---

`createStonecropPreset()` turns off the mutations PostGraphile generates for every table and every `VOLATILE` database function, so `stonecropAction` is the only write an app's API offers; an app calling one of them should dispatch an action instead.
