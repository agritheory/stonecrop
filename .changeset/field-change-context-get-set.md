---
'@stonecrop/stonecrop': minor
---

Code that builds a `FieldChangeContext` by hand, such as a test, now supplies `get` and `set`, and code that reads `context.path` or a `FieldTriggerExecutionResult`'s `path` allows for it being absent, as it is on a record not saved yet.
