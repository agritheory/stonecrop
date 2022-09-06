import { ComponentPublicInstance, Ref } from 'vue'

export type KeypressHandlers = {
	[key: string]: (event: KeyboardEvent) => void
}

export type KeyboardHandlerConfig = {
	default?: boolean
	listener?: (this: HTMLElement, ev: FocusEvent | KeyboardEvent) => any
	options?: boolean | AddEventListenerOptions
}

export type KeyboardHandlerOptions = {
	[key in keyof HTMLElementEventMap]?: KeyboardHandlerConfig
}

export type KeyboardNavigationOptions = {
	parent?: string | Element | Ref<Element>
	selectors?: string | Element | Ref<Element> | Ref<Element[]> | Ref<ComponentPublicInstance[]>
	handlers: KeyboardHandlerOptions
}
