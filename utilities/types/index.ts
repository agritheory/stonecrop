export type KeyboardNavigationOptions = {
	[key in keyof HTMLElementEventMap]?: {
		default?: boolean
		listener?: (this: Element, ev: HTMLElementEventMap[key]) => any
		options?: boolean | AddEventListenerOptions
	}
}
