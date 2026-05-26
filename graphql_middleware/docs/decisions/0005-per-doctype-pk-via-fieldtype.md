---
status: accepted
date: "2026-05-25"
deciders: ['Tyler Matteson', 'Rohan Bansal']
---
# Declare primary key per-doctype via `fieldtype: 'PrimaryKey'` — remove global `pkField` from plugin options

## Context and Problem Statement

`StonecropPluginOptions.pkField` was a single global string applied indiscriminately to every
doctype registered with the plugin. Every doctype's PK was assumed to be in the column named
by `pkField`. This is architecturally wrong: different doctypes can have different PKs, and
some doctypes (read-only views, junction tables, append-only logs) have no meaningful PK at all.
A global plugin-level config cannot express per-doctype identity.

## Decision Drivers

* Different doctypes legitimately have different PK fieldnames (`id`, `rowId`, `itemId`, etc.)
* PK-less doctypes (views, junction tables) must not be forced to declare a phantom PK column
* `fieldtype` already drives middleware behaviour for `'Display'` (excluded from SELECT) and
  `'Link'` (excluded from SELECT when backed by a `links` declaration) — using it for PK
  detection is consistent with the established dispatch pattern
* `StonecropFieldType` is `z.string().min(1)` — any non-empty string is already valid; no Zod
  change is needed to introduce `'PrimaryKey'`

## Considered Options

* Path A — global column name + `getPkResultKey` helper to recover the row key after SQL aliasing
* Path B — global fieldname + `camelToSnake` in SQL (keeps global config, fixes column derivation)
* Path C — `primaryKey?: boolean` flag on `FieldMeta` alongside `fieldtype`
* `fieldtype: 'PrimaryKey'` on the PK field in the doctype schema (chosen)

## Decision Outcome

Chosen option: "`fieldtype: 'PrimaryKey'`", because it expresses per-doctype identity in one
property, is consistent with the existing `Display`/`Link` fieldtype dispatch pattern, and
requires no Zod schema change.

The middleware detects the PK via `meta.fields.find(f => f.fieldtype === 'PrimaryKey')`.
When no such field is declared:
- `stonecropRecord` returns `{ data: null }` — cannot fetch by ID without a declared PK
- `stonecropRecords` proceeds normally — PK is not required for list/filter/sort

### Consequences

* Good, because `getSqlColumns` loses its `pkField` parameter — simpler signature with no
  global assumption baked in
* Good, because `StonecropPluginOptions` loses `pkField` entirely — smaller public API surface
* Good, because PK-less doctypes work naturally without workarounds
* Good, because PK declaration is co-located with the doctype field definition — no separate
  plugin config to synchronize with doctype changes
* Neutral, because `required` is independent of `fieldtype: 'PrimaryKey'` — user-defined
  natural keys may set `required: true`; DB-generated PKs typically omit it; no opinion
  is baked into the fieldtype
* Bad, because existing doctypes must update their PK field's `fieldtype` from `'Data'` to
  `'PrimaryKey'` — a mechanical one-line-per-doctype migration

## Pros and Cons of the Options

### Path A — global column name + `getPkResultKey` helper

* Good, because it is a middleware-only change with no schema impact
* Bad, because it still applies one PK column name to all doctypes — fails silently when any
  doctype's PK column differs from `pkField`
* Bad, because the helper adds complexity to recover the correct row key after SQL aliasing

### Path B — global fieldname + `camelToSnake` in SQL

* Good, because it correctly derives the PK column via `camelToSnake(pkField)`, fixing the
  column-not-found error for a single consistent PK fieldname across all doctypes
* Good, because it is a very narrow change (middleware + one line in the FAB preset)
* Bad, because it still assumes all doctypes share the same PK fieldname — wrong for a
  multi-doctype system

### Path C — `primaryKey?: boolean` flag on `FieldMeta`

* Good, because it is per-field and avoids global assumptions
* Bad, because a field carries BOTH a semantic type (`fieldtype: 'Data'`) AND a separate
  identity flag (`primaryKey: true`) — two overlapping semantic properties on the same field
* Bad, because it adds a new optional property to `FieldMeta` that only matters to the
  PostgreSQL middleware — not a natural schema-layer concern

### `fieldtype: 'PrimaryKey'`

* Good, because one property expresses the complete meaning — consistent with how `'Display'`
  and `'Link'` fieldtypes already carry semantic meaning that affects SQL generation
* Good, because `StonecropFieldType` accepts any non-empty string — no Zod change required
* Good, because `'PrimaryKey'` is self-documenting in JSON doctypes
* Neutral, because it is added to `BUILTIN_FIELD_TYPES` in `schema/src/fieldtype.ts` for
  documentation purposes only — no runtime enforcement change

## More Information

`required` is intentionally kept independent of `fieldtype: 'PrimaryKey'`. A natural business
key (product SKU, document number) is both the PK and required. A DB-generated surrogate key
(`serial`, `uuid`) is the PK but not required from the application's perspective (the DB
supplies it). The schema stays flexible for both patterns.

When `2b_schema_types.md` Phase 4 lands (`DoctypeMeta.fields` → `DoctypeField[]`), the
`getPkMeta` predicate and the `getSqlColumns` field iteration will need `f.kind === 'field'`
narrowing added — `FieldsetField` and `TableField` have no `fieldtype` property. This is
acknowledged rework; `TODO(schema-types Phase 4)` comments are left at those sites.
