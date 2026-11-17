---
'@stonecrop/aform': patch
---

A field drawn with `ADateTimeInput` or `ABadge` now shows the value its record holds (#548).

`ADateTimeInput` binds a time of day with `v-model`: it reads `HH:MM`, `HH:MM:SS` or Postgres' `HH:MM:SS.ffffff`, writes `HH:MM:SS` (`HH:MM` with `useSeconds` off), and takes `label`, `mode` and `uuid`. It writes only when someone changes the time. Bound to a record with no time, it shows empty boxes and writes nothing until someone types, and it empties its boxes when the record's time is cleared or another record comes in. Emptying any box of the record's time empties the field, which then holds null. Used without `v-model`, as inside `ADateSelection`, it starts at its default time as before.

Crossing noon or midnight with an arrow key is reported once every box has wrapped, so Up at 11:59 AM reports 12:00 PM, never 12:60. This applies with or without `v-model`: inside `ADateSelection` the `get-time` event no longer carries a minute or second of 60.

A form field declaring `component: 'ABadge'` is drawn through a wrapper that shows the record's value as a badge under the field's label, painted as the field's `format` returns it, else from its options, as ADropdown paints it. `ABadge` itself is unchanged: its `label` is the badge's text and it defaults to `cell-fill`.
