---
'@stonecrop/aform': patch
---

A field drawn with `ADateTimeInput` or `ABadge` now shows the value its record holds (#548).

`ADateTimeInput` binds a time of day with `v-model`: it reads `HH:MM`, `HH:MM:SS` or Postgres' `HH:MM:SS.ffffff`, writes `HH:MM:SS` (`HH:MM` with `useSeconds` off), and takes `label`, `mode` and `uuid`. It writes only when someone changes the time. Bound to a record with no time, it shows empty boxes and writes nothing until someone types, and it empties its boxes when the record's time is cleared or another record comes in. Crossing noon or midnight with an arrow key is reported once every box has wrapped, so Up at 11:59 AM no longer reports 12:60. Used without `v-model`, as inside `ADateSelection`, it behaves as before.

A form field declaring `component: 'ABadge'` is drawn through a wrapper that shows the record's value as a badge, painted from the field's options, under the field's label. `ABadge` itself is unchanged: its `label` is the badge's text and it defaults to `cell-fill`.
