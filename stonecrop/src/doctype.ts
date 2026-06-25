import type { DoctypeField, LinkDeclaration, WorkflowMeta } from '@stonecrop/schema'
import { List, Map } from 'immutable'
import { Component } from 'vue'

import type { DoctypeConfig, ImmutableDoctype } from './types/doctype'

/**
 * Doctype runtime class with Immutable.js collections for HST change tracking.
 * @public
 */
export default class Doctype {
	/**
	 * The doctype name
	 * @public
	 * @readonly
	 */
	readonly doctype: string

	/**
	 * Alias for doctype (for DoctypeLike interface compatibility)
	 * @public
	 * @readonly
	 */
	get name(): string {
		return this.doctype
	}

	/**
	 * The doctype schema
	 * @public
	 * @readonly
	 */
	readonly schema: ImmutableDoctype['schema']

	/**
	 * The doctype workflow
	 * @public
	 * @readonly
	 */
	readonly workflow: ImmutableDoctype['workflow']

	/**
	 * The doctype actions and field triggers
	 * @public
	 * @readonly
	 */
	readonly actions: ImmutableDoctype['actions']

	/**
	 * The doctype component
	 * @public
	 * @readonly
	 */
	readonly component?: Component

	/**
	 * Relationship links to other doctypes
	 * @public
	 * @readonly
	 */
	readonly links?: Record<string, LinkDeclaration>

	/**
	 * Creates a new Doctype instance
	 * @param doctype - The doctype name
	 * @param schema - The doctype schema definition
	 * @param workflow - The doctype workflow configuration (XState machine)
	 * @param actions - The doctype actions and field triggers
	 * @param component - Optional Vue component for rendering the doctype
	 * @param links - Optional relationship links to other doctypes
	 */
	constructor(
		doctype: string,
		schema: ImmutableDoctype['schema'],
		workflow: ImmutableDoctype['workflow'],
		actions: ImmutableDoctype['actions'],
		component?: Component,
		links?: Record<string, LinkDeclaration>
	) {
		this.doctype = doctype
		this.schema = schema
		this.workflow = workflow
		this.actions = actions
		this.component = component
		this.links = links
	}

	/**
	 * Creates a Doctype instance from a plain configuration object.
	 * Handles conversion of arrays to Immutable.js collections internally.
	 *
	 * This is the recommended way to create a Doctype from API responses
	 * or configuration files, as it encapsulates the Immutable.js construction
	 * that the framework uses internally.
	 *
	 * @param config - Plain object with doctype configuration (typically from API response)
	 * @returns A new Doctype instance with Immutable.js collections
	 *
	 * @example
	 * ```ts
	 * // From an API response
	 * const response = await client.getMeta({ doctype: 'plan' })
	 * const doctype = Doctype.fromObject(response)
	 * registry.addDoctype(doctype)
	 * ```
	 *
	 * @example
	 * ```ts
	 * // From a configuration object
	 * const planDoctype = Doctype.fromObject({
	 *   name: 'Plan',
	 *   fields: [
	 *     { fieldname: 'title', label: 'Title', fieldtype: 'Data' },
	 *     { fieldname: 'status', label: 'Status', fieldtype: 'Data' },
	 *   ],
	 *   workflow: {
	 *     id: 'plan',
	 *     initial: 'draft',
	 *     states: { draft: {}, submitted: {} }
	 *   }
	 * })
	 * ```
	 *
	 * @public
	 */
	static fromObject(config: DoctypeConfig): Doctype {
		const schema = config.fields ? List(config.fields) : List<DoctypeField>()
		const actions = config.actions ? Map(config.actions) : Map<string, string[]>()

		return new Doctype(config.name, schema, config.workflow, actions, undefined, config.links)
	}

	/**
	 * Returns the raw authoring schema as a plain array.
	 * For the resolved schema suitable for AForm, use `registry.resolveSchema(doctype)`.
	 *
	 * @returns Array of raw DoctypeField authoring definitions
	 *
	 * @example
	 * ```ts
	 * const fields = doctype.getSchemaArray()
	 * // Pass to resolveSchema for AForm-ready output:
	 * const resolved = registry.resolveSchema(doctype)
	 * ```
	 *
	 * @public
	 */
	getSchemaArray(): DoctypeField[] {
		if (!this.schema) return []
		return this.schema.toArray()
	}

