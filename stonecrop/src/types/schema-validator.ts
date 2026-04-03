import type Registry from '../registry'

/**
 * Validation severity levels
 * @public
 */
export enum ValidationSeverity {
	/** Blocking error that prevents save */
	ERROR = 'error',
	/** Advisory warning that allows save */
	WARNING = 'warning',
	/** Informational message */
	INFO = 'info',
}

/**
 * Validation issue
 * @public
 */
export interface ValidationIssue {
	/** Severity level */
	severity: ValidationSeverity
	/** Validation rule that failed */
	rule: string
	/** Human-readable message */
	message: string
	/** Doctype name */
	doctype?: string
	/** Field name if applicable */
	fieldname?: string
	/** Additional context */
	context?: Record<string, unknown>
}

/**
 * Validation result
 * @public
 */
export interface ValidationResult {
	/** Whether validation passed (no blocking errors) */
	valid: boolean
	/** List of validation issues */
	issues: ValidationIssue[]
	/** Count of errors */
	errorCount: number
	/** Count of warnings */
	warningCount: number
	/** Count of info messages */
	infoCount: number
}

/**
 * Schema validator options
 * @public
 */
export interface ValidatorOptions {
	/** Registry instance for doctype lookups */
	registry?: Registry
	/** Whether to validate Link field targets */
	validateLinkTargets?: boolean
	/** Whether to validate links object (target resolution, backlink consistency, layout entries) */
	validateLinks?: boolean
	/** Whether to validate workflow reachability */
	validateWorkflows?: boolean
	/** Whether to validate action registration */
	validateActions?: boolean
	/** Whether to validate required schema properties */
	validateRequiredProperties?: boolean
}
