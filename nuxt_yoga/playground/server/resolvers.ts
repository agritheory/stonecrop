import type { Resolvers } from '#graphql/resolver'

type ResolverContext = {
	user?: {
		id: string
		roles: string[]
	}
}

function hello(): string {
	return 'world'
}

function ping(): boolean {
	return true
}

function protectedQuery(_: unknown, args: {}, context: ResolverContext): string {
	if (!context.user) {
		throw new Error('Unauthorized: Please provide authentication')
	}

	if (!context.user.roles?.includes('admin')) {
		throw new Error('Forbidden: Admin role required')
	}

	return `Protected data for user ${context.user.id}`
}

function echo(_: unknown, { message }: { message: string }): string {
	return message
}

function addMessage(
	_: unknown,
	{ content }: { content: string },
	context: ResolverContext
): { id: string; content: string; author?: string } {
	// Example of using context in mutations
	const id = Date.now().toString()
	const author = context.user?.id || 'anonymous'

	console.log(`New message from ${author}: ${content}`)

	return {
		id,
		content,
		author,
	}
}

const resolvers: Resolvers = {
	Query: {
		hello,
		ping,
		// Uncomment to test protected queries
		// protectedQuery,
	},
	Mutation: {
		echo,
		// Uncomment to test context-aware mutations
		// addMessage,
	},
}

export default resolvers

// Example of how to integrate CASL (when needed):
//
// import { createAbility } from '@stonecrop/casl-middleware'
//
// function withCaslAuth(resolver: Function) {
//   return (parent: any, args: any, context: any, info: any) => {
//     const ability = createAbility(context.user)
//
//     if (!ability.can('read', 'Query')) {
//       throw new Error('Unauthorized')
//     }
//
//     return resolver(parent, args, { ...context, ability }, info)
//   }
// }
//
// Then wrap resolvers:
// protectedQuery: withCaslAuth(protectedQuery)
