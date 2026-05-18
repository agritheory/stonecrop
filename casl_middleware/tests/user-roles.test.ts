import { PureAbility, AbilityBuilder, type AbilityClass } from '@casl/ability'
import type { GraphQLResolveInfo } from 'graphql'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import type { AppAbility } from '../src/middleware/ability'
import { createCaslMiddleware } from '../src/middleware/graphql'
import type { Context } from '../src/types'

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
		detectSubjectType: (object: any) => {
			// Handle CASL's subject() helper objects
			if (object && typeof object === 'object') {
				// CASL uses __caslSubjectType__ property
				if ('__caslSubjectType__' in object) {
					return object.__caslSubjectType__
				}
				// Fallback to other type indicators
				if (object.type) return object.type
				if (object.constructor?.name && object.constructor.name !== 'Object') {
					return object.constructor.name
				}
			}
			return 'Unknown'
		},
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

describe('CASL GraphQL Middleware', { tags: ['unit', 'graphql'] }, () => {
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

			// Don't pass args that would be treated as conditions
			const result = await middleware(mockResolve, {}, {}, mockContext, mockInfo as GraphQLResolveInfo)

			expect(mockResolve).toHaveBeenCalled()
			expect(result).toEqual({ data: 'test' })
		})

		it('should create ability when not in context', async () => {
			const middleware = createCaslMiddleware()
			const contextWithoutAbility = { user: { id: '123', roles: ['user'] } } as any

			// The middleware creates a default ability if none exists
			// Default ability only allows 'read' on 'Query'
			const result = await middleware(mockResolve, {}, {}, contextWithoutAbility, mockInfo as GraphQLResolveInfo)

			// Should work because default ability allows 'read' on 'Query'
			expect(mockResolve).toHaveBeenCalled()
			expect(result).toEqual({ data: 'test' })
			expect(contextWithoutAbility.ability).toBeDefined()
		})

		it('should deny access when ability does not allow operation', async () => {
			const middleware = createCaslMiddleware()

			// Create ability that doesn't allow 'read' on 'Query'
			mockContext.ability = createTestAbility([{ action: 'read', subject: 'Post' }])

			await expect(middleware(mockResolve, {}, {}, mockContext, mockInfo as GraphQLResolveInfo)).rejects.toThrow(
				'Access denied for read on Query'
			)
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

			// Update ability to allow 'view' instead of 'read'
			mockContext.ability = createTestAbility([{ action: 'view', subject: 'Query' }])

			const result = await middleware(mockResolve, {}, {}, mockContext, mockInfo as GraphQLResolveInfo)

			expect(mockResolve).toHaveBeenCalled()
			expect(result).toEqual({ data: 'test' })
		})

		it('should deny when custom action is not allowed', async () => {
			const middleware = createCaslMiddleware({
				actionMap: {
					query: 'view',
				},
			})

			// Ability still has 'read' permission, not 'view'
			await expect(middleware(mockResolve, {}, {}, mockContext, mockInfo as GraphQLResolveInfo)).rejects.toThrow(
				'Access denied for view on Query'
			)
		})
	})

	describe('Subject Conditions', () => {
		it('should handle conditional permissions correctly', async () => {
			const middleware = createCaslMiddleware()

			// Change to User type which has conditional permission
			mockInfo.parentType = { name: 'User' } as any
			mockInfo.path = { typename: 'User', key: 'updateUser' } as any
			mockInfo.operation.operation = 'mutation'

			// Ability allows update on User with id: '123'
			mockContext.ability = createTestAbility([{ action: 'update', subject: 'User', conditions: { id: '123' } }])

			// This should work because we're not passing the conditions through args
			// The middleware should check the general permission
			const result = await middleware(mockResolve, {}, {}, mockContext, mockInfo as GraphQLResolveInfo)

			expect(mockResolve).toHaveBeenCalled()
		})
	})
})
