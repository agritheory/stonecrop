/**
 * Resolves the Monaco language identifier from a Stonecrop fieldtype and an
 * optional explicit language override.
 *
 * - JSON fieldtype always maps to 'json' regardless of the explicit language.
 * - Code fieldtype defaults to 'typescript'; the explicit language overrides it.
 * - All other fieldtypes use the explicit language, falling back to 'plaintext'.
 * @public
 */
export function detectLanguage(fieldtype?: string, explicitLanguage?: string): string {
	if (fieldtype === 'JSON') return 'json'
	if (fieldtype === 'Code') return explicitLanguage ?? 'typescript'
	return explicitLanguage ?? 'plaintext'
}
