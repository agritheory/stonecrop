---
'@stonecrop/aform': patch
---

Undo now reverses an edit an app's own table component writes straight into a row (#557). A table's rows were handed to its component as the store's own objects, so a component that set `row.qty = 5` changed the record without the store hearing of it: the undo log never saw the edit, and pressing Undo skipped it and reversed the one before. A table's component is now handed its rows through a view that leaves them as they were when written into: the write comes back as a new list of rows through `update:rows`, is saved like an edit made in Stonecrop's own table, and is the first one Undo reverses.
