---
'@stonecrop/aform': patch
'@stonecrop/schema': patch
'@stonecrop/stonecrop': patch
'@stonecrop/nuxt': patch
---

A field's static `validation.errorMessage` is no longer shown as an error on its own. Before, a field with one showed it on every record, valid or not, and marked its input `aria-invalid`, so a "Validation message" set in DocBuilder sat on every record and a screen reader announced the field as invalid.

The message now words an error a trigger reports without one: `setError(field)`, with the message left out, shows that field's own Validation message. AForm applies the wording before it routes errors, so a field bound to another field's part (totals sharing one currency) shows that part's own message, and fieldset children and link fields are covered too; a field component only shows the errors it is handed. `flattenFields` is generic, so it walks resolved fields as well as authored ones. DocBuilder's trigger editor shows `setError(field, message?)`, and the Validation message input says when it is shown.
