---
'@stonecrop/graphql-middleware': minor
'@stonecrop/casl-middleware': minor
'@stonecrop/graphql-client': minor
'@stonecrop/code-editor': minor
'@stonecrop/node-editor': minor
'@stonecrop/utilities': minor
'@stonecrop/stonecrop': minor
'@stonecrop/rockfoil': minor
'@stonecrop/desktop': minor
'@stonecrop/schema': minor
'@stonecrop/atable': minor
'@stonecrop/aform': minor
'@stonecrop/beam': minor
---

Libraries now ship unminified so the consumer's bundler minifies them, and the unbundled `dist/src/**/*.js` tree is no longer published because every package's exports map already blocked it.
