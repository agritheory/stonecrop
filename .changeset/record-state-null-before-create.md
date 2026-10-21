---
'@stonecrop/stonecrop': minor
---

`Stonecrop.getRecordState` returns `null` for a record not created yet instead of the workflow's first state, and `Doctype.getAvailableTransitions` and `getAvailableCommands` take that `null` to list the actions that can run on one.
