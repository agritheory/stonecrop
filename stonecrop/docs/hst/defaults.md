# Document defaults

A new record starts with no field values (`initializeRecord` gives it only its tables and embedded records), then the doctype's **`defaults`**, then the source the app registered for the doctype. A later layer wins. `"now"` and `"uuidv7"` are resolved when the record is composed.

A field none of these sets has no value, so a save leaves it out and the database gives the column its default. Never give one an empty value instead: an insert stores `''`, 0, false or null over that default. The form shows such a field empty until the save, whose reply carries what the database stored.

## Where defaults live

- **`defaults` on the doctype JSON**: fixed data, nested like the record itself, including child-table rows (`items: [{ postingDate: "now" }]`). It is the only place a doctype gives starting values: a field has no `default` of its own, and `validateDoctype` refuses one. Serialized JSON cannot contain functions, and `validateDoctype` refuses those too.
- **`registry.registerDefaults(doctype, source)`**: the app's starting values, in the same shape, or a function that returns them (or a promise of them). Field entries may be functions too, and each runs for every new record, so it can work out what a doctype file cannot, such as a value looked up for the user's company. `doctype` is its name or its slug (`'OrderItem'` or `'order-item'`). A doctype takes one registration; a second replaces the first and warns.

A function reads the record as it stands before its layer (`record` in its context), so a registered value can depend on the doctype's own. Values that depend on each other within one registration belong in one function that returns them together.

A grouped section is layout, so its fields are the record's own keys and take their entries at the top level: `{ city: "Springfield" }`, not `{ address: { city: "Springfield" } }`. A key that names no field of the record, such as a typo or a section's name, is refused when the doctype loads (`validateDoctype` checks the top-level keys of `defaults`), and skipped and reported when a new record is composed.

## Embedded records and table rows

An embedded record and each table row start from their own doctype's `defaults` (a linked table, whatever key the link is declared under), or with no values (an inline table). The containing doctype's entries then apply over them. Child tables stay `[]` unless `defaults` includes rows. Defaults that would start a row of a doctype inside a new record of the same doctype stop there and are reported. A row that needs an id sets that field to `"uuidv7"`.

## A new record is filled once

Composition waits for every starting value, then returns the whole record. Nothing is written to it afterwards, so a late value can never land on top of what a user has typed.

- A function may **return a value or a promise**. Either way, its value is in the record before the record is returned.
- Layers apply in the order above, so the registered source wins however long the doctype's took.
- A value that **throws, rejects, or has not arrived within the timeout** (5 seconds, `DEFAULTS_TIMEOUT_MS`; `timeoutMs` to change it) is skipped and reported with `console.warn`. Everything else still applies.

Hosts show their loading state while this runs: Desktop keeps the form, and its actions, behind its loading placeholder; `useStonecrop` sets `isLoading`. With only fixed values, nothing is awaited that the browser would paint around, so the form appears as quickly as before.

## Compose-time tokens

Resolved when the record is composed, inside `defaults` or a registered source:

| Token      | On date / datetime fields                                                                  | Elsewhere          |
| ---------- | ------------------------------------------------------------------------------------------ | ------------------ |
| `"now"`    | Today in the user's time zone (date), or the current moment as an ISO timestamp (datetime) | Left as `"now"`    |
| `"uuidv7"` | New uuidv7 string                                                                          | New uuidv7 string  |

## API

- `registry.composeNewRecord(doctype, { now, timeoutMs })` resolves to `{ record }` once every starting value is in.

See `compose-new-record.ts` for merge order and table-row composition.
