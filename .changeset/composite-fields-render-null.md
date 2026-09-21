---
'@stonecrop/aform': patch
---

`ACurrencyInput`, `AQuantityInput` and `ADateRange` render a `null` value, which a new record starts them at, where they threw.
