---
status: accepted
date: "2026-06-25"
deciders: ['Rohan Bansal']
---
# Execute clientHandlers via a host-side composable, not inside the Desktop component

## Context and Problem Statement

The docbuilder lets an author store a `clientHandler` (a JavaScript function body) on a workflow transition. At runtime that code must execute with a small capability surface injected — `router`, `record`, `runAction`, `graphql` — when the user clicks the transition. The question is *where* that execution lives.

`@stonecrop/desktop` renders the action button, but it is a deliberately host-agnostic emitter: a transition maps to `action: () => emit('action', {...})` and the host app decides what to do. Desktop reads HST to render, but it does not dispatch and does not call `useRouter()`. The four injected capabilities span three owners — `router` (vue-router), `runAction`/`graphql` (core + the data client), `record` (view state) — and no single package holds all four except the host. So "run the authored code somewhere" forces a decision about which layer gains the authority to dispatch and to execute arbitrary stored JS.

## Decision Drivers

* `@stonecrop/desktop` is published and reused; widening its responsibility from "emit an intent" to "dispatch + run arbitrary author code" changes what the package *is*.
* The capability map cannot be assembled by any single package except at the host (the three-owner split above).
* clientHandler semantics, the Command render path, and the planned single-writer state enforcement are all still in flux — the change should be reversible.
* The pure executor (`new AsyncFunction(...names, code)(...values)`) and the capability-assembly are separable concerns regardless of where invocation happens.

## Considered Options

* Option A — the executor runs inside Desktop's thunk-builder (`getAvailableTransitions`), so Desktop runs the handler.
* Option B — Desktop stays a pure emitter; the host's `@action` handler delegates to a shared composable that invokes a pure executor (chosen).

The executor/assembly split — a concern-free `executeClientHandler` in core plus a capability-assembling composable — is common to both options; it is not the axis of decision.

## Decision Outcome

Chosen option: "Option B", because it keeps the authority to dispatch and to execute author code in the layer the architecture already assigns it to (the host), confines the change to application code plus one composable (so it is reversible while the feature settles), and leaves the published `@stonecrop/desktop` package an emitter.

Concretely: a pure `executeClientHandler(code, api)` lives in `@stonecrop/stonecrop` (`new AsyncFunction(...names, code)`); a `useClientAction()` composable in `@stonecrop/nuxt` assembles `{ router, record, runAction, graphql }` and calls it; the host's Desktop `@action` handler delegates to that composable (`fullstack/app/pages/index.vue` is one line: `@action="run"`).

### Consequences

* Good, because `@stonecrop/desktop` stays a host-agnostic emitter — it gains no dispatch, routing, or arbitrary-code-execution authority.
* Good, because the change is confined to host app code + the composable, and is easy to reverse.
* Good, because there is one shared definition (`useClientAction`) every host's action handler delegates to, instead of per-host duplication.
* Bad, because Vue gives a module no way to inject a component's `@action` handler from outside, so each host must bind `@action` to the composable itself — execution is not automatic for every `@stonecrop/desktop` host.
* Bad, because the click→binding seam (Desktop `emit('action')` → host `@action`) is exercised only by `vue-tsc` + manual testing; the composable test mocks the emit.

## Pros and Cons of the Options

### Option A — executor in Desktop

* Good, because execution lives where the click and the live context already are (no re-resolving in the host).
* Good, because it is universal — any app mounting `@stonecrop/desktop` runs clientHandlers with zero host wiring.
* Good, because Commands also render in Desktop, so both action kinds would execute in one place.
* Bad, because it converts a published, reusable emitter into a dispatcher + arbitrary-code runner — a categorical widening of the package's role.
* Bad, because it bakes the change into a `dist`-consumed package (rebuild, version bump, every consumer affected) and is hard to reverse.
* Neutral, because Desktop deliberately routes through a `routeAdapter`, so it has no clean concrete `router` to inject anyway — the would-be locality advantage is smaller than it looks.

## History

* **2026-06-25** — decided (Option B).
* **2026-08-11** — the composable **moved to `@stonecrop/stonecrop`**; `@stonecrop/nuxt` re-exports it so hosts and the auto-import are unchanged. The decision itself stands — Desktop is still a pure emitter, and the host still binds `@action` — but this ADR's stated reason for putting the composable in the *Nuxt* package does not: it said the four capabilities "cannot be assembled by any single package except at the host", and on measurement three come from Stonecrop while `vue-router` was already a `@stonecrop/stonecrop` peerDependency, imported in `registry.ts`. Nothing in it was Nuxt-specific. The cost of the mistake was a two-tier split: Nuxt hosts got the blessed write path in one line, every other Vue host re-derived ~60 lines, and **both that did — `examples/desktop` and the FAB consumer — wrote the result back under the id they dispatched**, which is wrong for exactly the created record. Three overrides (`buildArgs`, `followRecord`, `onError`) now cover what genuinely varies; identity resolution stays sealed.
* **2026-08-11** — the store write moved one layer further down, into `Stonecrop.dispatchAction`, so a host that never adopts the composable still cannot file a record under the wrong key. The composable keeps only what needs the *dispatched* id — dropping the stale key and following the route — because that id lives inside the opaque `args` array, which the lower layer must not parse.
* **2026-08-11** — the "module-provided default handler" deferred below is **no longer blocked**: it was waiting on "a host-provided fetch contract", and `DataClient` became exactly that. It stays deferred on its own merits — Desktop has no `vue-router` (it routes through `routeAdapter`, whose `NavigationTarget` cannot express `replace`), and all four hosts bind `@action` today, so a Desktop-side default would silently double-write until each migrated.

## More Information

Executor: `stonecrop/src/client-handler.ts`. Composable: `nuxt/src/runtime/app/composables/useClientAction.ts`. Host wire: `nuxt/fullstack/app/pages/index.vue`. Scope is **transitions only**; the Command render path is deferred (Desktop's `actionElements` renders only FSM transitions today). A "module-provided default handler" that would remove even the one-line host binding is deferred: it requires a `<StonecropDesktop>` wrapper that also owns `@load-record`/`@load-records`, which are host-specific data fetches, so it needs a host-provided fetch contract. Capability details live in [0002](0002-clienthandler-capability-contract.md); the test approach in [0003](0003-clienthandler-execution-test-strategy.md).
