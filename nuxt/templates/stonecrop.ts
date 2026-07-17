/**
 * Stonecrop Server Plugin
 *
 * Runs at server startup (Nitro plugin) to load doctype definitions from the
 * doctypes/ directory into the middleware registry.
 */

import { resolve } from 'node:path'
import { clearRegistry, loadDoctypes } from '@stonecrop/graphql-middleware'

export default defineNitroPlugin(async () => {
	clearRegistry()

	const doctypesDir = resolve(process.cwd(), 'doctypes')
	loadDoctypes(doctypesDir, { continueOnError: true })
})
