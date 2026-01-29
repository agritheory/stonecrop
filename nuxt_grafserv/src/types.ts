import type { PromiseOrDirect } from 'grafast'
import type { GraphQLSchema } from 'graphql'
import type { GraphileConfig } from 'graphile-config'

/**
 * Schema provider function - returns a GraphQL schema
 */
export type SchemaProvider = () => GraphQLSchema | Promise<GraphQLSchema>

/**
 * PostGraphile instance interface (minimal type for compatibility)
 */
export interface PostGraphileInstance {
	getSchema(): PromiseOrDirect<GraphQLSchema>
	getSchemaResult(): PromiseOrDirect<{ schema: GraphQLSchema; resolvedPreset: GraphileConfig.ResolvedPreset }>
}

/**
 * Configuration for the Grafast module
 */
export interface ModuleOptions {
	/** Path to schema file(s), a schema provider function, or a PostGraphile instance */
	schema?: string | string[] | SchemaProvider | PostGraphileInstance

	/** Path to resolvers file (optional, only needed for .graphql schema files without PostGraphile) */
	resolvers?: string

	/** GraphQL endpoint URL (default: '/graphql/') */
	url?: string

	/** Whether to enable GraphiQL IDE (default: true in dev, false in prod) */
	graphiql?: boolean

	/** Custom Graphile preset to extend (for advanced grafast configuration) */
	preset?: GraphileConfig.Preset
}
