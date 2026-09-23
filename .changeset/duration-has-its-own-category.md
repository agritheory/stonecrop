---
'@stonecrop/schema': minor
'@stonecrop/stonecrop': patch
'@stonecrop/atable': patch
---

`ADuration` has its own `duration` component category, so a new record starts it at `null`, which an `interval` column accepts, where it started at `''`, and atable still filters it as text.
