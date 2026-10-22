---
'@stonecrop/stonecrop': minor
---

Add `prefillDraft(doctype, values)`, also given to scripts, which checks values against a doctype's fields and holds them for its next new record; `takePrefill` returns them once, and `composeNewRecord` applies them over every default as `prefill`.
