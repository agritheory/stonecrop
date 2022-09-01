import { ComponentPublicInstance, Ref } from 'vue'

export type KeyboardHandlerConfig = {
	default?: boolean
	listener?: (this: Element, ev: HTMLElementEventMap[keyof HTMLElementEventMap]) => any
	options?: boolean | AddEventListenerOptions
}

export type KeyboardHandlerOptions = {
	[key in keyof HTMLElementEventMap]?: KeyboardHandlerConfig
}

export type KeyboardNavigationOptions = {
	selectors: keyof HTMLElementTagNameMap | Element | Ref<Element> | Ref<Element[]> | Ref<ComponentPublicInstance[]>
	handlers: KeyboardHandlerOptions
}
