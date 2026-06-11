---
status: accepted
date: "2026-06-11"
deciders: ['Rohan Bansal']
---
# Document the action-handler casing contract instead of adding a conversion mechanism

## Context and Problem Statement

Action handlers dispatched via `stonecropAction` receive `context.pgClient` and may query the database directly. Rows returned by raw `pgClient.query()` carry snake_case column names, while the middleware's own read paths (`stonecropRecord`, `stonecropRecords`) return camelCase fieldname keys by aliasing columns at the SQL layer (`"display_name" AS "displayName"`, see ADR 0004). A handler that returns raw query rows therefore leaks snake_case keys to the client. The question is where the conversion responsibility lives and whether the framework should add a mechanism.

An earlier plan proposed exposing `snakeToCamel` through `ActionContext`. That option was rejected during investigation: it recreates the opt-in-correctness shape ADR 0004 explicitly rejected (forgetting it ships wrong casing silently), and it adds no capability — `snakeToCamel` is already a public export of `@stonecrop/schema`.

## Decision Drivers

* ADR 0004 establishes that the data-access layer owns naming conversion, invisible to callers, with no opt-in configuration
* Action dispatch is deliberately pass-through: the handler's resolved value becomes `ActionResult.data` verbatim, and handlers may return domain objects the framework does not own
* The casing gap only manifests for PostGraphile deployments with custom handlers doing raw SQL — a stage-two scenario with no affected users yet
* The deferred `DataAdapter` abstraction (ADR 0003) is the natural future owner of naming for handler-initiated reads, and it is gated on real adoption revealing a second backend

## Considered Options

* Option 1 — Document the contract: TSDoc on `ActionHandler`/`ActionContext` stating that handler return values are API-layer data (camelCase fieldname keys), with the two conversion recipes (SQL aliases, or `snakeToCamel` from `@stonecrop/schema`) (chosen)
* Option 2 — Expose the middleware's aliasing machinery to handlers (export `getSqlColumns(meta)` or provide a `queryDoctypeRows(pgClient, meta, where)` helper)
* Option 3 — Centrally deep-convert handler result keys at the dispatch boundary

## Decision Outcome

Chosen option: "Option 1 — document the contract", because it adds zero API surface for a gap with no affected users, is consistent with handlers being application-owned (ADR 0003), and does not pre-empt the `DataAdapter` design that should ultimately own this.

### Consequences

* Good, because the contract is stated at the exact point a handler author reads (`ActionHandler` / `ActionContext.pgClient` TSDoc, shipped in the published `.d.ts`)
* Good, because nothing shipped now needs to be un-shipped when the `DataAdapter` lands
* Bad, because the contract is advisory — a handler author who skips the docs can still return snake_case rows; nothing fails loudly
* Neutral, because Options 2 and 3 remain open as future work (below)

## Pros and Cons of the Options

### Option 2 — Expose aliasing machinery to handlers (future work)

* Good, because handler SQL would inherit the ADR 0004 convention instead of each author re-deriving it
* Good, because it is the structurally aligned fix: the layer that talks to the database owns naming translation
* Bad, because it grows public API surface ahead of demand, and its shape (helper function vs. query builder vs. adapter method) should be decided by the `DataAdapter` design, not before it
* **Deferred until**: the `DataAdapter` abstraction is designed (ADR 0003), or enough handler authors hit the casing gap to justify a standalone helper earlier

### Option 3 — Central deep-conversion at the dispatch boundary (future work)

* Good, because it matches ADR 0004's "callers never need to know" principle end to end
* Bad, because it mutates user-returned values the framework does not own (nested structures, Dates, class instances) — pass-through is part of the handler contract
* Bad, because `snakeToCamel` on arbitrary keys is only safe for plain data shaped like rows; the dispatch layer cannot distinguish raw rows from intentional snake_case payloads
* **Deferred until**: evidence that documented convention fails in practice (recurring bug reports of snake_case leaking to clients despite the documented contract)

## More Information

The TSDoc carrying this contract lives on `ActionContext.pgClient` and `ActionHandler` in `graphql_middleware/src/types/index.ts`. The middleware's own aliasing implementation is `getSqlColumns` in `graphql_middleware/src/plugin/postgraphile.ts`, which is the reference behaviour any future Option 2 helper should reproduce.
