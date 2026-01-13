export default {
	Query: {
		hello: () => 'world',
		ping: () => true,
	},
	Mutation: {
		echo: (_: unknown, { message }: { message: string }) => message,
	},
}
