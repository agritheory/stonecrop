import type { ExecutableStep, FieldArgs, FieldInfo } from 'postgraphile/grafast'
import type { PlanWrapperFn, PlanWrapperRule } from 'postgraphile/utils'

/**
 * Configuration object mapping field names to their before/after hooks for queries and mutations
 * @public
 */
export interface HookConfig {
	/**
	 * Hook configuration for a specific field
	 */
	[fieldName: string]: {
		/** Function to execute before a query operation */
		beforeQuery?: PlanWrapperFn
		/** Function to execute after a query operation */
		afterQuery?: (result: any, plan: any, $source: ExecutableStep, fieldArgs: FieldArgs, info: FieldInfo) => any
		/** Function to execute before a mutation operation */
		beforeMutation?: PlanWrapperFn
		/** Function to execute after a mutation operation */
		afterMutation?: (result: any, plan: any, $source: ExecutableStep, fieldArgs: FieldArgs, info: FieldInfo) => any
	}
}

/**
 * Internal mapping of field names to their plan wrapper rules
 * @public
 */
export interface HookPlan {
	/**
	 * Plan wrapper rule for a specific field
	 */
	[fieldName: string]: PlanWrapperRule
}
