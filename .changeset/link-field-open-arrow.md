---
'@stonecrop/aform': patch
---

A link field now shows its open-record arrow only when it has a value, a `doctype` and an app-provided `aformLinkNavigator`. A link with no doctype (e.g. a unit stored by its name) no longer shows an arrow that does nothing but log a warning.
