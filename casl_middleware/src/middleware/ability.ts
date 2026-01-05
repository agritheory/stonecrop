import { AbilityBuilder, PureAbility, AbilityClass, FieldMatcher, ConditionsMatcher } from '@casl/ability'
import { Context } from '../types'

// Shared function to detect subject type from objects
export const detectSubjectType = (object: any): string => {
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
}

// Simple field matcher - checks if a field is in the restricted list
const fieldMatcher: FieldMatcher = fields => field => {
	if (!fields || !field) return false
	if (Array.isArray(fields)) {
		return fields.includes(field)
	}
	return fields === field
}

// Simple conditions matcher - basic equality check
const conditionsMatcher: ConditionsMatcher<any> = conditions => object => {
	if (!conditions || !object) return true

	return Object.keys(conditions).every(key => {
		const conditionValue = conditions[key]
		const objectValue = object[key]

		// Simple equality check
		return objectValue === conditionValue
	})
}

export type AppAbility = PureAbility<[string, string], any>
export type AbilityBuilderFunction = (user?: Context['user']) => Promise<AppAbility> | AppAbility

const Ability = PureAbility as AbilityClass<AppAbility>

/**
 * Default ability builder - only provides minimal public access
 */
export const defaultAbilityBuilder = (user?: Context['user']): AppAbility => {
	const { can, build } = new AbilityBuilder<AppAbility>(Ability)

	can('read', 'Query')

	return build({
		detectSubjectType,
		fieldMatcher,
		conditionsMatcher,
	})
}

/**
 * Create ability using a provided builder function
 */
export const createAbility = async (
	user?: Context['user'],
	builderFn: AbilityBuilderFunction = defaultAbilityBuilder
): Promise<AppAbility> => {
	return await builderFn(user)
}

/**
 * Factory function for creating custom ability builders
 */
export const createDatabaseAbilityBuilder = (
	fetchRules: (userId?: string) => Promise<any[]>
): AbilityBuilderFunction => {
	return async (user?: Context['user']) => {
		const { can, cannot, build } = new AbilityBuilder<AppAbility>(Ability)

		if (user?.id) {
			const rules = await fetchRules(user.id)

			rules.forEach(rule => {
				if (rule.inverted) {
					cannot(rule.action, rule.subject, rule.fields, rule.conditions)
				} else {
					can(rule.action, rule.subject, rule.fields, rule.conditions)
				}
			})
		} else {
			can('read', 'Query')
		}

		return build({
			detectSubjectType,
			fieldMatcher,
			conditionsMatcher,
		})
	}
}

/**
 * Create an ability builder from static configuration
 */
export const createConfigBasedAbilityBuilder = (config: {
	roles: Record<
		string,
		Array<{
			action: string | string[]
			subject: string
			fields?: string | string[]
			conditions?: any
			inverted?: boolean
		}>
	>
	defaultRules?: Array<{
		action: string | string[]
		subject: string
		fields?: string | string[]
		conditions?: any
	}>
}): AbilityBuilderFunction => {
	return (user?: Context['user']) => {
		const { can, cannot, build } = new AbilityBuilder<AppAbility>(Ability)

		// Apply default rules
		if (config.defaultRules) {
			config.defaultRules.forEach(rule => {
				can(rule.action, rule.subject, rule.fields, rule.conditions)
			})
		}

		// Apply role-based rules
		if (user?.roles) {
			user.roles.forEach(role => {
				const rules = config.roles[role]
				if (rules) {
					rules.forEach(rule => {
						// Process template variables in conditions
						let processedConditions = rule.conditions
						if (processedConditions && user.id) {
							const condStr = JSON.stringify(processedConditions)
							if (condStr.includes('{{userId}}')) {
								processedConditions = JSON.parse(condStr.replace(/{{userId}}/g, user.id))
							}
						}

						if (rule.inverted) {
							cannot(rule.action, rule.subject, rule.fields, processedConditions)
						} else {
							can(rule.action, rule.subject, rule.fields, processedConditions)
						}
					})
				}
			})
		}

		return build({
			detectSubjectType,
			fieldMatcher,
			conditionsMatcher,
		})
	}
}

export const createAbilityFactory = <T extends PureAbility>(
	builderFn: (user?: Context['user']) => T
): ((user?: Context['user']) => T) => {
	return (user?: Context['user']) => builderFn(user)
}
