---
'@stonecrop/aform': patch
---

The calendar's range boxes read a typed day through Temporal instead of `new Date`, so `YYYY-MM-DD` is no longer a day early west of UTC, and a day that does not exist, or text not written the way the locale writes days, reads as no day.
