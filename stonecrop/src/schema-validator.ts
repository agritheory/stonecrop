/**
 * Schema Validation Utilities
 * Validates Stonecrop schemas for integrity and consistency
 * @packageDocumentation
 */

import type { SchemaTypes } from '@stonecrop/aform'
import type { List, Map as ImmutableMap } from 'immutable'
import type { AnyStateNodeConfig } from 'xstate'
import { getGlobalTriggerEngine } from './field-triggers'
import type Registry from './registry'

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
	/** Whether to validate workflow reachability */
	validateWorkflows?: boolean
	/** Whether to validate action registration */
	validateActions?: boolean
	/** Whether to validate required schema properties */
	validateRequiredProperties?: boolean
}

/**
 * Schema validator class
 * @public
 */
export class SchemaValidator {
	private options: Required<ValidatorOptions>

	/**
	 * Creates a new SchemaValidator instance
	 * @param options - Validator configuration options
	 */
	constructor(options: ValidatorOptions = {}) {
		this.options = {
			registry: options.registry || null!,
			validateLinkTargets: options.validateLinkTargets ?? true,
			validateActions: options.validateActions ?? true,
			validateWorkflows: options.validateWorkflows ?? true,
			validateRequiredProperties: options.validateRequiredProperties ?? true,
		}
	}

	/**
	 * Validates a complete doctype schema
	 * @param doctype - Doctype name
	 * @param schema - Schema fields (List or Array)
	 * @param workflow - Optional workflow configuration
	 * @param actions - Optional actions map
	 * @returns Validation result
	 */
	validate(
		doctype: string,
		schema: List<SchemaTypes> | SchemaTypes[] | undefined,
		workflow?: AnyStateNodeConfig,
		actions?: ImmutableMap<string, string[]> | Map<string, string[]>
	): ValidationResult {
		const issues: ValidationIssue[] = []

		// Convert schema to array for easier iteration
		const schemaArray = schema ? (Array.isArray(schema) ? schema : schema.toArray()) : []

		// Validate required properties
		if (this.options.validateRequiredProperties) {
			issues.push(...this.validateRequiredProperties(doctype, schemaArray))
		}

		// Validate Link field targets
		if (this.options.validateLinkTargets && this.options.registry) {
			issues.push(...this.validateLinkFields(doctype, schemaArray, this.options.registry))
		}

		// Validate workflow configuration
		if (this.options.validateWorkflows && workflow) {
			issues.push(...this.validateWorkflow(doctype, workflow))
		}

		// Validate action registration
		if (this.options.validateActions && actions) {
			const actionsMap = actions instanceof Map ? actions : actions.toObject()
			issues.push(...this.validateActionRegistration(doctype, actionsMap as Record<string, string[]>))
		}

		// Calculate counts
		const errorCount = issues.filter(i => i.severity === ValidationSeverity.ERROR).length
		const warningCount = issues.filter(i => i.severity === ValidationSeverity.WARNING).length
		const infoCount = issues.filter(i => i.severity === ValidationSeverity.INFO).length

		return {
			valid: errorCount === 0,
			issues,
			errorCount,
			warningCount,
			infoCount,
		}
	}

	/**
	 * Validates that required schema properties are present
	 * @internal
	 */
	private validateRequiredProperties(doctype: string, schema: SchemaTypes[]): ValidationIssue[] {
		const issues: ValidationIssue[] = []

		for (const field of schema) {
			// Check for fieldname
			if (!field.fieldname) {
				issues.push({
					severity: ValidationSeverity.ERROR,
					rule: 'required-fieldname',
					message: 'Field is missing required property: fieldname',
					doctype,
					context: { field },
				})
				continue
			}

			// Check for component or fieldtype
			if (!field.component && !('fieldtype' in field)) {
				issues.push({
					severity: ValidationSeverity.ERROR,
					rule: 'required-component-or-fieldtype',
					message: `Field "${field.fieldname}" must have either component or fieldtype property`,
					doctype,
					fieldname: field.fieldname,
				})
			}

			// Validate nested schemas (recursively)
			if ('schema' in field) {
				const nestedSchema = (field as { schema: unknown }).schema
				const nestedArray = (
					Array.isArray(nestedSchema) ? nestedSchema : (nestedSchema as { toArray?: () => unknown[] }).toArray?.() || []
				) as SchemaTypes[]
				issues.push(...this.validateRequiredProperties(doctype, nestedArray))
			}
		}

		return issues
	}

	/**
	 * Validates Link field targets exist in registry
	 * @internal
	 */
	private validateLinkFields(doctype: string, schema: SchemaTypes[], registry: Registry): ValidationIssue[] {
		const issues: ValidationIssue[] = []

		for (const field of schema) {
			const fieldtype = 'fieldtype' in field ? (field as { fieldtype: unknown }).fieldtype : undefined

			// Check Link fields
			if (fieldtype === 'Link') {
				const options = 'options' in field ? (field as { options: unknown }).options : undefined
				if (!options) {
					issues.push({
						severity: ValidationSeverity.ERROR,
						rule: 'link-missing-options',
						message: `Link field "${field.fieldname}" is missing options property (target doctype)`,
						doctype,
						fieldname: field.fieldname,
					})
					continue
				}

				// Check if target doctype exists in registry
				// Options should be a string representing the target doctype name
				const targetDoctype = typeof options === 'string' ? options : ''
				if (!targetDoctype) {
					issues.push({
						severity: ValidationSeverity.ERROR,
						rule: 'link-invalid-options',
						message: `Link field "${field.fieldname}" has invalid options format (expected string doctype name)`,
						doctype,
						fieldname: field.fieldname,
					})
					continue
				}
				const targetMeta = registry.registry[targetDoctype] || registry.registry[targetDoctype.toLowerCase()]

				if (!targetMeta) {
					issues.push({
						severity: ValidationSeverity.ERROR,
						rule: 'link-invalid-target',
						message: `Link field "${field.fieldname}" references non-existent doctype: "${targetDoctype}"`,
						doctype,
						fieldname: field.fieldname,
						context: { targetDoctype },
					})
				}
			}

			// Recursively check nested schemas
			if ('schema' in field) {
				const nestedSchema = (field as { schema: unknown }).schema
				const nestedArray = (
					Array.isArray(nestedSchema) ? nestedSchema : (nestedSchema as { toArray?: () => unknown[] }).toArray?.() || []
				) as SchemaTypes[]
				issues.push(...this.validateLinkFields(doctype, nestedArray, registry))
			}
		}

		return issues
	}

