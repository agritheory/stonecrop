---
# These are optional elements. Feel free to remove any of them.
status: accepted
date: "2022-12-15"
deciders: ['Tyler Matteson']

---
# Explain Current State of Dependencies

## Context and Problem Statement

As of the date of this decision, this project is currently being renovated with several important changes in features, dependencies and tooling. Documented the decisions that are being made now are in part a reflection of _not_ documenting the when the project was first prototyped.

## Considered Options

* GraphQL - Tag, Middleware
	- These packages are used for GraphQL parsing and represent significant work over writing them for scratch. There do not seem to be credible alternatives.
* Apollo - Gateway and Server
	- While Apollo gateway and server are not the only options with their feature set, the options are somewhat limited, at least in TypeScript
* Koa - Bodyparser, JWT, Proxy, Router
	- Koa's Promise-based API is nice and mature.
* Bcrypt
	- Used in the Auth plugins / examples
* JSONWebToken
	- Used in the Auth plugins / examples
* UUID
	-	Actually spec compliant as opposed to Nanoid

### Dependencies to be removed
* GraphQL Shield
	- This package's design and implementation differs too much from the hooks-based approach. It has be a separate middleware layer and would be difficult to implement in a fine-grained way.
* Install
	- Cruft and/or user error
* Koa Session Memory and Koa Session Minimal
	- These may be added back to show a session based example, but this really should be an implementation detail, not an opinion of this package
* Nodemon
	- To be replaced in a future PR with a more integrated solution
* Jest and Supertest
	- Not in use, to be replaced by Vitest in a future PR
* TOML
	- TOML is great configuration language but probably not the appropriate choice for this library, which would benefit from a more native and functional approach. The TOML dependency will be removed when the config APIs are refactor to support a `rockfoil.config.ts` approach.

## Decision Outcome
The options considered are listed above, many are default Adding a dependency will be considered a as part of the decision threshold for an ADR.
