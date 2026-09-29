/**
 * Mock GraphQL Executor for Stonecrop documentation playground
 *
 * Session-scoped in-memory stores so each visitor gets isolated ephemeral data.
 */

import { getSessionId, registerSessionEvictionHandler, touchSession } from './session-store'

interface GraphQLExecutor {
	query<T = Record<string, unknown>>(query: string, variables?: Record<string, unknown>): Promise<T>
	mutate<T = Record<string, unknown>>(mutation: string, variables?: Record<string, unknown>): Promise<T>
}

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

interface SessionData {
	users: Map<string, User>
	orders: Map<string, Order>
}

const sessionOrder: string[] = []
const sessionStores = new Map<string, SessionData>()

function seedUsers(): Map<string, User> {
	return new Map([
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
}

function seedOrders(): Map<string, Order> {
	return new Map([
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
}

function createSessionData(): SessionData {
	return {
		users: seedUsers(),
		orders: seedOrders(),
	}
}

function getSessionData(sessionId: string): SessionData {
	touchSession(sessionId, sessionOrder)
	if (!sessionStores.has(sessionId)) {
		sessionStores.set(sessionId, createSessionData())
	}
	return sessionStores.get(sessionId)!
}

registerSessionEvictionHandler(sessionId => {
	sessionStores.delete(sessionId)
})

function extractQueryName(query: string): string | null {
	const match = query.match(/\{\s*(\w+)/)
	return match?.[1] ?? null
}

function findByLookupField<T extends object>(
	store: ReadonlyMap<string, T>,
	value: unknown,
	lookupField?: unknown
): T | null {
	const field = typeof lookupField === 'string' && lookupField !== '' ? lookupField : 'id'
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

export class MockGraphQLExecutor implements GraphQLExecutor {
	private getStore(): SessionData {
		return getSessionData(getSessionId())
	}

	async query<T = Record<string, unknown>>(query: string, variables?: Record<string, unknown>): Promise<T> {
		const { users, orders } = this.getStore()

		let queryName = query.trim()
		if (queryName.includes('{')) {
			const extracted = extractQueryName(query)
			if (!extracted) {
				throw new Error('Could not parse query name from GraphQL query')
			}
			queryName = extracted
		}

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

		if (queryName === 'orderItemById') {
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

	async mutate<T = Record<string, unknown>>(mutation: string, variables?: Record<string, unknown>): Promise<T> {
		const { users, orders } = this.getStore()

		let mutationName = mutation.trim()
		if (mutationName.includes('{')) {
			const extracted = extractQueryName(mutation)
			if (!extracted) {
				throw new Error('Could not parse mutation name from GraphQL mutation')
			}
			mutationName = extracted
		}

		if (mutationName === 'createUser') {
			const input = variables?.input as Partial<User>
			const submitted = typeof input.id === 'string' && input.id !== '' ? input.id : undefined
			const id = submitted ?? String(users.size + 1)
			const user: User = {
				email: input.email || '',
				name: input.name || '',
				role: input.role || 'USER',
				status: 'PENDING',
				createdAt: new Date().toISOString(),
				...input,
				id,
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

		if (mutationName === 'createOrder') {
			const input = variables?.input as Partial<Order>
			const submitted = typeof input.id === 'string' && input.id !== '' ? input.id : undefined
			const id = submitted ?? String(orders.size + 1)
			const orderNumber = `ORD-2025-${String(orders.size + 1).padStart(4, '0')}`
			const order: Order = {
				orderNumber,
				userId: input.userId || '',
				status: 'DRAFT',
				total: 0,
				items: [],
				createdAt: new Date().toISOString(),
				...input,
				id,
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

	reset(): void {
		const sessionId = getSessionId()
		sessionStores.set(sessionId, createSessionData())
	}
}

export const mockExecutor = new MockGraphQLExecutor()
