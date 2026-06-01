/**
 * Vitest setup file
 * Runs before all test files
 */

// Remove Node.js's native BroadcastChannel to avoid conflicts with mocks
// Tests that need BroadcastChannel will mock it themselves
if (typeof global !== 'undefined' && 'BroadcastChannel' in global) {
	// oxlint-disable-next-line @typescript-eslint/no-unsafe-member-access
	delete (global as any).BroadcastChannel
}

// Also remove from globalThis if it exists there
if (typeof globalThis !== 'undefined' && 'BroadcastChannel' in globalThis) {
	// oxlint-disable-next-line @typescript-eslint/no-unsafe-member-access
	delete (globalThis as any).BroadcastChannel
}
