/**
 * Core HST Interface - enhanced with tree navigation
 * Provides a hierarchical state tree interface for navigating and manipulating nested data structures.
 *
 * @public
 */
export interface HSTNode {
	/**
	 * Gets a value at the specified path
	 * @param path - The dot-separated path to the value
	 * @returns The value at the specified path
	 */
	get(path: string): any

	/**
	 * Sets a value at the specified path
	 * @param path - The dot-separated path where to set the value
	 * @param value - The value to set
	 * @param source - Optional source of the operation (user, system, sync, undo, redo)
	 */
	set(path: string, value: any, source?: 'user' | 'system' | 'sync' | 'undo' | 'redo'): void

	/**
	 * Checks if a value exists at the specified path
	 * @param path - The dot-separated path to check
	 * @returns True if the path exists, false otherwise
	 */
	has(path: string): boolean

	/**
	 * Gets the parent node in the tree hierarchy
	 * @returns The parent HSTNode or null if this is the root
	 */
	getParent(): HSTNode | null

	/**
	 * Gets the root node of the tree
	 * @returns The root HSTNode
	 */
	getRoot(): HSTNode

	/**
	 * Gets the full path from root to this node
	 * @returns The dot-separated path string
	 */
	getPath(): string

	/**
	 * Gets the depth level of this node in the tree
	 * @returns The depth as a number (0 for root)
	 */
	getDepth(): number

	/**
	 * Gets an array of path segments from root to this node
	 * @returns Array of path segments representing breadcrumbs
	 */
	getBreadcrumbs(): string[]

	/**
	 * Gets a child node at the specified relative path
	 * @param path - The relative path to the child node
	 * @returns The child HSTNode
	 */
	getNode(path: string): HSTNode

	/**
	 * Trigger an XState transition with optional context data
	 * @param transition - The transition name (should be uppercase per convention)
	 * @param context - Optional additional FSM context data
	 * @returns Promise resolving to the transition execution results
	 */
	triggerTransition(
		transition: string,
		context?: { currentState?: string; targetState?: string; fsmContext?: Record<string, any> }
	): Promise<any>
}
