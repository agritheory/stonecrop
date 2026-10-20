---
'@stonecrop/stonecrop': minor
'@stonecrop/desktop': minor
---

A new record's edits in Desktop now run the doctype's field triggers before its first save, and a trigger reads and sets its own record, saved or not, with `context.get` and `context.set`; `stonecrop.editRecord(doctype, recordId)` gives a form that record.
