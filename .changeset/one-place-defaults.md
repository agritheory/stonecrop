---
"@stonecrop/schema": minor
"@stonecrop/stonecrop": minor
"@stonecrop/aform": minor
"@stonecrop/nuxt": minor
---

A doctype gives its starting values in one place, its `defaults`, which hold fixed data only. A field no longer has a `default` of its own: `validateDoctype` refuses one and points to `defaults`, and DocBuilder no longer offers the column. Embedded records and table rows start from their own doctype's `defaults`. The app's starting values come from one registration per doctype, `registry.registerDefaults`, whose functions run for every new record; registering a doctype a second time warns. `registry.setDefaultsLoader` and `composeNewRecord`'s `overlay` option are removed.
