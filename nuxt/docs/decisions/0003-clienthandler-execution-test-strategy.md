---
status: accepted
date: "2026-06-25"
deciders: ['Rohan Bansal']
---
# Guard clientHandler execution with a jsdom composable test; defer real-browser e2e

## Context and Problem Statement

clientHandler execution needs a regression guard so future changes don't silently break the dispatch envelope, the supersede semantics, the HST writeback, or the injected capabilities. The instinct is "a real browser test, to catch regressions in the future." The question is whether a real browser is the right tool for *this* regression surface, given what the execution path actually does and what test infrastructure the repo has.

## Decision Drivers

* The execution path is **browser-agnostic**: `new AsyncFunction`, a dispatch call, an in-memory `vue-router`, and an HST writeback. None of it depends on real-DOM behavior, layout, workers, or navigation — it runs identically in jsdom and Chromium.
* The repo's `@nuxt/test-utils` e2e harness is currently `describe.skip` — a `@vue/compiler-sfc@3.5.x` / `magic-string` interop bug breaks `setup()` under vite-node (fixed in Vue 3.6+) — and no Playwright is installed. A browser test built on it today would be born skipped, catching nothing.
* `vitest` browser mode is independent of `@nuxt/test-utils` (it renders via `vitest-browser-vue`, so it dodges the `setup()` skip) but still requires installing a Playwright/webdriverio provider for CI, and gives no Nuxt auto-imports — so it would mock the same dependencies a jsdom test does, in a real browser, for no execution-fidelity gain.

## Considered Options

* Option 1 — real-browser e2e via `@nuxt/test-utils` `createPage`.
* Option 2 — `vitest` browser mode + `vitest-browser-vue` + a Playwright provider.
* Option 3 — a jsdom/node composable integration test with mocked `stonecrop`/`vue-router` and the real executor (chosen).

## Decision Outcome

Chosen option: "Option 3". A jsdom/node test runs the **real** `executeClientHandler` against a mocked `stonecrop` + `vue-router`, feeding a synthetic `@action` payload and asserting the actual downstream behavior: the `[{id,data}]` dispatch envelope, supersede (a navigation handler fires zero dispatch), the live-`record` injection, `graphql.query`, and no-writeback-on-failure. Coverage is `executeClientHandler` 8/8 unit + `useClientAction` 6/6 integration. Real-browser e2e is deferred; if it is later built, it should target the **Monaco authoring** surface (real DOM + workers), which genuinely needs a browser, not execution.

### Consequences

* Good, because it is deterministic, runs in CI today with no new dependencies, and catches the regressions the feature actually introduced.
* Good, because it avoids a Vue 3.6 upgrade and a Playwright install that the execution surface does not justify.
* Bad, because the Desktop-render → `emit('action')` → host-`@action`-binding seam is not covered — the test mocks the emit; that seam stays `vue-tsc` + manual.
* Neutral, because on the current stack a browser test would be `describe.skip` and so would catch nothing — deferral loses no coverage that exists today.

## More Information

Tests: `stonecrop/tests/core/client-handler.spec.ts` and `nuxt/test/useClientAction.test.ts` (the latter `@vitest-environment node`, with `vi.mock` keeping the real `executeClientHandler` while overriding `useStonecrop`/`useRouter`). Real-browser e2e is blocked on the Vue 3.5.x → 3.6+ upgrade (to un-skip `@nuxt/test-utils` `setup()`) plus a Playwright install — a separate infrastructure initiative, tracked independently of clientHandler work.
