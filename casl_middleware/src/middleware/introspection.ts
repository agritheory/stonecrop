import { GraphQLError } from 'graphql'
import type { Context, MiddlewareOptions } from '../types'

export interface IntrospectionConfig {
	/**
	 * Whether to allow introspection queries at all
	 * @default true in development, false in production
	 */
	enabled?: boolean

	/**
	 * Roles that are allowed to introspect the schema
	 * If undefined, all authenticated users can introspect
	 */
	allowedRoles?: string[]

	/**
	 * Allow unauthenticated introspection
	 * @default false
	 */
	allowAnonymous?: boolean

	/**
	 * Custom function to determine if introspection is allowed
	 */
	customCheck?: (context: Context) => boolean | Promise<boolean>

	/**
	 * Types to hide from introspection based on user permissions
	 * Maps type names to required permissions
	 */
	typePermissions?: Record<string, { action: string; subject: string }>

	/**
	 * Fields to hide from introspection based on user permissions
	 * Maps "Type.field" to required permissions
	 */
	fieldPermissions?: Record<string, { action: string; subject: string }>
}

/**
 * Middleware to restrict GraphQL introspection based on user permissions
 */
export const createIntrospectionMiddleware = (config: IntrospectionConfig = {}) => {
	const {
		enabled = process.env.NODE_ENV !== 'production',
		allowedRoles,
		allowAnonymous = false,
		customCheck,
		typePermissions = {},
		fieldPermissions = {},
	} = config

	return async (resolve: any, root: any, args: any, context: Context, info: any) => {
		// Check if this is an introspection query
		const isIntrospection =
			info.fieldName === '__schema' ||
			info.fieldName === '__type' ||
			info.parentType?.name === '__Schema' ||
			info.parentType?.name === '__Type'

		if (!isIntrospection) {
			// Not an introspection query, continue normally
			return resolve(root, args, context, info)
		}

		// Check if introspection is enabled
		if (!enabled) {
			throw new GraphQLError('Introspection is disabled')
		}

		// Custom check function
		if (customCheck) {
			const allowed = await customCheck(context)
			if (!allowed) {
				throw new GraphQLError('Introspection not allowed')
			}
		}

		// Check authentication
		if (!context.user && !allowAnonymous) {
			throw new GraphQLError('Authentication required for introspection')
		}

		// Check role-based access
		if (allowedRoles && allowedRoles.length > 0) {
			const userRoles = context.user?.roles || []
			const hasAllowedRole = allowedRoles.some(role => userRoles.includes(role))

			if (!hasAllowedRole) {
				throw new GraphQLError('Insufficient permissions for introspection')
			}
		}

		// Check CASL-based permissions
		if (context.ability) {
			// Check if user can read schema
			if (!context.ability.can('read', '__Schema')) {
				throw new GraphQLError('Permission denied for schema introspection')
			}
		}

		// Get the result
		let result = await resolve(root, args, context, info)

		// Filter the result based on permissions
		if (result && (typePermissions || fieldPermissions)) {
			result = filterIntrospectionResult(result, context, {
				typePermissions,
				fieldPermissions,
			})
		}

		return result
	}
}

/**
 * Filter introspection results based on user permissions
 */
function filterIntrospectionResult(
	result: any,
	context: Context,
	config: {
		typePermissions?: Record<string, { action: string; subject: string }>
		fieldPermissions?: Record<string, { action: string; subject: string }>
	}
): any {
	if (!context.ability) return result

	// Filter __schema result
	if (result && result.types) {
		result.types = result.types.filter((type: any) => {
			// Check if user has permission to see this type
			const permission = config.typePermissions?.[type.name]
			if (permission) {
				return context.ability!.can(permission.action, permission.subject)
			}
			return true // Show types without specific permissions
		})

		// Filter fields within types
		result.types.forEach((type: any) => {
			if (type.fields) {
				type.fields = type.fields.filter((field: any) => {
					const fieldKey = `${type.name}.${field.name}`
					const permission = config.fieldPermissions?.[fieldKey]
					if (permission) {
						return context.ability!.can(permission.action, permission.subject)
					}
					return true
				})
			}
		})
	}

	// Filter __type result
	if (result && result.fields) {
		const typeName = result.name
		result.fields = result.fields.filter((field: any) => {
			const fieldKey = `${typeName}.${field.name}`
			const permission = config.fieldPermissions?.[fieldKey]
			if (permission) {
				return context.ability!.can(permission.action, permission.subject)
			}
			return true
		})
	}

	return result
}

/**
 * Postgraphile plugin for introspection control
 */
export const createPostgraphileIntrospectionPlugin = (config: IntrospectionConfig) => {
	return {
		name: 'IntrospectionControlPlugin',
		version: '1.0.0',

		// Disable introspection in GraphiQL based on config
		grafast: {
			hooks: {
				GraphQLSchema(schema: any) {
					if (!config.enabled) {
						// Remove introspection from schema
						// This is a simplified approach - real implementation would be more complex
						console.warn('Introspection control in Postgraphile requires custom implementation')
					}
					return schema
				},
			},
		},
	}
}

/**
 * Utility to create ability rules for introspection
 */
export const createIntrospectionAbilityRules = (user?: {
	roles?: string[]
}): Array<{ action: string; subject: string }> => {
	const rules: Array<{ action: string; subject: string }> = []

	if (!user) {
		// Anonymous users cannot introspect
		return rules
	}

	const roles = user.roles || []

	// Admins can introspect everything
	if (roles.includes('admin')) {
		rules.push({ action: 'read', subject: '__Schema' })
		rules.push({ action: 'read', subject: '__Type' })
		return rules
	}

	// Developers can introspect
	if (roles.includes('developer')) {
		rules.push({ action: 'read', subject: '__Schema' })
		rules.push({ action: 'read', subject: '__Type' })
		return rules
	}

	// Regular users get limited introspection
	if (roles.includes('user')) {
		// They can see the schema but not all types
		rules.push({ action: 'read', subject: '__Schema' })
		// Specific types they can see would be added here
	}

	return rules
}

/**
 * Example: Combine introspection with CASL middleware
 */
export const createSecureGraphQLMiddleware = (options: {
	casl?: MiddlewareOptions
	introspection?: IntrospectionConfig
}) => {
	const middlewares: any[] = []

	// Add introspection control
	if (options.introspection) {
		middlewares.push(createIntrospectionMiddleware(options.introspection))
	}

	// Combine all middlewares
	return (resolve: any, root: any, args: any, context: any, info: any) => {
		const chain = middlewares.reduceRight(
			(next, middleware) => () => middleware(next, root, args, context, info),
			() => resolve(root, args, context, info)
		)
		return chain()
	}
}
