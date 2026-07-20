// onscan.js ships no typings and has no @types package, so its import was implicitly `any` —
// which also made `onScan` unusable as a type. Declared here against the library's actual public
// surface (v1.5.2); the chainable methods return the singleton itself, which is why `attachTo`
// hands back something you can call `simulate` on.
declare module 'onscan.js' {
	export interface OnScanOptions {
		onScan?: (scanned: string, qty: number) => void
		onScanError?: (debug: { message: string }) => void
		onKeyProcess?: (char: string, event: KeyboardEvent) => void
		onKeyDetect?: (keyCode: number, event: KeyboardEvent) => void
		onPaste?: (pasted: string, event: ClipboardEvent) => void
		keyCodeMapper?: (event: KeyboardEvent) => string | null
		onScanButtonLongPress?: () => void
		scanButtonKeyCode?: number | false
		scanButtonLongPressTime?: number
		timeBeforeScanTest?: number
		avgTimeByChar?: number
		minLength?: number
		suffixKeyCodes?: number[]
		prefixKeyCodes?: number[]
		ignoreIfFocusOn?: boolean | string | Element | Element[]
		stopPropagation?: boolean
		preventDefault?: boolean
		captureEvents?: boolean
		reactToKeydown?: boolean
		reactToPaste?: boolean
		singleScanQty?: number
	}

	export interface OnScan {
		/** Attaches the scanner listeners to `target`. Throws if it is already attached. */
		attachTo(target: EventTarget, options?: OnScanOptions): OnScan
		detachFrom(target: EventTarget): void
		getOptions(target: EventTarget): OnScanOptions
		setOptions(target: EventTarget, options: OnScanOptions): OnScan
		/** Feeds a scan through as if a scanner produced it. */
		simulate(target: EventTarget, code: string | number[]): OnScan
		isScanInProgressFor(target: EventTarget): boolean
		isAttachedTo(target: EventTarget): boolean
		decodeKeyEvent(event: KeyboardEvent): string | null
	}

	const onScan: OnScan
	export default onScan
}
