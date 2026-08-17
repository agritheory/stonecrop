---
status: accepted
date: "2026-08-04"
deciders: ['Rohan Bansal']
---
# Register server-side action effects on the adapter, keyed by (doctype, action)

## Context and Problem Statement

A doctype's `workflow.actions` can express exactly two outcomes: a cross-state transition (`nextState`) and a mutate-in-place self-transition (`selfTransition`). An action that is neither — a stateless Command such as `Recalculate Total`, `Post to Ledger`, or `Send Reminder` — has nothing for `applyGuardedTransition` to apply. It fails loudly, which is the correct report but leaves the action unimplementable.

This is load-bearing rather than cosmetic, because Stonecrop deliberately does not follow CRUD. There are no `stonecropCreate`/`Update`/`Delete` mutations anywhere — the Postgres adapter never had them, and they were later removed from the two nuxt hosts that did — so **actions are the only write path**. Every domain operation that is not a state change currently has nowhere to live.

The action-handler registry that once served this was removed in 0.14.0 (`4d691c99`, `2873799e`); `callHandler` has been documented as "still unimplemented" since. The consumer app that hit this (FAB) worked around it with a parallel dispatch plugin — 1314 lines, 51% of its GraphQL plugin surface — that intercepts `stonecropAction` and routes to its own registry, discarding the `allowedStates` guard to do so.

## Decision Drivers

* Doctypes are **runtime data**, edited live in DocBuilder. Anything that makes a doctype edit require a schema or client rebuild is disqualifying.
* The doctype author and the database author are different people. A DocBuilder user modelling a workflow cannot be asked to name a function in someone else's backend.
* The guard is a security boundary. Whatever supplies the effect must not be able to bypass `allowedStates`.
* `@stonecrop/graphql-client` ships five fixed operations and knows no doctypes; that genericity is the point.
* The workaround in the field demonstrated the failure mode: to get an effect, it threw away the guard.

## Considered Options

* Option 1 — Keep the generic `stonecropAction(doctype, action, args)` mutation and add an effect seam on the adapter, keyed by (doctype, action) (chosen)
* Option 2 — Generate a typed mutation per action (`approveOrder`, `recalculateOrderTotal`, …)
* Option 3 — Let the doctype name a handler, restoring a global `registerHandler(name, fn)` registry

## Decision Outcome

Chosen option: "Option 1", because it leaves doctypes as data, keeps the client generic, and splits authorship along the line that already exists — **the doctype decides whether an action may run and what state results; the adapter decides what actually happens**.

Concretely: `GuardedTransitionIO` gains an optional `runEffect`, and the Postgres adapter exposes it as `createStonecropPlugin({ actionHandlers })`, a `[doctype name][action key]` map. Nothing about the registration is published to the client — the routing table is a server concern, so there is no `hasServerHandler` flag in the meta and no way for a browser to enumerate what is wired.

Ordering is fixed and not configurable: guard, then effect, then state write. A handler therefore cannot grant permission, and a handler that throws cannot leave the record sitting in the target state.

### Consequences

* Good, because a stateless Command becomes implementable without any schema change — the SDL is byte-identical before and after.
* Good, because the guard survives. FAB's workaround exists precisely to obtain the effect, and it loses `allowedStates` in the process; this keeps both.
* Good, because an action may carry a transition *and* an effect, which is the common real case (`approve` posts to a ledger **and** moves to Approved).
* Good, because the seam is `runEffect` on the storage-agnostic IO interface, so every host wires it the same way — the two nuxt hosts do, and neither is PostGraphile.
* Bad, because the pairing between an action and its handler is checkable only where both are visible. A renamed doctype silently unregisters its handlers; the action then fails loudly at dispatch rather than at startup. `nuxt/test/adapter-conformance.test.ts` asserts the pairing for the hosts in this repo, and found three shipped actions that were already broken.
* Bad, because `args` remains an opaque `JSON` scalar. Handlers receive unvalidated browser input, documented at the type but not enforced.
* Neutral, because handler results are pass-through, so ADR 0007's casing contract applies to them unchanged.

## Pros and Cons of the Options

### Option 2 — A typed mutation per action

* Good, because arguments would be typed and validated by GraphQL instead of hidden inside a `JSON` scalar.
* Good, because the schema would document what each action accepts.
* Bad, and decisively so, because doctypes are edited at runtime: adding an action in DocBuilder would require regenerating the schema and rebuilding the client before the button worked.
* Bad, because it ends the generic client — `@stonecrop/graphql-client` would need per-doctype documents, so a doctype could no longer be pure data.
* Bad, because it is the CRUD shape this project has explicitly rejected.

### Option 3 — A named handler in the doctype

* Good, because the wiring would be visible in one place, and a missing handler could be reported at load time.
* Bad, because it puts the wrong author in charge: a DocBuilder user would be typing the name of a backend function they cannot see, in a field the Zod load gate already strips.
* Bad, because a flat global namespace collides across doctypes — the same objection ADR 0002 raised when separating fetch handlers from action handlers.
* Bad, because the name would cross the wire in `stonecropMeta`, publishing the server's routing table to every browser.

## Notes

`ActionHandlerContext` is the **Postgres adapter's** handler shape; it carries a `pgClient`. Other hosts define their own — the shared contract is `GuardedTransitionIO.runEffect`, not any one adapter's handler signature. The two nuxt hosts in this repo each define a small local context over their own store, which is the intended pattern for a consumer on a different backend.
