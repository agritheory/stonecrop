export type * from '@stonecrop/aform/types'
export type * from '@stonecrop/atable/types'

import { useStonecrop } from './composable'
import DoctypeMeta from './doctype'
import { getGlobalTriggerEngine, registerGlobalAction } from './field-triggers'
import plugin from './plugins'
import Registry from './registry'
import { Stonecrop } from './stonecrop'
import { HST, createHST, type HSTNode } from './stores/hst'
export type * from './types'
export type { BaseStonecropReturn, HSTChangeData, HSTStonecropReturn } from './composable'
export type { FieldTriggerEngine } from './field-triggers'
export type {
	FieldChangeContext,
	FieldTriggerExecutionResult,
	ActionExecutionResult,
	FieldActionFunction,
} from './types/field-triggers'

export {
	DoctypeMeta,
	Registry,
	Stonecrop,
	useStonecrop,
	// HST exports for advanced usage
	HST,
	createHST,
	HSTNode,
	// Field trigger system exports
	getGlobalTriggerEngine,
	registerGlobalAction,
}

// Default export is the Vue plugin
export default plugin
