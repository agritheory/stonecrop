import { PgExecutor } from '@dataplan/pg'
import { constant } from 'postgraphile/grafast'

/**
 * A minimal PgExecutor for Tier 1 (no-database) tests.
 *
 * Created via the real PgExecutor constructor so it satisfies the type constraint
 * that `loadOneWithPgClient` imposes. The context step returns an empty object —
 * execution will fail if a test actually issues SQL, but plan-structure assertions
 * only need the executor to exist at schema-build time.
 */
export const fakeExecutor = new PgExecutor({
	name: 'test',
	context: () => constant({ pgSettings: {}, withPgClient: async (_: unknown, cb: any) => cb({}) } as any),
})

/**
 * Injects `fakeExecutor` into `build.input.pgRegistry.pgExecutors` via the `build`
 * hook phase so that `createStonecropPlugin`'s `extendSchema` factory (which runs in
 * the `init` phase) can find an executor without a real database.
 *
 * Injects into `pgExecutors` (not `pgResources`) so Amber preset plugins that
 * process pgResources/codecs in their own hooks are unaffected.
 */
export const FakePgResourcesPlugin: GraphileConfig.Plugin = {
	name: 'FakePgResourcesPlugin',
	version: '0.0.0',
	schema: {
		hooks: {
			build(build) {
				const b = build as any
				if (b.input?.pgRegistry?.pgExecutors) {
					b.input.pgRegistry.pgExecutors['test'] = fakeExecutor
				}
				return build
			},
		},
	},
}
