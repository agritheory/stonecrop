import type { PgClient } from '@dataplan/pg'
import { describe, it, expect, beforeEach } from 'vitest'

import { enrichLinkDisplayFields } from '../src/link-display'
import { clearRegistry, getMeta, loadDoctypesFromObject } from '../src/registry/doctypes'

describe('enrichLinkDisplayFields', { tags: ['unit', 'graphql'] }, () => {
	beforeEach(() => {
		clearRegistry()
		loadDoctypesFromObject({
			ScParty: {
				name: 'ScParty',
				slug: 'sc-party',
				displayField: 'partyName',
				fields: [
					{ kind: 'field', fieldname: 'id', component: 'ATextInput', primaryKey: true },
					{ kind: 'field', fieldname: 'partyName', component: 'ATextInput' },
				],
			},
			ScOrder: {
				name: 'ScOrder',
				fields: [
					{ kind: 'field', fieldname: 'id', component: 'ATextInput', primaryKey: true },
					{
						kind: 'field',
						fieldname: 'customerId',
						component: 'AFormLink',
						doctype: 'sc-party',
					},
				],
			},
		})
	})

	it('adds fieldname__display for inline link fields', async () => {
		const rows = [{ id: 1, customerId: 10 }]

		const pgClient = {
			query: async () => ({
				rows: [{ id: 10, partyName: 'Acme Corp' }],
			}),
		} as unknown as PgClient

		await enrichLinkDisplayFields(pgClient, getMeta('ScOrder')!, rows, { ScParty: 'sc_party' }, async (client, query) =>
			client.query(query)
		)

		expect(rows[0].customerId__display).toBe('Acme Corp')
	})

	it('skips rows whose FK value is already an expanded object', async () => {
		const rows = [{ id: 1, customerId: { id: 10, partyName: 'Acme Corp' } }]

		const pgClient = {
			query: async () => {
				throw new Error('should not query when the FK is already expanded')
			},
		} as unknown as PgClient

		await enrichLinkDisplayFields(pgClient, getMeta('ScOrder')!, rows, undefined, async (client, query) =>
			client.query(query)
		)

		expect(rows[0].customerId__display).toBeUndefined()
	})

	// Counted, not asserted on the rows: enriching a batch row-by-row produces exactly these rows
	// while issuing one lookup per row, so the payload cannot tell the two apart. Callers holding a
	// batch must hand over the whole batch, and this is what says so.
	it('issues one lookup per link field regardless of how many rows it is given', async () => {
		const rows = Array.from({ length: 25 }, (_, i) => ({ id: i, customerId: (i % 3) + 10 }))
		const queries: { text: string; values?: unknown[] }[] = []

		const pgClient = {
			query: async (query: { text: string; values?: unknown[] }) => {
				queries.push(query)
				return { rows: [{ id: 10, partyName: 'Acme Corp' }] }
			},
		} as unknown as PgClient

		await enrichLinkDisplayFields(pgClient, getMeta('ScOrder')!, rows, { ScParty: 'sc_party' }, async (client, query) =>
			client.query(query)
		)

		expect(queries).toHaveLength(1)
		// Every distinct id reaches that single lookup — batching must not mean dropping ids.
		expect(new Set(queries[0]!.values?.[0] as string[])).toEqual(new Set(['10', '11', '12']))
	})
})
