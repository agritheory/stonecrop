---
status: accepted
date: "2022-12-12"
deciders: ["Tyler Matteson", "Rohan Bansal"]
---

# Choose a Testing Framework for Rockfoil

## Context and Problem Statement

This project is intended to be a dependency framework in other applications, and as such its feature-set requires significant testing and coverage.

## Decision Drivers

* Easy to use (comparable to something established, like Jest)
* Easy to integrate with CI/CD
* Supports Typescript
* Provides coverage tooling

## Considered Options

* Jest
* Vitest

## Decision Outcome

Chosen option: "Vitest", because it meets the decision drivers and has a larger feature-set than Jest.

## More Information

Vitest uses [c8](https://github.com/bcoe/c8) for code coverage by default, which works well for the purposes of this project. The other option, [Istanbul](https://istanbul.js.org/), is a more established tool, but it is not as easy to use and does not natively support Typescript.
