import { ComponentPublicInstance, Ref } from 'vue'

/**
 * Key press handlers
 * @public
 */
export type KeypressHandlers = {
	[key: string]: (ev: KeyboardEvent) => any
}

/**
 * Keyboard navigation options
 * @public
 */
export type KeyboardNavigationOptions = {
	parent?: string | HTMLElement | Ref<HTMLElement>
	selectors?:
		| string
		| HTMLElement
		| HTMLElement[]
		| ComponentPublicInstance[]
		| Ref<HTMLElement>
		| Ref<HTMLElement[]>
		| Ref<ComponentPublicInstance[]>
	handlers?: KeypressHandlers
}
