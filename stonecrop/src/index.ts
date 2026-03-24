export type * from '@stonecrop/aform/types'
export type * from '@stonecrop/atable/types'

import { useStonecrop } from './composables/stonecrop'
import { useOperationLog, useUndoRedoShortcuts, withBatch } from './composables/operation-log'
import Doctype, { type DoctypeConfig } from './doctype'
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
import { type StonecropOptions, Stonecrop } from './stonecrop'
import { HST, createHST, type HSTNode } from './stores/hst'
import { useOperationLogStore } from './stores/operation-log'
import { collectNestedData } from './utils'
// Export schema validator
import { SchemaValidator, createValidator, validateSchema } from './schema-validator'
export type * from './types'
export type { BaseStonecropReturn, HSTChangeData, HSTStonecropReturn, OperationLogAPI } from './composables/stonecrop'
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
// Export schema validator types
export type { ValidationIssue, ValidationResult, ValidatorOptions } from './schema-validator'
export { ValidationSeverity } from './schema-validator'

export {
	Doctype,
	DoctypeConfig,
	Registry,
	Stonecrop,
	StonecropOptions,
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
	// Schema validator exports
	SchemaValidator,
	createValidator,
	validateSchema,
	// Operation log exports
	useOperationLog,
	useOperationLogStore,
	useUndoRedoShortcuts,
	withBatch,
	// Utility exports
	collectNestedData,
}

// Default export is the Vue plugin
export default plugin
