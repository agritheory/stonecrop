---
status: accepted
date: "2026-05-19"
deciders: ['Tyler Matteson', 'Rohan Bansal']
---
# Defer the `DataAdapter` abstraction until a second backend implementation exists

## Context and Problem Statement

`@stonecrop/graphql-middleware` currently targets one backend: a PostgreSQL database accessed via PostGraphile's Grafast pipeline. A natural question is whether to introduce a `DataAdapter` abstract base class or interface so that future backends (a REST API, localStorage, a different database) can slot in without changing the public API. The question is whether to design that abstraction now or wait.

## Decision Drivers

* PostGraphile v5 plan steps (`loadOneWithPgClient`, `sideEffectWithPgClient`) are synchronous plan-composition primitives — they register a step in Grafast's execution graph and return immediately; they cannot be `await`ed
* A promise-based external backend would need to return `Promise<T>`, which cannot implement the same interface as a Grafast step without a bridge wrapper that re-enters the planning lifecycle
* Premature abstractions are consistently harder to change than no abstraction — the rule of three applies: design from at least two concrete implementations

## Considered Options

* Design a `DataAdapter` interface now targeting both PostGraphile plan steps and future promise-based backends
* Defer the abstraction until a second concrete backend exists alongside the PostGraphile implementation

## Decision Outcome

Chosen option: "Defer the abstraction", because the two execution models (Grafast plan steps vs. async I/O) are incompatible in a way that no shared `findById(id)` interface can paper over without one side losing the benefit of its model.

### Consequences

* Good, because the PostGraphile path is clean — no adapter indirection, no bridge steps, no interface to satisfy
* Good, because when a second backend is built, the interface will be shaped by both implementations rather than guessed from one
* Bad, because adding a second backend in the future requires an interface extraction alongside the new implementation rather than just implementing a pre-existing interface
* Neutral, because this ADR documents the intent so the reasoning is not lost when someone later asks "why is there no `DataAdapter`?"

## Pros and Cons of the Options

### Design a `DataAdapter` interface now

* Bad, because `loadOneWithPgClient` returns a `LoadOneStep` (a synchronous Grafast plan object) — wrapping it behind a `findById(id): Promise<T>` interface requires a bridge step that defeats native batching
* Bad, because the interface will be shaped entirely by the PostgreSQL path, making it a leaky abstraction that breaks when a second backend reveals different requirements
* Neutral, because it would let callers swap backends without touching the plugin code — but only if the interface were correct, which it cannot be from one implementation

### Defer the abstraction

* Good, because no adapter indirection means one fewer moving part in the critical data path
* Good, because the correct interface emerges from two implementations rather than being invented from one
* Neutral, because the migration cost when a second backend arrives is bounded: extract the interface, adapt the PostGraphile implementation, implement the new backend

## More Information

The incompatibility between Grafast plan steps and promise-based I/O is structural: Grafast's planning phase is synchronous. Steps are registered by calling functions like `loadOneWithPgClient(executor, inputStep, callback)` during schema build or query planning — the callback is not invoked until the execution phase. A promise-based backend's `fetch(id)` call returns a `Promise` that must be `await`ed, which cannot happen in the planning phase. A bridge (`loadOne(() => fetch(id))`) would work but would prevent the batching that makes `loadOneWithPgClient` valuable in the first place.
