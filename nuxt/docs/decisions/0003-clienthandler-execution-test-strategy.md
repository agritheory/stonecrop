---
status: accepted
date: "2026-06-25"
revised: "2026-07-06"
deciders: ['Rohan Bansal']
---
# Guard clientHandler execution with a jsdom composable test; no browser e2e for this surface

## Context and Problem Statement

clientHandler execution needs a regression guard so future changes don't silently break the dispatch envelope, the supersede semantics, the HST writeback, or the injected capabilities. The instinct is "a real browser test, to catch regressions in the future." The question is whether a real browser is the right tool for *this* regression surface, given what the execution path actually does.

## Decision Drivers

* The execution path is **browser-agnostic**: `new AsyncFunction`, a dispatch call, an in-memory `vue-router`, and an HST writeback. None of it depends on real-DOM behavior, layout, workers, or navigation — it runs identically in jsdom and Chromium.
* The `@nuxt/test-utils` e2e harness is available (a vitest-config fix un-blocked it — see History), so a browser test is a *choice*, not forced. But for this surface it would mock the same dependencies a jsdom test does, in a real browser, for no execution-fidelity gain — at the cost of Playwright browsers in CI and the flake that browser e2e carries.

## Considered Options

* Option 1 — real-browser e2e via `@nuxt/test-utils` `createPage` (+ Playwright).
* Option 2 — `vitest` browser mode + `vitest-browser-vue` + a Playwright provider.
* Option 3 — a jsdom/node composable integration test with mocked `stonecrop`/`vue-router` and the real executor (chosen).

## Decision Outcome

Chosen option: "Option 3". A jsdom/node test runs the **real** `executeClientHandler` against a mocked `stonecrop` + `vue-router`, feeding a synthetic `@action` payload and asserting the actual downstream behavior: the `[{id,data}]` dispatch envelope, supersede (a navigation handler fires zero dispatch), the live-`record` injection, `graphql.query`, and no-writeback-on-failure. Coverage is `executeClientHandler` 8/8 unit + `useClientAction` 6/6 integration.

No browser e2e for clientHandler: the execution path is browser-agnostic, so a real browser adds no fidelity over jsdom. If real-browser testing is later introduced, it should target a genuinely browser-dependent surface — **Monaco authoring** (real DOM + workers) — not clientHandler execution.

### Consequences

* Good, because it is deterministic, runs in CI today with no browser binaries and none of the flake that browser e2e carries, and catches the regressions the feature actually introduced.
* Trade-off: the Desktop-render → `emit('action')` → host-`@action`-binding seam is not exercised by a *runtime* test — the jsdom test mocks the emit. Its payload **shape** contract is now compile-gated instead (see History, 2026-07-06 type-gate): `test:types` type-checks the fullstack example, the host that actually binds `@action="run"`, and Desktop's emit and `run()` share the `ActionEventPayload` type — so a shape drift fails CI. What stays uncovered is the runtime *value* assembly (Desktop builds the payload from its internal state at `Desktop.vue:359`) and the click→emit wiring; both are browser-agnostic and thin. A runtime test of them would mean mounting the ~800-line Desktop (brittle, internals-coupled) to guard a stable typed literal — disproportionate. The cleaner path, if that coverage is ever wanted, is to extract Desktop's transition/payload logic into a composable that can be unit-tested directly — not a `mountSuspended` or `createPage` test.

## History

* **2026-06-25** — decided (Option 3).
* **2026-07-06** — corrected a wrong premise: browser e2e was never blocked on a Vue 3.6 upgrade. The e2e skip was a vitest mis-config (one `defineVitestConfig` over all tests broke `setup()`'s build — nuxt/nuxt#34645). Split to a plain node config; `basic.test.ts` is now un-skipped in CI. Decision unchanged.
* **2026-07-06** — `test:types` now type-checks the fullstack example, so `<Desktop @action="run">` is compile-verified against Desktop's emit type (fixed 3 pre-existing type errors it surfaced). A runtime value-assembly test stays declined — it would mean mounting all of Desktop.

## More Information

Tests: `stonecrop/tests/core/client-handler.spec.ts` and `stonecrop/tests/core/client-action.spec.ts` (moved there from `nuxt/test/` when the composable moved — see [0001](0001-clienthandler-execution-host-delegation.md) History; `nuxt/test/useClientAction.test.ts` now only guards the auto-import re-export) (the latter `@vitest-environment node`, with `vi.mock` keeping the real `executeClientHandler` while overriding `useStonecrop`/`useRouter`).
