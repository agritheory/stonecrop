---
'@stonecrop/aform': minor
---

`ADropdown` picks a linked record when given `link`: it binds the record through `v-model:link-value` and searches with `linkFilterFunction`. `ACurrencyInput`'s currency box is one, so it shows its currency whether or not the field has a lookup, and names a bare currency id through `aformLinkResolver`, as before.
