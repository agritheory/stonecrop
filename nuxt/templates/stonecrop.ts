/**
 * Stonecrop Server Plugin
 *
 * Runs at server startup (Nitro plugin) to:
 * 1. Load doctype definitions from the doctypes/ directory
 * 2. Register built-in action handlers (save, etc.)
 * 3. Register custom workflow action handlers
 *
 * Action handlers receive (args, context) where context.doctype is the DoctypeMeta
 * for the doctype being acted upon. For this in-memory setup, data is imported
 * directly from server/data.ts. In production with PostGraphile, context.pgClient
 * provides an active database connection instead — see:
 * https://stonecrop.io/docs/guides/postgraphile
 */

import { resolve } from 'node:path'
import { clearRegistry, loadDoctypes, registerBuiltinHandlers, registerHandler } from '@stonecrop/graphql-middleware'
import { projects, tasks } from '../data'

export default defineNitroPlugin(async () => {
	clearRegistry()

	const doctypesDir = resolve(process.cwd(), 'doctypes')
	loadDoctypes(doctypesDir, { continueOnError: true })

	registerBuiltinHandlers()

	// Transition a Task from Todo → In Progress
	registerHandler('start_task', async (args: unknown[]) => {
		const [taskId] = args as [string]
		const task = tasks.get(taskId)
		if (!task) throw new Error(`Task not found: ${taskId}`)
		const updated = { ...task, status: 'In Progress' as const }
		tasks.set(taskId, updated)
		return updated
	})

	// Transition a Task from In Progress → Done
	registerHandler('complete_task', async (args: unknown[]) => {
		const [taskId] = args as [string]
		const task = tasks.get(taskId)
		if (!task) throw new Error(`Task not found: ${taskId}`)
		const updated = { ...task, status: 'Done' as const }
		tasks.set(taskId, updated)
		return updated
	})

	// Transition a Project from Active → Archived
	registerHandler('archive_project', async (args: unknown[]) => {
		const [projectId] = args as [string]
		const project = projects.get(projectId)
		if (!project) throw new Error(`Project not found: ${projectId}`)
		const updated = { ...project, status: 'Archived' as const }
		projects.set(projectId, updated)
		return updated
	})
})
