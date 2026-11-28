---
'@stonecrop/aform': patch
---

A date field no longer saves as empty when its box holds a date the browser can't read, such as one with a part cleared or 31 February: leaving the field puts the last date back and says so, and an optional date is emptied with its new clear button.
