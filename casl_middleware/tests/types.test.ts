import type { PureAbility } from '@casl/ability'
import { describe, it, expectTypeOf } from 'vitest'

import {
	createAbility,
	detectSubjectType,
	defaultAbilityBuilder,
	createDatabaseAbilityBuilder,
	createConfigBasedAbilityBuilder,
	type AppAbility,
	type AbilityBuilderFunction,
} from '../src/middleware/ability'
import { createJWTMiddleware, createJWT, type JWTConfig, type JWTPayload } from '../src/middleware/jwt'
import { createCaslMiddleware } from '../src/middleware/graphql'
import type { Context, User, MiddlewareOptions } from '../src/types'

describe('Type Safety Tests', () => {
	describe('Ability Types', () => {
		it('should have correct AppAbility type structure', () => {
			expectTypeOf<AppAbility>().toExtend<PureAbility>() // AppAbility extends PureAbility base type
		})

		it('should infer correct return type for createAbility', async () => {
			const ability = await createAbility({ id: '1', roles: ['user'] })
			expectTypeOf(ability).toEqualTypeOf<AppAbility>()
		})

		it('should accept AbilityBuilderFunction as parameter', () => {
			const builder: AbilityBuilderFunction = user => defaultAbilityBuilder(user)
			expectTypeOf(builder).parameter(0).toEqualTypeOf<User | undefined>()
			expectTypeOf(builder).returns.resolves.toEqualTypeOf<AppAbility>()
		})

		it('should have correct detectSubjectType signature', () => {
			expectTypeOf(detectSubjectType).parameter(0).toEqualTypeOf<any>()
			expectTypeOf(detectSubjectType).returns.toEqualTypeOf<string>()
		})

		it('should type database ability builder correctly', () => {
			const fetchRules = async (userId: string) => []
			const builder = createDatabaseAbilityBuilder(fetchRules)

			expectTypeOf(builder).parameter(0).toEqualTypeOf<User | undefined>()
			expectTypeOf(builder).returns.resolves.toEqualTypeOf<AppAbility>()
		})

		it('should type config-based ability builder correctly', () => {
			const config = {
				roles: {
					admin: [{ action: 'manage' as const, subject: 'all' as const }],
				},
			}
			const builder = createConfigBasedAbilityBuilder(config)

			expectTypeOf(builder).parameter(0).toEqualTypeOf<User | undefined>()
			// Builder returns AppAbility synchronously
			expectTypeOf(builder).toBeFunction()
		})
	})

	describe('JWT Types', () => {
		it('should have correct JWTConfig type structure', () => {
			const config: JWTConfig = {
				secret: 'test',
				enabled: true,
				optional: false,
			}

			expectTypeOf(config).toExtend<{
				secret?: string
				enabled?: boolean
				optional?: boolean
			}>() // Check config has at least these properties
		})

		it('should have correct JWTPayload structure', () => {
			expectTypeOf<JWTPayload>().toHaveProperty('sub')
			expectTypeOf<JWTPayload>().toHaveProperty('iat')
		})

		it('should infer correct return type for createJWT', () => {
			const user: User = { id: '1', roles: ['user'] }
			const token = createJWT(user, { secret: 'test' })

			expectTypeOf(token).toBeString()
		})

		it('should type middleware correctly', () => {
			const middleware = createJWTMiddleware({ secret: 'test' })

			expectTypeOf(middleware).parameter(0).toEqualTypeOf<Context>()
			expectTypeOf(middleware).parameter(1).toBeFunction()
			expectTypeOf(middleware).returns.toEqualTypeOf<Promise<any>>()
		})
	})

	describe('GraphQL Middleware Types', () => {
		it('should have correct MiddlewareOptions type structure', () => {
			const options: MiddlewareOptions = {
				subjectMap: {},
				actionMap: {},
				fieldPermissions: {},
				debug: false,
			}

			expectTypeOf(options).toExtend<{
				subjectMap?: Record<string, string>
				actionMap?: Record<string, string>
				fieldPermissions?: Record<string, any[]>
				debug?: boolean
			}>() // Check options has at least these properties
		})

		it('should type middleware function correctly', () => {
			const middleware = createCaslMiddleware()

			expectTypeOf(middleware).toBeFunction()
			expectTypeOf(middleware).parameter(0).toBeFunction() // resolve
			expectTypeOf(middleware).parameter(1).toBeAny() // root
			expectTypeOf(middleware).parameter(2).toBeAny() // args
			expectTypeOf(middleware).parameter(3).toEqualTypeOf<Context>() // context
			expectTypeOf(middleware).returns.toEqualTypeOf<Promise<any>>()
		})
	})

	describe('Context Types', () => {
		it('should have correct Context type structure', () => {
			expectTypeOf<Context>().toHaveProperty('ability')
			expectTypeOf<Context>().toHaveProperty('user')
		})

		it('should have correct User type structure', () => {
			expectTypeOf<User>().toHaveProperty('id')
			expectTypeOf<User>().toHaveProperty('roles')

			const user: User = { id: '1', roles: ['admin'] }
			expectTypeOf(user.id).toBeString()
			// roles is optional, so check the array type when present
			if (user.roles) {
				expectTypeOf(user.roles).toEqualTypeOf<string[]>()
			}
		})

		it('should allow optional properties on User', () => {
			const userWithOptionals: User = {
				id: '1',
				roles: ['user'],
				email: 'test@example.com',
			}

			expectTypeOf(userWithOptionals).toExtend<User>() // Check that object is assignable to User type
		})
	})

	describe('Ability Rule Types', () => {
		it('should correctly type ability actions', () => {
			const ability = defaultAbilityBuilder({ id: '1', roles: ['user'] })

			// Type checking that these calls are valid
			expectTypeOf(ability.can).parameter(0).toBeString()
			expectTypeOf(ability.can).parameter(1).toEqualTypeOf<string | any>()
		})

		it('should support subject type checking', () => {
			const ability = defaultAbilityBuilder({ id: '1', roles: ['user'] })

			// Verify can() method signature accepts string action and optional subject
			expectTypeOf(ability.can).parameter(0).toBeString()
			expectTypeOf(ability.can).toBeCallableWith('read', 'Post')
			expectTypeOf(ability.can).toBeCallableWith('read', undefined)
		})
	})

	describe('Builder Function Types', () => {
		it('should accept sync and async builder functions', () => {
			const syncBuilder: AbilityBuilderFunction = () => defaultAbilityBuilder()
			const asyncBuilder: AbilityBuilderFunction = async () => defaultAbilityBuilder()

			// Both should be valid builder functions
			expectTypeOf(syncBuilder).toBeFunction()
			expectTypeOf(asyncBuilder).toBeFunction()
			expectTypeOf(asyncBuilder).returns.resolves.toEqualTypeOf<AppAbility>()
		})

		it('should enforce correct parameter types for builders', () => {
			const builder: AbilityBuilderFunction = user => {
				expectTypeOf(user).toEqualTypeOf<User | undefined>()
				return defaultAbilityBuilder(user)
			}

			expectTypeOf(builder).toBeCallableWith(undefined)
			expectTypeOf(builder).toBeCallableWith({ id: '1', roles: [] })
		})
	})
})
