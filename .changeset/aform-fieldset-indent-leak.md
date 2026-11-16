---
'@stonecrop/aform': patch
---

A fieldset's indent no longer reaches forms nested deeper inside it. Only the form a fieldset or a linked record holds directly is indented, with its thinner left border. A table's expanded row inside a fieldset now starts its fields where it would outside one, instead of 8px further right. Apps that undid the indent on nested forms can drop that override.
