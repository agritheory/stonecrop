/**
 * Mock GraphQL Executor for Stonecrop
 *
 * Implements the local GraphQLExecutor interface below, simulating PostGraphile-style
 * responses with in-memory data stores.
 *
 * This can be swapped for a real PostGraphile HTTP client or programmatic API
 * by simply replacing the executor instance in the nuxt.config.ts configuration.
 */

/**
 * The shape a Stonecrop host's data executor must satisfy.
 *
 * Declared here rather than imported: `@stonecrop/graphql-middleware` does not export a
 * `GraphQLExecutor` type, and the import that claimed it did resolved to nothing — which
 * silently disabled every check `implements` was meant to provide. Keeping it local means
 * the contract is at least real. If the middleware ever publishes one, import that instead.
 */
interface GraphQLExecutor {
	query<T = Record<string, unknown>>(query: string, variables?: Record<string, unknown>): Promise<T>
	mutate<T = Record<string, unknown>>(mutation: string, variables?: Record<string, unknown>): Promise<T>
}

// =============================================================================
// Data Types
// =============================================================================

interface User {
	id: string
	email: string
	name: string
	role: 'ADMIN' | 'MANAGER' | 'USER' | 'GUEST'
	status: 'ACTIVE' | 'SUSPENDED' | 'PENDING' | 'DELETED'
	createdAt: string
	updatedAt?: string
	lastLogin?: string
	avatar?: string
	bio?: string
	phone?: string
	address?: string
}

interface OrderItem {
	id: string
	productId: string
	productName: string
	quantity: number
	unitPrice: number
	total: number
}

interface Order {
	id: string
	orderNumber: string
	userId: string
	status: 'DRAFT' | 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED'
	total: number
	items: OrderItem[]
	shippingAddress?: string
	billingAddress?: string
	createdAt: string
	updatedAt?: string
	processedAt?: string
	shippedAt?: string
	completedAt?: string
}

// =============================================================================
// In-Memory Data Stores
// =============================================================================

const users: Map<string, User> = new Map([
	[
		'1',
		{
			id: '1',
			email: 'admin@example.com',
			name: 'Admin User',
			role: 'ADMIN',
			status: 'ACTIVE',
			createdAt: '2025-01-01T00:00:00Z',
			bio: 'System administrator',
		},
	],
	[
		'2',
		{
			id: '2',
			email: 'john@example.com',
			name: 'John Doe',
			role: 'USER',
			status: 'ACTIVE',
			createdAt: '2025-01-02T00:00:00Z',
			bio: 'Regular user',
			phone: '+1-555-0100',
		},
	],
	[
		'3',
		{
			id: '3',
			email: 'jane@example.com',
			name: 'Jane Smith',
			role: 'MANAGER',
			status: 'ACTIVE',
			createdAt: '2025-01-03T00:00:00Z',
		},
	],
])

const orders: Map<string, Order> = new Map([
	[
		'1',
		{
			id: '1',
			orderNumber: 'ORD-2025-0001',
			userId: '2',
			status: 'COMPLETED',
			total: 150.0,
			items: [
				{
					id: '1-1',
					productId: 'PROD-001',
					productName: 'Widget A',
					quantity: 2,
					unitPrice: 50.0,
					total: 100.0,
				},
				{
					id: '1-2',
					productId: 'PROD-002',
					productName: 'Widget B',
					quantity: 1,
					unitPrice: 50.0,
					total: 50.0,
				},
			],
			shippingAddress: '123 Main St, City, ST 12345',
			createdAt: '2025-01-05T10:00:00Z',
			completedAt: '2025-01-07T15:30:00Z',
		},
	],
	[
		'2',
		{
			id: '2',
			orderNumber: 'ORD-2025-0002',
			userId: '2',
			status: 'PROCESSING',
			total: 75.0,
			items: [
				{
					id: '2-1',
					productId: 'PROD-003',
					productName: 'Gadget X',
					quantity: 3,
					unitPrice: 25.0,
					total: 75.0,
				},
			],
			shippingAddress: '123 Main St, City, ST 12345',
			createdAt: '2025-01-06T09:00:00Z',
			processedAt: '2025-01-06T09:30:00Z',
		},
	],
])

// =============================================================================
// Query Parsing Utilities
// =============================================================================

/**
 * Parse a GraphQL query to extract the operation name
 * This is a simplified parser for the mock - real PostGraphile handles this properly
 */
