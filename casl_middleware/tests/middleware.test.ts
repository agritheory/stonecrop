import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GraphQLError, GraphQLResolveInfo } from 'graphql'
import { PureAbility, AbilityBuilder, AbilityClass } from '@casl/ability'
import { createCaslMiddleware } from '../src/middleware/graphql'
import { Context } from '../src/types'
import { AppAbility } from '../src/middleware/ability'

const Ability = PureAbility as AbilityClass<AppAbility>

// Helper to create abilities with proper matchers
const createTestAbility = (rules: any[]): AppAbility => {
	const { can, cannot, build } = new AbilityBuilder<AppAbility>(Ability)

	rules.forEach(rule => {
		if (rule.inverted) {
			if (rule.fields && rule.conditions) {
				cannot(rule.action, rule.subject, rule.fields, rule.conditions)
			} else if (rule.fields) {
				cannot(rule.action, rule.subject, rule.fields)
			} else if (rule.conditions) {
				cannot(rule.action, rule.subject, rule.conditions)
			} else {
				cannot(rule.action, rule.subject)
			}
		} else {
			if (rule.fields && rule.conditions) {
				can(rule.action, rule.subject, rule.fields, rule.conditions)
			} else if (rule.fields) {
				can(rule.action, rule.subject, rule.fields)
			} else if (rule.conditions) {
				can(rule.action, rule.subject, rule.conditions)
			} else {
				can(rule.action, rule.subject)
			}
		}
	})

	return build({
		detectSubjectType: (object: any) => object?.type || object?.constructor?.name || 'Unknown',
		fieldMatcher: fields => field => {
			if (!fields || !field) return false
			return Array.isArray(fields) ? fields.includes(field) : fields === field
		},
		conditionsMatcher: conditions => object => {
			if (!conditions || !object) return true
			return Object.keys(conditions).every(key => object[key] === conditions[key])
		},
	})
}

describe('CASL GraphQL Middleware', () => {
	let mockResolve: any
	let mockContext: Context
	let mockInfo: any

	beforeEach(() => {
		mockResolve = vi.fn().mockResolvedValue({ data: 'test' })

		mockContext = {
			ability: createTestAbility([
				{ action: 'read', subject: 'Query' },
				{ action: 'read', subject: 'User' },
				{ action: 'update', subject: 'User', conditions: { id: '123' } },
			]),
			user: { id: '123', roles: ['user'] },
		}

		mockInfo = {
			fieldName: 'getUser',
			parentType: { name: 'Query' } as any,
			path: { typename: 'Query', key: 'getUser' } as any,
			operation: {
				operation: 'query',
				loc: { source: { body: 'query { getUser { id } }' } },
			} as any,
		}
	})

	describe('Basic Middleware Functionality', () => {
		it('should pass through when ability allows the operation', async () => {
			const middleware = createCaslMiddleware()

			const result = await middleware(mockResolve, {}, {}, mockContext, mockInfo as GraphQLResolveInfo)

			expect(mockResolve).toHaveBeenCalled()
			expect(result).toEqual({ data: 'test' })
		})

		it('should create ability when not in context', async () => {
			const middleware = createCaslMiddleware()
			const contextWithoutAbility = { user: { id: '123', roles: ['user'] } } as any

			// The middleware creates an ability if none exists
			const result = await middleware(mockResolve, {}, {}, contextWithoutAbility, mockInfo as GraphQLResolveInfo)

			expect(mockResolve).toHaveBeenCalled()
			expect(result).toEqual({ data: 'test' })
			expect(contextWithoutAbility.ability).toBeDefined()
		})

		it('should deny access when ability does not allow operation', async () => {
			const middleware = createCaslMiddleware()

			mockContext.ability = createTestAbility([{ action: 'read', subject: 'Post' }])

			await expect(middleware(mockResolve, {}, {}, mockContext, mockInfo as GraphQLResolveInfo)).rejects.toThrow(
				'Access denied for read on Query'
			)
		})
	})

	describe('Subject Mapping', () => {
		it('should map GraphQL types to custom subjects', async () => {
			const middleware = createCaslMiddleware({
				subjectMap: {
					Query: 'query_operations',
					User: 'app_user',
				},
			})

			mockContext.ability = createTestAbility([{ action: 'read', subject: 'query_operations' }])

			const result = await middleware(mockResolve, {}, {}, mockContext, mockInfo as GraphQLResolveInfo)

			expect(mockResolve).toHaveBeenCalled()
			expect(result).toEqual({ data: 'test' })
		})

		it('should use original type name when no mapping exists', async () => {
			const middleware = createCaslMiddleware({
				subjectMap: { User: 'app_user' },
			})

			// Should work with original 'Query' subject since it's not mapped
			const result = await middleware(mockResolve, {}, {}, mockContext, mockInfo as GraphQLResolveInfo)

			expect(mockResolve).toHaveBeenCalled()
		})
	})

	describe('Action Mapping', () => {
		it('should map GraphQL operations to custom actions', async () => {
			const middleware = createCaslMiddleware({
				actionMap: {
					query: 'view',
					mutation: 'modify',
					subscription: 'watch',
				},
			})

			mockContext.ability = createTestAbility([{ action: 'view', subject: 'Query' }])

			const result = await middleware(mockResolve, {}, {}, mockContext, mockInfo as GraphQLResolveInfo)

			expect(mockResolve).toHaveBeenCalled()
		})
	})

	describe('Field-Level Permissions', () => {
		it('should check field-level permissions when configured', async () => {
			const middleware = createCaslMiddleware({
				fieldPermissions: {
					'User.email': [{ action: 'read', subject: 'UserEmail' }],
					'User.password': [{ action: 'read', subject: 'UserPassword' }],
				},
			})

			mockInfo.parentType = { name: 'User' } as any
			mockInfo.fieldName = 'email'
			mockInfo.path = { typename: 'User', key: 'email' } as any

			mockContext.ability = createTestAbility([
				{ action: 'read', subject: 'User' },
				{ action: 'read', subject: 'UserEmail' },
			])

			const result = await middleware(mockResolve, {}, {}, mockContext, mockInfo as GraphQLResolveInfo)

			expect(mockResolve).toHaveBeenCalled()
		})

		it('should deny access to fields without permission', async () => {
			const middleware = createCaslMiddleware({
				fieldPermissions: {
					'User.password': [{ action: 'read', subject: 'UserPassword' }],
				},
			})

			mockInfo.parentType = { name: 'User' } as any
			mockInfo.fieldName = 'password'
			mockInfo.path = { typename: 'User', key: 'password' } as any

			mockContext.ability = createTestAbility([{ action: 'read', subject: 'User' }])

			await expect(middleware(mockResolve, {}, {}, mockContext, mockInfo as GraphQLResolveInfo)).rejects.toThrow(
				'Access denied for field User.password'
			)
		})
	})

	describe('Mutation Field Checking', () => {
		it('should check field permissions for mutations with input', async () => {
			const middleware = createCaslMiddleware()

			mockInfo.parentType = { name: 'Mutation' } as any
			mockInfo.operation.operation = 'mutation'
			mockInfo.operation.loc = {
				source: {
					body: 'mutation { updateUser(input: { name: "test", role: "admin" }) { id } }',
				},
			} as any

			mockContext.ability = createTestAbility([
				{ action: 'update', subject: 'Mutation' },
				{ action: 'update', subject: 'User', fields: ['name'] },
			])

			const args = { input: { name: 'test', role: 'admin' } }

			const result = await middleware(mockResolve, {}, args, mockContext, mockInfo as GraphQLResolveInfo)

			expect(mockResolve).toHaveBeenCalled()
		})
	})
})
