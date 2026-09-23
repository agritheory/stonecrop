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
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import { loadDoctypesFromObject, clearRegistry } from '@stonecrop/graphql-middleware'

import projectDoctype from '../templates/Project.json'
import taskDoctype from '../templates/Task.json'
import { tasks } from '../templates/data'
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

async function snooze(taskId: string): Promise<any> {
	const result = await run(
		`mutation { stonecropAction(doctype: "Task", action: "snooze", args: [{ id: "${taskId}" }]) { success data error } }`
	)
	return result.data?.stonecropAction
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

	it('creates the record when the save carries no id, which is the New Record shape', async () => {
		// A draft has no identity to send, so `useClientAction` omits `id` entirely. This is the
		// envelope the scaffold actually receives from a New Record save.
		const result = await run(
			`mutation { stonecropAction(doctype: "Task", action: "save", args: [{ data: { title: "brand new", projectId: "1" } }]) { success data error } }`
		)
		const action = result.data?.stonecropAction
		expect(action?.error).toBeNull()
		expect(action?.success).toBe(true)
		expect(action?.data?.title).toBe('brand new')
		expect(action?.data?.id).toBeTruthy()
		// Defaults the scaffold applies on create.
		expect(action?.data?.status).toBe('Todo')

		// It is genuinely in the store, readable through the normal record path.
		const readBack = await run(`query { stonecropRecord(doctype: "Task", id: "${action.data.id}") { data } }`)
		expect(readBack.data?.stonecropRecord?.data?.title).toBe('brand new')
	})

	it('creates the record when the save targets an id that does not exist', async () => {
		// Distinct from the draft case: an id was sent and matched nothing. Save is an upsert, so
		// this creates too. It used to report `{ success: true, data: {} }` and persist nothing.
		const result = await run(
			`mutation { stonecropAction(doctype: "Task", action: "save", args: [{ id: "no-such-task", data: { title: "revived", projectId: "1" } }]) { success data error } }`
		)
		const action = result.data?.stonecropAction
		expect(action?.error).toBeNull()
		expect(action?.success).toBe(true)
		expect(action?.data?.title).toBe('revived')
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

	// Touches task 3's due date.
	it('runs the registered server-side effect for a stateless command', async () => {
		tasks.set('3', { ...tasks.get('3')!, dueDate: '2025-01-20' })
		const action = await snooze('3')
		expect(action?.error).toBeNull()
		expect(action?.success).toBe(true)
		expect(action?.data?.dueDate).toBe('2025-01-27')
	})

	it('reports a command with no outcome and no registered effect', async () => {
		const result = await run(
			`mutation { stonecropAction(doctype: "Project", action: "nope", args: [{ id: "1" }]) { success error } }`
		)
		expect(result.data?.stonecropAction?.success).toBe(false)
		expect(result.data?.stonecropAction?.error).toContain('Unknown action')
	})
})

// The client files `record` as the whole record, so the scaffold must reply with what its read returns.
// Touches task 3's title and due date and task 2's state.
describe('templates host — the record an action replies with', { tags: ['unit', 'graphql'] }, () => {
	const readTask = async (id: string) =>
		(await run(`query { stonecropRecord(doctype: "Task", id: "${id}") { data } }`)).data?.stonecropRecord?.data

	it('replies to a save with the record a read returns', async () => {
		const result = await run(
			`mutation { stonecropAction(doctype: "Task", action: "save", args: [{ id: "3", data: { title: "renamed again" } }]) { record } }`
		)
		expect(result.data?.stonecropAction?.record?.title).toBe('renamed again')
		expect(result.data?.stonecropAction?.record).toEqual(await readTask('3'))
	})

	it('replies to a create with the record a read of it returns', async () => {
		const result = await run(
			`mutation { stonecropAction(doctype: "Task", action: "save", args: [{ data: { title: "created with a record", projectId: "1" } }]) { record } }`
		)
		const record = result.data?.stonecropAction?.record
		expect(record?.id).toBeTruthy()
		expect(record).toEqual(await readTask(record.id))
	})

	it('replies to a transition with the whole record, not only its new state', async () => {
		const result = await run(
			`mutation { stonecropAction(doctype: "Task", action: "complete_task", args: [{ id: "2" }]) { data record } }`
		)
		expect(result.data?.stonecropAction?.data).toEqual({ state: 'Done' })
		expect(result.data?.stonecropAction?.record?.status).toBe('Done')
		expect(result.data?.stonecropAction?.record).toEqual(await readTask('2'))
	})

	it("replies to a handler's command with the record its writes left", async () => {
		tasks.set('3', { ...tasks.get('3')!, dueDate: '2025-01-20' })
		const result = await run(
			`mutation { stonecropAction(doctype: "Task", action: "snooze", args: [{ id: "3" }]) { record } }`
		)
		expect(result.data?.stonecropAction?.record?.dueDate).toBe('2025-01-27')
		expect(result.data?.stonecropAction?.record).toEqual(await readTask('3'))
	})

	it('replies with no record when the action fails', async () => {
		const result = await run(
			`mutation { stonecropAction(doctype: "Task", action: "start_task", args: [{ id: "no-such-task" }]) { success record } }`
		)
		expect(result.data?.stonecropAction).toEqual({ success: false, record: null })
	})
})

// Touches the due dates of tasks 2 and 3.
describe('templates host — snoozing across a clock change', { tags: ['unit', 'graphql'] }, () => {
	afterEach(() => {
		vi.useRealTimers()
		vi.unstubAllEnvs()
	})

	// Each server zone's clocks spring forward within the week, so a week counted on its clock is an hour short.
	it.each([
		{ zone: 'America/New_York', due: '2026-03-05', snoozed: '2026-03-12' },
		{ zone: 'Europe/Berlin', due: '2026-03-25', snoozed: '2026-04-01' },
	])('snoozes a task due $due to a week later on a server in $zone', async ({ zone, due, snoozed }) => {
		vi.stubEnv('TZ', zone)
		tasks.set('3', { ...tasks.get('3')!, dueDate: due })
		const action = await snooze('3')
		expect(action?.error).toBeNull()
		expect(action?.data?.dueDate).toBe(snoozed)
	})

	// 9pm in New York, when UTC has already reached the next day.
	it("snoozes a task with no due date to a week from the server's today", async () => {
		vi.stubEnv('TZ', 'America/New_York')
		vi.useFakeTimers({ toFake: ['Date'] })
		vi.setSystemTime(new Date(2026, 0, 10, 21))
		tasks.set('2', { ...tasks.get('2')!, dueDate: null })
		const action = await snooze('2')
		expect(action?.error).toBeNull()
		expect(action?.data?.dueDate).toBe('2026-01-17')
	})
})

describe('templates host — reads', { tags: ['unit', 'graphql'] }, () => {
	it('serves the contract queries the client actually sends', async () => {
		const meta = await run(`query { stonecropMeta(doctype: "Project") { name slug fields { fieldname primaryKey } } }`)
		expect(meta.data?.stonecropMeta?.name).toBe('Project')
		expect(meta.data?.stonecropMeta?.fields?.some((f: any) => f.primaryKey)).toBe(true)

		const records = await run(`query { stonecropRecords(doctype: "Project") { data hasMore count } }`)
		expect(records.data?.stonecropRecords?.data?.length).toBeGreaterThan(0)
		expect(records.data?.stonecropRecords?.hasMore).toBe(false)
		// The scaffold is what a new app's adapter is copied from, so it must withhold the total
		// like the real one does — otherwise every scaffolded backend counts on every list read.
		expect(records.data?.stonecropRecords?.count).toBeNull()

		const withTotal = await run(`query { stonecropRecords(doctype: "Project", includeTotal: true) { count } }`)
		expect(withTotal.data?.stonecropRecords?.count).toBeGreaterThan(0)
	})
})
