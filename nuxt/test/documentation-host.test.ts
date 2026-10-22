/**
 * Executed coverage for the docs site's playground server (`documentation/server/`), which backs the
 * Desktop specimens on the playground page. Built and run the way templates-host.test.ts runs the
 * scaffold: a real schema from the server's own SDL and plans, with documents executed against it.
 *
 * The mock executor's store is module state shared across this file, so cases that mutate declare
 * what they touch.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { parse } from 'graphql'
import type { GraphQLSchema } from 'graphql'
import { execute, hookArgs, makeGrafastSchema } from 'postgraphile/grafast'
import { beforeAll, describe, expect, it } from 'vitest'

import { loadDoctypesFromObject, clearRegistry } from '@stonecrop/graphql-middleware'

import userDoctype from '../documentation/doctypes/user.json'
import { actionHandlers } from '../documentation/server/action-handlers'
import { mockExecutor } from '../documentation/server/mock-executor'
import { sumPlaygroundMoney } from '../documentation/server/playground-denominated'
import resolvers from '../documentation/server/resolvers'

let schema: GraphQLSchema

beforeAll(() => {
	clearRegistry()
	// The docs site's own doctype JSON, not a fixture.
	loadDoctypesFromObject({
		User: userDoctype as unknown as Parameters<typeof loadDoctypesFromObject>[0][string],
	})

	const sdl = readFileSync(fileURLToPath(new URL('../documentation/server/schema.graphql', import.meta.url)), 'utf-8')
	schema = makeGrafastSchema({
		typeDefs: sdl,
		// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- the server's plan map is not typed against makeGrafastSchema's parameter
		objects: resolvers as never,
	})
})

async function run(query: string): Promise<any> {
	const args = await hookArgs({ schema, document: parse(query), contextValue: Object.create(null) })
	return (await execute(args)) as any
}

// The client files `record` as the whole record, so the server must reply with what its read returns.
// Touches user 2's name and user 3's status, and creates a user.
describe('documentation host — the record an action replies with', { tags: ['unit', 'graphql'] }, () => {
	const readUser = async (id: string) =>
		(await run(`query { stonecropRecord(doctype: "User", id: "${id}") { data } }`)).data?.stonecropRecord?.data

	it('replies to a save with the record a read returns', async () => {
		const result = await run(
			`mutation { stonecropAction(doctype: "User", action: "save", args: [{ id: "2", data: { name: "Renamed by a save" } }]) { record } }`
		)
		expect(result.errors).toBeUndefined()
		expect(result.data?.stonecropAction?.record?.name).toBe('Renamed by a save')
		expect(result.data?.stonecropAction?.record).toEqual(await readUser('2'))
	})

	it('replies to a create with the record a read of it returns', async () => {
		const result = await run(
			`mutation { stonecropAction(doctype: "User", action: "save", args: [{ data: { email: "new@example.com", name: "Created with a record" } }]) { record } }`
		)
		expect(result.errors).toBeUndefined()
		const record = result.data?.stonecropAction?.record
		expect(record?.id).toBeTruthy()
		expect(record).toEqual(await readUser(record.id))
	})

	it('replies to a transition with the whole record, not only its new state', async () => {
		const result = await run(
			`mutation { stonecropAction(doctype: "User", action: "suspend", args: [{ id: "3" }]) { record } }`
		)
		expect(result.errors).toBeUndefined()
		expect(result.data?.stonecropAction?.record?.status).toBe('SUSPENDED')
		expect(result.data?.stonecropAction?.record).toEqual(await readUser('3'))
	})

	// An id that matches nothing is a record deleted since the client read it; creating it would
	// report a lost update as a success.
	it('refuses a save that targets an id that does not exist, and creates nothing', async () => {
		const result = await run(
			`mutation { stonecropAction(doctype: "User", action: "save", args: [{ id: "no-such-user", data: { email: "ghost@example.com", name: "Ghost" } }]) { success error } }`
		)
		expect(result.data?.stonecropAction).toEqual({
			success: false,
			error: 'Save failed: record no-such-user no longer exists.',
		})
		const users = (await run(`query { stonecropRecords(doctype: "User") { data } }`)).data?.stonecropRecords?.data
		expect(users?.length).toBeGreaterThan(0)
		expect(users?.some((user: { name?: string }) => user.name === 'Ghost')).toBe(false)
	})

	// With no record back the page stays on its draft, and its next save creates a second user.
	it('fails a save whose handler replies without the record key', async () => {
		actionHandlers.User = { save: async ({ data }) => Promise.resolve({ name: data.name }) }
		try {
			const result = await run(
				`mutation { stonecropAction(doctype: "User", action: "save", args: [{ data: { email: "keyless@example.com", name: "Keyless" } }]) { success error record } }`
			)
			expect(result.data?.stonecropAction).toEqual({
				success: false,
				error: 'Save failed: the server did not say which record it saved.',
				record: null,
			})
		} finally {
			delete actionHandlers.User
		}
	})

	it('replies with no record when the action fails', async () => {
		const result = await run(
			`mutation { stonecropAction(doctype: "User", action: "activate", args: [{ id: "no-such-user" }]) { success record } }`
		)
		expect(result.errors).toBeUndefined()
		expect(result.data?.stonecropAction).toEqual({ success: false, record: null })
	})
})

// The fullstack fixture holds a copy of this host's resolvers that no test executes. Holding the copy
// to this file lets the cases above cover its code, though not its own store or handlers.
describe('the fullstack fixture host', { tags: ['unit'] }, () => {
	it('runs the same resolvers as the documentation host, apart from its name', () => {
		const lines = (path: string) => readFileSync(fileURLToPath(new URL(path, import.meta.url)), 'utf-8').split('\n')
		const documentation = lines('../documentation/server/resolvers.ts')
		const fixture = lines('./fixtures/fullstack/resolvers.ts')
		expect(fixture).toHaveLength(documentation.length)
		expect(
			documentation.flatMap((line, index) => (line === fixture[index] ? [] : [[line.trim(), fixture[index].trim()]]))
		).toEqual([
			['* @stonecrop/nuxt documentation playground resolvers', '* @stonecrop/nuxt fullstack playground resolvers'],
			["name: 'Stonecrop Documentation Playground',", "name: 'Stonecrop Fullstack Playground',"],
		])
	})
})

// Recalculate Total adds up an order's lines by their dollar amounts; an order must open with that total, or recalculating
// changes an order nobody edited.
describe('documentation host — seeded orders', { tags: ['unit'] }, () => {
	it('opens each order with the total of its lines', async () => {
		type Money = { amount: number; baseAmount: number }
		type Order = { orderNumber: string; total: Money; items: { total: Money }[] }
		const { allOrders } = await mockExecutor.query<{ allOrders: { nodes: Order[] } }>('allOrders')

		for (const order of allOrders.nodes) {
			expect(order.total.amount, order.orderNumber).toBe(sumPlaygroundMoney(order.items.map(item => item.total)))
		}
	})
})
