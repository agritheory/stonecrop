import { makeExtendSchemaPlugin, gql } from 'postgraphile/utils'
import { Context, MiddlewareOptions, CreateAbilityInput, AbilityResponse } from './types'
import { createAbility } from './middleware/ability'
import { createCaslMiddleware } from './middleware/graphql'

/**
 * Postgraphile plugin that adds CASL authorization support
 *
 * @param options - CASL middleware configuration options
 * @returns Postgraphile plugin
 */
export const postgraphileCaslPlugin = (options: MiddlewareOptions = {}) => {
	return makeExtendSchemaPlugin(() => ({
		typeDefs: gql`
			input CreateAbilityInput {
				userId: String!
				roles: [String!]
			}

			type AbilityResponse {
				success: Boolean!
				ability: JSON
				message: String
			}

			type SecretData {
				id: String!
				content: String!
			}

			extend type Query {
				getSecretData: SecretData
			}

			extend type Mutation {
				createAbility(input: CreateAbilityInput!): AbilityResponse!
			}
		`,
		resolvers: {
			Query: {
				getSecretData: async (
					_query: any,
					args: any,
					context: Context,
					resolveInfo: any
				): Promise<{ id: string; content: string }> => {
					// Check if user has permission to read secret data
					if (!context.ability?.can('read', 'SecretData')) {
						throw new Error('Access denied')
					}

					return {
						id: '123',
						content: 'This is protected content',
					}
				},
			},
			Mutation: {
				createAbility: async (
					_query: any,
					args: { input: CreateAbilityInput },
					context: Context,
					resolveInfo: any
				): Promise<AbilityResponse> => {
					try {
						const { userId, roles } = args.input

						// Create ability for the specified user - await the promise
						const ability = await createAbility({ id: userId, roles })

						// Store ability in context for current request
						context.ability = ability

						return {
							success: true,
							ability: ability.rules,
							message: 'Ability created successfully',
						}
					} catch (error) {
						console.error('Error creating ability:', error)
						return {
							success: false,
							ability: null,
							message: error instanceof Error ? error.message : 'Unknown error occurred',
						}
					}
				},
			},
		},
	}))
}

/**
 * Create a GraphQL Yoga plugin for CASL authorization
 * Note: This is a placeholder for future implementation
 *
 * @param options - CASL middleware configuration options
 * @returns Yoga plugin
 */
export const createYogaPlugin = (options: MiddlewareOptions = {}) => {
	const middleware = createCaslMiddleware(options)

	return {
		onExecute: async ({ args }: any) => {
			// TODO: Implement Yoga plugin
			// This would integrate with GraphQL Yoga's plugin system
			console.log('Yoga plugin not yet implemented')
		},
	}
}

/**
 * Create an Apollo Server plugin for CASL authorization
 * Note: This is a placeholder for future implementation
 *
 * @param options - CASL middleware configuration options
 * @returns Apollo Server plugin
 */
export const createApolloPlugin = (options: MiddlewareOptions = {}) => {
	const middleware = createCaslMiddleware(options)

	return {
		requestDidStart: async () => ({
			willSendResponse: async (requestContext: any) => {
				// TODO: Implement Apollo Server plugin
				// This would integrate with Apollo Server's plugin system
				console.log('Apollo plugin not yet implemented')
			},
		}),
	}
}
