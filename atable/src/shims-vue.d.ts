declare module '*.vue' {
	import { ComponentOptions } from 'vue'
	const Component: ComponentOptions
	export default Component
}

declare module '*.svg?raw' {
	const content: string
	export default content
}
