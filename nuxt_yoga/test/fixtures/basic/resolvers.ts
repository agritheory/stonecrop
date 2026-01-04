export default {
	Query: {
		hello: () => 'world',
		ping: () => true,
	},
	Mutation: {
		echo: (_: any, { message }: { message: string }) => message,
	},
}
