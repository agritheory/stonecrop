import type { DoctypeField, LinkDeclaration, TriggerDefinition, WorkflowMeta } from '@stonecrop/schema'
import { getPrimaryKeyField, getRecordIdentity, isActionAllowedInState, normalizeFieldKind } from '@stonecrop/schema'
import { List } from 'immutable'
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
	 * @param component - Optional Vue component for rendering the doctype
	 * @param links - Optional relationship links to other doctypes
	 */
	constructor(
		doctype: string,
		schema: ImmutableDoctype['schema'],
		workflow: ImmutableDoctype['workflow'],
		component?: Component,
		links?: Record<string, LinkDeclaration>
	) {
		this.doctype = doctype
		this.schema = schema
		this.workflow = workflow
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
	 *     { fieldname: 'title', label: 'Title', component: 'ATextInput' },
	 *     { fieldname: 'status', label: 'Status', component: 'ATextInput' },
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
		// Authored JSON may omit the `kind` discriminant; the Zod schema injects it via a
		// preprocess, but this path bypasses Zod. Normalize here so the registry's
		// `resolveFields` (which gates link/fieldset handling on `field.kind`) sees the same
		// shape a parsed doctype would — otherwise links silently fail to expand.
		// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- normalizeFieldKind only injects the `kind` discriminant; the field shape is otherwise preserved
		const fields = config.fields?.map(normalizeFieldKind) as DoctypeField[] | undefined
		const schema = fields ? List(fields) : List<DoctypeField>()

		return new Doctype(config.name, schema, config.workflow, undefined, config.links)
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
	 * Resolve a record's identity using this doctype's declared `primaryKey`, falling back to `id`.
	 *
	 * Lives here rather than at the call site because the doctype owns its schema — and because the
	 * rule must match the server's, which builds its SQL identity predicate from the same declared
	 * field via `@stonecrop/schema`'s `getPrimaryKeyField`.
	 *
	 * @param record - the record to read the identity from
	 * @returns the identity as a string, or `undefined` when neither the declared key nor `id` yields one
	 *
	 * @public
	 */
	getRecordId(record: Record<string, unknown>): string | undefined {
		return getRecordIdentity(this.getSchemaArray(), record)
	}

	/**
	 * The field a record of this doctype is identified by: the declared `primaryKey`, or `id`
	 * when nothing is declared.
	 *
	 * The client-side twin of the adapters' `recordLookupField`. Both resolve through
	 * `@stonecrop/schema`'s `getPrimaryKeyField`, so the field a caller reads an identity out of
	 * is the same field the adapter builds its lookup predicate on.
	 *
	 * Use this to ask whether a record *states* its own identity. `getRecordId` deliberately
	 * falls back to `id` when the declared key is missing, which is right for resolving a link
	 * from a record already in hand and wrong for deciding whether a server response settled on
	 * a new identity: a response that omits a natural key would resolve through that fallback to
	 * a surrogate the adapter cannot look up.
	 *
	 * @returns The identifying fieldname
	 *
	 * @public
	 */
	get recordIdField(): string {
		return getPrimaryKeyField(this.getSchemaArray())?.fieldname ?? 'id'
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

			return (
				Object.entries(actions)
					// Exclude stateless Commands — they change no state and are surfaced separately
					// via getAvailableCommands(). Genuine transitions carry a nextState.
					.filter(([, actionDef]) => !actionDef.stateless && isActionAllowedInState(actionDef, currentState))
					.map(([name, actionDef]) => ({
						name,
						targetState: actionDef.nextState ?? currentState,
					}))
			)
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
	 * Returns the stateless **Commands** available in a given workflow state — side-effect
	 * actions (save/print/email…) that do not change workflow state. Unlike transitions,
	 * Commands may exist on a workflow that declares no `states` (a commands-only doctype),
	 * and a Command with no `allowedStates` is available in every state.
	 *
	 * Only meaningful for WorkflowMeta format; XState workflows have no Commands.
	 *
	 * @param currentState - The record's current state, used to honor a Command's `allowedStates`
	 * @returns Array of command descriptors with `name`
	 *
	 * @example
	 * ```ts
	 * const commands = doctype.getAvailableCommands('Draft')
	 * // [{ name: 'Print' }]
	 * ```
	 *
	 * @public
	 */
	getAvailableCommands(currentState?: string): Array<{ name: string }> {
		const workflow = this.workflow
		if (!workflow) return []

		// Only WorkflowMeta carries an `actions` map; XState workflows have no Commands.
		// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- probing the workflow union for the optional WorkflowMeta actions map
		const actions = (workflow as WorkflowMeta).actions
		if (!actions) return []

		return Object.entries(actions)
			.filter(([, actionDef]) => actionDef.stateless === true && isActionAllowedInState(actionDef, currentState ?? ''))
			.map(([name]) => ({ name }))
	}

	/**
	 * Returns the field-validation **triggers** declared on this doctype's workflow (advisory,
	 * client-side). Keyed by trigger name. Returns undefined when the workflow is absent, is an
	 * XState machine (no triggers), or simply declares none.
	 *
	 * @returns The `workflow.triggers` map, or undefined
	 *
	 * @example
	 * ```ts
	 * const triggers = doctype.getTriggers()
	 * // { dateOrder: { on: ['start_date', 'end_date'], clientHandler: '…' } }
	 * ```
	 *
	 * @public
	 */
	getTriggers(): Record<string, TriggerDefinition> | undefined {
		const workflow = this.workflow
		if (!workflow) return undefined

		// Only WorkflowMeta carries a `triggers` map; XState workflows have none.
		// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- probing the workflow union for the optional WorkflowMeta triggers map
		return (workflow as WorkflowMeta).triggers
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
	 * // { label: 'Submit', allowedStates: ['draft'] }
	 * ```
	 *
	 * @public
	 */
	getActionMeta(actionName: string):
		| {
				label: string
				requiredFields?: string[]
				allowedStates?: string[]
		  }
		| undefined {
		const workflow = this.workflow
		if (!workflow) return undefined

		// Only WorkflowMeta carries an `actions` map (with labels); XState workflows have none.
		// Don't require a `states` array — a commands-only doctype has labeled actions but no states.
		// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- probing the workflow union for the optional WorkflowMeta actions map
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
