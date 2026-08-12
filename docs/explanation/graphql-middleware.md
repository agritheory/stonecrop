---
title: GraphQL Middleware
description: Architecture and design of @stonecrop/graphql-middleware
---

# GraphQL Middleware

This document explains how `@stonecrop/graphql-middleware` works and why it is built the way it is. If you want step-by-step setup instructions, see [Setting Up the GraphQL Middleware](../guides/graphql-middleware-setup.md).

## How data flows through the middleware

Stonecrop's GraphQL middleware is built on PostGraphile v5 and Grafast, PostGraphile's query planning engine. This matters because the resolvers you see — `stonecropRecord`, `stonecropRecords`, `stonecropAction` — are not traditional GraphQL resolvers. They are Grafast *plan steps*.

A traditional resolver is a function that runs when a field is requested and returns data. A Grafast plan step is defined during query *planning*, before any data is fetched. Grafast collects all the plan steps for a query, optimises them, and then executes them as a batch. This is why the plan functions take `$`-prefixed step arguments (`$doctype`, `$id`) rather than resolved values — those arguments are references to future values, not values themselves.

`stonecropRecord` and `stonecropRecords` use `loadOneWithPgClient` from `@dataplan/pg`. This function is specifically designed for batching: when multiple records of the same doctype are requested in a single GraphQL query, Grafast merges them into one SQL call. A query that resolves ten `stonecropRecord` fields for the same doctype issues one `SELECT … WHERE id = ANY($1)` rather than ten separate queries.

`stonecropAction` uses `sideEffectWithPgClient`. Unlike `loadOneWithPgClient`, this is not batched — each mutation is a single, isolated database call. The distinction matters: batch-coalescing a mutation is almost never correct, and Grafast uses separate step types to enforce this distinction at the type level.

The `PgExecutor` — the object that provides the database connection — is discovered automatically from `build.input.pgRegistry.pgExecutors` during schema construction. You do not need to pass an executor to `createStonecropPlugin`; it finds whichever executor your `pgServices` configuration wired up.

## Fetch strategies

`stonecropRecord` returns a single record, but records often have related data: line items on an order, an address on a customer, a computed summary across child rows. Rather than always fetching everything (expensive for large trees) or never fetching links (forcing clients to issue many follow-up queries), the middleware gives each link a *fetch strategy* via the `fetch` field in its `LinkDeclaration`.

**`sync`** means linked records are fetched in the same resolver call and merged into the parent record's `data` payload. When the strategy is `sync`, the middleware issues an additional SQL query for that link and attaches the result directly. For `noneOrMany` and `atLeastOne` links (one-to-many), the default strategy is `sync`. Sync makes sense when the linked data is small and almost always needed.

A many-side link is capped at `fetch.limit` if the declaration names one, and otherwise at the server's `defaultRecordLimit` — the same option that caps `stonecropRecords`, because a link is a list fetched a different way. When a cap cuts a relation short, the field's name appears in `truncatedLinks` on the result. Guard on it: a link cannot be paged, so writing back a relation you only partly received deletes the rest.

**`lazy`** means the link is absent from the response entirely. The client retrieves it separately via `stonecropRecords` with a `filters` argument pointing back at the parent. For `atMostOne` and `one` links (many-to-one or one-to-one), the default strategy is `lazy`. Lazy is appropriate when the linked data is large, rarely needed, or retrieved conditionally.

**`custom`** delegates fetching to a registered handler function. Custom strategies are for cases that neither `sync` nor `lazy` can express cleanly — aggregations, multi-table joins, remote service calls. The handler receives the active `PgClient`, the parent record, and the link declaration, and returns a record or array of records.

The `stonecropRecord` query accepts an `options` argument with an `includeNested` field. Pass `true` to include all links, or pass an array of link names to include only those. When `includeNested` names a link that does not exist on the doctype, that name is returned in `unknownLinks` on the result object. This helps clients detect configuration errors: if `unknownLinks` is non-empty, a requested link name is not declared in the doctype schema.

## Writing records

There is one write path, and it is `stonecropAction`. Saving is a *self-transition* — an action declaring `selfTransition: true` — so there is no create mutation, no update mutation, and no separate create action. The client sends the record's id to update it and **sends no id to create it**; that absence is the entire signal, which is why a draft dispatches without one.

What a write may set comes from the doctype, not from the request. The patch is intersected with the doctype's declared, column-backed fields — the same derivation the read path selects — so what a record exposes is what a record accepts. Keys naming no column are discarded, as are values that arrive as nested objects where the column holds a scalar (the shape a read-modify-write produces for an expanding link). Everything discarded is listed in `droppedFields` on the result. The action still succeeds; report it, because those keys are data the user believes was saved.

Two things a patch can never set. `status` is one: state moves through `nextState`, guarded by `allowedStates`, and a patch that could write the state column would walk straight past the guard. Identity is the other — on create the declared primary key passes through only when the record itself carries it, which is what a natural-keyed doctype's user-entered key looks like; otherwise the column default mints it. The initial workflow state comes from the column default too. Nothing reads `workflow.states` for it: that array is unordered and has no initial marker, and a record being created is in no state for `allowedStates` to constrain.

An id that was dispatched but matched no row is refused rather than created. It means the record went away since the client read it, and creating a replacement under a new identity would report success for a lost update.

## Why there is no `DataAdapter` base class yet

Stonecrop's middleware currently targets one backend: a PostgreSQL database accessed through PostGraphile's Grafast pipeline. A natural next question is: should there be a `DataAdapter` interface so that a REST API, a localStorage cache, or a different database could be swapped in?

The short answer is: not yet, and deliberately so.

Grafast plan steps and promise-based I/O are not compatible models. `loadOneWithPgClient` is a *synchronous* call that registers a step in Grafast's execution plan — it returns a `LoadOneStep` object immediately, without awaiting anything. A promise-based backend would return `Promise<T>`, which cannot fulfil the same contract without a wrapper step that re-enters the Grafast planning lifecycle. If you forced a common `findById(id): Promise<T>` interface onto both models, one side would need a bridge that defeats the purpose of the abstraction.

More broadly, the correct time to design an abstraction is when you have at least two concrete implementations to generalise from. A single implementation produces an abstraction that matches that one implementation — which is not an abstraction, just an extra layer of indirection. When a second backend is needed, its requirements will reveal which parts of the interface are genuinely shared and which were accidents of the PostgreSQL path. The interface will be better for waiting.

The ADR at `graphql_middleware/docs/decisions/0003-deferred-dataadapter-abstraction.md` records this decision formally.

## Related Documentation

- [Setting Up the GraphQL Middleware](../guides/graphql-middleware-setup.md) — Step-by-step configuration guide
- [Custom Fetch Handlers](../guides/custom-fetch-handlers.md) — Implementing handlers for the `custom` fetch strategy
- [Doctypes](../explanation/doctype.md) — Document type system and schemas
