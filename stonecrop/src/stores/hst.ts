import { effectScope, isReactive, reactive, ReactiveEffect, toRaw, type DebuggerEvent } from 'vue'

import { noRecord, recordInStore } from '../record-access'
import { getGlobalTriggerEngine } from '../field-triggers'
import { useOperationLogStore } from './operation-log'
import { parsePath } from './path'
import type { FieldChangeContext, TransitionChangeContext } from '../types/field-triggers'
import type { HSTNode } from '../types/hst'

/**
 * Get the operation log store if available
 */
function getOperationLogStore() {
	try {
		return useOperationLogStore()
	} catch {
		// Operation log is optional
		return null
	}
}

// How many `set()` calls are writing into the store right now. A change the store's reactive state
// reports while this is 0 was made by writing straight into an object read from the store.
let writesThroughSet = 0

// The bundler's environment, as Node and bundlers name it; this package does not depend on Node's types.
declare const process: { env: Record<string, string | undefined> }

// Written as `process.env.NODE_ENV` so the app's bundler replaces it; where nothing does and there is no
// `process`, the warning stays off.
const isDevelopment = () => {
	try {
		return process.env.NODE_ENV !== 'production'
	} catch {
		return false
	}
}

// The dot path from `root` to `target`, or undefined if `target` is not inside `root`.
function pathTo(root: unknown, target: object, seen = new Set<object>()): string[] | undefined {
	if (root === target) return []
	if (root === null || typeof root !== 'object' || seen.has(root)) return undefined
	seen.add(root)
	for (const [key, value] of Object.entries(root)) {
		const rest = pathTo(toRaw(value), target, seen)
		if (rest) return [key, ...rest]
	}
	return undefined
}

// Only plain objects and arrays are walked: those are what records and their rows are made of.
function isPlainContainer(value: unknown): value is Record<string, unknown> {
	if (value === null || typeof value !== 'object') return false
	return (
		Array.isArray(value) || Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null
	)
}

/**
 * Warns the developer, outside production, when a value in `store` changes without going through
 * {@link HSTNode.set}: a component or app code wrote straight into an object it read from the store.
 * The write is let through, but the operation log never hears of it, so Undo skips it and reverses the
 * change made before it.
 *
 * A deep `watch` would walk the whole store again after every change, so each edit would get slower the
 * more records the store holds. Instead, each key in the store is read once, by an effect that is never
 * re-run: it stays subscribed to what it read, so a later write to that key reaches `onTrigger` without
 * any walk. After a change, only the object that changed is looked at again, to start tracking keys and
 * objects it did not have before. Each key is tracked by exactly one effect, so a write warns once.
 *
 * The effects live in their own detached scope: the store outlives the component that happened to build
 * Stonecrop, and the warning must not stop when that component unmounts.
 */
function warnOnWritesOutsideSet(store: object): void {
	const root = toRaw(store)
	// For each object already tracked, the keys whose values have been read inside an effect.
	const trackedKeys = new WeakMap<object, Set<string>>()
	// Objects that changed since their effect last ran its scheduler, to look at for new keys.
	const changed = new Set<object>()
	const scope = effectScope(true)
	// Whether the effect running now has read anything new, so an effect that read nothing can be dropped.
	let readSomething = false

	const onTrigger = (event: DebuggerEvent) => {
		changed.add(event.target)
		if (writesThroughSet > 0) return
		const owner = pathTo(root, event.target)
		// A write into an object no longer in the store changes nothing the store holds.
		if (!owner) return
		const key = typeof event.key === 'symbol' ? undefined : String(event.key)
		const path = [...owner, ...(key === undefined ? [] : [key])].join('.') || '(store)'
		console.warn(
			`[Stonecrop] ${path} was changed by writing straight into an object read from the store, so the ` +
				'operation log did not record it and Undo will skip it. Make the change through useStonecrop ' +
				"(handleHSTChange) or the store's set() instead."
		)
	}

	// Reads, through the reactive proxy, every key of `raw` (and of the objects under it) not read before.
	// Run inside an effect, so the effect subscribes to exactly those keys.
	const visit = (raw: Record<string, unknown>) => {
		const proxy = reactive(raw)
		let keys = trackedKeys.get(raw)
		if (!keys) {
			keys = new Set()
			trackedKeys.set(raw, keys)
			readSomething = true
			// Subscribes to keys being added or removed (an array's length).
			Object.keys(proxy)
		}
		for (const key of Object.keys(raw)) {
			let value: unknown
			if (keys.has(key)) {
				value = raw[key]
			} else {
				keys.add(key)
				readSomething = true
				value = toRaw(proxy[key])
			}
			if (isPlainContainer(value) && !trackedKeys.has(value)) visit(value)
		}
	}

	const track = (targets: object[]) => {
		scope.run(() => {
			const effect = new ReactiveEffect(() => targets.forEach(target => isPlainContainer(target) && visit(target)))
			effect.onTrigger = onTrigger
			// Never re-run, so the effect keeps its subscriptions; only look at what changed.
			effect.scheduler = flush
			readSomething = false
			effect.run()
			// Nothing new was read: drop the effect rather than keep an empty one.
			if (!readSomething) effect.stop()
		})
	}

	function flush() {
		if (changed.size === 0) return
		const targets = [...changed]
		changed.clear()
		track(targets)
	}

	track([root])
}

