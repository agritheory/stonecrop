---
'@stonecrop/aform': minor
---

`ADate`, `ANumericInput` and the amount and quantity boxes of `ACurrencyInput` and `AQuantityInput` hold `null` once emptied, where they held an `''` that no date or number column accepts, so the date and number fields' model types now include `null`.
