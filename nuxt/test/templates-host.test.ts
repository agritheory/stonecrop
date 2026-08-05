/**
 * Executed coverage for the scaffold the CLI writes into a new app.
 *
 * `templates/resolvers.ts` ships to consumers verbatim — `nuxt/src/cli/installers/grafserv.ts`
 * copies it into `server/resolvers.ts` — but nothing in this repo ran it. Its plan resolvers were
 * unreachable from tests because bare `grafast` did not resolve here and was aliased to a stub that
 * threw, so the file was verifiable only by reading it. Three shipped `save` actions that could
 * never dispatch are what that blind spot cost.
 *
 * This builds a real schema from the scaffold's own SDL and plans and executes documents against
 * it, so the scaffold is covered the same way the Postgres adapter is by
 * graphql_middleware/tests/integration/resolver.test.ts.
 *
 * The in-memory stores in `templates/data.ts` are module state shared across this file, so cases
 * that mutate declare what they touch and do not assume a pristine store.
 */
import { parse } from 'graphql'
import type { GraphQLSchema } from 'graphql'
import { execute, hookArgs, makeGrafastSchema } from 'postgraphile/grafast'
import { beforeAll, describe, expect, it } from 'vitest'

import { loadDoctypesFromObject, clearRegistry } from '@stonecrop/graphql-middleware'

import projectDoctype from '../templates/Project.json'
import taskDoctype from '../templates/Task.json'
import { resolvers } from '../templates/resolvers'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

let schema: GraphQLSchema

beforeAll(() => {
	clearRegistry()
	// The scaffold's own doctype JSON, not a fixture — the point is to run what ships.
	loadDoctypesFromObject({
		Project: projectDoctype as unknown as Parameters<typeof loadDoctypesFromObject>[0][string],
		Task: taskDoctype as unknown as Parameters<typeof loadDoctypesFromObject>[0][string],
	})

	const sdl = readFileSync(fileURLToPath(new URL('../templates/schema.graphql', import.meta.url)), 'utf-8')
	schema = makeGrafastSchema({
		typeDefs: sdl,
		// `resolvers` is the scaffold's export, shaped for grafast's `objects` form.
		// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- the scaffold's plan map is not typed against makeGrafastSchema's parameter
		objects: resolvers as never,
	})
})

async function run(query: string): Promise<any> {
	const args = await hookArgs({ schema, document: parse(query), contextValue: Object.create(null) })
	return (await execute(args)) as any
}

describe('templates host — actions', { tags: ['unit', 'graphql'] }, () => {
	it('saves an existing record', async () => {
		const result = await run(
			`mutation { stonecropAction(doctype: "Task", action: "save", args: [{ id: "1", data: { title: "renamed" } }]) { success data error } }`
		)
		const action = result.data?.stonecropAction
		expect(action?.error).toBeNull()
		expect(action?.success).toBe(true)
		expect(action?.data?.title).toBe('renamed')
	})

	it('creates the record when the save targets one that does not exist', async () => {
		// The New Record flow navigates to a client-invented `new-<timestamp>` id, so the very
		// first save of a new record always targets something absent. This used to report
		// `{ success: true, data: {} }` and persist nothing.
		const result = await run(
			`mutation { stonecropAction(doctype: "Task", action: "save", args: [{ id: "new-1700000000000", data: { title: "brand new", projectId: "1" } }]) { success data error } }`
		)
		const action = result.data?.stonecropAction
		expect(action?.error).toBeNull()
		expect(action?.success).toBe(true)
		expect(action?.data?.title).toBe('brand new')
		// The backend assigned the identity; the client's synthetic id is not it.
		expect(action?.data?.id).toBeTruthy()
		expect(String(action?.data?.id)).not.toContain('new-')
		// Defaults the scaffold applies on create.
		expect(action?.data?.status).toBe('Todo')

		// It is genuinely in the store, readable through the normal record path.
		const readBack = await run(`query { stonecropRecord(doctype: "Task", id: "${action.data.id}") { data } }`)
		expect(readBack.data?.stonecropRecord?.data?.title).toBe('brand new')
	})

	it('refuses a transition against a record that does not exist', async () => {
		// Only a self-transition creates; a workflow transition on a bad id is a bad id.
		const result = await run(
			`mutation { stonecropAction(doctype: "Task", action: "start_task", args: [{ id: "no-such-task" }]) { success error } }`
		)
		const action = result.data?.stonecropAction
		expect(action?.success).toBe(false)
		expect(action?.error).toContain('does not exist')
	})

	it('applies a guarded transition, and refuses it from the wrong state', async () => {
		// Task 1 seeds 'Todo' (task 2 seeds 'In Progress', so it would fail the guard by design).
		const ok = await run(
			`mutation { stonecropAction(doctype: "Task", action: "start_task", args: [{ id: "1" }]) { success data error } }`
		)
		expect(ok.data?.stonecropAction?.error).toBeNull()
		expect(ok.data?.stonecropAction?.success).toBe(true)
		expect(ok.data?.stonecropAction?.data?.state).toBe('In Progress')

		// Now in 'In Progress', start_task is no longer allowed from 'Todo'.
		const again = await run(
			`mutation { stonecropAction(doctype: "Task", action: "start_task", args: [{ id: "1" }]) { success error } }`
		)
		expect(again.data?.stonecropAction?.success).toBe(false)
		expect(again.data?.stonecropAction?.error).toContain('not allowed')
	})

	it('runs the registered server-side effect for a stateless command', async () => {
		const before = await run(`query { stonecropRecord(doctype: "Task", id: "3") { data } }`)
		const previousDue = before.data?.stonecropRecord?.data?.dueDate

		const result = await run(
			`mutation { stonecropAction(doctype: "Task", action: "snooze", args: [{ id: "3" }]) { success data error } }`
		)
		const action = result.data?.stonecropAction
		expect(action?.error).toBeNull()
		expect(action?.success).toBe(true)
		expect(action?.data?.dueDate).not.toBe(previousDue)
	})

	it('reports a command with no outcome and no registered effect', async () => {
		const result = await run(
			`mutation { stonecropAction(doctype: "Project", action: "nope", args: [{ id: "1" }]) { success error } }`
		)
		expect(result.data?.stonecropAction?.success).toBe(false)
		expect(result.data?.stonecropAction?.error).toContain('Unknown action')
	})
})

describe('templates host — reads', { tags: ['unit', 'graphql'] }, () => {
	it('serves the contract queries the client actually sends', async () => {
		const meta = await run(`query { stonecropMeta(doctype: "Project") { name slug fields { fieldname primaryKey } } }`)
		expect(meta.data?.stonecropMeta?.name).toBe('Project')
		expect(meta.data?.stonecropMeta?.fields?.some((f: any) => f.primaryKey)).toBe(true)

		const records = await run(`query { stonecropRecords(doctype: "Project") { data count } }`)
		expect(records.data?.stonecropRecords?.count).toBeGreaterThan(0)
	})
})
