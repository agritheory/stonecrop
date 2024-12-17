import { type Elements, type Element, type XYPosition, Position } from '@vue-flow/core'
import type { AnyStateMachine, AnyStateNodeDefinition, StatesConfig } from 'xstate'

/**
 * Editor states
 * @public
 */
export type EditorStates = {
	[key: string]: AnyStateMachine | AnyStateNodeDefinition | StatesConfig<any, any, any>
}

/**
 * Flow elements
 * @public
 */
export type FlowElements = Elements<
	{ hasInput?: boolean; hasOutput?: boolean },
	{ hasInput?: boolean; hasOutput?: boolean }
>

/**
 * Flow element
 * @public
 */
export type FlowElement = Element<
	{ hasInput?: boolean; hasOutput?: boolean },
	{ hasInput?: boolean; hasOutput?: boolean }
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
