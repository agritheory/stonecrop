import { codegen } from '@graphql-codegen/core'
import { getCachedDocumentNodeFromSchema } from '@graphql-codegen/plugin-helpers'
import * as typescriptPlugin from '@graphql-codegen/typescript'
import * as typescriptResolversPlugin from '@graphql-codegen/typescript-resolvers'

import { loadSchemaFromFiles } from './schema_loader'

export type CodeGenConfig = typescriptPlugin.TypeScriptPluginConfig &
	typescriptResolversPlugin.TypeScriptResolversPluginConfig

export async function createResolverTypeDefs(schema: string | string[], config: CodeGenConfig, rootDir: string) {
	const schemaAsDocumentNode = getCachedDocumentNodeFromSchema(await loadSchemaFromFiles(schema, rootDir))
	return await codegen({
		documents: [],
		config: {
			...config,
			contextType: 'YogaContext',
			useIndexSignature: false,
		},
		filename: 'not used but required',
		schema: schemaAsDocumentNode,
		plugins: [
			{
				typescript: {},
			},
			{
				typescriptResolvers: {},
			},
		],
		pluginMap: {
			typescript: typescriptPlugin,
			typescriptResolvers: typescriptResolversPlugin,
		},
	})
}
