# Document defaults

New records start from the schema floor (`initializeRecord`), then compose-time tokens, then the doctype **`defaults`** document, then any source registered on the registry, then an optional overlay.

There is one value shape everywhere: a nested object in the same form as `formData` / the HST document, or a function that returns one (or a promise of one). Field entries inside the document may also be functions.

## Where defaults live

- **`defaults` on the doctype JSON** — best for static documents, including child-table rows (`items: [{ postingDate: "now" }]`).
- **`registry.registerDefaults(slug, source)`** — same shape; functions are allowed when the doctype is built in memory.
- **`registry.setDefaultsLoader(fn)`** — fills registered defaults the first time a **new** record is composed. Schema load and `resolveSchema` never call the loader.

Serialized JSON **cannot** contain functions. `DoctypeMeta` validation rejects them so a file cannot silently drop them on `JSON.stringify`.

## Sync blocks, a promise loads

No configuration flag:

- A function that **returns a value** runs to completion before composition returns that layer. The draft does not proceed until sync work finishes.
- A function that **returns a promise** loads. The form paints from everything already resolved; when the promise settles, that field or document is merged in.

## Compose-time tokens

Resolved when the record is composed, on field `default` or inside `defaults`:

| Token     | On date / datetime fields              | Elsewhere        |
| --------- | -------------------------------------- | ---------------- |
| `"now"`   | ISO date or datetime for the component | Left as `"now"`  |
| `"uuidv7"` | New uuidv7 string                     | Left as `"uuidv7"` |

Child tables stay `[]` unless `defaults` includes rows. A row that needs an id sets that field to `"uuidv7"`.

## API

- `registry.composeNewRecord(doctype)` — awaits the defaults loader once per slug, then composes.
- `registry.composeNewRecordSync(doctype)` — no loader; use when defaults are already registered.
- `seedDraftRecord(registry, doctype, formDataRef)` — used by hosts for draft routes.

See `compose-new-record.ts` for merge order and table-row composition.
