/**
 * GraphQL server installer
 * Installs @stonecrop/nuxt-grafserv and scaffolds server files
 */

import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'pathe'
import consola from 'consola'
import { addDependencies } from '../utils/package'
import { updateNuxtConfig } from '../utils/config'
import { loadTemplate } from '../utils/templates'

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
			grafast: '^1.0.1',
		})

		// Update nuxt.config.ts
		const configUpdated = await updateNuxtConfig(cwd, {
			import: "import type { ModuleOptions as GrafservOptions } from '@stonecrop/nuxt-grafserv'",
			module: "'@stonecrop/nuxt-grafserv'",
			moduleOptions: {
				key: 'grafserv',
				value: `{
		// Use in-memory Grafast resolvers (no database required)
		// Switch to 'postgraphile' when connecting a real database
		type: 'schema',

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

	// Scaffold server/data.ts (in-memory data store)
	const dataPath = join(serverDir, 'data.ts')
	if (!existsSync(dataPath)) {
		const dataTemplate = await loadTemplate('data.ts')
		await writeFile(dataPath, dataTemplate, 'utf-8')
		consola.info('Created server/data.ts')
	} else {
		consola.info('server/data.ts already exists, skipping')
	}

	// Scaffold server/plugins/stonecrop.ts (Nitro server plugin for handler registration)
	const nitroPluginsDir = join(serverDir, 'plugins')
	if (!existsSync(nitroPluginsDir)) {
		await mkdir(nitroPluginsDir, { recursive: true })
		consola.info('Created server/plugins/ directory')
	}
	const stonecropPluginPath = join(nitroPluginsDir, 'stonecrop.ts')
	if (!existsSync(stonecropPluginPath)) {
		const stonecropTemplate = await loadTemplate('stonecrop.ts')
		await writeFile(stonecropPluginPath, stonecropTemplate, 'utf-8')
		consola.info('Created server/plugins/stonecrop.ts')
	} else {
		consola.info('server/plugins/stonecrop.ts already exists, skipping')
	}
}
