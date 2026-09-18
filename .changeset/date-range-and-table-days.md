---
'@stonecrop/aform': patch
'@stonecrop/atable': patch
---

`ADateRange` and the table's default date cell read and write each `YYYY-MM-DD` day as that day, so neither shows or saves a date a day off outside UTC.
