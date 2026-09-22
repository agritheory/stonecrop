---
'@stonecrop/desktop': minor
---

`ActionSet` is no longer exported or registered by `StonecropDesktop`, since it only works inside Desktop; a page that rendered it directly renders `Desktop` with its content in the default slot and passes `hostActions`.
