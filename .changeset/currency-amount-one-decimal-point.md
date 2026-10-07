---
'@stonecrop/aform': patch
'@stonecrop/utilities': patch
---

`ACurrencyInput`'s amount box and a currency cell being edited refuse a second decimal point, typed or pasted, which would leave no amount. `currencyAmountEntryPattern` allows one, followed only by digits.
