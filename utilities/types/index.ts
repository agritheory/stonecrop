import { ComponentPublicInstance, Ref } from 'vue'

export type KeyboardHandlerConfig = {
	listener?: (ev: KeyboardEvent) => any
	options?: boolean | AddEventListenerOptions
}

export type KeypressHandlers = {
	[key: string]: KeyboardHandlerConfig
}

export type KeyboardNavigationOptions = {
	parent?: string | Element | Ref<Element>
	selectors?: string | Element | Ref<Element> | Ref<Element[]> | Ref<ComponentPublicInstance[]>
	handlers: KeypressHandlers
}
