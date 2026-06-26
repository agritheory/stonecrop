/**
 * Nitro Server Plugin for Stonecrop
 *
 * This plugin runs on server startup to:
 * 1. Load doctype definitions from /fullstack/doctypes/
 * 2. Register built-in action handlers
 * 3. Configure the MockGraphQLExecutor instance
 */

import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { loadDoctypes, registerBuiltinHandlers, registerHandler, clearRegistry } from '@stonecrop/graphql-middleware'
import { mockExecutor } from '../mock-executor'

/**
 * Action argument shape sent by the frontend — runDoctypeAction in
 * app/composables/useDoctypes.ts sends a single `{ id, data? }` object,
 * where `data` carries form values for save-type actions.
 */
type ActionArgs = [{ id: string; data?: Record<string, unknown> }]

// Define custom action handlers for this playground
const customHandlers = {
	/**
	 * Save form edits to a user
	 */
	'user:save': async (args: unknown[], context: { executor: typeof mockExecutor }) => {
		const [{ id, data }] = args as ActionArgs
		const result = await context.executor.mutate<{
			updateUserById: { user: { id: string } } | null
		}>(`mutation { updateUserById(id: $id, patch: $patch) { user { id } } }`, {
			id,
			patch: data ?? {},
		})
		return result.updateUserById?.user
	},

	/**
	 * Save form edits to an order
	 */
	'order:save': async (args: unknown[], context: { executor: typeof mockExecutor }) => {
		const [{ id, data }] = args as ActionArgs
		const result = await context.executor.mutate<{
			updateOrderById: { order: { id: string } } | null
		}>(`mutation { updateOrderById(id: $id, patch: $patch) { order { id } } }`, {
			id,
			patch: data ?? {},
		})
		return result.updateOrderById?.order
	},
}

/**
 * Initialize Stonecrop on server startup
 */
export default defineNitroPlugin(async () => {
	console.log('[Stonecrop] Initializing server plugin...')

	try {
		// Clear any existing registry (for hot reload in development)
		clearRegistry()

		// Load doctype definitions from the doctypes directory
		// The plugin is at server/plugins/stonecrop.ts, doctypes are at ../../app/doctypes
		const pluginDir = resolve(new URL(import.meta.url).pathname, '..')
		const doctypesDir = resolve(pluginDir, '../../app/doctypes')

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

		// Register built-in handlers from graphql-middleware
		registerBuiltinHandlers()

		// Register custom action handlers for this playground
		for (const [name, handler] of Object.entries(customHandlers)) {
			registerHandler(name, handler as Parameters<typeof registerHandler>[1])
			console.log(`[Stonecrop] Registered action handler: ${name}`)
		}

		console.log('[Stonecrop] Server plugin initialized successfully')
	} catch (error) {
		console.error('[Stonecrop] Failed to initialize:', error)
		// Don't throw - allow server to continue even if doctypes fail to load
	}
})

// Export the mock executor for use in nuxt.config.ts
export { mockExecutor }