// Type definitions for global Registry
interface RegistryGlobal {
	Registry?: {
		_root?: {
			registry: Record<string, any>
		}
	}
}

// Interface for Immutable-like objects
interface ImmutableLike {
	get(key: string): any
	set(key: string, value: any): ImmutableLike
	has(key: string): boolean
	size?: number
	__ownerID?: any
	_map?: any
	_list?: any
	_origin?: any
	_capacity?: any
	_defaultValues?: any
	_tail?: any
	_root?: any
}

// Interface for Vue reactive objects
interface VueReactive {
	__v_isReactive: boolean
	[key: string]: any
}

// Interface for Pinia stores
interface PiniaStore {
	$state?: Record<string, any>
	$patch?: (partial: Record<string, any>) => void
	$id?: string
	[key: string]: any
}

// Extend global interfaces
declare global {
	interface Window extends RegistryGlobal {}
	const global: RegistryGlobal | undefined
}

/**
 * Global HST Manager (Singleton)
 * Manages hierarchical state trees and provides access to the global registry.
 *
 * @public
 */
class HST {
	private static instance: HST

	/**
	 * Gets the singleton instance of HST
	 * @returns The HST singleton instance
	 */
	static getInstance(): HST {
		if (!HST.instance) {
			HST.instance = new HST()
		}
		return HST.instance
	}

	/**
	 * Gets the global registry instance
	 * @returns The global registry object or undefined if not found
	 */
	getRegistry(): any {
		// In test environment, try different ways to access Registry
		// First, try the global Registry if it exists
		if (typeof globalThis !== 'undefined') {
			// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- Window interface extended with RegistryGlobal in declare global above; no other way to access globalThis properties
			const globalRegistry = (globalThis as unknown as RegistryGlobal).Registry?._root
			if (globalRegistry) {
				return globalRegistry
			}
		}

		// Try to access through window (browser environment)
		if (typeof window !== 'undefined') {
			const windowRegistry = window.Registry?._root
			if (windowRegistry) {
				return windowRegistry
			}
		}

		// Try to access through global (Node environment)
		if (typeof global !== 'undefined' && global) {
			const nodeRegistry = global.Registry?._root
			if (nodeRegistry) {
				return nodeRegistry
			}
		}

		// If we can't find it globally, it might not be set up
		// This is expected in test environments where Registry is created locally
		return undefined
	}

	/**
	 * Helper method to get doctype metadata from the registry
	 * @param doctype - The name of the doctype to retrieve metadata for
	 * @returns The doctype metadata object or undefined if not found
	 */
	getDoctypeMeta(doctype: string) {
		const registry = this.getRegistry()
		if (registry && typeof registry === 'object' && 'registry' in registry) {
			return registry.registry[doctype]
		}
		return undefined
	}
}

// Enhanced HST Proxy with tree navigation
class HSTProxy implements HSTNode {
	private target: any
	private ancestorPath: string
	private rootNode: HSTNode | null
	private doctype: string
	private hst: HST

	constructor(target: any, doctype: string, ancestorPath = '', rootNode: HSTNode | null = null) {
		this.target = target
		this.ancestorPath = ancestorPath
		this.rootNode = rootNode || this
		this.doctype = doctype
		this.hst = HST.getInstance()

		return new Proxy(this, {
			get(hst, prop) {
				// Return HST methods directly
				if (prop in hst) return Reflect.get(hst, prop)

				// Handle property access - return tree nodes for navigation
				const path = String(prop)
				return hst.getNode(path)
			},

			set(hst, prop, value) {
				const path = String(prop)
				hst.set(path, value)
				return true
			},
		})
	}

