---
'@stonecrop/aform': minor
'@stonecrop/desktop': minor
'@stonecrop/schema': minor
'@stonecrop/stonecrop': minor
---

A fieldset's fields are now read and written as keys of the record itself, never nested under the fieldset's name, so an edit inside a fieldset reaches the form and its save, and data handed to `AForm` must hold them flat.
