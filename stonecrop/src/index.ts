export type * from '@stonecrop/aform/types'
export type * from '@stonecrop/atable/types'

import { executeClientHandler } from './client-handler'
import { useLazyLink } from './composables/lazy-link'
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
import { Stonecrop, getStonecrop } from './stonecrop'
import { HST, createHST, type HSTNode } from './stores/hst'
import { useOperationLogStore } from './stores/operation-log'
import { SchemaValidator, createValidator, validateSchema } from './schema-validator'
import { ValidationSeverity } from './types/schema-validator'

// Export all types from ./types
export type * from './types'

// clientHandler executor types
export type { ClientHandlerApi } from './client-handler'

// Export enum as value (enums need runtime export, not just type)
export { ValidationSeverity }

export {
	Doctype,
	Registry,
	Stonecrop,
	useLazyLink,
	useStonecrop,
	// clientHandler executor
	executeClientHandler,
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
	getStonecrop,
}

// Default export is the Vue plugin
export default plugin
