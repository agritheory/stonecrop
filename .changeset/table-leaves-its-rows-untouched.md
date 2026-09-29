---
'@stonecrop/atable': minor
---

`ATable` no longer changes the list passed as `rows`; an edit arrives only through `update:rows`, so a host that passes `rows` without `v-model:rows` must listen for it.
