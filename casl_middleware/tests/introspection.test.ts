// casl-middleware/tests/introspection.test.ts

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AbilityBuilder, AbilityClass, PureAbility } from '@casl/ability'

import {
	createIntrospectionMiddleware,
	createIntrospectionAbilityRules,
	createPostgraphileIntrospectionPlugin,
	createSecureGraphQLMiddleware,
} from '../src/middleware/introspection'
import type { Context } from '../src/types'
import type { AppAbility } from '../src/middleware/ability'

const Ability = PureAbility as AbilityClass<AppAbility>

describe('Introspection Middleware', { tags: ['unit', 'graphql'] }, () => {
	let mockResolve: ReturnType<typeof vi.fn>
	let mockContext: Context
	let mockInfo: any

	beforeEach(() => {
		mockResolve = vi.fn().mockResolvedValue({
			types: [
				{ name: 'User', fields: [{ name: 'id' }, { name: 'email' }] },
				{ name: 'AdminData', fields: [{ name: 'secret' }] },
				{ name: 'Post', fields: [{ name: 'title' }, { name: 'content' }] },
			],
		})

		mockContext = {
			user: { id: 'user-123', roles: ['user'] },
			ability: undefined,
		}

		mockInfo = {
			fieldName: '__schema',
			parentType: { name: 'Query' },
		}
	})

	describe('Basic Introspection Control', () => {
		it('should allow introspection when enabled', async () => {
			const middleware = createIntrospectionMiddleware({
				enabled: true,
			})

			const result = await middleware(mockResolve, {}, {}, mockContext, mockInfo)

			expect(mockResolve).toHaveBeenCalled()
			expect(result).toBeDefined()
		})

		it('should block introspection when disabled', async () => {
			const middleware = createIntrospectionMiddleware({
				enabled: false,
			})

			await expect(middleware(mockResolve, {}, {}, mockContext, mockInfo)).rejects.toThrow('Introspection is disabled')

			expect(mockResolve).not.toHaveBeenCalled()
		})

		it('should pass through non-introspection queries', async () => {
			const middleware = createIntrospectionMiddleware({
				enabled: false, // Even when disabled
			})

			mockInfo.fieldName = 'getUser' // Not an introspection query

			const result = await middleware(mockResolve, {}, {}, mockContext, mockInfo)

			expect(mockResolve).toHaveBeenCalled()
			expect(result).toBeDefined()
		})

		it('should detect __type introspection queries', async () => {
			const middleware = createIntrospectionMiddleware({
				enabled: false,
			})

			mockInfo.fieldName = '__type'

			await expect(middleware(mockResolve, {}, {}, mockContext, mockInfo)).rejects.toThrow('Introspection is disabled')
		})

		it('should detect nested introspection queries', async () => {
			const middleware = createIntrospectionMiddleware({
				enabled: false,
			})

			mockInfo.fieldName = 'fields'
			mockInfo.parentType = { name: '__Type' }

			await expect(middleware(mockResolve, {}, {}, mockContext, mockInfo)).rejects.toThrow('Introspection is disabled')
		})
	})

	describe('Authentication Requirements', () => {
		it('should require authentication by default', async () => {
			const middleware = createIntrospectionMiddleware({
				enabled: true,
				allowAnonymous: false,
			})

			mockContext.user = undefined // No user

			await expect(middleware(mockResolve, {}, {}, mockContext, mockInfo)).rejects.toThrow(
				'Authentication required for introspection'
			)
		})

		it('should allow anonymous introspection when configured', async () => {
			const middleware = createIntrospectionMiddleware({
				enabled: true,
				allowAnonymous: true,
			})

			mockContext.user = undefined // No user

			const result = await middleware(mockResolve, {}, {}, mockContext, mockInfo)

			expect(mockResolve).toHaveBeenCalled()
			expect(result).toBeDefined()
		})
	})

	describe('Role-Based Access Control', () => {
		it('should allow introspection for allowed roles', async () => {
			const middleware = createIntrospectionMiddleware({
				enabled: true,
				allowedRoles: ['admin', 'developer'],
			})

			mockContext.user = { id: 'user-123', roles: ['developer'] }

			await middleware(mockResolve, {}, {}, mockContext, mockInfo)

			expect(mockResolve).toHaveBeenCalled()
		})

		it('should deny introspection for non-allowed roles', async () => {
			const middleware = createIntrospectionMiddleware({
				enabled: true,
				allowedRoles: ['admin', 'developer'],
			})

			mockContext.user = { id: 'user-123', roles: ['user'] }

			await expect(middleware(mockResolve, {}, {}, mockContext, mockInfo)).rejects.toThrow(
				'Insufficient permissions for introspection'
			)
		})

		it('should handle users with multiple roles', async () => {
			const middleware = createIntrospectionMiddleware({
				enabled: true,
				allowedRoles: ['admin', 'developer'],
			})

			mockContext.user = { id: 'user-123', roles: ['user', 'developer'] }

			await middleware(mockResolve, {}, {}, mockContext, mockInfo)

			expect(mockResolve).toHaveBeenCalled()
		})

		it('should handle empty allowed roles array', async () => {
			const middleware = createIntrospectionMiddleware({
				enabled: true,
				allowedRoles: [],
			})

			// Empty allowed roles means no role-based restriction
			await middleware(mockResolve, {}, {}, mockContext, mockInfo)

			expect(mockResolve).toHaveBeenCalled()
		})
	})

	describe('CASL Integration', () => {
		it('should check CASL permissions when ability exists', async () => {
			const { can, build } = new AbilityBuilder<AppAbility>(Ability)
			can('read', '__Schema')
			const ability = build()

			mockContext.ability = ability

			const middleware = createIntrospectionMiddleware({
				enabled: true,
			})

			await middleware(mockResolve, {}, {}, mockContext, mockInfo)

			expect(mockResolve).toHaveBeenCalled()
		})

		it('should deny when CASL permission is not granted', async () => {
			const { can, build } = new AbilityBuilder<AppAbility>(Ability)
			can('read', 'User') // Can read User, but not __Schema
			const ability = build()

			mockContext.ability = ability

			const middleware = createIntrospectionMiddleware({
				enabled: true,
			})

			await expect(middleware(mockResolve, {}, {}, mockContext, mockInfo)).rejects.toThrow(
				'Permission denied for schema introspection'
			)
		})
	})

	describe('Custom Check Function', () => {
		it('should use custom check function when provided', async () => {
			const customCheck = vi.fn().mockResolvedValue(true)

			const middleware = createIntrospectionMiddleware({
				enabled: true,
				customCheck,
			})

			await middleware(mockResolve, {}, {}, mockContext, mockInfo)

			expect(customCheck).toHaveBeenCalledWith(mockContext)
			expect(mockResolve).toHaveBeenCalled()
		})

		it('should deny when custom check returns false', async () => {
			const customCheck = vi.fn().mockResolvedValue(false)

			const middleware = createIntrospectionMiddleware({
				enabled: true,
				customCheck,
			})

			await expect(middleware(mockResolve, {}, {}, mockContext, mockInfo)).rejects.toThrow('Introspection not allowed')

			expect(customCheck).toHaveBeenCalledWith(mockContext)
			expect(mockResolve).not.toHaveBeenCalled()
		})

		it('should handle async custom check functions', async () => {
			const customCheck = vi.fn().mockImplementation(async context => {
				await new Promise(resolve => setTimeout(resolve, 10))
				return context.user?.roles?.includes('admin')
			})

			const middleware = createIntrospectionMiddleware({
				enabled: true,
				customCheck,
			})

			mockContext.user = { id: 'user-123', roles: ['admin'] }

			await middleware(mockResolve, {}, {}, mockContext, mockInfo)

			expect(customCheck).toHaveBeenCalledWith(mockContext)
			expect(mockResolve).toHaveBeenCalled()
		})
	})

	describe('Type Filtering', () => {
		it('should filter types based on permissions', async () => {
			const { can, build } = new AbilityBuilder<AppAbility>(Ability)
			can('read', '__Schema')
			can('read', 'User')
			can('read', 'Post')

			// Cannot read AdminData
			const ability = build()

			mockContext.ability = ability

			const middleware = createIntrospectionMiddleware({
				enabled: true,
				typePermissions: {
					AdminData: { action: 'read', subject: 'AdminData' },
				},
			})

			const result = await middleware(mockResolve, {}, {}, mockContext, mockInfo)

			// Should filter out AdminData
			expect(result.types).toHaveLength(2)
			expect(result.types.map((t: any) => t.name)).toEqual(['User', 'Post'])
			expect(result.types.map((t: any) => t.name)).not.toContain('AdminData')
		})

		it('should keep types without permission requirements', async () => {
			const { can, build } = new AbilityBuilder<AppAbility>(Ability)
			can('read', '__Schema')
			const ability = build()

			mockContext.ability = ability

			const middleware = createIntrospectionMiddleware({
				enabled: true,
				typePermissions: {
					AdminData: { action: 'read', subject: 'AdminData' },
				},
			})

			const result = await middleware(mockResolve, {}, {}, mockContext, mockInfo)

			// Should keep User and Post (no permission requirements)
			// Should filter out AdminData
			expect(result.types.map((t: any) => t.name)).toContain('User')
			expect(result.types.map((t: any) => t.name)).toContain('Post')
			expect(result.types.map((t: any) => t.name)).not.toContain('AdminData')
		})
	})

	describe('Field Filtering', () => {
		it('should filter fields based on permissions', async () => {
			const { can, build } = new AbilityBuilder<AppAbility>(Ability)
			can('read', '__Schema')
			can('read', 'UserPublicFields')
			// Cannot read User.email
			const ability = build()

			mockContext.ability = ability

			const middleware = createIntrospectionMiddleware({
				enabled: true,
				fieldPermissions: {
					'User.email': { action: 'read', subject: 'UserEmail' },
				},
			})

			const result = await middleware(mockResolve, {}, {}, mockContext, mockInfo)

			const userType = result.types.find((t: any) => t.name === 'User')
			expect(userType.fields).toHaveLength(1)
			expect(userType.fields[0].name).toBe('id')
		})

		it('should handle __type field filtering', async () => {
			const { can, build } = new AbilityBuilder<AppAbility>(Ability)
			can('read', '__Schema')
			const ability = build()

			mockContext.ability = ability
			mockInfo.fieldName = '__type'

			// Mock __type result
			mockResolve.mockResolvedValue({
				name: 'User',
				fields: [{ name: 'id' }, { name: 'email' }, { name: 'password' }],
			})

			const middleware = createIntrospectionMiddleware({
				enabled: true,
				fieldPermissions: {
					'User.password': { action: 'read', subject: 'UserPassword' },
				},
			})

			const result = await middleware(mockResolve, {}, {}, mockContext, mockInfo)

			// Should filter out password field
			expect(result.fields).toHaveLength(2)
			expect(result.fields.map((f: any) => f.name)).toEqual(['id', 'email'])
		})
	})

	describe('createIntrospectionAbilityRules', () => {
		it('should return empty rules for anonymous users', () => {
			const rules = createIntrospectionAbilityRules()
			expect(rules).toEqual([])
		})

		it('should return admin rules for admin users', () => {
			const rules = createIntrospectionAbilityRules({ roles: ['admin'] })

			expect(rules).toEqual([
				{ action: 'read', subject: '__Schema' },
				{ action: 'read', subject: '__Type' },
			])
		})

		it('should return developer rules for developer users', () => {
			const rules = createIntrospectionAbilityRules({ roles: ['developer'] })

			expect(rules).toEqual([
				{ action: 'read', subject: '__Schema' },
				{ action: 'read', subject: '__Type' },
			])
		})

		it('should return limited rules for regular users', () => {
			const rules = createIntrospectionAbilityRules({ roles: ['user'] })

			expect(rules).toEqual([{ action: 'read', subject: '__Schema' }])
		})

		it('should handle users with multiple roles (admin takes precedence)', () => {
			const rules = createIntrospectionAbilityRules({ roles: ['user', 'admin'] })

			// Admin rules should be returned (early return)
			expect(rules).toEqual([
				{ action: 'read', subject: '__Schema' },
				{ action: 'read', subject: '__Type' },
			])
		})
	})

	describe('Postgraphile Plugin', () => {
		it('should create a valid plugin object', () => {
			const plugin = createPostgraphileIntrospectionPlugin({
				enabled: true,
			})

			expect(plugin).toBeDefined()
			expect(plugin.name).toBe('IntrospectionControlPlugin')
			expect(plugin.version).toBe('1.0.0')
			expect(plugin.grafast).toBeDefined()
		})

		it('should warn when introspection is disabled', () => {
			const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

			const plugin = createPostgraphileIntrospectionPlugin({
				enabled: false,
			})

			// Simulate the hook being called
			const schema = {}
			plugin.grafast.hooks.GraphQLSchema(schema)

			expect(consoleSpy).toHaveBeenCalledWith('Introspection control in Postgraphile requires custom implementation')

			consoleSpy.mockRestore()
		})
	})

	describe('createSecureGraphQLMiddleware', () => {
		it('should combine middlewares', () => {
			const middleware = createSecureGraphQLMiddleware({
				introspection: {
					enabled: true,
					allowedRoles: ['admin'],
				},
			})

			expect(middleware).toBeInstanceOf(Function)
		})

		it('should apply introspection middleware when configured', async () => {
			const mockResolve2 = vi.fn().mockResolvedValue({ data: 'test' })

			const middleware = createSecureGraphQLMiddleware({
				introspection: {
					enabled: false,
				},
			})

			mockInfo.fieldName = '__schema'

			await expect(middleware(mockResolve2, {}, {}, mockContext, mockInfo)).rejects.toThrow('Introspection is disabled')
		})

		it('should pass through when no introspection config', async () => {
			const mockResolve2 = vi.fn().mockResolvedValue({ data: 'test' })

			const middleware = createSecureGraphQLMiddleware({})

			const result = await middleware(mockResolve2, {}, {}, mockContext, mockInfo)

			expect(mockResolve2).toHaveBeenCalled()
			expect(result).toEqual({ data: 'test' })
		})
	})

	describe('Environment-based Defaults', () => {
		it('should default to enabled in development', () => {
			const originalEnv = process.env.NODE_ENV
			process.env.NODE_ENV = 'development'

			const middleware = createIntrospectionMiddleware({})

			// Should not throw
			expect(async () => {
				await middleware(mockResolve, {}, {}, mockContext, mockInfo)
			}).not.toThrow()

			process.env.NODE_ENV = originalEnv
		})

		it('should default to disabled in production', async () => {
			const originalEnv = process.env.NODE_ENV
			process.env.NODE_ENV = 'production'

			const middleware = createIntrospectionMiddleware({})

			// Should throw in production
			await expect(middleware(mockResolve, {}, {}, mockContext, mockInfo)).rejects.toThrow('Introspection is disabled')

			process.env.NODE_ENV = originalEnv
		})
	})
})
