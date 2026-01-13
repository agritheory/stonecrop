import { extendSchema, gql } from 'postgraphile/utils'
import type { ExecutableStep } from 'postgraphile/grafast'
import { GraphileConfig } from 'postgraphile/graphile-build'

import { createAbility } from './ability'

/**
 * PostGraphile plugin for CASL authorization
 * @public
 */
export const pglCaslPlugin: GraphileConfig.Plugin = extendSchema(build => {
	const {
		grafast: { constant, object, sideEffect },
	} = build

	return {
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

		objects: {
			Query: {
				plans: {
					async getSecretData() {
						// TODO: This should be protected by CASL
						// const $ability = context<Context>().get('ability')
						// if (!$ability.can('read', 'SecretData')) {
						// 	throw new Error('Access denied')
						// }

						return object({
							id: constant('123'),
							content: constant('This is protected content'),
						})
					},
				},
			},

			Mutation: {
				plans: {
					async createAbility(_plan: any, fieldArgs: any) {
						const $input = fieldArgs.getRaw().input
						const $userId = $input.userId
						const $roles = $input.roles

						return sideEffect(
							[$userId as ExecutableStep, $roles as ExecutableStep],
							async ([userId, roles]: [string, string[]]) => {
								// Make this async
								try {
									const ability = await createAbility({ id: userId, roles }) // Await here
									return {
										success: true,
										ability: ability.rules,
										message: 'Ability created successfully',
									}
								} catch (error) {
									return {
										success: false,
										ability: null,
										message: error instanceof Error ? error.message : 'Unknown error occurred',
									}
								}
							}
						)
					},
				},
			},
		},
	}
})
