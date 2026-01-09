/**
 * @stonecrop/nuxt fullstack playground resolvers
 *
 * Implements Stonecrop RPC-style operations:
 * - getMeta/stonecropMeta: Read doctype schemas from registry
 * - stonecropRecord/stonecropRecords: Proxy to MockGraphQLExecutor
 * - stonecropAction: Execute registered action handlers
 * - stonecropCreate/stonecropUpdate/stonecropDelete: CRUD via executor
 */

import { getMeta, getAllMeta, getHandler, type DoctypeMeta, type ActionContext } from '@stonecrop/graphql-middleware'
import { mockExecutor } from './mock-executor'

// ============================================
// Type Helpers
// ============================================

/**
 * Convert doctype name to PostGraphile-style query names
 */
function toQueryName(doctypeName: string, singular: boolean = true): string {
	// User -> userById / allUsers
	// Order -> orderById / allOrders
	const name = doctypeName.charAt(0).toLowerCase() + doctypeName.slice(1)
	return singular ? `${name}ById` : `all${doctypeName}s`
}

/**
 * Convert doctype name to PostGraphile-style mutation names
 */
function toMutationName(doctypeName: string, operation: 'create' | 'update' | 'delete'): string {
	// User -> createUser / updateUserById / deleteUserById
	const name = doctypeName.charAt(0).toLowerCase() + doctypeName.slice(1)
	if (operation === 'create') {
		return `create${doctypeName}`
	}
	return `${operation}${doctypeName}ById`
}

/**
 * Format FieldMeta for GraphQL response
 * The registry stores fields with various properties, normalize for the schema
 */
function formatFieldMeta(field: { fieldname: string; fieldtype: string; [key: string]: unknown }) {
	return {
		fieldname: field.fieldname,
		fieldtype: field.fieldtype,
		label: field.label ?? null,
		required: field.required ?? false,
		readOnly: field.readOnly ?? false,
		options: field.options ?? null,
		default: field.default ?? null,
		width: field.width ?? null,
		validation: field.validation ?? null,
	}
}

/**
 * Format DoctypeMeta for GraphQL response
 */
function formatDoctypeMeta(meta: DoctypeMeta) {
	return {
		name: meta.name,
		slug: meta.slug ?? null,
		tableName: meta.tableName ?? null,
		fields: meta.fields.map(formatFieldMeta),
		workflow: meta.workflow
			? {
					states: meta.workflow.states ?? null,
					actions: meta.workflow.actions ?? null,
			  }
			: null,
		inherits: meta.inherits ?? null,
		listDoctype: meta.listDoctype ?? null,
		parentDoctype: meta.parentDoctype ?? null,
	}
}

// ============================================
// Resolvers
// ============================================

