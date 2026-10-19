---
'@stonecrop/desktop': patch
'@stonecrop/schema': patch
---

Packages are now built with the Vite and Rolldown that Vite+ bundles, so the `pluralize` copy inside schema runs with CommonJS's `this` set to its exports, and desktop's bundle inlines a constant selector and drops an unused statement.
