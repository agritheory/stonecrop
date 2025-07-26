// Core HST Interface - enhanced with tree navigation
interface HSTNode {
	get(path: string): any
	set(path: string, value: any): void
	has(path: string): boolean

	// Tree navigation
	getParent(): HSTNode | null
	getRoot(): HSTNode
	getPath(): string
	getDepth(): number
	getBreadcrumbs(): string[]
}

// Global HST Manager (Singleton)
class HST {
	private static instance: HST

	static getInstance(): HST {
		if (!HST.instance) {
			HST.instance = new HST()
		}
		return HST.instance
	}

	getRegistry(): any {
		// In test environment, try different ways to access Registry
		// First, try the global Registry if it exists
		if (typeof globalThis !== 'undefined' && (globalThis as any).Registry?._root) {
			return (globalThis as any).Registry._root
		}

		// Try to access through window (browser environment)
		if (typeof window !== 'undefined' && (window as any).Registry?._root) {
			return (window as any).Registry._root
		}

		// Try to access through global (Node environment)
		if (typeof global !== 'undefined' && (global as any).Registry?._root) {
			return (global as any).Registry._root
		}

		// If we can't find it globally, it might not be set up
		// This is expected in test environments where Registry is created locally
		return undefined
	}

	// Helper method to get doctype metadata
	getDoctypeMeta(doctype: string) {
		const registry = this.getRegistry()
		return registry?.registry[doctype]
	}
}

// Enhanced HST Proxy with tree navigation
class HSTProxy implements HSTNode {
	private target: any
	private parentPath: string
	private rootNode: HSTNode | null
	private doctype: string
	private parentDoctype?: string
	private hst: HST

	constructor(target: any, doctype: string, parentPath = '', rootNode: HSTNode | null = null, parentDoctype?: string) {
		this.target = target
		this.parentPath = parentPath
		this.rootNode = rootNode || this
		this.doctype = doctype
		this.parentDoctype = parentDoctype
		this.hst = HST.getInstance()

		return new Proxy(this, {
			get(hst, prop) {
				// Return HST methods directly
				if (prop in hst) return hst[prop]

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

		// Always wrap in HSTProxy for tree navigation
		if (typeof value === 'object' && value !== null && !this.isPrimitive(value)) {
			return new HSTProxy(value, this.doctype, fullPath, this.rootNode, this.parentDoctype)
		}

		// For primitives, return a minimal wrapper that throws on tree operations
		return new HSTProxy(value, this.doctype, fullPath, this.rootNode, this.parentDoctype)
	}

	set(path: string, value: any): void {
		this.updateValue(path, value)
	}

	has(path: string): boolean {
		try {
			// Handle empty path case
			if (path === '') {
				return true // empty path refers to the root object
			}

			const segments = this.parsePath(path)
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
	getParent(): HSTNode | null {
		if (!this.parentPath) return null

		const parentSegments = this.parentPath.split('.').slice(0, -1)
		const parentPath = parentSegments.join('.')

		if (parentPath === '') {
			return this.rootNode
		}

		// Return a wrapped node, not raw data
		return this.rootNode!.getNode(parentPath)
	}

	getRoot(): HSTNode {
		return this.rootNode!
	}

	getPath(): string {
		return this.parentPath
	}

	getDepth(): number {
		return this.parentPath ? this.parentPath.split('.').length : 0
	}

	getBreadcrumbs(): string[] {
		return this.parentPath ? this.parentPath.split('.') : []
	}

	// Private helper methods
	private resolvePath(path: string): string {
		if (path === '') return this.parentPath
		return this.parentPath ? `${this.parentPath}.${path}` : path
	}

	private resolveValue(path: string): any {
		// Handle empty path - return the target object
		if (path === '') {
			return this.target
		}

		const segments = this.parsePath(path)
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

		const segments = this.parsePath(path)
		const lastSegment = segments.pop()!
		let current = this.target

		// Navigate to parent object
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

	private isVueReactive(obj: any): boolean {
		return obj && typeof obj === 'object' && obj.__v_isReactive === true
	}

	private isPiniaStore(obj: any): boolean {
		return obj && typeof obj === 'object' && ('$state' in obj || '$patch' in obj || '$id' in obj)
	}

	private isImmutable(obj: any): boolean {
		if (!obj || typeof obj !== 'object') {
			return false
		}

		const hasGetMethod = typeof obj.get === 'function'
		const hasSetMethod = typeof obj.set === 'function'
		const hasHasMethod = typeof obj.has === 'function'

		const hasImmutableMarkers =
			obj.__ownerID !== undefined ||
			obj._map !== undefined ||
			obj._list !== undefined ||
			obj._origin !== undefined ||
			obj._capacity !== undefined ||
			obj._defaultValues !== undefined ||
			obj._tail !== undefined ||
			obj._root !== undefined ||
			(obj.size !== undefined && hasGetMethod && hasSetMethod)

		const constructorName = obj.constructor?.name
		const isImmutableConstructor =
			constructorName &&
			(constructorName.includes('Map') ||
				constructorName.includes('List') ||
				constructorName.includes('Set') ||
				constructorName.includes('Stack') ||
				constructorName.includes('Seq')) &&
			(hasGetMethod || hasSetMethod)

		return (
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

	private parsePath(path: string): string[] {
		if (!path) return []
		return path.split('.').filter(segment => segment.length > 0)
	}
}

// Factory function for HST creation
function createHST(target: any, doctype: string, parentDoctype?: string): HSTNode {
	return new HSTProxy(target, doctype, '', null, parentDoctype)
}

// Export everything
export { HSTProxy, HST, createHST, type HSTNode }
