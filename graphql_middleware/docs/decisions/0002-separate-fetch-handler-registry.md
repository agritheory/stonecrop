---
status: accepted
date: "2026-05-19"
deciders: ['Tyler Matteson', 'Rohan Bansal']
---
# Create a separate fetch handler registry distinct from the action handler registry

## Context and Problem Statement

Stonecrop's middleware has two kinds of user-supplied callbacks: action handlers (invoked by `stonecropAction` to execute workflow transitions) and fetch handlers (invoked by `stonecropRecord` when a link uses the `custom` fetch strategy). When the `custom` fetch strategy was designed, a decision was needed: should fetch handlers share the existing action handler registry, or have their own?

## Decision Drivers

* Action handlers and fetch handlers have incompatible function signatures — sharing a registry would require callers to cast on retrieval
* A shared namespace creates a collision risk: a fetch handler named `submitOrder` would silently shadow an action handler of the same name
* The action handler registry is part of the public API; mixing two unrelated concerns would make both harder to reason about

## Considered Options

* Reuse the action handler registry (`registerHandler` / `getHandler`) for both kinds of callback
* Create a dedicated fetch handler registry (`registerFetchHandler` / `getFetchHandler`) in a separate module

## Decision Outcome

Chosen option: "Create a dedicated fetch handler registry", because the two handler types have different signatures, different callers, and different lifecycles. Mixing them in one registry would couple unrelated concerns and introduce a namespace collision risk.

### Consequences

* Good, because each registry has a single, clear purpose — `registry/actions.ts` for workflow callbacks, `registry/fetchHandlers.ts` for data-fetching callbacks
* Good, because there is no risk of a fetch handler shadowing an action handler under the same name
* Good, because the two registries can evolve independently — fetch handler signatures can change without touching action handler code, and vice versa
* Neutral, because tests that need a clean state must clear both registries (`clearHandlers()` and `clearFetchHandlers()`)

## Pros and Cons of the Options

### Reuse the action handler registry

Action handler signature: `(args: unknown[], context: ActionContext) => Promise<unknown>`
Fetch handler signature: `(pgClient: PgClient, parentRecord: Record<string, unknown>, link: LinkDeclaration) => Promise<record | record[]>`

* Bad, because the signatures are incompatible — storing both types in a `Map<string, Function>` requires unsafe casts at retrieval
* Bad, because a name collision (same string registered as both an action handler and a fetch handler) would cause a silent bug that is hard to trace
* Bad, because the public API surface becomes ambiguous: does `registerHandler('foo', fn)` register an action handler or a fetch handler?

### Create a dedicated fetch handler registry

* Good, because type safety is preserved end-to-end — `getFetchHandler` returns `FetchHandler | undefined`, not a generic function type
* Good, because the two registries are independently clearable in tests
* Neutral, because it adds one more module (`registry/fetchHandlers.ts`) to the package
