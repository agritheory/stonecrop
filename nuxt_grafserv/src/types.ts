import type { GraphQLSchema } from 'graphql'
import type { GraphileConfig } from 'graphile-config'

/**
 * Schema provider function - returns a GraphQL schema
 */
export type SchemaProvider = () => GraphQLSchema | Promise<GraphQLSchema>

/**
 * Configuration for the Grafast module
 */
export interface ModuleOptions {
	/** Path to schema file(s) or a schema provider function */
	schema?: string | string[] | SchemaProvider

	/** Path to resolvers file (for .graphql schema files) */
	resolvers?: string

	/** GraphQL endpoint URL (default: '/graphql/') */
	url?: string

	/** Whether to enable GraphiQL IDE (default: true in dev, false in prod) */
	graphiql?: boolean

	/** Custom Graphile preset to extend (for advanced grafast configuration) */
	preset?: GraphileConfig.Preset
}
