---
'@stonecrop/nuxt': patch
'@stonecrop/nuxt-grafserv': patch
---

Build the Nuxt modules in `prepublishOnly`, as every other package does, rather than on every `pack`, and drop nuxt's deprecated `prepublish` hook, which built it a second time on publish. The published files are unchanged.
