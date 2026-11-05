---
'@stonecrop/aform': patch
'@stonecrop/schema': patch
---

A field's static `validation.errorMessage` is no longer shown as an error on its own. A field shows only the errors its host reports, and the static message only words a reported error that has no text of its own (an empty string in `errors`). Before, a field with a static message showed it on every record, valid or not, and marked its input `aria-invalid`, so a "Validation message" set in DocBuilder sat on every record and a screen reader announced the field as invalid.
