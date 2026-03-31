export type * from '@stonecrop/aform/types'
export type * from '@stonecrop/atable/types'

import { useStonecrop } from './composables/stonecrop'
import { useOperationLog, useUndoRedoShortcuts, withBatch } from './composables/operation-log'
import Doctype from './doctype'
import {
	FieldTriggerEngine,
	getGlobalTriggerEngine,
	markOperationIrreversible,
	registerGlobalAction,
	registerTransitionAction,
	setFieldRollback,
	triggerTransition,
} from './field-triggers'
import plugin from './plugins'
import Registry from './registry'
import { Stonecrop, collectNestedData } from './stonecrop'
import { HST, createHST, type HSTNode } from './stores/hst'
import { useOperationLogStore } from './stores/operation-log'
import { SchemaValidator, createValidator, validateSchema } from './schema-validator'
import { ValidationSeverity } from './types/schema-validator'

// Export all types from ./types
export type * from './types'

// Export enum as value (enums need runtime export, not just type)
export { ValidationSeverity }

export {
	Doctype,
	Registry,
	Stonecrop,
	useStonecrop,
	// HST exports for advanced usage
	HST,
	createHST,
	HSTNode,
	// Field trigger system exports
	FieldTriggerEngine,
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
	// Utility functions
	collectNestedData,
}

// Default export is the Vue plugin
export default plugin