	/**
	 * Validates workflow state machine configuration
	 * @internal
	 */
	private validateWorkflow(doctype: string, workflow: AnyStateNodeConfig): ValidationIssue[] {
		const issues: ValidationIssue[] = []

		// Check for initial state
		if (!workflow.initial && !workflow.type) {
			issues.push({
				severity: ValidationSeverity.WARNING,
				rule: 'workflow-missing-initial',
				message: 'Workflow is missing initial state property',
				doctype,
			})
		}

		// Check for states
		if (!workflow.states || Object.keys(workflow.states).length === 0) {
			issues.push({
				severity: ValidationSeverity.WARNING,
				rule: 'workflow-no-states',
				message: 'Workflow has no states defined',
				doctype,
			})
			return issues
		}

		// Validate initial state exists
		if (workflow.initial && typeof workflow.initial === 'string' && !workflow.states[workflow.initial]) {
			issues.push({
				severity: ValidationSeverity.ERROR,
				rule: 'workflow-invalid-initial',
				message: `Workflow initial state "${workflow.initial}" does not exist in states`,
				doctype,
				context: { initialState: workflow.initial },
			})
		}

		// Check state reachability (simple check - all states should have at least one incoming transition or be initial)
		const stateNames = Object.keys(workflow.states)
		const reachableStates = new Set<string>()

		// Initial state is always reachable
		if (workflow.initial && typeof workflow.initial === 'string') {
			reachableStates.add(workflow.initial)
		}

		// Find all target states from transitions
		for (const [_stateName, stateConfig] of Object.entries(workflow.states)) {
			const state = stateConfig as AnyStateNodeConfig
			if (state.on) {
				for (const [_event, transition] of Object.entries(state.on)) {
					if (typeof transition === 'string') {
						reachableStates.add(transition)
					} else if (transition && typeof transition === 'object') {
						const target = 'target' in transition ? (transition as { target: unknown }).target : undefined
						if (typeof target === 'string') {
							reachableStates.add(target)
						} else if (Array.isArray(target)) {
							target.forEach((t: unknown) => {
								if (typeof t === 'string') {
									reachableStates.add(t)
								}
							})
						}
					}
				}
			}
		}

		// Check for unreachable states
		for (const stateName of stateNames) {
			if (!reachableStates.has(stateName)) {
				issues.push({
					severity: ValidationSeverity.WARNING,
					rule: 'workflow-unreachable-state',
					message: `Workflow state "${stateName}" may not be reachable`,
					doctype,
					context: { stateName },
				})
			}
		}

		return issues
	}

	/**
	 * Validates that actions are registered in the FieldTriggerEngine
	 * @internal
	 */
	private validateActionRegistration(doctype: string, actions: Record<string, string[]>): ValidationIssue[] {
		const issues: ValidationIssue[] = []
		const triggerEngine = getGlobalTriggerEngine()

		for (const [triggerName, actionNames] of Object.entries(actions)) {
			if (!Array.isArray(actionNames)) {
				issues.push({
					severity: ValidationSeverity.ERROR,
					rule: 'action-invalid-format',
					message: `Action configuration for "${triggerName}" must be an array`,
					doctype,
					context: { triggerName, actionNames },
				})
				continue
			}

			// Check each action name
			for (const actionName of actionNames) {
				// Check if action is registered globally
				const engine = triggerEngine as unknown as {
					globalActions?: Map<string, unknown>
					globalTransitionActions?: Map<string, unknown>
				}
				const isRegistered = engine.globalActions?.has(actionName) || engine.globalTransitionActions?.has(actionName)

				if (!isRegistered) {
					issues.push({
						severity: ValidationSeverity.WARNING,
						rule: 'action-not-registered',
						message: `Action "${actionName}" referenced in "${triggerName}" is not registered in FieldTriggerEngine`,
						doctype,
						context: { triggerName, actionName },
					})
				}
			}
		}

		return issues
	}
}

/**
 * Creates a validator with the given registry
 * @param registry - Registry instance
 * @param options - Additional validator options
 * @returns SchemaValidator instance
 * @public
 */
export function createValidator(registry: Registry, options?: Partial<ValidatorOptions>): SchemaValidator {
	return new SchemaValidator({
		registry,
		...options,
	})
}

/**
 * Quick validation helper
 * @param doctype - Doctype name
 * @param schema - Schema fields
 * @param registry - Registry instance
 * @param workflow - Optional workflow configuration
 * @param actions - Optional actions map
 * @returns Validation result
 * @public
 */
export function validateSchema(
	doctype: string,
	schema: List<SchemaTypes> | SchemaTypes[] | undefined,
	registry: Registry,
	workflow?: AnyStateNodeConfig,
	actions?: ImmutableMap<string, string[]> | Map<string, string[]>
): ValidationResult {
	const validator = createValidator(registry)
	return validator.validate(doctype, schema, workflow, actions)
}
