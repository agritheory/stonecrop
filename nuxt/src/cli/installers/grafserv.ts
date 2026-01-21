/**
 * GraphQL server installer
 * Installs @stonecrop/nuxt-grafserv and scaffolds server files
 */

import { existsSync } from 'node:fs'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { join, dirname } from 'pathe'
import { fileURLToPath } from 'node:url'
import consola from 'consola'
import { addDependencies } from '../utils/package'
import { updateNuxtConfig } from '../utils/config'

const __dirname = dirname(fileURLToPath(import.meta.url))

export interface GrafservInstallerOptions {
	cwd: string
	schemaPath?: string
	resolversPath?: string
	endpoint?: string
}

/**
 * Install the @stonecrop/nuxt-grafserv GraphQL server
 */
export async function installGrafserv(options: GrafservInstallerOptions): Promise<boolean> {
	const {
		cwd,
		schemaPath = 'server/schema.graphql',
		resolversPath = 'server/resolvers.ts',
		endpoint = '/graphql/',
	} = options

	consola.start('Installing @stonecrop/nuxt-grafserv GraphQL server...')

	try {
		// Scaffold server files first
		await scaffoldServerFiles(cwd)

		// Add dependencies - use latest published versions
		await addDependencies(cwd, {
			'@stonecrop/nuxt-grafserv': 'latest',
			'@stonecrop/graphql-middleware': 'latest',
			graphql: '^16.11.0',
			grafast: '^1.0.0-rc.4',
		})

		// Update nuxt.config.ts
		const configUpdated = await updateNuxtConfig(cwd, {
			import: "import type { ModuleOptions as GrafservOptions } from '@stonecrop/nuxt-grafserv'",
			module: "'@stonecrop/nuxt-grafserv'",
			moduleOptions: {
				key: 'grafserv',
				value: `{
		// GraphQL schema and resolvers
		schema: '${schemaPath}',
		resolvers: '${resolversPath}',

		// GraphQL endpoint
		url: '${endpoint}',

		// Enable GraphiQL in development
		graphiql: true,

		// Graphile preset with grafserv options
		preset: {
			grafserv: {
				websockets: false,
			},
		},
	} as GrafservOptions`,
			},
		})

		if (!configUpdated) {
			consola.warn('Could not automatically update nuxt.config.ts')
			consola.info('Please add @stonecrop/nuxt-grafserv to your modules array manually')
		}

		consola.success('@stonecrop/nuxt-grafserv installed successfully')
		return true
	} catch (error) {
		consola.error('Failed to install @stonecrop/nuxt-grafserv:', error)
		return false
	}
}

/**
 * Scaffold the server directory with GraphQL files
 */
async function scaffoldServerFiles(cwd: string): Promise<void> {
	const serverDir = join(cwd, 'server')

	// Create server directory if it doesn't exist
	if (!existsSync(serverDir)) {
		await mkdir(serverDir, { recursive: true })
		consola.info('Created server/ directory')
	}

	// Scaffold schema.graphql
	const schemaPath = join(serverDir, 'schema.graphql')
	if (!existsSync(schemaPath)) {
		const schemaTemplate = await loadTemplate('schema.graphql')
		await writeFile(schemaPath, schemaTemplate, 'utf-8')
		consola.info('Created server/schema.graphql')
	} else {
		consola.info('server/schema.graphql already exists, skipping')
	}

	// Scaffold resolvers.ts
	const resolversPath = join(serverDir, 'resolvers.ts')
	if (!existsSync(resolversPath)) {
		const resolversTemplate = await loadTemplate('resolvers.ts')
		await writeFile(resolversPath, resolversTemplate, 'utf-8')
		consola.info('Created server/resolvers.ts')
	} else {
		consola.info('server/resolvers.ts already exists, skipping')
	}

	// Scaffold plugins.ts
	const pluginsPath = join(serverDir, 'plugins.ts')
	if (!existsSync(pluginsPath)) {
		const pluginsTemplate = await loadTemplate('plugins.ts')
		await writeFile(pluginsPath, pluginsTemplate, 'utf-8')
		consola.info('Created server/plugins.ts')
	} else {
		consola.info('server/plugins.ts already exists, skipping')
	}
}

