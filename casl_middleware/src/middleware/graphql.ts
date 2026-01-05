import { subject } from '@casl/ability'
import { GraphQLError, GraphQLResolveInfo } from 'graphql'
import { parse, visit, FieldNode, DocumentNode } from 'graphql/language'
import { Context, MiddlewareOptions, ResolverFn } from '../types'
import { createAbility, defaultAbilityBuilder } from './ability'

// Helper to extract operation name from GraphQL info
const getOperationName = (info: GraphQLResolveInfo): string => {
	return info.operation.operation.toLowerCase()
}

// Helper to get full field path
const getFieldPath = (info: GraphQLResolveInfo): string => {
	return info.path.typename ? `${info.path.typename}.${info.path.key}` : String(info.path.key)
}

// Parse GraphQL query to extract accessed fields
const extractAccessedFields = (query: string): string[] => {
	const fields: string[] = []

	try {
		const ast: DocumentNode = parse(query)

		visit(ast, {
			Field: {
				enter(node: FieldNode) {
					if (node.name.value !== '__typename') {
						fields.push(node.name.value)
					}
				},
			},
		})
	} catch (error) {
		console.error('Failed to parse GraphQL query:', error)
	}

	return fields
}

// Check if ability allows the operation
const checkPermission = (context: Context, action: string, subjectName: string, conditions?: any): boolean => {
	if (!context.ability) {
		return false
	}

	try {
		// Only use subject helper if we have specific conditions to check
		// (not just resolver args, but actual CASL conditions)
		if (conditions && typeof conditions === 'object') {
			return context.ability.can(action, subject(subjectName, conditions))
		} else {
			// Simple check without conditions - just action and subject type
			return context.ability.can(action, subjectName)
		}
	} catch (error) {
		console.error('Permission check failed:', error)
		return false
	}
}

// CASL GraphQL middleware factory
export const createCaslMiddleware = (options: MiddlewareOptions = {}) => {
	const {
		subjectMap = {},
		actionMap = {
			query: 'read',
			mutation: 'update',
			subscription: 'read',
		},
		fieldPermissions = {},
		abilityBuilder = defaultAbilityBuilder,
		debug = false,
	} = options

	return async (
		resolve: ResolverFn,
		root: any,
		args: any,
		context: Context,
		info: GraphQLResolveInfo
	): Promise<any> => {
		// Create ability if not already in context
		if (!context.ability) {
			context.ability = await createAbility(context.user, abilityBuilder)
		}

		const operation = getOperationName(info)
		const fieldPath = getFieldPath(info)
		const action = actionMap[operation] || operation

		// Get subject from map or default to type name
		const subjectType = info.parentType.name
		const subjectName = subjectMap[subjectType] || subjectType

		if (debug) {
			console.log(`Checking permission: ${action} on ${subjectName} at ${fieldPath}`)
		}

		// Check field-level permissions if defined
		if (fieldPermissions[fieldPath]) {
			const permissions = fieldPermissions[fieldPath]
			const allowed = permissions.some(permission =>
				// Don't pass resolver args here - only use them if the permission defines conditions
				checkPermission(context, permission.action, permission.subject, permission.conditions)
			)

			if (!allowed) {
				throw new GraphQLError(`Access denied for field ${fieldPath}`)
			}
		}

		// Check operation-level permission
		// Don't pass resolver args as conditions - they're not CASL conditions
		const allowed = checkPermission(context, action, subjectName)

		if (!allowed) {
			throw new GraphQLError(`Access denied for ${action} on ${subjectName}`)
		}

		// Additional checks for mutations with input fields
		if (operation === 'mutation' && args.input) {
			const querySource = info.operation.loc?.source.body

			if (querySource) {
				const accessedFields = extractAccessedFields(querySource)

				for (const field of accessedFields) {
					// Check field-level update permissions if needed
					const fieldAllowed = checkPermission(context, 'update', subjectName, { field })

					if (!fieldAllowed && debug) {
						console.warn(`Warning: Field ${field} update not explicitly allowed`)
					}
				}
			}
		}

		// Call the resolver
		return resolve(root, args, context, info)
	}
}

// Utility function to combine multiple middlewares
export const combineMiddlewares = (...middlewares: any[]) => {
	return (resolve: ResolverFn, root: any, args: any, context: any, info: any) => {
		const chain = middlewares.reduceRight(
			(next, middleware) => () => middleware(next, root, args, context, info),
			() => resolve(root, args, context, info)
		)
		return chain()
	}
}
