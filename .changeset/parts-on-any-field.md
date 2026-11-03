---
'@stonecrop/schema': minor
'@stonecrop/aform': minor
---

A field rendered by an app's own component, a table among them, may declare `parts` naming the other fields of its record it reads. AForm hands them to the component from the record it edits, so they work before the record is first saved. Stonecrop's own single-value inputs and ATable still declare none.