export const resolvers = {
	Query: {
		// -------------------------------------------
		// Stonecrop Meta Queries
		// -------------------------------------------

		/**
		 * Get doctype metadata by name
		 * Used by @stonecrop/graphql-client's getMeta() method
		 */
		getMeta: (_: unknown, { doctype }: { doctype: string }) => {
			const meta = getMeta(doctype)
			return meta ? formatDoctypeMeta(meta) : null
		},

		/**
		 * Alias for getMeta - matches Stonecrop plugin naming
		 */
		stonecropMeta: (_: unknown, { doctype }: { doctype: string }) => {
			const meta = getMeta(doctype)
			return meta ? formatDoctypeMeta(meta) : null
		},

		/**
		 * Get all registered doctype metadata
		 */
		stonecropAllMeta: () => {
			return getAllMeta().map(formatDoctypeMeta)
		},

		// -------------------------------------------
		// Stonecrop Record Queries
		// -------------------------------------------

		/**
		 * Get a single record by doctype and ID
		 * Proxies to MockGraphQLExecutor
		 */
		stonecropRecord: async (_: unknown, { doctype, id }: { doctype: string; id: string }) => {
			const meta = getMeta(doctype)
			if (!meta) {
				throw new Error(`Unknown doctype: ${doctype}`)
			}

			const queryName = toQueryName(meta.name)
			const query = `{ ${queryName}(id: $id) }`

			try {
				const result = await mockExecutor.query<Record<string, unknown>>(query, { id })
				const data = result[queryName]

				return {
					data,
					doctype,
				}
			} catch (error) {
				console.error(`[stonecropRecord] Error fetching ${doctype}/${id}:`, error)
				return {
					data: null,
					doctype,
				}
			}
		},

		/**
		 * Get multiple records with optional filtering
		 * Proxies to MockGraphQLExecutor
		 */
		stonecropRecords: async (
			_: unknown,
			{
				doctype,
				filters,
				orderBy,
				limit,
				offset,
			}: {
				doctype: string
				filters?: Record<string, unknown>
				orderBy?: string
				limit?: number
				offset?: number
			}
		) => {
			const meta = getMeta(doctype)
			if (!meta) {
				throw new Error(`Unknown doctype: ${doctype}`)
			}

			const queryName = toQueryName(meta.name, false)
			const query = `{ ${queryName} }`

			try {
				const result = await mockExecutor.query<Record<string, { nodes: unknown[]; totalCount?: number }>>(query, {
					first: limit,
					offset,
					orderBy,
					...filters,
				})

				const connection = result[queryName]
				const data = connection?.nodes ?? []

				return {
					data,
					doctype,
					count: connection?.totalCount ?? data.length,
				}
			} catch (error) {
				console.error(`[stonecropRecords] Error fetching ${doctype}:`, error)
				return {
					data: [],
					doctype,
					count: 0,
				}
			}
		},

		// -------------------------------------------
		// System Queries
		// -------------------------------------------

		/**
		 * Health check
		 */
		healthCheck: () => ({
			status: 'healthy',
			timestamp: new Date().toISOString(),
			version: '1.0.0',
		}),

		/**
		 * Server info with enabled features
		 */
		serverInfo: () => ({
			name: 'Stonecrop Fullstack Playground',
			version: '1.0.0',
			environment: process.env.NODE_ENV || 'development',
			features: ['nuxt-grafserv', 'graphql-middleware', 'casl-middleware', 'stonecrop-nuxt', 'mock-executor'],
		}),
	},

	Mutation: {
		// -------------------------------------------
		// Stonecrop Action Mutation
		// -------------------------------------------

		/**
		 * Execute a doctype action
		 * Looks up action handler from registry and executes it
		 */
		stonecropAction: async (
			_: unknown,
			{ doctype, action, args }: { doctype: string; action: string; args?: unknown[] }
		) => {
			const meta = getMeta(doctype)
			if (!meta) {
				return {
					success: false,
					data: null,
					error: `Unknown doctype: ${doctype}`,
				}
			}

			// Look up action definition in doctype workflow
			const actionDef = meta.workflow?.actions?.[action]
			if (!actionDef) {
				return {
					success: false,
					data: null,
					error: `Unknown action: ${action} on ${doctype}`,
				}
			}

			// Get registered handler
			const handler = getHandler(actionDef.handler)
			if (!handler) {
				return {
					success: false,
					data: null,
					error: `Handler not registered: ${actionDef.handler}`,
				}
			}

			// Build action context
			const actionContext: ActionContext = {
				doctype: meta,
				executor: mockExecutor,
			}

			try {
				const result = await handler(args ?? [], actionContext)
				return {
					success: true,
					data: result,
					error: null,
				}
			} catch (err) {
				return {
					success: false,
					data: null,
					error: err instanceof Error ? err.message : String(err),
				}
			}
		},

		// -------------------------------------------
		// Stonecrop CRUD Mutations
		// -------------------------------------------

		/**
		 * Create a new record
		 */
		stonecropCreate: async (_: unknown, { doctype, input }: { doctype: string; input: Record<string, unknown> }) => {
			const meta = getMeta(doctype)
			if (!meta) {
				throw new Error(`Unknown doctype: ${doctype}`)
			}

			const mutationName = toMutationName(meta.name, 'create')
			const mutation = `mutation { ${mutationName}(input: $input) }`

			try {
				const result = await mockExecutor.mutate<Record<string, { [key: string]: unknown }>>(mutation, {
					input,
				})

				// Extract the nested record from result (e.g., createUser.user)
				const mutationResult = result[mutationName]
				const recordKey = meta.name.charAt(0).toLowerCase() + meta.name.slice(1)
				const data = mutationResult?.[recordKey] ?? mutationResult

				return {
					data,
					doctype,
				}
			} catch (error) {
				console.error(`[stonecropCreate] Error creating ${doctype}:`, error)
				throw error
			}
		},

		/**
		 * Update an existing record
		 */
		stonecropUpdate: async (
			_: unknown,
			{ doctype, id, patch }: { doctype: string; id: string; patch: Record<string, unknown> }
		) => {
			const meta = getMeta(doctype)
			if (!meta) {
				throw new Error(`Unknown doctype: ${doctype}`)
			}

			const mutationName = toMutationName(meta.name, 'update')
			const mutation = `mutation { ${mutationName}(id: $id, patch: $patch) }`

			try {
				const result = await mockExecutor.mutate<Record<string, { [key: string]: unknown } | null>>(mutation, {
					id,
					patch,
				})

				const mutationResult = result[mutationName]
				if (!mutationResult) {
					return null
				}

				const recordKey = meta.name.charAt(0).toLowerCase() + meta.name.slice(1)
				const data = mutationResult?.[recordKey] ?? mutationResult

				return {
					data,
					doctype,
				}
			} catch (error) {
				console.error(`[stonecropUpdate] Error updating ${doctype}/${id}:`, error)
				throw error
			}
		},

		/**
		 * Delete a record
		 */
		stonecropDelete: async (_: unknown, { doctype, id }: { doctype: string; id: string }) => {
			const meta = getMeta(doctype)
			if (!meta) {
				return {
					success: false,
					data: null,
					error: `Unknown doctype: ${doctype}`,
				}
			}

			const mutationName = toMutationName(meta.name, 'delete')
			const mutation = `mutation { ${mutationName}(id: $id) }`

			try {
				const result = await mockExecutor.mutate<Record<string, { deletedUserId?: string; deletedOrderId?: string }>>(
					mutation,
					{ id }
				)

				const mutationResult = result[mutationName]
				const deleted = mutationResult?.deletedUserId || mutationResult?.deletedOrderId

				return {
					success: !!deleted,
					data: { id: deleted },
					error: deleted ? null : 'Record not found',
				}
			} catch (error) {
				return {
					success: false,
					data: null,
					error: error instanceof Error ? error.message : String(error),
				}
			}
		},
	},
}

export default resolvers
