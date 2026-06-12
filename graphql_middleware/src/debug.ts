import { wrapPlans } from 'postgraphile/utils'

/**
 * Options for the Stonecrop debug plugin.
 * @public
 */
export interface DebugPluginOptions {
	/** Log a message when a plan is built for a Stonecrop field. Default: `true` */
	logPlans?: boolean
	/** Log timing for plan construction. Default: `false` */
	logTiming?: boolean
}

/**
 * Creates a PostGraphile plugin that wraps Stonecrop resolver plans with
 * debug logging. Use it in your preset file:
 *
 * ```typescript
 * import { createStonecropPlugin, createDebugPlugin } from '@stonecrop/graphql-middleware'
 *
 * export default {
 *   plugins: [createStonecropPlugin(), createDebugPlugin()],
 * }
 * ```
 *
 * Place `createDebugPlugin()` **after** `createStonecropPlugin()` in the
 * plugins array so the wrapper sees the Stonecrop fields.
 *
 * @param options - Optional logging configuration
 * @returns A PostGraphile plugin
 * @public
 */
export const createDebugPlugin = (options: DebugPluginOptions = {}): GraphileConfig.Plugin => {
	const { logPlans = true, logTiming = false } = options

	const wrapField = (typeName: string, fieldName: string) => ({
		plan: (plan: () => any) => {
			if (logPlans) {
				// oxlint-disable-next-line no-console
				console.log(`[@stonecrop/graphql-middleware] Building plan for ${typeName}.${fieldName}`)
			}

			const start = logTiming ? Date.now() : 0
			const $result = plan()

			if (logTiming) {
				// oxlint-disable-next-line no-console
				console.log(
					`[@stonecrop/graphql-middleware] Plan built for ${typeName}.${fieldName} in ${Date.now() - start}ms`
				)
			}

			return $result
		},
	})

	return wrapPlans({
		Query: {
			stonecropRecord: wrapField('Query', 'stonecropRecord'),
			stonecropRecords: wrapField('Query', 'stonecropRecords'),
			stonecropMeta: wrapField('Query', 'stonecropMeta'),
			stonecropAllMeta: wrapField('Query', 'stonecropAllMeta'),
		},
		Mutation: {
			stonecropAction: wrapField('Mutation', 'stonecropAction'),
		},
	})
}
