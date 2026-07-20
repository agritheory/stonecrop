# 0006 — `tableName` Removed from Schema; Middleware Derives FROM Target

**Status:** Accepted
**Date:** 2026-05-26
**Deciders:** Stonecrop core team

---

## Context

`DoctypeMeta` previously carried a `tableName: string` field that the middleware used
as the PostgreSQL `FROM` clause target. This created a schema-layer coupling to a
specific data source concept: a doctype is an abstract description of a record type,
not a database table. Making `tableName` part of the schema forced schema authors to
know the DB layout before defining their types, and leaked a PostgreSQL-specific concept
into what should be a data-source-agnostic layer.

Hard requirement established by the team: `tableName` must not exist in `DoctypeMeta`.
The schema describes WHAT data looks like, not HOW or WHERE to fetch it.

---

## Decision

Remove `tableName` from `DoctypeMeta` (Zod schema and TypeScript type).

The PostgreSQL middleware derives the FROM clause target via convention, with a
plugin-level override map for exceptions:

```typescript
export interface StonecropPluginOptions {
  tables?: Record<string, string>  // doctype name → FROM clause target
}
```

The `resolveTableName` helper encapsulates the logic:

```typescript
function resolveTableName(name: string, tables?: Record<string, string>): string {
  const target = tables?.[name] ?? camelToSnake(name)
  const dotIndex = target.indexOf('.')
  if (dotIndex > 0) {
    return `"${target.slice(0, dotIndex)}"."${target.slice(dotIndex + 1)}"`
  }
  return `"${target}"`
}
```

- Default: `camelToSnake(doctype.name)` — e.g., `ScItem → sc_item`, `PlanningPeriod → planning_period`
- Override: `tables: { Planner: 'plan' }` for doctypes where convention fails
- Schema-qualified: `tables: { Plan: 'orpin.plan' }` emits `"orpin"."plan"` (dot detected, split correctly)
- Values may be bare identifiers or `schema.table` pairs. SQL fragments are not supported.

Also removed: `deriveTableName` option from the schema converter (`GraphQLConversionOptions`),
since the converter no longer generates `tableName` in its output. `tableName: String` also
removed from the `StonecropDoctypeMeta` GraphQL SDL type.

---

## Verified Data (FAB doctypes)

| Doctype | `camelToSnake(name)` | Actual table | Needs override? |
|---------|----------------------|--------------|-----------------|
| Company | company | company | no |
| Location | location | location | no |
| Plan | plan | plan | no |
| **Planner** | **planner** | **plan** | **yes** |
| PlanningPeriod | planning_period | planning_period | no |
| Recipe | recipe | recipe | no |
| RecipeTask | recipe_task | recipe_task | no |
| Resource | resource | resource | no |
| User | user | user | no |

8 of 9 FAB doctypes resolve correctly by convention. `Planner` is the only exception —
it is a distinct doctype projection over the `plan` table, which pure convention cannot
express. The override map handles this: `tables: { Planner: 'plan' }`.

Note: `orpin.plan` appeared in DDL seed scripts but not in any runtime doctype JSON.
It was a phantom concern and does not affect this decision.

---

## Alternatives Considered

**Option 1 — Pure convention (`camelToSnake(name)`):** Elegant for the common case but
fails silently when two doctypes share a table (e.g., Planner → plan). Silent failures
on a required mapping are unacceptable. Rejected.

**Option 2 — All-explicit adapter config map (every doctype listed):** Fully correct but
requires a mapping entry for every doctype — not just exceptions. Every new doctype
becomes two artifacts. Rejected.

**Option 3 — PostGraphile introspection:** Couples the middleware to PostGraphile's internal
type graph. Fails for views, materialized views, or tables PostGraphile was not told about.
Circular dependency smell. Rejected.

**Option 4 — Optional `tableName` on schema:** Keeps the field on the schema for non-standard
cases. Violates the hard requirement that `tableName` not exist in the schema layer. Rejected.

**Option B (chosen) — Convention + plugin override map:** Satisfies the hard requirement
(schema knows nothing about DB tables), handles the Planner/plan exception via explicit
configuration, and correctly emits schema-qualified identifiers via dot detection.

---

## Consequences

- Schema authors need no DB knowledge when defining doctypes.
- The middleware adapter owns all DB-layer naming, consistent with ADR-0003.
- When convention fails (shared tables, schema-qualified names), the plugin `tables` option
  provides an explicit escape hatch with correct PostgreSQL identifier quoting.
- The schema converter (`stonecrop-schema generate`) no longer emits `tableName` in generated
  doctype JSON. Existing generated files with `tableName` are silently dropped by Zod's default
  strip behavior — no validation failures, but manual cleanup is recommended.
- Remove `tableName` from all 9 doctype JSONs; add `tables: { Planner: 'plan' }`
  to `createStonecropPlugin()` in the graphile preset.