	get(path: string): any {
		return this.resolveValue(path)
	}

	// Method to get a tree-wrapped node for navigation
	getNode(path: string): HSTNode {
		const fullPath = this.resolvePath(path)
		const value = this.resolveValue(path)

		// Determine the correct doctype for this node based on the path
		const pathSegments = fullPath.split('.')
		let nodeDoctype = this.doctype

		// If we're at the root level and this is a StonecropStore, use the first path segment as the doctype
		if (this.doctype === 'StonecropStore' && pathSegments.length >= 1) {
			nodeDoctype = pathSegments[0]
		}

		// Always wrap in HSTProxy for tree navigation
		if (typeof value === 'object' && value !== null && !this.isPrimitive(value)) {
			return new HSTProxy(value, nodeDoctype, fullPath, this.rootNode)
		}

		// For primitives, return a minimal wrapper that throws on tree operations
		return new HSTProxy(value, nodeDoctype, fullPath, this.rootNode)
	}

	set(path: string, value: any, source: 'user' | 'system' | 'sync' | 'undo' | 'redo' = 'user'): void {
		// Get current value for change context
		const fullPath = this.resolvePath(path)
		if (fullPath === undefined) {
			console.warn('HST.set: resolved path is undefined, skipping operation')
			return
		}
		const beforeValue = this.has(path) ? this.get(path) : undefined

		// Log operation if not from undo/redo and store is available
		if (source !== 'undo' && source !== 'redo') {
			const logStore = getOperationLogStore()
			if (logStore && typeof logStore.addOperation === 'function') {
				const pathSegments = fullPath.split('.')
				const doctype = this.doctype === 'StonecropStore' && pathSegments.length >= 1 ? pathSegments[0] : this.doctype
				const recordId = pathSegments.length >= 2 ? pathSegments[1] : undefined
				const fieldname = pathSegments.slice(2).join('.') || pathSegments[pathSegments.length - 1]

				// Detect if this is a DELETE operation (setting to undefined when a value existed)
				const isDelete = value === undefined && beforeValue !== undefined
				const operationType: 'set' | 'delete' = isDelete ? 'delete' : 'set'

				logStore.addOperation(
					{
						type: operationType,
						path: fullPath,
						fieldname,
						beforeValue,
						afterValue: value,
						doctype,
						recordId,
						reversible: true, // Default to reversible, can be changed by field triggers
					},
					source
				)
			}
		}

		// Update the value
		writesThroughSet++
		try {
			this.updateValue(path, value)
		} finally {
			writesThroughSet--
		}

		// Trigger field actions asynchronously (don't block the set operation)
		void this.triggerFieldActions(fullPath, beforeValue, value)
	}

	has(path: string): boolean {
		try {
			// Handle empty path case
			if (path === '') {
				return true // empty path refers to the root object
			}

			const segments = parsePath(path)
			let current = this.target

			for (let i = 0; i < segments.length; i++) {
				const segment = segments[i]

				if (current === null || current === undefined) {
					return false
				}

				// Check if this is the last segment
				if (i === segments.length - 1) {
					// For the final property, check if it exists
					if (this.isImmutable(current)) {
						return current.has(segment)
					} else if (this.isPiniaStore(current)) {
						return (current.$state && segment in current.$state) || segment in current
					} else {
						return segment in current
					}
				}

				// Navigate to the next level
				current = this.getProperty(current, segment)
			}

			return false
		} catch {
			return false
		}
	}

	// Tree navigation methods
	getAncestor(): HSTNode | null {
		if (!this.ancestorPath) return null

		const ancestorSegments = this.ancestorPath.split('.').slice(0, -1)
		const ancestorPath = ancestorSegments.join('.')

		if (ancestorPath === '') {
			return this.rootNode
		}

		// Return a wrapped node, not raw data
		return this.rootNode!.getNode(ancestorPath)
	}

	getRoot(): HSTNode {
		return this.rootNode!
	}

	getPath(): string {
		return this.ancestorPath
	}

	getDepth(): number {
		return this.ancestorPath ? this.ancestorPath.split('.').length : 0
	}

	getBreadcrumbs(): string[] {
		return this.ancestorPath ? this.ancestorPath.split('.') : []
	}

