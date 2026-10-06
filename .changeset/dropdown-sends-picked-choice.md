---
'@stonecrop/aform': minor
---

`ADropdown` sends `update:modelValue` when a choice is picked from the list or typed out in full, instead of with each keystroke, so a record never holds a partly typed value such as `Pend`. Clearing the box empties the field.
