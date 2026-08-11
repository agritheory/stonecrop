/**
 * Base type for elements in the Action Set
 * @public
 */
export type BaseElement = {
	label: string
	show?: boolean
}

/**
 * Element actions
 * @public
 */
export type ElementAction = BaseElement & {
	link?: string
	action?: () => void
}

/**
 * Button elements
 * @public
 */
export type ButtonElement = BaseElement &
	ElementAction & {
		type: 'button'
		disabled?: boolean
	}

/**
 * Dropdown elements
 * @public
 */
export type DropdownElement = BaseElement & {
	type: 'dropdown'
	actions: ElementAction[]
}

/**
 * Superset of all element types in the Action Set
 * @public
 */
export type ActionElements = ButtonElement | DropdownElement

/**
 * Navigation target passed to RouteAdapter.navigate and emitted with the 'navigate' event
 * @public
 */
export type NavigationTarget = {
	view: 'doctypes' | 'records' | 'record'
	doctype?: string
	recordId?: string
}

/**
 * Adapter that lets host applications (Nuxt, etc.) supply their own routing layer.
 * When provided as a prop, Desktop uses these functions instead of reaching into
 * the Vue Router instance baked into the Stonecrop registry.
 * @public
 */
export type RouteAdapter = {
	/** Returns the active doctype key (e.g. 'plan', 'recipe'). Called inside computed — should read reactive state. */
	getCurrentDoctype: () => string
	/** Returns the active record ID, or '' when viewing a list. Called inside computed. */
	getCurrentRecordId: () => string
	/** Returns which of the three views is currently active. Called inside computed. */
	getCurrentView: () => 'doctypes' | 'records' | 'record'
	/** Perform the navigation. Called after the host app has handled any side effects. */
	navigate: (target: NavigationTarget) => void | Promise<void>
}

/**
 * Payload emitted with the 'action' event when the user triggers a declared action.
 *
 * Re-exported, not defined here: the shell emits it and `useClientAction` consumes it, and those
 * now live in different packages. It is declared in `@stonecrop/stonecrop` — which this package
 * already depends on — so the two cannot drift. Importing it from `@stonecrop/desktop` still
 * works and is still the natural place for a host to reach for it.
 *
 * @public
 */
export type { ActionEventPayload } from '@stonecrop/stonecrop'

/**
 * Payload emitted with the 'record:open' event
 * @public
 */
export type RecordOpenEventPayload = {
	doctype: string
	recordId: string
}

/**
 * Payload emitted with the 'load-records' event when Desktop needs records for a list view
 * @public
 */
export type LoadRecordsEventPayload = {
	doctype: string
}

/**
 * Payload emitted with the 'load-record' event when Desktop needs a single record
 * @public
 */
export type LoadRecordEventPayload = {
	doctype: string
	recordId: string
}
