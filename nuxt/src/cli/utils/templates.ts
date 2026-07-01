/**
 * Template loading for CLI installers
 *
 * Templates live in the package's templates/ directory (shipped via the
 * "files" field in package.json). There is deliberately no inline fallback:
 * a missing template means a broken installation (wrong dist layout or
 * corrupted install), and failing loudly beats scaffolding a silently
 * broken app from stale duplicated content.
 */

import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { join, dirname } from 'pathe'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Load a template file from the package's templates/ directory
 * @throws if the template file cannot be found
 */
export async function loadTemplate(filename: string): Promise<string> {
	// utils/ -> cli/ -> src/ -> package root
	const templatePath = join(__dirname, '..', '..', '..', 'templates', filename)

	if (!existsSync(templatePath)) {
		throw new Error(
			`Template not found: ${templatePath}. ` +
				'The @stonecrop/nuxt package installation appears to be incomplete — try reinstalling.'
		)
	}

	return readFile(templatePath, 'utf-8')
}
