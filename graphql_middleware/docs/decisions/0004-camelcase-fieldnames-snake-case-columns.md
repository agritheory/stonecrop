---
status: accepted
date: "2026-05-25"
deciders: ['Tyler Matteson', 'Rohan Bansal']
---
# Derive SQL column names via unconditional `camelToSnake` — fieldnames are API identifiers, not DB column names

## Context and Problem Statement

The `getSqlColumns` helper used `f.fieldname` verbatim as the PostgreSQL column identifier.
Fieldnames are derived from PostGraphile Amber's camelCase GraphQL field names (`displayName`,
`rowId`, `companyName`). PostgreSQL columns follow snake_case convention (`display_name`,
`row_id`, `company_name`). Queries like `SELECT "rowId" FROM "company"` fail at runtime with
`column "rowId" does not exist`.

## Decision Drivers

* `stonecrop-schema generate` derives fieldnames from GraphQL field names — the CLI is correct;
  fieldnames are the API/GraphQL layer identity, not the DB layer identity
* Doctypes should be data-source-agnostic: a `fieldname` describes a field in the GraphQL schema,
  not a column in a specific database
* The middleware is already PostgreSQL-specific (`loadOneWithPgClient` from `@dataplan/pg`) and
  is the correct place to own column name derivation for its data source

## Considered Options

* Option B — `fieldCasing: 'camel'` opt-in config on `createStonecropPlugin`
* Option D — Unconditional `camelToSnake` on all fieldnames when building SQL (chosen)

## Decision Outcome

Chosen option: "Option D — unconditional `camelToSnake`", because `camelToSnake` is idempotent
on snake_case input, no new configuration surface is added, and no existing users are broken.
The derivation mirrors the inverse of PostGraphile Amber's inflector, which converts `display_name`
→ `displayName` at schema build time; `camelToSnake` restores the original column name.

### Consequences

* Good, because SELECT, WHERE, ORDER BY, and backlink clauses all use `camelToSnake(fieldname)`
  as the PostgreSQL column identifier — callers never need to know DB naming conventions
* Good, because SQL aliases (`"display_name" AS "displayName"`) make query result rows carry
  fieldname keys — consistent with the GraphQL/API layer contract
* Good, because `camelToSnake` is idempotent on conventional snake_case fieldnames
  (`camelToSnake('item_id') === 'item_id'`) — all existing integration tests that use
  snake_case fieldnames pass without modification
* Bad, because if a PostgreSQL schema uses quoted mixed-case column names (a PostgreSQL
  anti-pattern), `camelToSnake(fieldname)` produces the wrong column name — no per-field
  `columnName` override exists yet (deferred pending a real edge case)

## Pros and Cons of the Options

### Option B — `fieldCasing: 'camel'` opt-in config

* Good, because it preserves verbatim fieldname-as-column behaviour for edge-case users
  with quoted mixed-case columns
* Bad, because the config option's existence implies the default (verbatim) is correct for
  some users — it is not; the default would be the broken behaviour
* Bad, because a user following the CLI-generated workflow who omits `fieldCasing: 'camel'`
  gets silent wrong SQL with no indication of the required config
* Bad, because it transfers cognitive burden to every new user of the Stonecrop CLI workflow

### Option D — Unconditional `camelToSnake`

* Good, because no configuration is required — correct behaviour is the default
* Good, because it is idempotent on snake_case: no existing conventional PostgreSQL schema breaks
* Neutral, because the middleware now unconditionally assumes a conventional snake_case PostgreSQL
  schema — a reasonable constraint given `@dataplan/pg` only supports PostgreSQL

## More Information

Option B remains viable if Stonecrop gains users with quoted mixed-case PostgreSQL column names.
In that scenario a `columnName?: string` property on `FieldMeta` (per-field override) would be
the cleaner escape hatch than a global `fieldCasing` toggle — it would handle the exceptional
column without affecting the general case.

This decision affects every SQL-generating site in `postgraphile.ts`:
- `getSqlColumns`: column list with `AS` aliases
- `stonecropRecord`: `WHERE "${pkColumn}"::text = ANY($1::text[])`
- `stonecropRecord` link fetch: `WHERE "${backlinkCol}"::text = $1` (many) and `WHERE "${targetPkColumn}" = $1` (one)
- `stonecropRecords`: `WHERE "${camelToSnake(field)}" = $N` (filter) and `ORDER BY "${camelToSnake(fieldName)}"` (sort)
