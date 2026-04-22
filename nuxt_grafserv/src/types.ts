import type { FieldCasing } from '@stonecrop/graphql-middleware'
import type { GraphQLSchema } from 'graphql'

/**
 * Schema provider function - returns a GraphQL schema
 */
export type SchemaProvider = () => GraphQLSchema | Promise<GraphQLSchema>

/**
 * PostGraphile configuration using preset
 *
 * This is the recommended approach for PostGraphile integration.
 * The preset file path is resolved and imported at runtime, then passed to PostGraphile's makeSchema() function.
 *
 * Note: Inline preset objects are not supported due to Nitro's build/runtime separation.
 * Complex objects with extends arrays, plugins, and functions cannot be serialized across this boundary.
 *
 * @example
 * ```typescript
 * // 1. Create server/graphile.preset.ts
 * import { createStonecropPreset, makePgService, createStonecropPlugin } from '@stonecrop/graphql-middleware'
 *
 * export default {
 *   extends: [createStonecropPreset()],
 *   pgServices: [
 *     makePgService({
 *       connectionString: process.env.DATABASE_URL,
 *       schemas: ['public'],
 *     }),
 *   ],
 *   plugins: [createStonecropPlugin()],
 * }
 *
 * // 2. Reference the preset file in nuxt.config.ts
 * export default defineNuxtConfig({
 *   modules: ['@stonecrop/nuxt-grafserv'],
 *   grafserv: {
 *     type: 'postgraphile',
 *     preset: './server/graphile.preset.ts',
 *     url: '/graphql',
 *     graphiql: true,
 *   },
 * })
 * ```
 */
export interface PostGraphileConfig {
	/** Configuration type discriminator */
	type: 'postgraphile'

	/**
	 * Path to PostGraphile preset file
	 *
	 * The preset file must export the preset configuration using default export:
	 * `export default { extends: [...], pgServices: [...], plugins: [...] }`
	 *
	 * A PostGraphile instance will be created from this preset at build time.
	 *
	 * If omitted, a default preset is synthesized using `DATABASE_URL` and
	 * `fieldCasing` / `explain` options. Omitting the preset file is valid for
	 * standard setups that use environment variables and Stonecrop defaults.
	 *
	 * @example './server/graphile.preset.ts'
	 * @example './server/graphile.preset.js'
	 */
	preset?: string

	/**
	 * Field name casing convention (default: 'camel')
	 *
	 * - `'camel'`: field names like `createdAt`, `taskTitle` (PostGraphile Amber default)
	 * - `'pascal'`: field names like `CreatedAt`, `TaskTitle`
	 *
	 * Only used when `preset` is omitted (synthesized preset mode).
	 * Has no effect when using an explicit preset file — casing is controlled
	 * by the preset's own inflection configuration.
	 */
	fieldCasing?: FieldCasing

	/**
	 * Enable Grafast explain in Ruru UI (default: false)
	 *
	 * When true, Ruru's "Explain" tab shows the full Grafast operation plan
	 * including which steps ran and what SQL each step generated.
	 *
	 * **Never enable in production** — it exposes query internals to any client
	 * that can access Ruru.
	 *
	 * Only used when `preset` is omitted (synthesized preset mode).
	 */
	explain?: boolean

	/** GraphQL endpoint URL (default: '/graphql/') */
	url?: string

	/** Whether to enable GraphiQL IDE (default: true in dev, false in prod) */
	graphiql?: boolean
}

/**
 * Schema configuration using GraphQL schema files or provider function
 *
 * Use this for custom GraphQL schemas with Grafast resolvers.
 * Schema files (.graphql) are loaded and combined with resolver functions.
 *
 * @example
 * ```typescript
 * // Using schema files with resolvers
 * export default defineNuxtConfig({
 *   modules: ['@stonecrop/nuxt-grafserv'],
 *   grafserv: {
 *     type: 'schema',
 *     schema: 'server/schema/**\/*.graphql',
 *     resolvers: 'server/resolvers/index.ts',
 *     url: '/graphql',
 *     graphiql: true,
 *   },
 * })
 *
 * // Using schema provider function
 * export default defineNuxtConfig({
 *   grafserv: {
 *     type: 'schema',
 *     schema: async () => {
 *       // Return a GraphQLSchema instance
 *       return myCustomSchema
 *     },
 *   },
 * })
 * ```
 */
export interface SchemaConfig {
	/** Configuration type discriminator */
	type: 'schema'

	/**
	 * Path to schema file(s) or schema provider function
	 * - String: Single file path (e.g., 'server/schema/schema.graphql')
	 * - Array: Multiple file paths (e.g., ['server/schema/**\/*.graphql'])
	 * - Function: Returns a GraphQL schema directly
	 */
	schema: string | string[] | SchemaProvider

	/**
	 * Path to resolvers file (optional)
	 * Only needed when using .graphql schema files.
	 * Should export Grafast resolver objects.
	 *
	 * @example 'server/resolvers/index.ts'
	 */
	resolvers?: string

	/** GraphQL endpoint URL (default: '/graphql/') */
	url?: string

	/** Whether to enable GraphiQL IDE (default: true in dev, false in prod) */
	graphiql?: boolean
}

/**
 * Module configuration - use either PostGraphile preset or custom schema
 *
 * @see PostGraphileConfig for PostGraphile integration
 * @see SchemaConfig for custom schemas with resolvers
 */
export type ModuleOptions = PostGraphileConfig | SchemaConfig
