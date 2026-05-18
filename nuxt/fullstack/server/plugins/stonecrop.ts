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

// Define custom action handlers for this playground
const customHandlers = {
	/**
	 * Activate a user - transitions status from PENDING/SUSPENDED to ACTIVE
	 */
	activate_user: async (args: unknown[], context: { executor: typeof mockExecutor }) => {
		const [userId] = args as [string]
		const result = await context.executor.mutate<{
			updateUserById: { user: { id: string; status: string } } | null
		}>(`mutation { updateUserById(id: $id, patch: { status: "ACTIVE" }) { user { id status } } }`, {
			id: userId,
			patch: { status: 'ACTIVE' },
		})
		return result.updateUserById?.user
	},

	/**
	 * Suspend a user - transitions status from ACTIVE to SUSPENDED
	 */
	suspend_user: async (args: unknown[], context: { executor: typeof mockExecutor }) => {
		const [userId] = args as [string]
		const result = await context.executor.mutate<{
			updateUserById: { user: { id: string; status: string } } | null
		}>(`mutation { updateUserById(id: $id, patch: { status: "SUSPENDED" }) { user { id status } } }`, {
			id: userId,
			patch: { status: 'SUSPENDED' },
		})
		return result.updateUserById?.user
	},

	/**
	 * Delete a user - marks status as DELETED (soft delete)
	 */
	delete_user: async (args: unknown[], context: { executor: typeof mockExecutor }) => {
		const [userId] = args as [string]
		const result = await context.executor.mutate<{
			updateUserById: { user: { id: string; status: string } } | null
		}>(`mutation { updateUserById(id: $id, patch: { status: "DELETED" }) { user { id status } } }`, {
			id: userId,
			patch: { status: 'DELETED' },
		})
		return result.updateUserById?.user
	},

	/**
	 * Submit an order - transitions from DRAFT to PENDING
	 */
	submit_order: async (args: unknown[], context: { executor: typeof mockExecutor }) => {
		const [orderId] = args as [string]
		const result = await context.executor.mutate<{
			updateOrderById: { order: { id: string; status: string } } | null
		}>(`mutation { updateOrderById(id: $id, patch: { status: "PENDING" }) { order { id status } } }`, {
			id: orderId,
			patch: { status: 'PENDING' },
		})
		return result.updateOrderById?.order
	},

	/**
	 * Process an order - transitions from PENDING to PROCESSING
	 */
	process_order: async (args: unknown[], context: { executor: typeof mockExecutor }) => {
		const [orderId] = args as [string]
		const result = await context.executor.mutate<{
			updateOrderById: { order: { id: string; status: string } } | null
		}>(`mutation { updateOrderById(id: $id, patch: { status: "PROCESSING" }) { order { id status } } }`, {
			id: orderId,
			patch: { status: 'PROCESSING' },
		})
		return result.updateOrderById?.order
	},

	/**
	 * Ship an order - transitions from PROCESSING to SHIPPED
	 */
	ship_order: async (args: unknown[], context: { executor: typeof mockExecutor }) => {
		const [orderId] = args as [string]
		const result = await context.executor.mutate<{
			updateOrderById: { order: { id: string; status: string } } | null
		}>(`mutation { updateOrderById(id: $id, patch: { status: "SHIPPED" }) { order { id status } } }`, {
			id: orderId,
			patch: { status: 'SHIPPED' },
		})
		return result.updateOrderById?.order
	},

	/**
	 * Complete an order - transitions from SHIPPED to COMPLETED
	 */
	complete_order: async (args: unknown[], context: { executor: typeof mockExecutor }) => {
		const [orderId] = args as [string]
		const result = await context.executor.mutate<{
			updateOrderById: { order: { id: string; status: string } } | null
		}>(`mutation { updateOrderById(id: $id, patch: { status: "COMPLETED" }) { order { id status } } }`, {
			id: orderId,
			patch: { status: 'COMPLETED' },
		})
		return result.updateOrderById?.order
	},

	/**
	 * Cancel an order - transitions to CANCELLED from any non-COMPLETED state
	 */
	cancel_order: async (args: unknown[], context: { executor: typeof mockExecutor }) => {
		const [orderId] = args as [string]
		const result = await context.executor.mutate<{
			updateOrderById: { order: { id: string; status: string } } | null
		}>(`mutation { updateOrderById(id: $id, patch: { status: "CANCELLED" }) { order { id status } } }`, {
			id: orderId,
			patch: { status: 'CANCELLED' },
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
