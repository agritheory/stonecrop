/**
 * GraphQL resolvers for nuxt-grafserv playground
 * Uses in-memory data stores for demonstration
 */

import { type GrafastSchemaConfig, Step, access, constant, filter, lambda, object } from 'grafast'

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

// Sample data
const users: Map<string, User> = new Map([
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
])

const orders: Map<string, Order> = new Map([
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
])

let nextUserId = 4
let nextOrderId = 3
let nextItemId = 4

const resolvers: GrafastSchemaConfig['objects'] = {
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
			users: () => constant(Array.from(users.values())),

			/**
			 * Get user by ID
			 */
			user: (_source, fieldArgs) => {
				const { $id } = fieldArgs
				return lambda($id, id => users.get(id) ?? null)
			},

			/**
			 * Get all orders
			 */
			orders: () => constant(Array.from(orders.values())),

			/**
			 * Get orders for a specific user
			 */
			userOrders: (_source, fieldArgs) => {
				const { $userId } = fieldArgs
				const $allOrders = constant(Array.from(orders.values()))
				return filter($allOrders, $order =>
					lambda([access($order, 'userId'), $userId], ([orderUserId, userId]) => orderUserId === userId)
				)
			},
		},
	},

	Mutation: {
		plans: {
			/**
			 * Echo back the message
			 */
			echo: (_source, fieldArgs) => {
				const { $message } = fieldArgs
				return $message
			},

			/**
			 * Create a new user
			 */
			createUser: (_source, fieldArgs) => {
				const { $name, $email } = fieldArgs
				const $id = constant(String(nextUserId++))
				const $now = constant(new Date().toISOString())

				const $user = object({
					id: $id,
					name: $name,
					email: $email,
					role: constant('user'),
					createdAt: $now,
					updatedAt: $now,
				})

				return lambda($user, user => {
					users.set(user.id, user)
					console.log(`[Playground] Created user: ${user.name} (${user.id})`)
					return user
				})
			},

			/**
			 * Update an existing user
			 */
			updateUser: (_source, fieldArgs) => {
				const { $id, $name, $email, $role } = fieldArgs
				return lambda([$id, $name, $email, $role], ([id, name, email, role]) => {
					const user = users.get(id)
					if (!user) return null

					if (name !== undefined) user.name = name
					if (email !== undefined) user.email = email
					if (role !== undefined) user.role = role
					user.updatedAt = new Date().toISOString()

					users.set(id, user)
					console.log(`[Playground] Updated user: ${user.name} (${user.id})`)
					return user
				})
			},

			/**
			 * Delete a user
			 */
			deleteUser: (_source, fieldArgs) => {
				const { $id } = fieldArgs
				return lambda($id, id => {
					const deleted = users.delete(id)
					if (deleted) {
						console.log(`[Playground] Deleted user: ${id}`)
					}
					return deleted
				})
			},

			/**
			 * Create a new order
			 */
			createOrder: (_source, fieldArgs) => {
				const { $userId, $items } = fieldArgs
				return lambda([$userId, $items], ([userId, items]) => {
					const user = users.get(userId)
					if (!user) {
						throw new Error(`User not found: ${userId}`)
					}

					const orderId = String(nextOrderId++)
					const orderItems: OrderItem[] = items.map(
						(item: { productName: string; quantity: number; price: number }) => ({
							id: String(nextItemId++),
							...item,
						})
					)

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
					console.log(`[Playground] Created order: ${orderId} for user ${userId}`)
					return order
				})
			},

			/**
			 * Update order status
			 */
			updateOrderStatus: (_source, fieldArgs) => {
				const { $id, $status } = fieldArgs
				return lambda([$id, $status], ([id, status]) => {
					const order = orders.get(id)
					if (!order) return null

					order.status = status
					orders.set(id, order)
					console.log(`[Playground] Updated order ${id} status to: ${status}`)
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
			// Field resolvers if needed
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
				const $userId = access($order, 'userId')
				return lambda($userId, userId => users.get(userId as string) ?? null)
			},
		},
	},
}

export default resolvers
