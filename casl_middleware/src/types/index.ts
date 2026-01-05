import { GraphQLResolveInfo } from 'graphql'

import type { AppAbility, AbilityBuilderFunction } from '../middleware/ability'

// User type definition
export interface User {
	id: string
	roles?: string[]
	[key: string]: any
}

// GraphQL context with CASL ability
export interface Context {
	ability?: AppAbility // This is now correct type (MongoAbility)
	user?: User
	[key: string]: any
}

// ... rest of the file stays the same

// Middleware configuration options
export interface MiddlewareOptions {
	subjectMap?: Record<string, string>
	actionMap?: Record<string, string>
	fieldPermissions?: Record<string, FieldPermission[]>
	abilityBuilder?: AbilityBuilderFunction
	debug?: boolean
}

// Field-level permission definition
export interface FieldPermission {
	action: string
	subject: string
	field?: string
	conditions?: any
}

// GraphQL resolver function type
export type ResolverFn = (root: any, args: any, context: Context, info: GraphQLResolveInfo) => Promise<any> | any

// Middleware function type
export type MiddlewareFn = (
	resolve: ResolverFn,
	root: any,
	args: any,
	context: Context,
	info: GraphQLResolveInfo
) => Promise<any> | any

// Plugin options for framework integrations
export interface PluginOptions extends MiddlewareOptions {
	abilityBuilder?: AbilityBuilderFunction
	cacheOptions?: {
		ttl?: number
		key?: (user?: User) => string
	}
}

// Response types for GraphQL mutations
export interface AbilityResponse {
	success: boolean
	ability: any
	message: string
}

export interface CreateAbilityInput {
	userId: string
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
