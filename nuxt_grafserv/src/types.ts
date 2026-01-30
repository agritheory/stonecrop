import type { GraphQLSchema } from 'graphql'
import type { GraphileConfig } from 'graphile-config'

/**
 * Schema provider function - returns a GraphQL schema
 */
export type SchemaProvider = () => GraphQLSchema | Promise<GraphQLSchema>

/**
 * PostGraphile configuration using preset
 *
 * This is the recommended approach for PostGraphile integration.
 * The preset is passed to PostGraphile's makeSchema() function to generate the GraphQL schema.
 *
 * @example
 * ```typescript
 * import { PostGraphileAmberPreset } from 'postgraphile/presets/amber'
 * import { makePgService } from 'postgraphile/adaptors/pg'
 *
 * export default defineNuxtConfig({
 *   modules: ['@stonecrop/nuxt-grafserv'],
 *   grafserv: {
 *     type: 'postgraphile',
 *     preset: {
 *       extends: [PostGraphileAmberPreset],
 *       pgServices: [
 *         makePgService({
 *           connectionString: process.env.DATABASE_URL,
 *           schemas: ['public'],
 *         }),
 *       ],
 *       plugins: [MyCustomPlugin],
 *     },
 *     url: '/graphql',
 *     graphiql: true,
 *   },
 * })
 * ```
 */
export interface PostGraphileConfig {
	/** Configuration type discriminator */
	type: 'postgraphile'

	/** PostGraphile preset configuration - passed to makeSchema() */
	preset: GraphileConfig.Preset

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
