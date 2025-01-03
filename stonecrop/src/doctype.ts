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
	 * The doctype actions
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
	// TODO: allow different components for different views; probably
	// should be defined in the schema instead?

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
	 * Converts the registered doctype to a slug (kebab-case)
	 * @returns The slugified doctype string
	 * @public
	 */
	get slug() {
		return this.doctype
			.replace(/([a-z])([A-Z])/g, '$1-$2')
			.replace(/[\s_]+/g, '-')
			.toLowerCase()
	}
}