function extractQueryName(query: string): string | null {
	// Match patterns like: userById, allUsers, orderById, allOrders
	const match = query.match(/\{\s*(\w+)/)
	return match?.[1] ?? null
}

/**
 * Convert snake_case table name to camelCase query name
 */
function toCamelCase(str: string): string {
	return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * Look a record up by the doctype's declared key rather than always by `id`.
 *
 * `lookupField` comes from `recordLookupField()` in resolvers.ts, which reads the doctype's
 * declared `primaryKey`. Keying the store by `id` is the fast path; any other field is a
 * natural key, so the store is scanned. Values are compared as strings because the `id`
 * argument arrives from GraphQL as `String!` while a record may hold a number.
 */
function findByLookupField<T extends object>(
	store: ReadonlyMap<string, T>,
	value: unknown,
	lookupField?: unknown
): T | null {
	const field = typeof lookupField === 'string' && lookupField !== '' ? lookupField : 'id'
	// Only primitives are usable keys; stringifying an object would compare "[object Object]".
	if (typeof value !== 'string' && typeof value !== 'number') return null
	const wanted = String(value)
	if (field === 'id') return store.get(wanted) ?? null
	for (const record of store.values()) {
		const candidate: unknown = Reflect.get(record, field)
		if ((typeof candidate === 'string' || typeof candidate === 'number') && String(candidate) === wanted) {
			return record
		}
	}
	return null
}

// =============================================================================
// Mock GraphQL Executor
// =============================================================================

export class MockGraphQLExecutor implements GraphQLExecutor {
	/**
	 * Execute a GraphQL query against the mock data stores
	 *
	 * Supports PostGraphile-style query patterns:
	 * - userById(id: "1") -> single user
	 * - allUsers -> connection with nodes
	 * - orderById(id: "1") -> single order
	 * - allOrders -> connection with nodes
	 */
	async query<T = Record<string, unknown>>(query: string, variables?: Record<string, unknown>): Promise<T> {
		// Accept either a query name (e.g., "allUsers") or a full GraphQL query
		let queryName = query.trim()
		if (queryName.includes('{')) {
			const extracted = extractQueryName(query)
			if (!extracted) {
				throw new Error('Could not parse query name from GraphQL query')
			}
			queryName = extracted
		}

		// Handle User queries
		if (queryName === 'userById') {
			const user = findByLookupField(users, variables?.id, variables?.lookupField)
			return { userById: user } as T
		}

		if (queryName === 'allUsers') {
			const limit = (variables?.first as number) || 100
			const offset = (variables?.offset as number) || 0
			const allUsers = Array.from(users.values())
			const nodes = allUsers.slice(offset, offset + limit)
			return {
				allUsers: {
					nodes,
					totalCount: allUsers.length,
				},
			} as T
		}

		// Handle Order queries
		if (queryName === 'orderById') {
			const order = findByLookupField(orders, variables?.id, variables?.lookupField)
			return { orderById: order } as T
		}

		if (queryName === 'allOrders') {
			const limit = (variables?.first as number) || 100
			const offset = (variables?.offset as number) || 0
			const userId = variables?.userId as string | undefined
			let allOrders = Array.from(orders.values())

			if (userId) {
				allOrders = allOrders.filter(o => o.userId === userId)
			}

			const nodes = allOrders.slice(offset, offset + limit)
			return {
				allOrders: {
					nodes,
					totalCount: allOrders.length,
				},
			} as T
		}

		// Handle OrderItem queries (nested)
		if (queryName === 'orderItemById') {
			// Order items live nested inside orders rather than in their own store, so flatten
			// first and then apply the same declared-key lookup every other doctype gets.
			const items = new Map<string, OrderItem>()
			for (const order of orders.values()) {
				for (const item of order.items) items.set(item.id, item)
			}
			const item = findByLookupField(items, variables?.id, variables?.lookupField)
			return { orderItemById: item } as T
		}

		if (queryName === 'allOrderItems') {
			const orderId = variables?.orderId as string | undefined
			let items: OrderItem[] = []

			if (orderId) {
				const order = orders.get(orderId)
				items = order?.items || []
			} else {
				// Get all items from all orders
				for (const order of orders.values()) {
					items.push(...order.items)
				}
			}

			return {
				allOrderItems: {
					nodes: items,
					totalCount: items.length,
				},
			} as T
		}

		throw new Error(`Unknown query: ${queryName}`)
	}

	/**
	 * Execute a GraphQL mutation against the mock data stores
	 *
	 * Supports PostGraphile-style mutation patterns:
	 * - createUser(input: {...}) -> create user
	 * - updateUserById(id: "1", patch: {...}) -> update user
	 *
	 * There is no delete branch: removal is a declared workflow outcome, so `toMutationName` only
	 * ever derives `create` and `update` and nothing can route a delete here.
	 */
	async mutate<T = Record<string, unknown>>(mutation: string, variables?: Record<string, unknown>): Promise<T> {
		// Accept either a mutation name (e.g., "createUser") or a full GraphQL mutation
		let mutationName = mutation.trim()
		if (mutationName.includes('{')) {
			const extracted = extractQueryName(mutation)
			if (!extracted) {
				throw new Error('Could not parse mutation name from GraphQL mutation')
			}
			mutationName = extracted
		}

		// Handle User mutations
		if (mutationName === 'createUser') {
			const input = variables?.input as Partial<User>
			const id = String(users.size + 1)
			const user: User = {
				id,
				email: input.email || '',
				name: input.name || '',
				role: input.role || 'USER',
				status: 'PENDING',
				createdAt: new Date().toISOString(),
				...input,
			}
			users.set(id, user)
			return { createUser: { user } } as T
		}

		if (mutationName === 'updateUserById') {
			const id = variables?.id as string
			const patch = variables?.patch as Partial<User>
			const user = users.get(id)

			if (!user) {
				return { updateUserById: null } as T
			}

			const updated: User = {
				...user,
				...patch,
				updatedAt: new Date().toISOString(),
			}
			users.set(id, updated)
			return { updateUserById: { user: updated } } as T
		}

		// Handle Order mutations
		if (mutationName === 'createOrder') {
			const input = variables?.input as Partial<Order>
			const id = String(orders.size + 1)
			const orderNumber = `ORD-2025-${String(orders.size + 1).padStart(4, '0')}`
			const order: Order = {
				id,
				orderNumber,
				userId: input.userId || '',
				status: 'DRAFT',
				total: 0,
				items: [],
				createdAt: new Date().toISOString(),
				...input,
			}
			orders.set(id, order)
			return { createOrder: { order } } as T
		}

		if (mutationName === 'updateOrderById') {
			const id = variables?.id as string
			const patch = variables?.patch as Partial<Order>
			const order = orders.get(id)

			if (!order) {
				return { updateOrderById: null } as T
			}

			const updated: Order = {
				...order,
				...patch,
				updatedAt: new Date().toISOString(),
			}

			// Update timestamp fields based on status changes
			if (patch.status === 'PROCESSING' && !updated.processedAt) {
				updated.processedAt = new Date().toISOString()
			}
			if (patch.status === 'SHIPPED' && !updated.shippedAt) {
				updated.shippedAt = new Date().toISOString()
			}
			if (patch.status === 'COMPLETED' && !updated.completedAt) {
				updated.completedAt = new Date().toISOString()
			}

			orders.set(id, updated)
			return { updateOrderById: { order: updated } } as T
		}

		throw new Error(`Unknown mutation: ${mutationName}`)
	}

	// ==========================================================================
	// Data Access Methods (for testing and direct access)
	// ==========================================================================

	getUser(id: string): User | undefined {
		return users.get(id)
	}

	getAllUsers(): User[] {
		return Array.from(users.values())
	}

	getOrder(id: string): Order | undefined {
		return orders.get(id)
	}

	getAllOrders(): Order[] {
		return Array.from(orders.values())
	}

	/**
	 * Reset data stores to initial state (useful for testing)
	 */
	reset(): void {
		users.clear()
		orders.clear()

		// Re-add initial data
		users.set('1', {
			id: '1',
			email: 'admin@example.com',
			name: 'Admin User',
			role: 'ADMIN',
			status: 'ACTIVE',
			createdAt: '2025-01-01T00:00:00Z',
			bio: 'System administrator',
		})
		users.set('2', {
			id: '2',
			email: 'john@example.com',
			name: 'John Doe',
			role: 'USER',
			status: 'ACTIVE',
			createdAt: '2025-01-02T00:00:00Z',
			bio: 'Regular user',
			phone: '+1-555-0100',
		})
		users.set('3', {
			id: '3',
			email: 'jane@example.com',
			name: 'Jane Smith',
			role: 'MANAGER',
			status: 'ACTIVE',
			createdAt: '2025-01-03T00:00:00Z',
		})

		orders.set('1', {
			id: '1',
			orderNumber: 'ORD-2025-0001',
			userId: '2',
			status: 'COMPLETED',
			total: 150.0,
			items: [
				{
					id: '1-1',
					productId: 'PROD-001',
					productName: 'Widget A',
					quantity: 2,
					unitPrice: 50.0,
					total: 100.0,
				},
				{
					id: '1-2',
					productId: 'PROD-002',
					productName: 'Widget B',
					quantity: 1,
					unitPrice: 50.0,
					total: 50.0,
				},
			],
			shippingAddress: '123 Main St, City, ST 12345',
			createdAt: '2025-01-05T10:00:00Z',
			completedAt: '2025-01-07T15:30:00Z',
		})
		orders.set('2', {
			id: '2',
			orderNumber: 'ORD-2025-0002',
			userId: '2',
			status: 'PROCESSING',
			total: 75.0,
			items: [
				{
					id: '2-1',
					productId: 'PROD-003',
					productName: 'Gadget X',
					quantity: 3,
					unitPrice: 25.0,
					total: 75.0,
				},
			],
			shippingAddress: '123 Main St, City, ST 12345',
			createdAt: '2025-01-06T09:00:00Z',
			processedAt: '2025-01-06T09:30:00Z',
		})
	}
}

// Export a singleton instance for use across the application
export const mockExecutor = new MockGraphQLExecutor()
