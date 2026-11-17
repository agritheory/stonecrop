/**
 * Parse a path string into segments, handling both dot notation and array bracket notation
 * @param path - The path string to parse (e.g., "order.456.line_items[0].product")
 * @returns Array of path segments (e.g., ['order', '456', 'line_items', '0', 'product'])
 */
export function parsePath(path: string): string[] {
	if (!path) return []

	// Replace array bracket notation with dot notation
	// items[0] → items.0
	// items[0][1] → items.0.1
	const normalizedPath = path.replace(/\[(\d+)\]/g, '.$1')

	return normalizedPath.split('.').filter(segment => segment.length > 0)
}
