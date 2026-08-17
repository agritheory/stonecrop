import { constant, lambda, type Step } from 'grafast'

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
			// `$id` is annotated so `lambda` can infer its callback parameter. Left as `any`, the step
			// widens to `unknown` and the `(id: string)` callback below stops being assignable.
			user: (_$root: Step, { $id }: { $id: Step<string> }) =>
				lambda($id, (id: string) => {
					return usersData.find(u => u.id === id) || null
				}),
			users: () => constant(usersData),
		},
	},
}
