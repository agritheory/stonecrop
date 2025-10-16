export type * from '@stonecrop/aform/types'
export type * from '@stonecrop/atable/types'

import { useStonecrop } from './composable'
import { useOperationLog, useUndoRedoShortcuts, withBatch } from './composables/operation-log'
import DoctypeMeta from './doctype'
import {
	getGlobalTriggerEngine,
	markOperationIrreversible,
	registerGlobalAction,
	registerTransitionAction,
	setFieldRollback,
	triggerTransition,
} from './field-triggers'
import plugin from './plugins'
import Registry from './registry'
import { Stonecrop } from './stonecrop'
import { HST, createHST, type HSTNode } from './stores/hst'
import { useOperationLogStore } from './stores/operation-log'
export type * from './types'
export type { BaseStonecropReturn, HSTChangeData, HSTStonecropReturn } from './composable'
export type { FieldTriggerEngine } from './field-triggers'
export type {
	FieldChangeContext,
	TransitionChangeContext,
	FieldTriggerExecutionResult,
	ActionExecutionResult,
	TransitionExecutionResult,
	FieldActionFunction,
	TransitionActionFunction,
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
	registerTransitionAction,
	setFieldRollback,
	triggerTransition,
	markOperationIrreversible,
	// Operation log exports
	useOperationLog,
	useOperationLogStore,
	useUndoRedoShortcuts,
	withBatch,
}

// Default export is the Vue plugin
export default plugin
