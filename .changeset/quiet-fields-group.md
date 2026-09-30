---
"@stonecrop/stonecrop": minor
---

A new record reads its starting values through the doctype's declarations: a field inside a grouped section is filled like any other field (a date there set to `"now"` starts as today), and a table's rows take their own doctype's starting values however the link is keyed, including inside an embedded record. A starting value whose key names no field of the record, such as a typo or a section's name, is skipped and reported instead of being added to the record, as is a table row that is not a document of field values.
