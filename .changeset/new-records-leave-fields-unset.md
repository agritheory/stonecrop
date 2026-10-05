---
'@stonecrop/stonecrop': minor
'@stonecrop/atable': minor
---

A new record (`initializeRecord`) or table row (`addRow`) no longer gives a field a value nobody entered, so a save leaves it to the database's default instead of sending `''`, 0, false or null.
