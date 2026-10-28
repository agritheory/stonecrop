---
'@stonecrop/desktop': minor
'@stonecrop/nuxt': patch
---

BREAKING: Desktop no longer adds a New Record button to lists or Create New to the command palette; an app that wants New passes it as `hostActions` on its list views, as the starter template now does.
