/**
 * GraphQL resolvers for nuxt-grafserv playground
 * Uses in-memory data stores for demonstration
 * Modernized with Grafast plan resolvers
 */

import { constant, lambda, context, Step, type GrafastSchemaConfig } from 'grafast'

// In-memory data stores
interface User {
	id: string
	name: string
	email: string
	role: string
	createdAt: string
	updatedAt: string
}

interface OrderItem {
	id: string
	productName: string
	quantity: number
	price: number
}

interface Order {
	id: string
	userId: string
	status: string
	total: number
	items: OrderItem[]
	createdAt: string
}

// Use globalThis to persist data across module reloads (HMR)
interface GlobalStore {
	users?: Map<string, User>
	orders?: Map<string, Order>
	nextUserId?: number
	nextOrderId?: number
	nextItemId?: number
}

declare global {
	// eslint-disable-next-line no-var
	var __grafserv_store: GlobalStore | undefined
}

// Initialize store if it doesn't exist
if (!global.__grafserv_store) {
	global.__grafserv_store = {
		users: new Map([
			[
				'1',
				{
					id: '1',
					name: 'Alice Admin',
					email: 'alice@example.com',
					role: 'admin',
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				},
			],
			[
				'2',
				{
					id: '2',
					name: 'Bob User',
					email: 'bob@example.com',
					role: 'user',
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				},
			],
			[
				'3',
				{
					id: '3',
					name: 'Charlie Guest',
					email: 'charlie@example.com',
					role: 'guest',
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				},
			],
		]),
		orders: new Map([
			[
				'1',
				{
					id: '1',
					userId: '2',
					status: 'pending',
					total: 99.99,
					items: [
						{ id: '1', productName: 'Widget A', quantity: 2, price: 29.99 },
						{ id: '2', productName: 'Widget B', quantity: 1, price: 40.01 },
					],
					createdAt: new Date().toISOString(),
				},
			],
			[
				'2',
				{
					id: '2',
					userId: '2',
					status: 'completed',
					total: 150.0,
					items: [{ id: '3', productName: 'Premium Widget', quantity: 1, price: 150.0 }],
					createdAt: new Date().toISOString(),
				},
			],
		]),
		nextUserId: 4,
		nextOrderId: 3,
		nextItemId: 4,
	}
}

// Reference the global store
const users = global.__grafserv_store.users!
const orders = global.__grafserv_store.orders!
const counters = {
	get nextUserId() {
		return global.__grafserv_store!.nextUserId!
	},
	set nextUserId(val: number) {
		global.__grafserv_store!.nextUserId = val
	},
	get nextOrderId() {
		return global.__grafserv_store!.nextOrderId!
	},
	set nextOrderId(val: number) {
		global.__grafserv_store!.nextOrderId = val
	},
	get nextItemId() {
		return global.__grafserv_store!.nextItemId!
	},
	set nextItemId(val: number) {
		global.__grafserv_store!.nextItemId = val
	},
}

const resolvers: Omit<GrafastSchemaConfig, 'typeDefs'> = {
	objects: {
		Query: {
			plans: {
				/**
				 * Simple hello world
				 */
				hello: () => constant('world'),

				/**
				 * Health check
				 */
				ping: () => constant(true),

				/**
				 * Get all users
				 */
				users: () => {
					const $context = context()
					return lambda($context, () => Array.from(users.values()))
				},

				/**
				 * Get user by ID
				 */
				user: (_$source, fieldArgs) => {
					const { $id } = fieldArgs
					return lambda($id, (id: string) => users.get(id) || null)
				},

				/**
				 * Get all orders
				 */
				orders: () => {
					const $context = context()
					return lambda($context, () => Array.from(orders.values()))
				},

				/**
				 * Get orders for a specific user
				 */
				userOrders: (_$source, fieldArgs) => {
					const { $userId } = fieldArgs
					return lambda($userId, (userId: string) =>
						Array.from(orders.values()).filter(order => order.userId === userId)
					)
				},
			},
		},

		Mutation: {
			plans: {
				/**
				 * Echo back the message
				 */
				echo: (_$source, fieldArgs) => {
					const { $message } = fieldArgs
					return $message
				},

				/**
				 * Create a new user
				 */
				createUser: (_$source, fieldArgs) => {
					const { $name, $email } = fieldArgs
					if (!$name || !$email) {
						throw new Error('Name and email are required to create a user')
					}
					return lambda([$name, $email], ([name, email]: readonly [string, string]) => {
						const id = String(counters.nextUserId++)
						const now = new Date().toISOString()
						const user: User = {
							id,
							name,
							email,
							role: 'user',
							createdAt: now,
							updatedAt: now,
						}
						users.set(id, user)
						return user
					})
				},

				/**
				 * Update an existing user
				 */
				updateUser: (_$source, fieldArgs) => {
					const { $id, $name, $email, $role } = fieldArgs
					if (!$id || (!$name && !$email && !$role)) {
						throw new Error('User ID and at least one field to update are required')
					}

					// Filter out undefined steps
					const steps = [$id, $name, $email, $role].filter((step): step is typeof $id => step !== undefined)
					return lambda(steps, (values: any[]) => {
						const [id, name, email, role] = values as [
							string,
							string | undefined,
							string | undefined,
							string | undefined
						]
						const user = users.get(id)
						if (!user) return null

						if (name !== undefined) user.name = name
						if (email !== undefined) user.email = email
						if (role !== undefined) user.role = role
						user.updatedAt = new Date().toISOString()

						users.set(id, user)
						return user
					})
				},

				/**
				 * Delete a user
				 */
				deleteUser: (_$source, fieldArgs) => {
					const { $id } = fieldArgs
					return lambda($id, (id: string) => {
						const deleted = users.delete(id)
						if (deleted) {
						}
						return deleted
					})
				},

				/**
				 * Create a new order
				 */
				createOrder: (_$source, fieldArgs) => {
					const { $userId, $items } = fieldArgs
					if (!$userId || !$items) {
						throw new Error('UserId and items are required')
					}

					return lambda(
						[$userId, $items],
						([userId, items]: readonly [string, Array<{ productName: string; quantity: number; price: number }>]) => {
							const user = users.get(userId)
							if (!user) {
								throw new Error(`User not found: ${userId}`)
							}

							const orderId = String(counters.nextOrderId++)
							const orderItems: OrderItem[] = items.map((item: any) => ({
								id: String(counters.nextItemId++),
								...item,
							}))

							const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

							const order: Order = {
								id: orderId,
								userId,
								status: 'pending',
								total,
								items: orderItems,
								createdAt: new Date().toISOString(),
							}

							orders.set(orderId, order)
							return order
						}
					)
				},

				/**
				 * Update order status
				 */
				updateOrderStatus: (_$source, fieldArgs) => {
					const { $id, $status } = fieldArgs
					if (!$id || !$status) {
						throw new Error('Order ID and status are required')
					}
					return lambda([$id, $status], ([id, status]: readonly [string, string]) => {
						const order = orders.get(id)
						if (!order) return null

						order.status = status
						orders.set(id, order)
						return order
					})
				},
			},
		},

		/**
		 * User type resolvers
		 */
		User: {
			plans: {
				// Field resolvers if needed - default plan resolver will handle fields
			},
		},

		/**
		 * Order type resolvers
		 */
		Order: {
			plans: {
				/**
				 * Resolve the user for an order
				 */
				user: ($order: Step<Order>) => {
					return lambda($order, order => users.get(order.userId) || null)
				},
			},
		},
	},
}

export default resolvers