	/**
	 * Trigger an XState transition with optional context data
	 */
	async triggerTransition(
		transition: string,
		context?: { currentState?: string; targetState?: string; fsmContext?: Record<string, any> }
	): Promise<any> {
		const triggerEngine = getGlobalTriggerEngine()

		// Determine doctype and recordId from the current path
		const pathSegments = this.ancestorPath.split('.')
		let doctype = this.doctype
		let recordId: string | undefined

		// If we're at the root level and this is a StonecropStore, use the first path segment as the doctype
		if (this.doctype === 'StonecropStore' && pathSegments.length >= 1) {
			doctype = pathSegments[0]
		}

		// Extract recordId from path if it follows the expected pattern
		if (pathSegments.length >= 2) {
			recordId = pathSegments[1]
		}

		// Build transition context
		const transitionContext: TransitionChangeContext = {
			path: this.ancestorPath,
			fieldname: '', // No specific field for transitions
			beforeValue: undefined,
			afterValue: undefined,
			operation: 'set',
			doctype,
			recordId,
			timestamp: new Date(),
			store: this.rootNode || undefined,
			...(recordId
				? recordInStore(this.rootNode ?? this, pathSegments.slice(0, 2).join('.'))
				: noRecord(`Transition "${transition}" was triggered above any record, so it has no record to read or set`)),
			transition,
			currentState: context?.currentState,
			targetState: context?.targetState,
			fsmContext: context?.fsmContext,
		}

		// Log FSM transition operation
		const logStore = getOperationLogStore()
		if (logStore && typeof logStore.addOperation === 'function') {
			logStore.addOperation(
				{
					type: 'transition' as const,
					path: this.ancestorPath,
					fieldname: transition,
					beforeValue: context?.currentState,
					afterValue: context?.targetState,
					doctype,
					recordId,
					reversible: false, // FSM transitions are generally not reversible
					metadata: {
						transition,
						currentState: context?.currentState,
						targetState: context?.targetState,
						fsmContext: context?.fsmContext,
					},
				},
				'user'
			)
		}

		// Execute transition actions
		return await triggerEngine.executeTransitionActions(transitionContext)
	}

	// Private helper methods
	private resolvePath(path: string): string {
		if (path === '') return this.ancestorPath ?? ''
		return this.ancestorPath ? `${this.ancestorPath}.${path}` : path
	}

	private resolveValue(path: string): any {
		// Handle empty path - return the target object
		if (path === '') {
			return this.target
		}

		const segments = parsePath(path)
		let current = this.target

		for (const segment of segments) {
			if (current === null || current === undefined) {
				return undefined
			}

			current = this.getProperty(current, segment)
		}

		return current
	}

	private updateValue(path: string, value: any): void {
		// Handle empty path case - should throw error
		if (path === '') {
			throw new Error('Cannot set value on empty path')
		}

		const segments = parsePath(path)
		const lastSegment = segments.pop()!
		let current = this.target

		// Navigate to ancestor object
		for (const segment of segments) {
			current = this.getProperty(current, segment)
			if (current === null || current === undefined) {
				throw new Error(`Cannot set property on null/undefined path: ${path}`)
			}
		}

		// Set the final property
		this.setProperty(current, lastSegment, value)
	}

	private getProperty(obj: any, key: string): any {
		// Immutable objects
		if (this.isImmutable(obj)) {
			return obj.get(key)
		}

		// Vue reactive object
		if (this.isVueReactive(obj)) {
			return obj[key]
		}

		// Pinia store
		if (this.isPiniaStore(obj)) {
			return obj.$state?.[key] ?? obj[key]
		}

		// Plain object
		return obj[key]
	}

	private setProperty(obj: any, key: string, value: any): void {
		// Immutable objects
		if (this.isImmutable(obj)) {
			throw new Error('Cannot directly mutate immutable objects. Use immutable update methods instead.')
		}

		// Pinia store
		if (this.isPiniaStore(obj)) {
			if (obj.$patch) {
				obj.$patch({ [key]: value })
			} else {
				obj[key] = value
			}
			return
		}

		// Vue reactive or plain object
		obj[key] = value
	}

