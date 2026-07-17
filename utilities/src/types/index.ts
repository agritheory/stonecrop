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
	// The ref arms are nullable and readonly because that is what `useTemplateRef` hands back — the
	// element does not exist until mount. The composable already guards for it.
	parent?: string | HTMLElement | Readonly<Ref<HTMLElement | null>>
	selectors?:
		| string
		| HTMLElement
		| HTMLElement[]
		| ComponentPublicInstance[]
		| Readonly<Ref<HTMLElement | null>>
		| Readonly<Ref<HTMLElement[] | null>>
		| Readonly<Ref<ComponentPublicInstance[] | null>>
	handlers?: KeypressHandlers
}
