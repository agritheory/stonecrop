import { ComponentPublicInstance, Ref } from 'vue'

export type KeypressHandlers = {
	[key: string]: (ev: KeyboardEvent) => any
}

export type KeyboardNavigationOptions = {
	parent?: string | Element | Ref<Element>
	selectors?: string | Element | Ref<Element> | Ref<Element[]> | Ref<ComponentPublicInstance[]>
	handlers?: KeypressHandlers
}
