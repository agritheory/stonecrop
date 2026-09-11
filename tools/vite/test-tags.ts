/**
 * The repo-wide vitest tag vocabulary, previously restated per package and already forked into
 * several shapes.
 *
 * Every package declares the whole vocabulary rather than the subset its tests use. `strictTags`
 * defaults to true and rejects a tag a config does not declare, so it is the missing declaration
 * that breaks a suite; a spare one costs nothing and keeps the list a single definition.
 */
export const testTags = [
	{ name: 'unit', description: 'Pure logic test — no DOM, network, or framework runtime.' },
	{ name: 'component', description: 'Vue component test using jsdom + @vue/test-utils.' },
	{
		name: 'e2e',
		timeout: 30_000,
		description: 'Spins up a real server or Nuxt runtime. Run in integration gate only.',
	},
	{
		name: 'nuxt',
		timeout: 30_000,
		description: 'Involves the Nuxt module, plugin, composables, or @nuxt/test-utils.',
	},
	{ name: 'graphql', description: 'Involves GraphQL schema, queries, resolvers, or PostGraphile.' },
	{
		name: 'integration',
		timeout: 60_000,
		description: 'Requires a live PostgreSQL database. Skipped in CI environments without a database.',
	},
]
