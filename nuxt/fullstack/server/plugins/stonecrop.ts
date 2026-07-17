/**
 * Nitro Server Plugin for Stonecrop
 *
 * This plugin runs on server startup to:
 * 1. Load doctype definitions from /fullstack/doctypes/
 * 2. Configure the MockGraphQLExecutor instance
 */

import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { loadDoctypes, clearRegistry } from '@stonecrop/graphql-middleware'
import { mockExecutor } from '../mock-executor'

/**
 * Initialize Stonecrop on server startup
 */
export default defineNitroPlugin(async () => {
	console.log('[Stonecrop] Initializing server plugin...')

	try {
		// Clear any existing registry (for hot reload in development)
		clearRegistry()

		// Load doctype definitions from the doctypes directory. It lives at the project root
		// (a shared sibling of app/ and server/), which is also the module's default doctypesDir.
		// The plugin is at server/plugins/stonecrop.ts, so the root is two levels up.
		const pluginDir = resolve(new URL(import.meta.url).pathname, '..')
		const doctypesDir = resolve(pluginDir, '../../doctypes')

		if (!existsSync(doctypesDir)) {
			console.warn(`[Stonecrop] Could not find doctypes directory at ${doctypesDir}, skipping doctype loading`)
			return
		}

		console.log(`[Stonecrop] Loading doctypes from: ${doctypesDir}`)

		loadDoctypes(doctypesDir, {
			continueOnError: true,
			onError: (file, errors) => {
				console.warn(`[Stonecrop] Warning: Failed to load ${file}:`, errors)
			},
		})

		console.log('[Stonecrop] Doctypes loaded successfully')

		console.log('[Stonecrop] Server plugin initialized successfully')
	} catch (error) {
		console.error('[Stonecrop] Failed to initialize:', error)
		// Don't throw - allow server to continue even if doctypes fail to load
	}
})

// Export the mock executor for use in nuxt.config.ts
export { mockExecutor }
