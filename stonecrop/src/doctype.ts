import { Component } from 'vue'

import type { ImmutableDoctype } from './types'

/**
 * Doctype Meta class
 * @public
 */
export default class DoctypeMeta {
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
	 * Creates a new DoctypeMeta instance
	 * @param doctype - The doctype name
	 * @param schema - The doctype schema definition
	 * @param workflow - The doctype workflow configuration (XState machine)
	 * @param actions - The doctype actions and field triggers
	 * @param component - Optional Vue component for rendering the doctype
	 */
	constructor(
		doctype: string,
		schema: ImmutableDoctype['schema'],
		workflow: ImmutableDoctype['workflow'],
		actions: ImmutableDoctype['actions'],
		component?: Component
	) {
		this.doctype = doctype
		this.schema = schema
		this.workflow = workflow
		this.actions = actions
		this.component = component
	}

	/**
	 * Returns the transitions available from a given workflow state, derived from the
	 * doctype's XState workflow configuration.
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
		const states = this.workflow?.states
		if (!states) return []
		const stateConfig = states[currentState]
		if (!stateConfig?.on) return []
		return Object.entries(stateConfig.on).map(([name, target]) => ({
			name,
			targetState: typeof target === 'string' ? target : 'unknown',
		}))
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
	 * const doctype = new DoctypeMeta('TaskItem', schema, workflow, actions
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
