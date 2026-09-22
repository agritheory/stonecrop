---
'@stonecrop/aform': minor
'@stonecrop/atable': minor
'@stonecrop/schema': minor
---

Add generic quantity/currency grid-cell editing support: `AQuantityInput`/`ACurrencyInput`-backed `QuantityCellEditor` and `CurrencyCellEditor` popovers (`@stonecrop/aform`), a `CurrencyValueCell` cell renderer and `ItemsTableSection` table wrapper (`@stonecrop/atable`), and `ValueField.resolveCurrencyMeta`/`resolveItemUomMeta` serialized resolvers so a table-typed Link field can supply an app's own currency/UOM metadata lookups (`@stonecrop/schema`, threaded through `ATable`'s new `resolveCurrencyMeta`/`resolveItemUomMeta` props and `createTableStore`'s `getCurrencyMeta()`/`getItemUomMeta()`).
