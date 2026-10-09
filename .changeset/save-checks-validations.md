---
'@stonecrop/stonecrop': patch
---

`useClientAction` no longer sends an action declaring `selfTransition` (a save) while the record fails its doctype's validation `triggers`: the errors show on their fields and the refusal goes to `onError`.
