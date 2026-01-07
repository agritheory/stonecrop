import { App } from 'vue'

import { defaultKeypressHandlers, useKeyboardNav } from './composables/keyboard'
export type * from './types'

// Export SQL introspection utilities
export type { SQLColumn, SQLTable, StonecropFieldType, ConversionResult } from './sql-introspection'
export { mapSQLTypeToFieldType, parseDDL, convertTableToSchema, introspectSQL } from './sql-introspection'

// Export naming convention utilities
export type { NameConversion } from './naming-conventions'
export {
	snakeToCamel,
	camelToSnake,
	snakeToLabel,
	camelToLabel,
	convertSQLName,
	convertSQLNames,
	createNameMapping,
} from './naming-conventions'

// Export workflow scaffolding utilities
export type { WorkflowScaffold } from './workflow-scaffolder'
export {
	detectStatusColumn,
	extractStateValues,
	generateTransitionName,
	scaffoldWorkflow,
	scaffoldWorkflowFromTable,
	generateWorkflowLayout,
} from './workflow-scaffolder'

/**
 * Install all utility components
 * @param app - Vue app instance
 * @public
 */
function install(_app: App /* options */) {}

export { defaultKeypressHandlers, install, useKeyboardNav }
