---
'@stonecrop/aform': minor
'@stonecrop/atable': minor
'@stonecrop/utilities': minor
---

`ANumericInput`, `AQuantityInput` and `ACurrencyInput` take `options.arithmetic: true`, and so do table cells in the same columns: the box then takes arithmetic, so `12*3+4` is saved as `40` when you leave the box or press Enter. It allows digits, `.`, `+ - * / %` and parentheses, and refuses `e`, `^` and other letters, typed or pasted. An unfinished expression (`12*`) leaves the last number in place. `@stonecrop/utilities` exports the evaluator and its helpers: `evaluateArithmetic`, `arithmeticEntryPattern`, `isArithmeticKey`, `currencyAmountSeparators` and the `NumberSeparators` type.
