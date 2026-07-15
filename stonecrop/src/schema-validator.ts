/**
 * Schema Validation Utilities
 * Validates Stonecrop schemas for integrity and consistency
 * @packageDocumentation
 */

import type { DoctypeField } from '@stonecrop/schema'
import type { LinkDeclaration } from '@stonecrop/schema'
import { componentLinkExpansion } from '@stonecrop/schema'
import type { List, Map as ImmutableMap } from 'immutable'
import type { AnyStateNodeConfig } from 'xstate'

import { getGlobalTriggerEngine } from './field-triggers'
import type Registry from './registry'
import { ValidationSeverity } from './types/schema-validator'
import type { ValidationIssue, ValidationResult, ValidatorOptions } from './types/schema-validator'

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
			validateLinks: options.validateLinks ?? true,
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
	 * @param links - Optional links object
	 * @returns Validation result
	 */
	validate(
		doctype: string,
		schema: List<DoctypeField> | DoctypeField[] | undefined,
		workflow?: AnyStateNodeConfig,
		actions?: ImmutableMap<string, string[]> | Map<string, string[]>,
		links?: Record<string, LinkDeclaration>
	): ValidationResult {
		const issues: ValidationIssue[] = []

		// Convert schema to array for easier iteration
		const schemaArray = schema ? (Array.isArray(schema) ? schema : schema.toArray()) : []

		// Validate required properties
		if (this.options.validateRequiredProperties) {
			issues.push(...this.validateRequiredProperties(doctype, schemaArray, links))
		}

		// Validate Link field targets
		if (this.options.validateLinkTargets && this.options.registry) {
			issues.push(...this.validateLinkFields(doctype, schemaArray, this.options.registry))
		}

		// Validate links object
		if (this.options.validateLinks && this.options.registry && links) {
			issues.push(...this.validateLinkDeclarations(doctype, links, schemaArray, this.options.registry))
		}

		// Validate workflow configuration
		if (this.options.validateWorkflows && workflow) {
			issues.push(...this.validateWorkflow(doctype, workflow))
		}

		// Validate action registration
		if (this.options.validateActions && actions) {
			const actionsMap = actions instanceof Map ? actions : actions.toObject()
			// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- toObject() returns plain object; runtime-safe cast for Map<string, string[]>
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
	private validateRequiredProperties(
		doctype: string,
		schema: DoctypeField[],
		links?: Record<string, LinkDeclaration>
	): ValidationIssue[] {
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

			// A value field renders through its component and has no other rendering axis;
			// fieldset/table have their own structural requirements.
			if (field.kind === 'field' && !field.component) {
				issues.push({
					severity: ValidationSeverity.ERROR,
					rule: 'required-component',
					message: `Field "${field.fieldname}" must have a component property`,
					doctype,
					fieldname: field.fieldname,
				})
			}

			// A link component with nothing to point at renders an empty picker, which looks exactly
			// like a record that has no value — so this fails silently at runtime rather than loudly.
			// Link-ness comes from `doctype` or a `links` declaration, so this is a field that named
			// a link component and gave it neither.
			if (
				field.kind === 'field' &&
				componentLinkExpansion(field.component) &&
				!field.doctype &&
				!links?.[field.fieldname]
			) {
				issues.push({
					severity: ValidationSeverity.ERROR,
					rule: 'link-component-without-doctype',
					message:
						`Field "${field.fieldname}" renders with "${field.component}", which is a link component, ` +
						`but has no \`doctype\` to name its target`,
					doctype,
					fieldname: field.fieldname,
				})
			}

			// Validate nested schemas recursively (fieldset only; table columns are ColumnSchema not DoctypeField)
			if (field.kind === 'fieldset') {
				issues.push(...this.validateRequiredProperties(doctype, field.schema, links))
			}
		}

		return issues
	}

	/**
	 * Validates Link field targets exist in registry
	 * @internal
	 */
	private validateLinkFields(doctype: string, schema: DoctypeField[], registry: Registry): ValidationIssue[] {
		const issues: ValidationIssue[] = []

		for (const field of schema) {
			// `doctype` is both the link marker and its target, and the schema types it as a
			// non-empty string — so there is no "missing target" or "malformed target" state left
			// to check here. The rules that did (`link-missing-options`, `link-invalid-options`)
			// were removed with the `options`-as-link-target convention; the case they actually
			// guarded — a link component with no target — is now `link-component-without-doctype`,
			// which fires in validateRequiredProperties whether or not a registry is configured.
			if (field.kind === 'field' && field.doctype) {
				const targetDoctype = field.doctype
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

			// Recursively check nested fieldset schemas
			if (field.kind === 'fieldset') {
				issues.push(...this.validateLinkFields(doctype, field.schema, registry))
			}
		}

		return issues
	}

	/**
	 * Validates link declarations: target resolution, backlink consistency, Link field correspondence
	 * @internal
	 */
	private validateLinkDeclarations(
		doctype: string,
		links: Record<string, LinkDeclaration>,
		schema: DoctypeField[],
		registry: Registry
	): ValidationIssue[] {
		const issues: ValidationIssue[] = []

		// Build a map of link fields by fieldname for quick lookup
		const linkFieldsByFieldname = new Map<string, DoctypeField>()
		for (const field of schema) {
			if (field.kind === 'field' && field.doctype) {
				linkFieldsByFieldname.set(field.fieldname, field)
			}
		}

		for (const [fieldname, link] of Object.entries(links)) {
			// Check target resolves in registry
			const targetDoctype = registry.registry[link.target]
			if (!targetDoctype) {
				issues.push({
					severity: ValidationSeverity.ERROR,
					rule: 'link-invalid-target',
					message: `Link "${fieldname}" references non-existent doctype: "${link.target}"`,
					doctype,
					fieldname,
					context: { target: link.target },
				})
				continue
			}

			// Warn on self-referential target
			if (link.target === doctype) {
				issues.push({
					severity: ValidationSeverity.WARNING,
					rule: 'link-self-referential',
					message: `Link "${fieldname}" is self-referential (target: "${link.target}")`,
					doctype,
					fieldname,
					context: { target: link.target },
				})
			}

			// Check backlink consistency
			if (link.backlink && targetDoctype.links) {
				const reciprocalLink = targetDoctype.links[link.backlink]
				if (!reciprocalLink) {
					issues.push({
						severity: ValidationSeverity.ERROR,
						rule: 'link-backlink-missing',
						message: `Backlink "${link.backlink}" not found on target doctype "${link.target}"`,
						doctype,
						fieldname,
						context: { backlink: link.backlink, target: link.target },
					})
				} else if (reciprocalLink.target !== doctype) {
					issues.push({
						severity: ValidationSeverity.WARNING,
						rule: 'link-backlink-mismatch',
						message: `Backlink "${link.backlink}" on "${link.target}" points to "${reciprocalLink.target}" instead of "${doctype}"`,
						doctype,
						fieldname,
						context: { backlink: link.backlink, target: link.target, actualTarget: reciprocalLink.target },
					})
				}
			}

			// If Link field exists with same fieldname, verify it has matching target
			// Only check if link has fieldname set (otherwise it's a standalone link without a field)
			if (link.fieldname) {
				const linkField = linkFieldsByFieldname.get(link.fieldname)
				if (linkField && linkField.kind === 'field') {
					// Map membership implies `doctype` is set — that is the map's build condition.
					const linkFieldTarget = linkField.doctype
					if (linkFieldTarget && linkFieldTarget !== link.target) {
						issues.push({
							severity: ValidationSeverity.ERROR,
							rule: 'link-field-target-mismatch',
							message: `Link field "${link.fieldname}" targets "${linkFieldTarget}" but link declaration targets "${link.target}"`,
							doctype,
							fieldname: link.fieldname,
							context: { linkFieldTarget, linkTarget: link.target },
						})
					}
				}
			}
		}

		// NOTE: there is deliberately no "every link field needs a declaration" rule. A plain foreign
		// key is a link with no `links` entry — the map is additive, carrying expansion metadata
		// (backlink/fetch/cardinality), and is not required. Such a rule would contradict
		// `Registry.resolveFields`, which resolves undeclared links to inline pickers, and would flag
		// every doctype that mixes an expanded relation with a plain FK (e.g. `country`: a `links`
		// map for states/languages/subdivisions plus a plain `continent` picker).

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
						// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- 'target' in transition guard confirms property; accessing unknown-typed target safely
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
				// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- introspecting FieldTriggerEngine private fields for validation; no public API for this check
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
	schema: List<DoctypeField> | DoctypeField[] | undefined,
	registry: Registry,
	workflow?: AnyStateNodeConfig,
	actions?: ImmutableMap<string, string[]> | Map<string, string[]>
): ValidationResult {
	const validator = createValidator(registry)
	return validator.validate(doctype, schema, workflow, actions)
}
