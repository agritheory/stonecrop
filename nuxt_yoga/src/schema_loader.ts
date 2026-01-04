import { resolve } from 'node:path'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchema as loadGraphqlSchema } from '@graphql-tools/load'
import { type GraphQLSchema, printSchema } from 'graphql'

/**
 * Loads the schema from the GraphQL files.
 * @returns the GraphQL schema
 */
export async function loadSchemaFromFiles(schemaPointers: string | string[], cwd?: string): Promise<GraphQLSchema> {
	const pointers = Array.isArray(schemaPointers) ? schemaPointers : [schemaPointers]

	// Ensure paths are absolute
	const absolutePointers = pointers.map(pointer =>
		pointer.startsWith('/') ? pointer : resolve(cwd || process.cwd(), pointer)
	)

	return await loadGraphqlSchema(absolutePointers, {
		loaders: [new GraphQLFileLoader()],
	})
}

export async function createSchemaImport(schemaPointers: string | string[], cwd?: string): Promise<string> {
	const schema = await loadSchemaFromFiles(schemaPointers, cwd)
	return `
	export const typeDefs = \`${printSchema(schema)}\`
	export const schema = typeDefs
	`
}