	private async triggerFieldActions(fullPath: string, beforeValue: any, afterValue: any): Promise<void> {
		try {
			// Guard against undefined or null fullPath
			if (!fullPath || typeof fullPath !== 'string') {
				return
			}

			// Skip triggering when the value did not actually change
			if (Object.is(beforeValue, afterValue)) {
				return
			}

			const pathSegments = fullPath.split('.')

			// Only trigger field actions for actual field changes (at least 3 levels deep: doctype.recordId.fieldname)
			// Skip triggering for doctype-level or record-level changes
			if (pathSegments.length < 3) {
				return
			}

			const triggerEngine = getGlobalTriggerEngine()
			const fieldname = pathSegments.slice(2).join('.') || pathSegments[pathSegments.length - 1]

			// Determine the correct doctype for this path using the same logic as getNode()
			// The path should be in format: "doctype.recordId.fieldname"
			let doctype = this.doctype

			// If we're at the root level and this is a StonecropStore, use the first path segment as the doctype
			if (this.doctype === 'StonecropStore' && pathSegments.length >= 1) {
				doctype = pathSegments[0]
			}

			let recordId: string | undefined

			// Extract recordId from path if it follows the expected pattern
			if (pathSegments.length >= 2) {
				recordId = pathSegments[1]
			}

			const context: FieldChangeContext = {
				path: fullPath,
				fieldname,
				beforeValue,
				afterValue,
				operation: 'set',
				doctype,
				recordId,
				timestamp: new Date(),
				store: this.rootNode || undefined, // Pass the root store for snapshot/rollback capabilities
				...recordInStore(this.rootNode ?? this, pathSegments.slice(0, 2).join('.')),
			}

			await triggerEngine.executeFieldTriggers(context)
		} catch (error) {
			// Silently handle trigger errors to not break the main flow
			// In production, you might want to log this error
			if (error instanceof Error) {
				console.warn('Field trigger error:', error.message)
				// Optional: emit an event or call error handler
			}
		}
	}
	private isVueReactive(obj: any): obj is VueReactive {
		return obj && typeof obj === 'object' && '__v_isReactive' in obj && obj.__v_isReactive === true
	}

	private isPiniaStore(obj: any): obj is PiniaStore {
		return obj && typeof obj === 'object' && ('$state' in obj || '$patch' in obj || '$id' in obj)
	}

	private isImmutable(obj: any): obj is ImmutableLike {
		if (!obj || typeof obj !== 'object') {
			return false
		}

		const hasGetMethod = 'get' in obj && typeof obj.get === 'function'
		const hasSetMethod = 'set' in obj && typeof obj.set === 'function'
		const hasHasMethod = 'has' in obj && typeof obj.has === 'function'

		const hasImmutableMarkers =
			'__ownerID' in obj ||
			'_map' in obj ||
			'_list' in obj ||
			'_origin' in obj ||
			'_capacity' in obj ||
			'_defaultValues' in obj ||
			'_tail' in obj ||
			'_root' in obj ||
			('size' in obj && hasGetMethod && hasSetMethod)

		let constructorName: string | undefined
		try {
			if ('constructor' in obj && obj.constructor && typeof obj.constructor === 'object' && 'name' in obj.constructor) {
				// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- obj.constructor.name accessed after 'name' in check; obj is any throughout this method
				const nameValue = (obj.constructor as { name: unknown }).name
				constructorName = typeof nameValue === 'string' ? nameValue : undefined
			}
		} catch {
			constructorName = undefined
		}

		const isImmutableConstructor =
			constructorName &&
			(constructorName.includes('Map') ||
				constructorName.includes('List') ||
				constructorName.includes('Set') ||
				constructorName.includes('Stack') ||
				constructorName.includes('Seq')) &&
			(hasGetMethod || hasSetMethod)

		return Boolean(
			(hasGetMethod && hasSetMethod && hasHasMethod && hasImmutableMarkers) ||
			(hasGetMethod && hasSetMethod && isImmutableConstructor)
		)
	}

	private isPrimitive(value: any): boolean {
		// Don't wrap primitive values, functions, or null/undefined
		return (
			value === null ||
			value === undefined ||
			typeof value === 'string' ||
			typeof value === 'number' ||
			typeof value === 'boolean' ||
			typeof value === 'function' ||
			typeof value === 'symbol' ||
			typeof value === 'bigint'
		)
	}
}

/**
 * Factory function for HST creation
 * Creates a new HSTNode proxy for hierarchical state tree navigation.
 *
 * @param target - The target object to wrap with HST functionality
 * @param doctype - The document type identifier
 * @returns A new HSTNode proxy instance
 *
 * @public
 */
function createHST(target: any, doctype: string): HSTNode {
	if (isDevelopment() && isReactive(target)) warnOnWritesOutsideSet(target)
	return new HSTProxy(target, doctype, '', null)
}

// Export everything
export { HSTProxy, HST, createHST, type HSTNode }
