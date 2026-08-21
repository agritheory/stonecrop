// `postgraphile/graphql` rather than `graphql`: the schema is built by PostGraphile's instance, and
// graphql-js rejects types from a different module realm.
import { type GraphQLObjectType, type GraphQLSchema } from 'postgraphile/graphql'
import { makeSchema } from 'postgraphile'
import { makePgService } from 'postgraphile/adaptors/pg'
import { describe, it, expect, beforeAll, inject } from 'vitest'

import { convertGraphQLSchema } from '@stonecrop/schema'
import { printSchema } from 'postgraphile/graphql'

import { createStonecropPreset } from '../../src'

/**
 * Which relationships reach the GraphQL surface as a collection.
 *
 * PostGraphile registers both directions of every foreign key, but Amber exposes only the forward
 * one — the many side carries no `manyRelation:resource:connection` behavior, so a parent type has
 * no field for its children and a generated doctype can never contain a child table.
 *
 * Stonecrop exposes the many side for foreign keys the database declares as owning, `ON DELETE
 * CASCADE`. That is the only statement of ownership a schema makes: `sc_tag.item_id` cascades and
 * is Item's rows, `sc_order.customer_id` does not and is a reference to a party that outlives the
 * order. Both are the same shape otherwise, which is why nothing downstream can tell them apart.
 */

let schema: GraphQLSchema

beforeAll(async () => {
	const { schema: built } = await makeSchema({
		extends: [createStonecropPreset()],
		pgServices: [makePgService({ connectionString: inject('naturalIdTestDatabaseUrl') })],
	})
	schema = built
}, 60_000)

const fieldsOf = (typeName: string): string[] =>
	Object.keys((schema.getType(typeName) as GraphQLObjectType).getFields())

describe('owned relations reach the schema', { tags: ['integration', 'graphql'] }, () => {
	it('gives a parent a collection field for rows it owns', () => {
		// sc_tag.item_id and sc_note.item_id are both ON DELETE CASCADE.
		expect(fieldsOf('ScItem')).toContain('scTagsByItemId')
		expect(fieldsOf('ScItem')).toContain('scNotesByItemId')
	})

	it('gives no collection field for a reference it does not own', () => {
		// sc_order.customer_id has no ON DELETE action, so an order references a party rather than
		// belonging to one. Asserted as an absence of any collection: a party has no rows of orders.
		expect(fieldsOf('ScParty').filter(f => f.startsWith('scOrders'))).toEqual([])
	})

	it('leaves the forward direction exactly as it was', () => {
		expect(fieldsOf('ScTag')).toContain('scItemByItemId')
	})

	it('emits a connection rather than a list', () => {
		// The converter recognises a Connection type and nothing else, so a list field would be
		// dropped silently rather than becoming a link.
		const item = schema.getType('ScItem') as GraphQLObjectType
		expect(String(item.getFields()['scTagsByItemId']?.type)).toContain('Connection')
		expect(fieldsOf('ScItem')).not.toContain('scTagsByItemIdList')
	})

	it('converts an owned collection into a to-many link declaration', () => {
		const converted = convertGraphQLSchema(printSchema(schema))
		const item = converted.find(d => d.name === 'ScItem')
		expect(item?.links?.['scTagsByItemId']).toEqual({ target: 'sc-tag', cardinality: 'noneOrMany' })
		expect(converted.find(d => d.name === 'ScParty')?.links).toBeUndefined()
	})
})
