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
})
