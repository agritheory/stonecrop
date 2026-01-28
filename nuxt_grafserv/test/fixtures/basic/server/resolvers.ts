import { constant, lambda } from 'grafast'

// Sample data
const usersData = [
	{ id: '1', name: 'Alice', email: 'alice@example.com' },
	{ id: '2', name: 'Bob', email: 'bob@example.com' },
]

// Export resolvers in Grafast format with plans
export default {
	Query: {
		plans: {
			hello: () => constant('Hello, World!'),
			user: (_$root: any, { $id }: any) =>
				lambda($id, (id: string) => {
					return usersData.find(u => u.id === id) || null
				}),
			users: () => constant(usersData),
		},
	},
}
