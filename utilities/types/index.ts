import { ComponentPublicInstance, Ref } from 'vue'

export type KeypressHandlers = {
	[key: string]: (ev: KeyboardEvent) => any
}

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
