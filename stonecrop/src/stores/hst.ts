// Core HST Interface - minimal get/set only
interface HSTNode {
	get(path: string): any
	set(path: string, value: any): void
	has(path: string): boolean
}

// Core HST Proxy Implementation
class HSTProxy implements HSTNode {
	private target: any

	constructor(target: any) {
		this.target = target
	}

	get(path: string): any {
		return this.resolvePath(path)
	}

	set(path: string, value: any): void {
		this.updatePath(path, value)
	}

	has(path: string): boolean {
		try {
			const value = this.resolvePath(path)
			return value !== undefined
		} catch {
			return false
		}
	}

	private resolvePath(path: string): any {
		const segments = this.parsePath(path)
		let current = this.target

		for (const segment of segments) {
			if (current === null || current === undefined) {
				return undefined
			}

			// Handle different store types
			current = this.getProperty(current, segment)
		}

		return current
	}

	private updatePath(path: string, value: any): void {
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
		// Vue reactive object
		if (this.isVueReactive(obj)) {
			return obj[key]
		}

		// Pinia store
		if (this.isPiniaStore(obj)) {
			return obj.$state?.[key] ?? obj[key]
		}

		// Plain object or immutable
		return obj[key]
	}

	private setProperty(obj: any, key: string, value: any): void {
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
		// Check for Vue 3 reactive proxy
		return obj && typeof obj === 'object' && obj.__v_isReactive === true
	}

	private isPiniaStore(obj: any): boolean {
		// Check for Pinia store characteristics
		return obj && typeof obj === 'object' && ('$state' in obj || '$patch' in obj || '$id' in obj)
	}

	private parsePath(path: string): string[] {
		if (!path) return []
		return path.split('.').filter(segment => segment.length > 0)
	}
}

// Factory function
function createHST(target: any): HSTNode {
	return new HSTProxy(target)
}

export { HSTProxy, createHST, type HSTNode }
