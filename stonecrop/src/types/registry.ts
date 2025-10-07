/**
 * Route context passed to getMeta function
 * @public
 */
export interface RouteContext {
	/** The full route path (e.g., "/todo/1" or "/todo") */
	path: string
	/** Path segments split by "/" (e.g., ["todo", "1"] or ["todo"]) */
	segments: string[]
}
