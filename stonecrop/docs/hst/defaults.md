# Document defaults

New records start from the schema floor (`initializeRecord`), then compose-time tokens, then the doctype **`defaults`** document, then any source registered on the registry, then an optional overlay.

There is one value shape everywhere: a nested object in the same form as `formData` / the HST document, or a function that returns one (or a promise of one). Field entries inside the document may also be functions.

A grouped section is layout, so its fields are the record's own keys and take their entries at the top level: `{ city: "Springfield" }`, not `{ address: { city: "Springfield" } }`. A key that names no field of the record, such as a typo or a section's name, is refused when the doctype loads (`validateDoctype` checks the top-level keys of `defaults`), and skipped and reported when a new record is composed.

## Where defaults live

- **`defaults` on the doctype JSON** — best for static documents, including child-table rows (`items: [{ postingDate: "now" }]`).
- **`registry.registerDefaults(doctype, source)`** — same shape; functions are allowed when the doctype is built in memory. `doctype` is its name or its slug (`'OrderItem'` or `'order-item'`).
- **`registry.setDefaultsLoader(fn)`** — fills registered defaults the first time a **new** record is composed. Schema load and `resolveSchema` never call the loader.

Serialized JSON **cannot** contain functions. `DoctypeMeta` validation rejects them so a file cannot silently drop them on `JSON.stringify`.

## A new record is filled once

Composition waits for every starting value, then returns the whole record. Nothing is written to it afterwards, so a late value can never land on top of what a user has typed.

- A function may **return a value or a promise**. Either way, its value is in the record before the record is returned.
- Layers apply in the order above, so a later layer wins however long an earlier one took. The caller's overlay always wins.
- A value that **throws, rejects, or has not arrived within the timeout** (5 seconds, `DEFAULTS_TIMEOUT_MS`; `timeoutMs` to change it) is skipped and reported with `console.warn`. Everything else still applies.
- A **failed loader** is not remembered: the next new record asks again. New records opened at once share one load.

Hosts show their loading state while this runs: Desktop keeps the form, and its actions, behind its loading placeholder; `useStonecrop` sets `isLoading`. With only fixed values, nothing is awaited that the browser would paint around, so the form appears as quickly as before.

## Compose-time tokens

Resolved when the record is composed, on field `default` or inside `defaults`:

| Token     | On date / datetime fields              | Elsewhere        |
| --------- | -------------------------------------- | ---------------- |
| `"now"`   | Today in the user's time zone (date), or the current moment as an ISO timestamp (datetime) | Left as `"now"`  |
| `"uuidv7"` | New uuidv7 string                     | Left as `"uuidv7"` |

Child tables stay `[]` unless `defaults` includes rows. Each row starts from its own doctype's defaults (a linked table, whatever key the link is declared under) or from its columns (an inline table), then takes the row's entries. A row that needs an id sets that field to `"uuidv7"`.

## API

- `registry.composeNewRecord(doctype, { overlay, now, timeoutMs })` resolves to `{ record }` once every starting value is in. It runs the defaults loader first, once per slug.

See `compose-new-record.ts` for merge order and table-row composition.
