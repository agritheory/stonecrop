/**
 * Stonecrop Server Plugin
 *
 * Runs at server startup (Nitro plugin) to:
 * 1. Load doctype definitions from the doctypes/ directory
 * 2. Register built-in action handlers (validation, etc.)
 * 3. Register custom workflow action handlers
 *
 * Action handlers receive (args, context) where args is the array sent by the
 * client — the app's frontend (app/composables/useDoctypes.ts) sends a single
 * `{ id, data? }` object per action — and context.doctype is the DoctypeMeta
 * for the doctype being acted upon. For this in-memory setup, data is imported
 * directly from server/data.ts. In production with PostGraphile, context.pgClient
 * provides an active database connection instead — see:
 * https://stonecrop.io/docs/guides/postgraphile
 */

import { resolve } from 'node:path'
import { clearRegistry, loadDoctypes, registerBuiltinHandlers, registerHandler } from '@stonecrop/graphql-middleware'
import { projects, tasks, type Project, type Task } from '../data'

/** Action argument shape sent by the frontend (see runDoctypeAction in useDoctypes.ts) */
type ActionArgs = [{ id: string; data?: Record<string, unknown> }]

export default defineNitroPlugin(async () => {
	clearRegistry()

	const doctypesDir = resolve(process.cwd(), 'doctypes')
	loadDoctypes(doctypesDir, { continueOnError: true })

	registerBuiltinHandlers()

	// Persist form edits to a Project
	registerHandler('project:save', async (args: unknown[]) => {
		const [{ id, data }] = args as ActionArgs
		const project = projects.get(id)
		if (!project) throw new Error(`Project not found: ${id}`)
		const updated = { ...project, ...data, id } as Project
		projects.set(id, updated)
		return updated
	})

	// Persist form edits to a Task
	registerHandler('task:save', async (args: unknown[]) => {
		const [{ id, data }] = args as ActionArgs
		const task = tasks.get(id)
		if (!task) throw new Error(`Task not found: ${id}`)
		const updated = { ...task, ...data, id } as Task
		tasks.set(id, updated)
		return updated
	})
})
