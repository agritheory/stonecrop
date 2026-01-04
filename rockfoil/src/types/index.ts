import type { ExecutableStep, FieldArgs, FieldInfo } from 'postgraphile/grafast'
import type { PlanWrapperFn, PlanWrapperRule } from 'postgraphile/utils'

export interface HookConfig {
	[fieldName: string]: {
		beforeQuery?: PlanWrapperFn
		afterQuery?: (result: any, plan: any, $source: ExecutableStep, fieldArgs: FieldArgs, info: FieldInfo) => any
		beforeMutation?: PlanWrapperFn
		afterMutation?: (result: any, plan: any, $source: ExecutableStep, fieldArgs: FieldArgs, info: FieldInfo) => any
	}
}

export interface HookPlan {
	[fieldName: string]: PlanWrapperRule
}
