---
'@stonecrop/utilities': minor
'@stonecrop/aform': patch
'@stonecrop/nuxt': patch
---

"Now" and "today" are read from `Date.now()` instead of `Temporal.Now`. On a runtime with its own `Temporal` (Node 26, newer browsers), `temporal-polyfill` hands that one out, and it reads the system clock directly, so a faked clock in tests never reached it and date tests failed. `@stonecrop/utilities` now exports `zonedNow()` and `today()`; ADatePicker, ADateSelection and ADateTime use them for their default dates, and the Nuxt template's task snooze computes the server's today the same way when a task has no due date.
