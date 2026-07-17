---
status: accepted
date: "2026-06-25"
deciders: ['Rohan Bansal']
---
# Remove the inert `ActionDefinition.args` config bag from the schema

## Context and Problem Statement

`ActionDefinition` carried `args?: z.record(z.string(), z.unknown())` — a static, per-action configuration bag declared on the schema and propagated into the GraphQL SDL (`StonecropWorkflowAction`). It was never read by any runtime branch: the only thing that touched it was the template resolver mapping it into the SDL response. It is also easy to confuse with a *different*, live `args` — the record ids / form data passed to `runAction` / `stonecropAction` at dispatch time — which is unrelated and stays.

Workflow handlers are bespoke per action for the foreseeable future, so there is no static-config consumer that `ActionDefinition.args` was serving. A field that is plumbed schema → SDL → resolver but read nowhere is dead weight that *looks* configurable and does nothing. This mirrors [ADR 0006](0006-tablename-removed-from-schema.md), which removed `tableName` from the schema for the same "the schema should not carry inert/leaked concepts" reason.

## Decision Drivers

* The field is inert — read by no runtime branch; only mapped into the SDL.
* There is no production consumer yet (pre-stable), so a breaking removal is acceptable now and only gets more expensive later.
* Keeping it invites authors to set it expecting an effect, and invites confusion with the live dispatch `args`.

## Considered Options

* Option 1 — keep `ActionDefinition.args` for possible future static-config use.
* Option 2 — remove it entirely across schema, SDL, resolver, client, and fixtures (chosen).

## Decision Outcome

Chosen option: "Option 2". Remove `ActionDefinition.args` across all nine sites: the Zod field (`@stonecrop/schema`), the `StonecropWorkflowAction` SDL type, the resolver passthrough, the template-drift test assertion, both `getMeta` client query selections, the `getActionMeta` return type, the `doctype.spec` fixture, the injected docbuilder stub, and a stale comment. The dispatch `args` (`stonecropAction(..., args: JSON)` mutation argument and the `runAction` parameter) is **preserved** — it is a different concept.

### Consequences

* Good, because the schema no longer advertises a configurable field that has no effect.
* Bad, because it is a breaking public-API change (Zod schema, GraphQL SDL, and the client query shape), requiring a pre-stable version bump and Rush change files.
* Neutral, because if a genuine static-config need emerges it can be re-added deliberately, with a runtime consumer this time.

## Validation

The template-drift test (`graphql_middleware/tests/typeDefs.test.ts`) compares `Object.keys(ActionDefinition.shape)` against the parsed SDL fields, so SDL ↔ schema parity is enforced automatically. Full suites pass after removal: schema 170, graphql-middleware 162 (incl. drift), stonecrop 528, graphql-client 26.

## More Information

The initial estimate was "6 sites"; it became nine. The extra three (`getActionMeta` return type, the `doctype.spec` fixture, the injected stub) plus the SDL surfaced only when the drift test failed — the schema `dist` had to be rebuilt and a fixture sweep run. The lesson (verify a removal across its whole surface, not a narrow grep) is recorded in working-style memory rather than here.
