import { type Elements, type Element, type XYPosition, Position } from '@vue-flow/core'
import type { AnyStateMachine, AnyStateNodeDefinition, StatesConfig } from 'xstate'

export type EditorStates = {
	[key: string]: Partial<AnyStateMachine | AnyStateNodeDefinition> | StatesConfig<any, any, any>
}

export type FlowElements = Elements<
	{ hasInput?: boolean; hasOutput?: boolean },
	{ hasInput?: boolean; hasOutput?: boolean }
>

export type FlowElement = Element<
	{ hasInput?: boolean; hasOutput?: boolean },
	{ hasInput?: boolean; hasOutput?: boolean }
>

export type Layout = {
	[key: string]: {
		position?: XYPosition
		targetPosition?: Position
		sourcePosition?: Position
	}
}
