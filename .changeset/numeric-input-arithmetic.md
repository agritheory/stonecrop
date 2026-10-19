---
'@stonecrop/aform': minor
'@stonecrop/atable': minor
'@stonecrop/utilities': minor
---

`ANumericInput`, `AQuantityInput` and `ACurrencyInput` take arithmetic by default, and so do table cells in the same columns: `12*3+4` is saved as `40` when you leave the box or press Enter. It allows digits, `.`, `+ - * / %` and parentheses, and a leading `=` or `+` as a spreadsheet formula starts (`=12*3`), and refuses `e`, `^` and other letters, typed or pasted. An unfinished expression (`12*`) leaves the last number in place. Only an edit writes: a box focused and left as it was commits nothing, so a value is never rewritten or rounded by being looked at. A currency amount worked out this way is rounded to the currency's decimals (`10/3` in USD is `3.33`), and `ANumericInput` and number cells round to `options.precision` when it is set. `options.arithmetic: false` turns it off and keeps the plain `type="number"` box. `@stonecrop/utilities` exports the shared `useArithmeticInput` composable that the form fields and table cells all use, and the evaluator and its helpers: `evaluateArithmetic`, `roundToPrecision`, `arithmeticEntryPattern`, `isArithmeticKey`, `currencyAmountSeparators` and the `ArithmeticInputOptions` and `NumberSeparators` types.
