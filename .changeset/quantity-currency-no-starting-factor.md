---
'@stonecrop/aform': patch
---

`AQuantityInput` and `ACurrencyInput` given no value show every box empty, as they do for `null`, instead of a conversion factor or exchange rate of 1 nobody entered.
