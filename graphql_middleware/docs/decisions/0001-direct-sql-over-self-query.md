---
status: accepted
date: "2026-05-19"
deciders: ['Tyler Matteson', 'Rohan Bansal']
---
# Use direct parameterised SQL via `loadOneWithPgClient` instead of PostGraphile self-queries

## Context and Problem Statement

The original `stonecropRecord` and `stonecropRecords` resolvers issued HTTP self-queries through PostGraphile using `executor.query()`. This required the middleware to construct valid GraphQL query strings, including correctly-cased field names that matched PostGraphile's inflection. A parallel `StonecropInflectionConfig` type had to mirror PostGraphile's naming conventions so that generated queries matched the schema. Every resolver call made an HTTP round-trip back through PostGraphile, preventing Grafast's native batching from working.

## Decision Drivers

* Eliminate the HTTP round-trip per resolver call
* Remove `StonecropInflectionConfig` and all query-string-building helpers — a parallel naming system that had to stay in sync with PostGraphile's inflection rules
* Enable Grafast's native batching so that multiple `stonecropRecord` calls in one GraphQL request are coalesced into one SQL query per doctype

## Considered Options

* HTTP self-query via `executor.query()` — original approach
* Direct parameterised SQL via `loadOneWithPgClient` from `@dataplan/pg`

## Decision Outcome

Chosen option: "Direct parameterised SQL via `loadOneWithPgClient`", because it removes a full HTTP round-trip, eliminates the naming-mirror problem entirely, and gives Grafast native batching without additional work.

### Consequences

* Good, because no PostGraphile naming knowledge is required in middleware SQL generation — column names come directly from doctype field definitions
* Good, because Grafast batches multiple record fetches for the same doctype into a single `SELECT … WHERE id = ANY($1)` automatically
* Good, because `StonecropInflectionConfig`, `buildRecordQuery`, `buildListQuery`, and all related query-building helpers can be deleted
* Bad, because `@dataplan/pg` must be an explicit `dependency` in `package.json` — `loadOneWithPgClient` is not re-exported from the `postgraphile` package, so it cannot be picked up transitively
* Neutral, because integration tests now require a real database connection; unit tests use `FakePgResourcesPlugin` to build the schema without one

## Pros and Cons of the Options

### HTTP self-query via `executor.query()`

* Good, because it stays at the GraphQL abstraction layer — the middleware never writes SQL directly
* Bad, because each resolver call adds an HTTP round-trip even when the request originates from the same process
* Bad, because generating correct GraphQL query strings requires knowing PostGraphile's inflection rules, creating a coupling that breaks whenever naming conventions change
* Bad, because Grafast cannot batch self-queries — each call is an independent HTTP request

### Direct parameterised SQL via `loadOneWithPgClient`

* Good, because column names are taken directly from doctype field definitions — no naming conventions to mirror
* Good, because `loadOneWithPgClient` participates natively in Grafast's batch planning
* Good, because parameterised queries (`$1`, `$2`, …) are safe against SQL injection by construction
* Neutral, because the middleware now owns the SQL generation for all record fetches
