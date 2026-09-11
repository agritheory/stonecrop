import { describe, expect, it } from 'vitest'

import { convertGraphQLSchema, planGeneration } from '../src/converter/index'
import { DoctypeMeta } from '../src/doctype'
import { validateDoctype } from '../src/validation'

/**
 * Which doctypes get a URL, and what it is.
 *
 * A doctype that exists only as rows inside another — a child table — has no page of its own, and
 * a route for it is a URL nobody can reach a link to. The declaration that says so is the parent's
 * `links` entry with a to-many cardinality, which generation now derives from the owning foreign
 * keys the server exposes.
 *
 * The pair shares one URL segment: the aggregate lists at `/order`, the entity opens a record at
 * `/order/:id`. Both are written literally, so nothing downstream re-derives one from the other.
 */

const sdl = `
	type Query { orders: OrderConnection }

	type Order {
		id: ID!
		code: String!
		customer: Customer!
		lines: OrderLineConnection
		attachments: AttachmentConnection
	}

	type OrderLine {
		id: ID!
		qty: Int!
		order: Order!
	}

	type Attachment {
		id: ID!
		filename: String!
	}

	type Customer {
		id: ID!
		customerName: String!
	}

	type Note {
		id: ID!
		body: String!
		line: OrderLine!
	}

	type OrderConnection { edges: [OrderEdge] totalCount: Int }
	type OrderEdge { node: Order cursor: String }
	type OrderLineConnection { edges: [OrderLineEdge] totalCount: Int }
	type OrderLineEdge { node: OrderLine cursor: String }
	type AttachmentConnection { edges: [AttachmentEdge] totalCount: Int }
	type AttachmentEdge { node: Attachment cursor: String }
`

const routes = (): Record<string, string | undefined> => {
	const entities = convertGraphQLSchema(sdl)
	const plan = planGeneration(entities)
	return Object.fromEntries(plan.map(entry => [entry.generated.name, entry.generated.route]))
}

describe('route generation', { tags: ['unit'] }, () => {
	it('gives an entity the record path and its aggregate the collection path', () => {
		const r = routes()
		expect(r['Order']).toBe('/order/:id')
		expect(r['Orders']).toBe('/order')
	})

	it('shares one segment between the pair, taken from the entity', () => {
		// Not `/orders` for the collection: a URL never carries a plural, so the aggregate borrows
		// the entity's slug rather than using its own.
		const r = routes()
		expect(r['Orders']).toBe('/order')
		expect(r['Order']?.startsWith('/order/')).toBe(true)
	})

	it('gives no route to a doctype that exists only as rows inside another', () => {
		// Attachment is reached only through Order.attachments, a to-many link.
		const r = routes()
		expect(r['Attachment']).toBeUndefined()
		expect(r['Attachments']).toBeUndefined()
	})

	it('routes a doctype something links to singly, even when another lists it', () => {
		// OrderLine is Order's child *and* Note's single reference. Denying it would leave that
		// reference with nowhere to navigate, which fails silently; an unused URL does not.
		const r = routes()
		expect(r['OrderLine']).toBe('/order-line/:id')
		expect(r['OrderLines']).toBe('/order-line')
	})

	it('routes a doctype nothing links to at all', () => {
		const r = routes()
		expect(r['Customer']).toBe('/customer/:id')
		expect(r['Note']).toBe('/note/:id')
	})

	it('still generates the aggregate for a doctype it gives no route', () => {
		// The route is gated, not the doctype: a child table is a doctype like any other.
		const names = planGeneration(convertGraphQLSchema(sdl)).map(e => e.generated.name)
		expect(names).toContain('Attachments')
	})

	it('emits doctypes the load gate accepts', () => {
		for (const entry of planGeneration(convertGraphQLSchema(sdl))) {
			expect(validateDoctype(entry.generated).success, entry.generated.name).toBe(true)
		}
	})

	it('keeps route through the load gate rather than stripping it', () => {
		// Asserted on the parsed output, not on `success`: an unknown key is stripped, not refused,
		// so a validity check passes whether or not the schema knows the field.
		const parsed = DoctypeMeta.parse({ name: 'Order', slug: 'order', route: '/order', fields: [] })
		expect(parsed.route).toBe('/order')
	})

	it('refuses a route that is not a path', () => {
		const result = DoctypeMeta.safeParse({ name: 'Order', slug: 'order', route: 'order', fields: [] })
		expect(result.success).toBe(false)
	})
})
