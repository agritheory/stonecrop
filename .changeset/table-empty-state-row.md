---
'@stonecrop/atable': minor
'@stonecrop/schema': minor
'@stonecrop/aform': patch
---

An empty table now shows a full-width "No data" row (or "No matching records" when filters hide every row) once its rows have loaded. When the host sets `config.addable`, the row also offers "Add row", which adds a row through `store.addRow()` and emits `row:add`. Hosts can replace the row through the `empty` slot.

A doctype's table field can turn this on with `addable` in its `TableViewConfig`; AForm turns it off while the form can't edit the record.

The empty row, the pagination footer and the list-expansion panel now span the same `store.columnCount`, so the footer no longer stops one column short with row actions on. A table with a pinned column that starts out empty now sizes the pinned column from its first data row once one arrives.