	/**
	 * Returns the actions as a plain object for use with components that expect
	 * plain JavaScript objects.
	 *
	 * @returns Object mapping action names to field trigger arrays
	 *
	 * @public
	 */
	getActionsObject(): Record<string, string[]> {
		if (!this.actions) return {}
		return this.actions.toObject()
	}

	/**
	 * Returns the transitions available from a given workflow state, derived from the
	 * doctype's workflow configuration. Supports both XState format and WorkflowMeta format.
	 *
	 * @param currentState - The state name to read transitions from
	 * @returns Array of transition descriptors with `name` and `targetState`
	 *
	 * @example
	 * ```ts
	 * const transitions = doctype.getAvailableTransitions('draft')
	 * // [{ name: 'SUBMIT', targetState: 'submitted' }]
	 * ```
	 *
	 * @public
	 */
	getAvailableTransitions(currentState: string): Array<{ name: string; targetState: string }> {
		const workflow = this.workflow
		if (!workflow) return []

		// Check if this is WorkflowMeta format (states is an array) or XState format (states is an object)
		if (Array.isArray(workflow.states)) {
			// WorkflowMeta format: validate state exists and filter actions by allowedStates
			const states = workflow.states
			if (!states.includes(currentState)) return []

			// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- Array.isArray(workflow.states) confirms WorkflowMeta format above
			const actions = (workflow as WorkflowMeta).actions
			if (!actions) return []

			return Object.entries(actions)
				.filter(([, actionDef]) => {
					const allowedStates = actionDef.allowedStates
					// If no allowedStates specified, action is available in all valid states
					if (!allowedStates || allowedStates.length === 0) return true
					return allowedStates.includes(currentState)
				})
				.map(([name, actionDef]) => ({
					name,
					targetState: actionDef.nextState ?? currentState,
				}))
		}

		// XState format: use the on property of the state
		const states = workflow.states
		if (!states) return []
		const stateConfig = states[currentState]
		if (!stateConfig?.on) return []
		return Object.entries(stateConfig.on).map(([name, target]) => ({
			name,
			targetState: typeof target === 'string' ? target : 'unknown',
		}))
	}

	/**
	 * Returns metadata for a specific action, if available.
	 * Only works with WorkflowMeta format; returns undefined for XState format.
	 *
	 * @param actionName - The action name to get metadata for
	 * @returns Action metadata or undefined
	 *
	 * @example
	 * ```ts
	 * const actionMeta = doctype.getActionMeta('submit')
	 * // { label: 'Submit', handler: 'plan:submit', allowedStates: ['draft'] }
	 * ```
	 *
	 * @public
	 */
	getActionMeta(actionName: string):
		| {
				label: string
				handler: string
				requiredFields?: string[]
				allowedStates?: string[]
		  }
		| undefined {
		const workflow = this.workflow
		if (!workflow || !Array.isArray(workflow.states)) return undefined

		// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- Array.isArray(workflow.states) confirms WorkflowMeta format above
		const actions = (workflow as WorkflowMeta).actions
		return actions?.[actionName]
	}

	/**
	 * Converts the registered doctype string to a slug (kebab-case). The following conversions are made:
	 * - It replaces camelCase and PascalCase with kebab-case strings
	 * - It replaces spaces and underscores with hyphens
	 * - It converts the string to lowercase
	 *
	 * @returns The slugified doctype string
	 *
	 * @example
	 * ```ts
	 * const doctype = new Doctype('TaskItem', schema, workflow, actions)
	 * console.log(doctype.slug) // 'task-item'
	 * ```
	 *
	 * @public
	 */
	get slug() {
		return this.doctype
			.replace(/([a-z])([A-Z])/g, '$1-$2')
			.replace(/[\s_]+/g, '-')
			.toLowerCase()
	}
}
