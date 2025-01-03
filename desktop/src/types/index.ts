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
