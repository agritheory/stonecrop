import { GraphQLResolveInfo } from 'graphql'

import type { AppAbility, AbilityBuilderFunction } from '../middleware/ability'

/**
 * User information for authorization
 * @public
 */
export interface User {
	/** Unique identifier for the user */
	id: string
	/** Array of role names assigned to the user */
	roles?: string[]
	/** Additional user properties */
	[key: string]: any
}

/**
 * GraphQL context with CASL ability and user information
 * @public
 */
export interface Context {
	/** CASL ability instance for authorization checks */
	ability?: AppAbility
	/** Current authenticated user */
	user?: User
	/** Additional context properties */
	[key: string]: any
}

// ... rest of the file stays the same

/**
 * Configuration options for CASL middleware
 * @public
 */
export interface MiddlewareOptions {
	/** Mapping of GraphQL types to authorization subjects */
	subjectMap?: Record<string, string>
	/** Mapping of GraphQL operations to CASL actions */
	actionMap?: Record<string, string>
	/** Field-level permission rules */
	fieldPermissions?: Record<string, FieldPermission[]>
	/** Custom function to build user abilities */
	abilityBuilder?: AbilityBuilderFunction
	/** Enable debug logging */
	debug?: boolean
}

/**
 * Field-level permission definition for fine-grained access control
 * @public
 */
export interface FieldPermission {
	/** CASL action (e.g., 'read', 'write') */
	action: string
	/** Subject/resource type to apply permission to */
	subject: string
	/** Specific field name (optional) */
	field?: string
	/** Conditional rules for permission */
	conditions?: any
}

/**
 * GraphQL resolver function type
 * @public
 */
export type ResolverFn = (root: any, args: any, context: Context, info: GraphQLResolveInfo) => any

/**
 * Middleware function that wraps a GraphQL resolver with authorization logic
 * @public
 */
export type MiddlewareFn = (
	resolve: ResolverFn,
	root: any,
	args: any,
	context: Context,
	info: GraphQLResolveInfo
) => any

/**
 * Plugin configuration options for framework integrations
 * @public
 */
export interface PluginOptions extends MiddlewareOptions {
	/** Custom function to build user abilities */
	abilityBuilder?: AbilityBuilderFunction
	/** Ability caching configuration */
	cacheOptions?: {
		/** Time-to-live in milliseconds */
		ttl?: number
		/** Function to generate cache key from user */
		key?: (user?: User) => string
	}
}

/**
 * Response type for ability creation mutations
 * @public
 */
export interface AbilityResponse {
	/** Whether the ability was created successfully */
	success: boolean
	/** The created ability rules */
	ability: any
	/** Success or error message */
	message: string
}

/**
 * Input type for creating a new ability
 * @public
 */
export interface CreateAbilityInput {
	/** User ID to create ability for */
	userId: string
	/** Array of role names to assign */
	roles: string[]
}

// Rule definition for database storage
export interface AbilityRule {
	id?: string
	roleId?: string
	userId?: string
	action: string | string[]
	subject: string
	fields?: string[]
	conditions?: any
	inverted?: boolean
}
