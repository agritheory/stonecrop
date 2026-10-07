---
"@stonecrop/aform": minor
"@stonecrop/atable": minor
"@stonecrop/utilities": minor
---

Replace read-only conversion rows on `ACurrencyInput` and `AQuantityInput` with a compact helper line when the entered unit differs from the base. Remove `stockUomLabel`, `stockQtyLabel`, `conversionFactorLabel`, `baseCurrencyLabel`, `baseAmountLabel`, and `exchangeRateLabel` props.

Table quantity and currency formatters omit redundant units and use `Intl` for currency cells. Quantity column sort/filter compares on `stockQty`. `AQuantityInput` accepts negative quantities.
