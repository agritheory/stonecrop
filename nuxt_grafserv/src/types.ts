import type { GraphQLSchema } from 'graphql'
import type { FieldCasing } from '@stonecrop/graphql-middleware'

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
 * // Minimal config — no preset file needed. Uses DATABASE_URL automatically.
 * export default defineNuxtConfig({
 *   modules: ['@stonecrop/nuxt-grafserv'],
 *   grafserv: {
 *     type: 'postgraphile',
 *     // fieldCasing: 'pascal',           // optional — defaults to 'camel'
 *     // schemas: ['public', 'auth'],      // optional — defaults to ['public']
 *     // explain: true,                    // optional — enables Ruru Explain tab; never set in production
 *   },
 * })
 *
 * // With an explicit preset file (for custom plugins, connection, etc.):
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
 *   plugins: [createStonecropPlugin(), MyCustomPlugin],
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
	 * Path to PostGraphile preset file.
	 *
	 * When omitted, a default preset is synthesized using `DATABASE_URL` for the
	 * connection string and `fieldCasing`/`schemas`/`explain` from this config.
	 * A warning is emitted at startup if `DATABASE_URL` is not set.
	 *
	 * The preset file must export the preset configuration using default export:
	 * `export default { extends: [...], pgServices: [...], plugins: [...] }`
	 *
	 * @example './server/graphile.preset.ts'
	 * @example './server/graphile.preset.js'
	 */
	preset?: string

	/**
	 * Column-to-field name casing for the synthesized preset.
	 * - `'camel'` (default): `my_column` → `myColumn` (PostGraphile Amber default)
	 * - `'pascal'`: `my_column` → `MyColumn`
	 *
	 * Ignored when an explicit `preset` file is provided.
	 */
	fieldCasing?: FieldCasing

	/**
	 * PostgreSQL schemas to expose. Defaults to `['public']`.
	 * Ignored when an explicit `preset` file is provided.
	 */
	schemas?: string[]

	/**
	 * Enable the Ruru Explain tab (shows Grafast plan + SQL for each query).
	 * **Never enable in production** — it exposes query internals to any client.
	 * Ignored when an explicit `preset` file is provided.
	 *
	 * @default false
	 */
	explain?: boolean

	/**
	 * Enable developer-friendly debug mode. When `true`, the synthesized preset
	 * automatically sets `grafast.explain: true`, injects `createDebugPlugin()`,
	 * and configures `grafserv.maskError` as a pass-through so full error details
	 * are visible in the GraphQL response.
	 *
	 * This is a convenience switch for local development — it is the equivalent of
	 * setting `explain: true` plus the debug plugin plus unmasked errors at once.
	 * **Never enable in production**.
	 *
	 * Ignored when an explicit `preset` file is provided.
	 *
	 * @default false
	 */
	debug?: boolean

	/** GraphQL endpoint URL (default: '/graphql/') */
	url?: string

	/**
	 * Serve the GraphiQL IDE (Ruru) and its static assets. Defaults to `true` in
	 * development and `false` in production.
	 */
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

	/**
	 * Serve the GraphiQL IDE (Ruru) and its static assets. Defaults to `true` in
	 * development and `false` in production.
	 */
	graphiql?: boolean
}

/**
 * Module configuration - use either PostGraphile preset or custom schema
 *
 * @see PostGraphileConfig for PostGraphile integration
 * @see SchemaConfig for custom schemas with resolvers
 */
export type ModuleOptions = PostGraphileConfig | SchemaConfig
