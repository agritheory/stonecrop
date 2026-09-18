import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadTypedefs } from '@graphql-tools/load'
import { grafserv } from 'grafserv/h3/v1'
import { makeGrafastSchema } from 'grafast'
import { defineEventHandler, setResponseStatus } from 'h3'
import { useRuntimeConfig } from 'nitropack/runtime'
let grafservInstance = null
let cachedSchema = null
async function loadTypeDefsFromFiles(schemaPath) {
	const paths = Array.isArray(schemaPath) ? schemaPath : [schemaPath]
	const sources = await loadTypedefs(paths, {
		loaders: [new GraphQLFileLoader()],
	})
	return sources.map(source => source.document).filter(Boolean)
}
async function getSchemaForSchemaMode(options) {
	if (cachedSchema) {
		return cachedSchema
	}
	let schema
	if (typeof options.schema === 'function') {
		console.debug('[@stonecrop/nuxt-grafserv] Using schema provider function')
		schema = await options.schema()
	} else {
		console.debug('[@stonecrop/nuxt-grafserv] Loading schema from file(s)')
		const typeDefDocs = await loadTypeDefsFromFiles(options.schema)
		const objects = {}
		if (options.resolversPath) {
			try {
				const resolverModule = await import('#internal/grafserv/resolvers')
				const resolvers = resolverModule.default || resolverModule
				console.debug('[@stonecrop/nuxt-grafserv] Resolvers loaded:', Object.keys(resolvers))
				for (const typeName of Object.keys(resolvers)) {
					objects[typeName] = resolvers[typeName]
				}
			} catch (e) {
				console.error('[@stonecrop/nuxt-grafserv] Error loading resolvers:', e)
				throw e
			}
		} else {
			console.debug('[@stonecrop/nuxt-grafserv] No resolvers specified')
		}
		try {
			schema = makeGrafastSchema({
				typeDefs: typeDefDocs,
				objects,
			})
			console.debug('[@stonecrop/nuxt-grafserv] Grafast schema created successfully')
		} catch (error) {
			console.error('[@stonecrop/nuxt-grafserv] Error creating Grafast schema:', error)
			throw error
		}
	}
	cachedSchema = schema
	return schema
}
export async function getGrafservInstance(options) {
	if (grafservInstance) {
		console.log('[@stonecrop/nuxt-grafserv] Returning cached grafserv instance')
		return grafservInstance
	}
	if (options.type === 'postgraphile') {
		console.debug('[@stonecrop/nuxt-grafserv] Creating grafserv via pgl.createServ()')
		try {
			const { pgl } = await import('#internal/grafserv/pgl')
			grafservInstance = pgl.createServ(grafserv)
			console.log('[@stonecrop/nuxt-grafserv] PostGraphile grafserv instance created via pgl.createServ()')
		} catch (error) {
			if (error instanceof Error && 'code' in error && error.code === 'MODULE_NOT_FOUND') {
				throw new Error(
					'[@stonecrop/nuxt-grafserv] PostGraphile preset provided but "postgraphile" package not found. Install it with: npm install postgraphile',
					{ cause: error }
				)
			}
			console.error('[@stonecrop/nuxt-grafserv] Error creating PostGraphile grafserv instance:', error)
			throw error
		}
	} else if (options.type === 'schema') {
		const schema = await getSchemaForSchemaMode(options)
		grafservInstance = grafserv({ schema })
		console.log('[@stonecrop/nuxt-grafserv] Schema-mode grafserv instance created')
	} else {
		throw new Error(`[@stonecrop/nuxt-grafserv] Invalid configuration type: ${options.type}`)
	}
	return grafservInstance
}
export async function clearGrafservCache() {
	grafservInstance = null
	cachedSchema = null
	console.log('[@stonecrop/nuxt-grafserv] Cache cleared')
}
export default defineEventHandler(async event => {
	const config = useRuntimeConfig()
	const options = config.grafserv
	const graphiqlEnabled = options.graphiql ?? false
	try {
		const serv = await getGrafservInstance(options)
		if (!graphiqlEnabled && event.method === 'GET') {
			setResponseStatus(event, 404)
			return 'GraphiQL is disabled'
		}
		const graphqlResult = await serv.handleGraphQLEvent(event)
		if (graphqlResult !== null) {
			return graphqlResult
		}
		if (graphiqlEnabled) {
			return serv.handleGraphiqlEvent(event)
		}
		setResponseStatus(event, 404)
		return 'GraphiQL is disabled'
	} catch (error) {
		console.error('[@stonecrop/nuxt-grafserv] Error in GraphQL handler:', error)
		throw error
	}
})
