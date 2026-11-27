---
'@stonecrop/schema': patch
'@stonecrop/atable': patch
'@stonecrop/utilities': patch
---

A time of day now shows and is entered as a time (#568). A doctype generated from a table with a `time` column drew it with a text box, so a form showed `09:30:00.000000`, took any text in its place and offered no way to pick a time, and a table showed the same text. The `Time` scalar now maps to `ADateTimeInput`, whose hour, minute and second boxes read the stored time and write it back as `HH:MM:SS`, and a table shows a time column's value as the user's locale writes a time, such as `9:30 AM`.
