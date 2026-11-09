---
'@stonecrop/atable': minor
---

An empty table now shows a full-width "No data" row (or "No matching records" when filters hide every row) once its rows have loaded. When the host sets `config.addable`, the row also offers "Add row", which adds a row through `store.addRow()` and emits `row:add`. Hosts can replace the row through the `empty` slot.
