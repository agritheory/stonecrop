---
'@stonecrop/nuxt': patch
---

The app template's server refuses a Save sent with the id of a record that no longer exists, as the Postgres adapter does, instead of creating a new record under a new id.
