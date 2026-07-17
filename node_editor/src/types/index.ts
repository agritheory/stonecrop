import { type Elements, type Element, type XYPosition, Position } from '@vue-flow/core'

/**
 * Flow elements
 * @public
 */
export type FlowElements = Elements<
	{ hasInput?: boolean; hasOutput?: boolean },
	// `actionKey` is the stable action identity carried on an edge, decoupled from its visible
	// `label` (the display name). It lets an edge be relabeled without re-keying the action.
	{ hasInput?: boolean; hasOutput?: boolean; actionKey?: string }
>

/**
 * Flow element
 * @public
 */
export type FlowElement = Element<
	{ hasInput?: boolean; hasOutput?: boolean },
	{ hasInput?: boolean; hasOutput?: boolean; actionKey?: string }
>

/**
 * Node layout
 * @public
 */
export type Layout = {
	[key: string]: {
		position?: XYPosition
		targetPosition?: Position
		sourcePosition?: Position
	}
}
