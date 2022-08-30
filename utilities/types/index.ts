import { ComponentPublicInstance, Ref } from 'vue'

export type KeyboardHandlerOptions = {
	[key in keyof HTMLElementEventMap]?: {
		default?: boolean
		listener?: (this: Element, ev: HTMLElementEventMap[key]) => any
		options?: boolean | AddEventListenerOptions
	}
}

export type KeyboardNavigationOptions = {
	elements: Ref<Element> | Ref<Element[]> | Ref<ComponentPublicInstance[]>
	handlers: KeyboardHandlerOptions
}
