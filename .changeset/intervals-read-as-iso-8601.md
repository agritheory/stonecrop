---
'@stonecrop/graphql-middleware': minor
---

Record reads and save replies return an `interval` column, or a list of them, as ISO 8601 durations such as `P1DT2H30M`, and refuse one whose parts differ in sign, which no ISO 8601 duration can hold.
