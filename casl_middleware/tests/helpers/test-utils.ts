import { GraphQLSchema } from 'graphql'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { PureAbility } from '@casl/ability'
import { Context, User } from '../../src/types'
import { AppAbility } from '../../src/middleware/ability'

/**
 * Create a mock GraphQL context for testing
 */
export const createMockContext = (user?: User, ability?: AppAbility): Context => {
	const defaultAbility = new PureAbility<[string, any]>([{ action: 'read', subject: 'Query' }]) as AppAbility

	return {
		user: user || undefined,
		ability: ability || defaultAbility,
	}
}

/**
 * Create a simple test schema
 */
export const createTestSchema = (): GraphQLSchema => {
	const typeDefs = `
		type User {
			id: ID!
			name: String!
			email: String
			role: String
		}

		type Post {
			id: ID!
			title: String!
			content: String!
			authorId: String!
		}

		type Query {
			me: User
			user(id: ID!): User
			posts: [Post!]!
		}

		type Mutation {
			updateUser(id: ID!, name: String): User
			createPost(title: String!, content: String!): Post
		}
	`

	const resolvers = {
		Query: {
			me: () => ({ id: '123', name: 'Test User', email: 'test@example.com', role: 'user' }),
			user: (_: any, { id }: any) => ({ id, name: `User ${id}`, email: `user${id}@example.com`, role: 'user' }),
			posts: () => [
				{ id: '1', title: 'Post 1', content: 'Content 1', authorId: '123' },
				{ id: '2', title: 'Post 2', content: 'Content 2', authorId: '456' },
			],
		},
		Mutation: {
			updateUser: (_: any, { id, name }: any) => ({ id, name: name || 'Updated', email: 'updated@example.com' }),
			createPost: (_: any, { title, content }: any) => ({ id: '3', title, content, authorId: '123' }),
		},
	}

	return makeExecutableSchema({ typeDefs, resolvers })
}

/**
 * Create test users with different roles
 */
export const testUsers = {
	public: undefined,
	regular: { id: '123', roles: ['user'] },
	moderator: { id: '456', roles: ['user', 'moderator'] },
	editor: { id: '789', roles: ['user', 'editor'] },
	admin: { id: '999', roles: ['admin'] },
}

/**
 * Assertion helper for checking abilities
 */
export const expectAbility = (ability: PureAbility) => ({
	toAllow: (action: string, subject: string, conditions?: any) => {
		expect(ability.can(action, subject, conditions)).toBe(true)
	},
	toDeny: (action: string, subject: string, conditions?: any) => {
		expect(ability.can(action, subject, conditions)).toBe(false)
	},
})

/**
 * Mock GraphQL ResolveInfo for testing
 */
export const createMockResolveInfo = (overrides: any = {}): any => ({
	fieldName: 'testField',
	parentType: { name: 'Query' },
	path: { typename: 'Query', key: 'testField' },
	operation: {
		operation: 'query',
		loc: { source: { body: 'query { testField }' } },
	},
	...overrides,
})