/**
 * Load a template file
 */
async function loadTemplate(filename: string): Promise<string> {
	// Try to load from templates directory
	const templatePath = join(__dirname, '..', '..', '..', 'templates', filename)

	if (existsSync(templatePath)) {
		return readFile(templatePath, 'utf-8')
	}

	// Fallback to inline templates
	return getInlineTemplate(filename)
}

/**
 * Get inline template content as fallback
 */
function getInlineTemplate(filename: string): string {
	const templates: Record<string, string> = {
		'schema.graphql': `# Stonecrop GraphQL Schema
# Add your type definitions here

scalar JSON

type Query {
	"""
	Health check endpoint
	"""
	healthCheck: HealthStatus!

	"""
	Get metadata for a doctype
	"""
	getMeta(doctype: String!): JSON
}

type Mutation {
	"""
	Execute a doctype action
	"""
	stonecropAction(doctype: String!, action: String!, args: JSON): ActionResult!
}

type HealthStatus {
	status: String!
	timestamp: String!
}

type ActionResult {
	success: Boolean!
	data: JSON
	error: String
}
`,
		'resolvers.ts': `/**
 * GraphQL Resolvers
 * Add your resolver implementations here
 */

export const resolvers = {
	Query: {
		healthCheck: () => ({
			status: 'healthy',
			timestamp: new Date().toISOString(),
		}),

		getMeta: (_: unknown, { doctype }: { doctype: string }) => {
			// TODO: Implement doctype metadata lookup
			console.log('getMeta called for:', doctype)
			return null
		},
	},

	Mutation: {
		stonecropAction: async (
			_: unknown,
			{ doctype, action, args }: { doctype: string; action: string; args?: unknown }
		) => {
			// TODO: Implement action execution
			console.log('stonecropAction called:', { doctype, action, args })
			return {
				success: true,
				data: null,
				error: null,
			}
		},
	},
}

export default resolvers
`,
		'plugins.ts': `/**
 * Grafserv Plugins
 * Add custom middleware and hooks via Grafserv plugins
 *
 * @see https://grafast.org/grafserv/plugins
 */

import type { GraphileConfig } from 'graphile-config'

/**
 * Example: Request logging plugin
 */
const loggingPlugin: GraphileConfig.Plugin = {
	name: 'request-logging',
	version: '1.0.0',
	grafserv: {
		middleware: {
			processGraphQLRequestBody: async (next, event) => {
				const start = Date.now()
				console.log('[GraphQL] Request started:', {
					path: event.request.url,
					method: event.request.method,
				})

				const result = await next()

				const duration = Date.now() - start
				console.log(\`[GraphQL] Request completed in \${duration}ms\`)

				return result
			},
		},
	},
}

/**
 * Example: Authentication plugin
 */
const authPlugin: GraphileConfig.Plugin = {
	name: 'authentication',
	version: '1.0.0',
	grafserv: {
		middleware: {
			processGraphQLRequestBody: async (next, event) => {
				// Extract authentication from headers
				const authHeader = event.request.headers.get('authorization')

				if (authHeader?.startsWith('Bearer ')) {
					const token = authHeader.slice(7)
					// TODO: Validate token and set user context
					console.log('[Auth] Token received:', token)
				} else {
					console.log('[Auth] Anonymous request')
				}

				return next()
			},
		},
	},
}

/**
 * Export all plugins
 * Import these in your nuxt.config.ts:
 *
 * import plugins from './server/plugins'
 *
 * export default defineNuxtConfig({
 *   grafserv: {
 *     preset: {
 *       plugins
 *     }
 *   }
 * })
 */
export const plugins: GraphileConfig.Plugin[] = [
	loggingPlugin,
	// authPlugin, // Uncomment to enable authentication
]

export default plugins
`,
	}

	return templates[filename] || ''
}
