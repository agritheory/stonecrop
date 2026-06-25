---
status: accepted
date: "2026-06-25"
deciders: ['Rohan Bansal']
---
# clientHandler capability contract: runAction is the only blessed write, graphql is read-only

## Context and Problem Statement

A `clientHandler` runs in the browser with named capabilities injected by the assembly composable (see [0001](0001-clienthandler-execution-host-delegation.md)). The session already holds a live HST store and a GraphQL data client, so the question is what authority to hand authored code: which APIs are injected, and specifically whether a handler may issue arbitrary writes.

This is not a sandbox decision — `new AsyncFunction` can reach `fetch`/`window` regardless of what is injected, so withholding an API does not prevent a determined author from making a network call. The contract is about *intent and consistency*, not containment. Two consistency concerns drive it: every write must keep HST in sync, and a future transition-architecture wants the workflow-state field to have exactly one writer.

## Decision Drivers

* HST consistency: a write that does not write the result back into HST leaves the store stale.
* A future single-state-writer guard (the transition-architecture initiative) must not be bypassable from a clientHandler.
* The session already queries GraphQL to fill HST, so granting *read* access adds no new authority.
* `query` is the GraphQL transport's method, not a capability every `DataClient` implementation can honor (a REST/in-memory client cannot run `query(gqlString)`).

## Considered Options

* Option 1 — inject a generic `graphql` with both `query` and `mutation`.
* Option 2 — inject `router`, `record`, `runAction` (the only write), and a read-only `graphql.query`; no `mutation` (chosen).
* Option 3 — inject `runAction` only, no `graphql` at all.

## Decision Outcome

Chosen option: "Option 2". The executor injects `router`, `record`, `runAction`, and `graphql.query`. `runAction` is the **only blessed write** — it is `dispatchAction` **plus** `addRecord(result.data)`, and it owns the `[{ id, data }]` argument envelope every server handler destructures, so an author calls `runAction('Assign')` without knowing that shape. `graphql.query` is read-only and is probed structurally off `getClient()` (it is **not** added to the abstract `DataClient` interface). No `graphql.mutation` is injected.

### Consequences

* Good, because every write travels one HST-consistent, auditable path that will ride the future single-state-writer guard.
* Good, because read `query` is an ergonomic escape hatch for shapes the HST does not model, granting no authority the session lacks.
* Good, because probing `query` structurally keeps it a GraphQL-transport concern and leaves the shared `DataClient` abstraction untouched.
* Bad, because the contract is intent, not enforcement — an author can still call `fetch` directly; real authorization must live server-side.
* Bad, because an action carrying both a `clientHandler` and a server `handler` skips the server unless the handler itself calls `runAction` (the supersede footgun — document it).

## Pros and Cons of the Options

### Option 1 — generic graphql with mutation

* Good, because it is maximally flexible for the author.
* Bad, because a raw `mutation` bypasses the dispatch op-log, leaves HST stale, and dodges the future state-writer guard — exactly the invariants `runAction` exists to hold.

### Option 3 — runAction only, no query

* Good, because it is the smallest surface.
* Bad, because it withholds an ergonomic read the session is already entitled to make, with no security benefit (reads grant no new authority).

## More Information

The envelope contract is verified against the server handlers (`const [{ id }] = args`, `fullstack/server/plugins/stonecrop.ts`). An earlier plan example `runAction('Assign', [record.id])` was **broken** — it sent `['r1']`, so `args[0].id` was `undefined` — and was corrected to `runAction('Assign')`; the Monaco authoring stub's phantom `graphql.mutation` was removed to match. This contract is the client-side complement of the transition-architecture's server-side "single state-writer" goal; when that lands, `runAction` is the call that rides its guard.
