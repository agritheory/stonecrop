---
'@stonecrop/atable': patch
---

Sorting a quantity or currency column puts an emptied value with the blank cells, rather than ranking it as 0. A column's `component` decides how its cells compare, not the keys its values carry.
