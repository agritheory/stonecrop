import { AbilityBuilder, PureAbility, subject, type AbilityClass } from '@casl/ability'
import { describe, it, expect, vi } from 'vitest'

import {
	createAbility,
	detectSubjectType,
	defaultAbilityBuilder,
	createDatabaseAbilityBuilder,
	createConfigBasedAbilityBuilder,
	createAbilityFactory,
	type AppAbility,
} from '../src/middleware/ability'

const Ability = PureAbility as AbilityClass<AppAbility>

describe('Ability Creation', { tags: ['unit', 'graphql'] }, () => {
	describe('createAbility', () => {
		// Create a test builder with proper matchers - using the same detectSubjectType as production
		const testBuilder = (user?: any) => {
			const { can, cannot, build } = new AbilityBuilder<AppAbility>(Ability)

			if (!user) {
				can('read', 'Query')
				can('read', 'PublicType')
			} else {
				can('read', 'Query')
				can('read', 'Mutation')

				if (user.roles?.includes('admin')) {
					can('manage', 'all')
				} else {
					can('read', 'User', { id: user.id })
					can('update', 'User', { id: user.id })
					cannot('update', 'User', 'role')
					cannot('update', 'User', 'permissions')
				}

				if (user.roles?.includes('moderator')) {
					can('update', 'Post')
					can('delete', 'Comment')
				}

				if (user.roles?.includes('editor')) {
					can('create', 'Post')
					can('update', 'Post')
					can('delete', 'Post')
				}
			}

			return build({
				detectSubjectType,
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

		it('should create a basic ability for unauthenticated users', async () => {
			const ability = await createAbility(undefined, testBuilder)

			expect(ability).toBeDefined()
			expect(ability.can('read', 'Query')).toBe(true)
			expect(ability.can('read', 'PublicType')).toBe(true)
			expect(ability.can('read', 'Mutation')).toBe(false)
			expect(ability.can('manage', 'all')).toBe(false)
		})

		it('should create abilities for authenticated users without roles', async () => {
			const user = { id: '123', roles: [] }
			const ability = await createAbility(user, testBuilder)

			expect(ability.can('read', 'Query')).toBe(true)
			expect(ability.can('read', 'Mutation')).toBe(true)
			expect(ability.can('read', subject('User', { id: '123' }))).toBe(true)
			expect(ability.can('update', subject('User', { id: '123' }))).toBe(true)
			expect(ability.can('update', subject('User', { id: '456' }))).toBe(false)

			// Check field-level restrictions
			expect(ability.can('update', 'User', 'role')).toBe(false)
			expect(ability.can('update', 'User', 'permissions')).toBe(false)
		})

		it('should create admin abilities for users with admin role', async () => {
			const user = { id: '123', roles: ['admin'] }
			const ability = await createAbility(user, testBuilder)

			expect(ability.can('manage', 'all')).toBe(true)
			expect(ability.can('read', 'Query')).toBe(true)
			expect(ability.can('update', subject('User', { id: '456' }))).toBe(true)
			expect(ability.can('delete', 'User')).toBe(true)
		})

		it('should handle mixed roles correctly', async () => {
			const user = { id: '123', roles: ['user', 'moderator'] }
			const ability = await createAbility(user, testBuilder)

			expect(ability.can('read', 'Query')).toBe(true)
			expect(ability.can('read', 'Mutation')).toBe(true)
			expect(ability.can('manage', 'all')).toBe(false)
			expect(ability.can('read', subject('User', { id: '123' }))).toBe(true)
			expect(ability.can('update', subject('User', { id: '123' }))).toBe(true)

			// Check field restrictions
			expect(ability.can('update', 'User', 'role')).toBe(false)
			expect(ability.can('update', 'User', 'permissions')).toBe(false)

			// Check moderator permissions
			expect(ability.can('update', 'Post')).toBe(true)
			expect(ability.can('delete', 'Comment')).toBe(true)
		})
	})

	describe('Custom Ability Builder', () => {
		it('should allow custom ability definitions', () => {
			const customCreateAbility = (user?: { id: string; permissions?: string[] }) => {
				const { can, build } = new AbilityBuilder<AppAbility>(Ability)

				if (user?.permissions?.includes('read:posts')) {
					can('read', 'Post')
				}

				if (user?.permissions?.includes('write:posts')) {
					can(['create', 'update'], 'Post', { authorId: user.id })
				}

				if (user?.permissions?.includes('delete:posts')) {
					can('delete', 'Post', { authorId: user.id })
				}

				return build({
					detectSubjectType,
					conditionsMatcher: conditions => object => {
						if (!conditions || !object) return true
						return Object.keys(conditions).every(key => object[key] === conditions[key])
					},
				})
			}

			const user = { id: '123', permissions: ['read:posts', 'write:posts'] }
			const ability = customCreateAbility(user)

			expect(ability.can('read', 'Post')).toBe(true)
			expect(ability.can('create', subject('Post', { authorId: '123' }))).toBe(true)
			expect(ability.can('update', subject('Post', { authorId: '123' }))).toBe(true)
			expect(ability.can('delete', subject('Post', { authorId: '123' }))).toBe(false)
			expect(ability.can('update', subject('Post', { authorId: '456' }))).toBe(false)
		})
	})

	describe('detectSubjectType', () => {
		it('should detect __caslSubjectType__ property', () => {
			const obj = { __caslSubjectType__: 'CustomType', data: 'test' }
			expect(detectSubjectType(obj)).toBe('CustomType')
		})

		it('should fallback to type property', () => {
			const obj = { type: 'Post', title: 'Test' }
			expect(detectSubjectType(obj)).toBe('Post')
		})

		it('should fallback to constructor name', () => {
			class User {
				name: string
				constructor(name: string) {
					this.name = name
				}
			}
			const user = new User('John')
			expect(detectSubjectType(user)).toBe('User')
		})

		it('should return Unknown for plain objects', () => {
			const obj = { data: 'test' }
			expect(detectSubjectType(obj)).toBe('Unknown')
		})

		it('should return Unknown for null or undefined', () => {
			expect(detectSubjectType(null)).toBe('Unknown')
			expect(detectSubjectType(undefined)).toBe('Unknown')
		})

		it('should return Unknown for primitives', () => {
			expect(detectSubjectType('string')).toBe('Unknown')
			expect(detectSubjectType(123)).toBe('Unknown')
			expect(detectSubjectType(true)).toBe('Unknown')
		})
	})

	describe('defaultAbilityBuilder', () => {
		it('should create ability with only Query read access for no user', () => {
			const ability = defaultAbilityBuilder()
			expect(ability.can('read', 'Query')).toBe(true)
			expect(ability.can('read', 'Mutation')).toBe(false)
			expect(ability.can('manage', 'all')).toBe(false)
		})

		it('should create ability with only Query read access for user without roles', () => {
			const user = { id: '123', roles: [] }
			const ability = defaultAbilityBuilder(user)
			expect(ability.can('read', 'Query')).toBe(true)
			expect(ability.can('read', 'Mutation')).toBe(false)
		})
	})

	describe('createDatabaseAbilityBuilder', () => {
		it('should build ability from database rules', async () => {
			const mockFetchRules = vi.fn().mockResolvedValue([
				{ action: 'read', subject: 'Post', inverted: false },
				{ action: 'create', subject: 'Post', inverted: false },
				{ action: 'update', subject: 'Post', fields: ['title'], inverted: false },
				{ action: 'delete', subject: 'Post', inverted: true },
			])

			const builder = createDatabaseAbilityBuilder(mockFetchRules)
			const user = { id: '123', roles: ['user'] }
			const ability = await builder(user)

			expect(mockFetchRules).toHaveBeenCalledWith('123')
			expect(ability.can('read', 'Post')).toBe(true)
			expect(ability.can('create', 'Post')).toBe(true)
			expect(ability.can('update', 'Post', 'title')).toBe(true)
			expect(ability.can('delete', 'Post')).toBe(false)
		})

		it('should handle rules with conditions', async () => {
			const mockFetchRules = vi.fn().mockResolvedValue([
				{
					action: 'update',
					subject: 'Post',
					conditions: { authorId: '123' },
					inverted: false,
				},
			])

			const builder = createDatabaseAbilityBuilder(mockFetchRules)
			const user = { id: '123', roles: ['user'] }
			const ability = await builder(user)

			expect(ability.can('update', subject('Post', { authorId: '123' }))).toBe(true)
			expect(ability.can('update', subject('Post', { authorId: '456' }))).toBe(false)
		})

		it('should only allow Query read for user without id', async () => {
			const mockFetchRules = vi.fn()
			const builder = createDatabaseAbilityBuilder(mockFetchRules)
			const ability = await builder()

			expect(mockFetchRules).not.toHaveBeenCalled()
			expect(ability.can('read', 'Query')).toBe(true)
			expect(ability.can('read', 'Post')).toBe(false)
		})

		it('should handle empty rules array', async () => {
			const mockFetchRules = vi.fn().mockResolvedValue([])
			const builder = createDatabaseAbilityBuilder(mockFetchRules)
			const user = { id: '123', roles: [] }
			const ability = await builder(user)

			expect(mockFetchRules).toHaveBeenCalledWith('123')
			expect(ability.can('read', 'Query')).toBe(false)
		})
	})

	describe('createConfigBasedAbilityBuilder', () => {
		it('should build ability from role-based config', async () => {
			const config = {
				roles: {
					editor: [
						{ action: 'read', subject: 'Post' },
						{ action: 'create', subject: 'Post' },
						{ action: 'update', subject: 'Post' },
					],
					viewer: [{ action: 'read', subject: 'Post' }],
				},
			}

			const builder = createConfigBasedAbilityBuilder(config)
			const user = { id: '123', roles: ['editor'] }
			const ability = await builder(user)

			expect(ability.can('read', 'Post')).toBe(true)
			expect(ability.can('create', 'Post')).toBe(true)
			expect(ability.can('update', 'Post')).toBe(true)
			expect(ability.can('delete', 'Post')).toBe(false)
		})

		it('should apply default rules', async () => {
			const config = {
				roles: {},
				defaultRules: [
					{ action: 'read', subject: 'Query' },
					{ action: 'read', subject: 'PublicData' },
				],
			}

			const builder = createConfigBasedAbilityBuilder(config)
			const ability = await builder()

			expect(ability.can('read', 'Query')).toBe(true)
			expect(ability.can('read', 'PublicData')).toBe(true)
		})

		it('should combine multiple roles', async () => {
			const config = {
				roles: {
					editor: [
						{ action: 'create', subject: 'Post' },
						{ action: 'update', subject: 'Post' },
					],
					moderator: [
						{ action: 'delete', subject: 'Comment' },
						{ action: 'update', subject: 'Comment' },
					],
				},
			}

			const builder = createConfigBasedAbilityBuilder(config)
			const user = { id: '123', roles: ['editor', 'moderator'] }
			const ability = await builder(user)

			expect(ability.can('create', 'Post')).toBe(true)
			expect(ability.can('update', 'Post')).toBe(true)
			expect(ability.can('delete', 'Comment')).toBe(true)
			expect(ability.can('update', 'Comment')).toBe(true)
		})

		it('should handle field-level permissions', async () => {
			const config = {
				roles: {
					user: [
						{ action: 'update', subject: 'User', fields: ['name', 'email'] },
						{ action: 'update', subject: 'User', fields: 'role', inverted: true },
					],
				},
			}

			const builder = createConfigBasedAbilityBuilder(config)
			const user = { id: '123', roles: ['user'] }
			const ability = await builder(user)

			expect(ability.can('update', 'User', 'name')).toBe(true)
			expect(ability.can('update', 'User', 'email')).toBe(true)
			expect(ability.can('update', 'User', 'role')).toBe(false)
		})

		it('should process userId template variables in conditions', async () => {
			const config = {
				roles: {
					user: [
						{
							action: 'update',
							subject: 'Post',
							conditions: { authorId: '{{userId}}' },
						},
					],
				},
			}

			const builder = createConfigBasedAbilityBuilder(config)
			const user = { id: '123', roles: ['user'] }
			const ability = await builder(user)

			expect(ability.can('update', subject('Post', { authorId: '123' }))).toBe(true)
			expect(ability.can('update', subject('Post', { authorId: '456' }))).toBe(false)
		})

		it('should handle user without roles', async () => {
			const config = {
				roles: {
					user: [{ action: 'read', subject: 'Post' }],
				},
				defaultRules: [{ action: 'read', subject: 'Query' }],
			}

			const builder = createConfigBasedAbilityBuilder(config)
			const ability = await builder({ id: '123', roles: [] })

			expect(ability.can('read', 'Query')).toBe(true)
			expect(ability.can('read', 'Post')).toBe(false)
		})

		it('should handle undefined user', async () => {
			const config = {
				roles: {
					user: [{ action: 'read', subject: 'Post' }],
				},
				defaultRules: [{ action: 'read', subject: 'Query' }],
			}

			const builder = createConfigBasedAbilityBuilder(config)
			const ability = await builder()

			expect(ability.can('read', 'Query')).toBe(true)
			expect(ability.can('read', 'Post')).toBe(false)
		})

		it('should handle role not defined in config', async () => {
			const config = {
				roles: {
					admin: [{ action: 'manage', subject: 'all' }],
				},
			}

			const builder = createConfigBasedAbilityBuilder(config)
			const user = { id: '123', roles: ['unknownRole'] }
			const ability = await builder(user)

			expect(ability.can('manage', 'all')).toBe(false)
		})

		it('should handle conditions without userId in template', async () => {
			const config = {
				roles: {
					user: [
						{
							action: 'update',
							subject: 'Post',
							conditions: { status: 'draft' },
						},
					],
				},
			}

			const builder = createConfigBasedAbilityBuilder(config)
			const user = { id: '123', roles: ['user'] }
			const ability = await builder(user)

			expect(ability.can('update', subject('Post', { status: 'draft' }))).toBe(true)
			expect(ability.can('update', subject('Post', { status: 'published' }))).toBe(false)
		})
	})

	describe('createAbilityFactory', () => {
		it('should create a factory function', () => {
			const builderFn = (user?: any) => {
				const { can, build } = new AbilityBuilder<AppAbility>(Ability)
				can('read', 'Query')
				if (user?.roles?.includes('admin')) {
					can('manage', 'all')
				}
				return build({ detectSubjectType })
			}

			const factory = createAbilityFactory(builderFn)
			expect(typeof factory).toBe('function')

			const ability1 = factory()
			expect(ability1.can('read', 'Query')).toBe(true)
			expect(ability1.can('manage', 'all')).toBe(false)

			const ability2 = factory({ id: '123', roles: ['admin'] })
			expect(ability2.can('manage', 'all')).toBe(true)
		})
	})

	describe('createAbility with different builders', () => {
		it('should work with database builder', async () => {
			const mockFetchRules = vi.fn().mockResolvedValue([{ action: 'read', subject: 'Post', inverted: false }])

			const builder = createDatabaseAbilityBuilder(mockFetchRules)
			const user = { id: '123', roles: ['user'] }
			const ability = await createAbility(user, builder)

			expect(ability.can('read', 'Post')).toBe(true)
		})

		it('should work with config-based builder', async () => {
			const config = {
				roles: {
					admin: [{ action: 'manage', subject: 'all' }],
				},
			}

			const builder = createConfigBasedAbilityBuilder(config)
			const user = { id: '123', roles: ['admin'] }
			const ability = await createAbility(user, builder)

			expect(ability.can('manage', 'all')).toBe(true)
		})
	})
})
