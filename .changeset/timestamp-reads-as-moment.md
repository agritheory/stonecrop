---
'@stonecrop/graphql-middleware': minor
---

A zone-free `timestamp` column is read and written as the moment it names in the database's time zone, so saving a date-time no longer moves it by the user's offset.
