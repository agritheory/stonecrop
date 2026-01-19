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
		})

		// Update nuxt.config.ts
		await updateNuxtConfig(cwd, {
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

		// Middleware file path (for auth, logging, etc.)
		middlewarePath: 'server/middleware.ts',

		// Grafserv options
		grafserv: {
			websockets: false,
			introspection: true,
		},
	} as GrafservOptions`,
			},
		})

		consola.info('Make sure @stonecrop/nuxt-grafserv is in your modules array')
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

	// Scaffold middleware.ts
	const middlewarePath = join(serverDir, 'middleware.ts')
	if (!existsSync(middlewarePath)) {
		const middlewareTemplate = await loadTemplate('middleware.ts')
		await writeFile(middlewarePath, middlewareTemplate, 'utf-8')
		consola.info('Created server/middleware.ts')
	} else {
		consola.info('server/middleware.ts already exists, skipping')
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
		'middleware.ts': `/**
 * GraphQL Middleware Chain
 * Add authentication, logging, and other middleware here
 */

import type { GrafastContext, MiddlewareFunction } from '@stonecrop/nuxt-grafserv'

const middleware: MiddlewareFunction[] = [
	// Request logging middleware
	async (ctx: GrafastContext, next) => {
		const start = Date.now()
		const requestId = \`req-\${Date.now()}-\${Math.random().toString(36).slice(2, 9)}\`
		ctx.requestId = requestId

		console.log(\`[\${requestId}] GraphQL request started\`)

		const result = await next()

		const duration = Date.now() - start
		console.log(\`[\${requestId}] GraphQL request completed in \${duration}ms\`)

		return result
	},

	// Authentication middleware (example)
	async (ctx: GrafastContext, next) => {
		// TODO: Implement your authentication logic
		// const authHeader = ctx.req.headers.get('authorization')
		// ctx.user = await validateToken(authHeader)

		ctx.user = { id: 'anonymous', roles: ['guest'] }
		return next()
	},
]

export default middleware
`,
	}

	return templates[filename] || ''
}
