---
'@stonecrop/aform': minor
'@stonecrop/utilities': minor
---

`ACurrencyInput`'s amount box and a currency cell being edited write and read amounts with the browser's separators, as a table cell shows them (`1,234.56` in English, `1.234,56` in German), and with the currency's decimals. `options.amountMask: false` turns this off. `@stonecrop/utilities` exports the helpers: `formatCurrencyAmountInput`, `parseCurrencyAmountInput`, `currencyAmountEntryPattern` and `currencyInputFractionDigits`.
