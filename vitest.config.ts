import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		projects: [
			'aform/*/vite.config.ts',
			'atable/*/vite.config.ts',
			'beam/*/vite.config.ts',
			'casl_middleware/*/vite.config.ts',
			'desktop/vite.config.ts',
			'nuxt/*',
			'rockfoil/*/vite.config.ts',
			'stonecrop/*/vite.config.ts',
		],
		// ---------------------------------------------------------------------------
		// Test tags
		//
		// Tags describe two orthogonal dimensions and are combinable. Apply one tag
		// from the speed/isolation dimension and any relevant technology tags:
		//
		// Speed / isolation (mutually exclusive — pick one):
		//
		//   unit      — Pure logic tests. No DOM, no network, no framework runtime.
		//               Runs in jsdom or node, completes in milliseconds.
		//               Examples: store logic, schema validation, utility functions,
		//               composable unit tests, CLI helpers.
		//
		//   component — Vue component tests. Requires jsdom + @vue/test-utils.
		//               Tests a single component in isolation (mount/render only).
		//               Examples: aform fields, atable cells, beam UI primitives,
		//               desktop component props/events.
		//
		//   e2e       — End-to-end or integration tests. Spins up a real server or
		//               Nuxt runtime. Slow (30 s timeout). Only run in the integration
		//               CI gate, not the fast PR feedback check.
		//               Examples: @nuxt/test-utils setup() tests, nuxt_grafserv
		//               integration tests that start a real Grafserv handler.
		//
		// Technology / domain (combinable — apply all that apply):
		//
		//   nuxt      — Involves the Nuxt module system, plugin, composables, or
		//               @nuxt/test-utils. Applies to everything in nuxt/ and
		//               nuxt_grafserv/. Inherits the 30 s timeout because Nuxt fixture
		//               setup is inherently slow even for unit tests.
		//               Can overlap with `unit` (nuxt composable unit tests) or `e2e`
		//               (full Nuxt app startup).
		//
		//   graphql   — Involves GraphQL schema, queries, resolvers, or PostGraphile.
		//               Applies to graphql_middleware, graphql_client, casl_middleware,
		//               rockfoil, and nuxt_grafserv tests. Gets CI retry (≤ 2) to
		//               absorb flakiness from PostGraphile startup.
		//               Can overlap with `unit` (schema/handler logic), `e2e`
		//               (real server), or `nuxt` (nuxt_grafserv integration).
		//
		// Common combinations:
		//   ['unit', 'nuxt']              — nuxt composable / module unit test
		//   ['unit', 'graphql']           — graphql middleware / client unit test
		//   ['e2e', 'nuxt']               — @nuxt/test-utils app startup test
		//   ['e2e', 'nuxt', 'graphql']    — full nuxt_grafserv integration test
		//   ['component']                 — standalone Vue component test (no extra tags needed)
		//
		// CI filter examples:
		//   Fast PR feedback:   vitest --tags-filter="unit or component"
		//   Integration gate:   vitest --tags-filter="e2e or nuxt or graphql"
		// ---------------------------------------------------------------------------
		tags: [
			{ name: 'unit' },
			{ name: 'component' },
			{ name: 'e2e', timeout: 30_000 },
			{ name: 'nuxt', timeout: 30_000 },
			{ name: 'graphql', retry: process.env.CI ? 2 : 0 },
		],
	},
})
