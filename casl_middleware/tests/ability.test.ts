import { AbilityBuilder, PureAbility, subject, AbilityClass } from '@casl/ability'
import { describe, it, expect } from 'vitest'

import { createAbility, detectSubjectType, AppAbility } from '../src/middleware/ability'

const Ability = PureAbility as AbilityClass<AppAbility>

describe('Ability Creation', () => {
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
})
