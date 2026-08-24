// `postgraphile/graphql` rather than `graphql`: the schema is built by PostGraphile's instance, and
// graphql-js rejects types from a different module realm (`printSchema` throws, it does not misreport).
import { printSchema, type GraphQLSchema, type GraphQLObjectType } from 'postgraphile/graphql'
import { makeSchema } from 'postgraphile'
import { makePgService } from 'postgraphile/adaptors/pg'
import { describe, it, expect, beforeAll, afterAll, inject } from 'vitest'

import { convertGraphQLSchema } from '@stonecrop/schema'

import { createStonecropPreset } from '../../src'

/**
 * Identity naming in the schema PostGraphile builds for a Stonecrop server.
 *
 * Amber points `nodeIdFieldName` at `id`, so `PgAttributesPlugin` renames any real column called
 * `id` out of the way to `rowId`. Neither name is then usable by Stonecrop: the middleware resolves
 * columns with raw SQL through `camelToSnake` and never consults the GraphQL surface, so `id` is an
 * opaque base64 node id with no column behind it and `rowId` names a `row_id` that does not exist.
 *
 * The preset therefore moves Relay's identifier to `nodeId` and gives the column its name back.
 * Both inflectors have to move together — undoing the rename alone would collide with the Relay
 * field still sitting on `id`, and disabling `NodePlugin` alone removes the Relay field but leaves
 * the column called `rowId`, which is strictly worse.
 */

let schema: GraphQLSchema

beforeAll(async () => {
	const { schema: built } = await makeSchema({
		extends: [createStonecropPreset()],
		pgServices: [makePgService({ connectionString: inject('naturalIdTestDatabaseUrl') })],
	})
	schema = built
}, 60_000)

afterAll(() => {
	// makeSchema's pg service is released by the global teardown that owns the database.
})

const fieldsOf = (typeName: string): string[] =>
	Object.keys((schema.getType(typeName) as GraphQLObjectType).getFields())

describe('identity naming in the generated schema', { tags: ['integration', 'graphql'] }, () => {
	it('leaves a real `id` column named `id`', () => {
		// sc_item is `id serial PRIMARY KEY`. Un-overridden, Amber renames it to `rowId`.
		//
		// Asserting the *type* rather than the presence of the name: un-overridden, `ScItem.id`
		// exists too — it is Relay's `ID!`. Only the column's own `Int!` distinguishes the two, so a
		// presence check here passes for the wrong reason.
		const id = (schema.getType('ScItem') as GraphQLObjectType).getFields()['id']
		expect(String(id?.type)).toBe('Int!')
	})

	it('emits no `rowId` anywhere in the schema', () => {
		// Asserted across the whole SDL rather than one type: the rename is applied per-attribute,
		// so a single type passing proves nothing about the other nine.
		expect(printSchema(schema)).not.toContain('rowId')
	})

	it('does not invent an `id` field on a table that has no `id` column', () => {
		// sc_code is keyed on `code` and has no `id` column at all. Un-overridden, Relay's
		// identifier occupies `id` here, which reads as a column and is not one.
		expect(fieldsOf('ScCode')).not.toContain('id')
		expect(fieldsOf('ScCode')).toEqual(expect.arrayContaining(['code', 'name', 'status']))
	})

	it('keeps Relay’s global identifier, moved to `nodeId`', () => {
		// Moved, not removed — the Node interface still resolves, so nothing that speaks Relay breaks.
		expect(fieldsOf('ScItem')).toContain('nodeId')
		expect(Object.keys(schema.getQueryType()!.getFields())).toContain('node')
	})
})

describe('doctypes generated from this schema', { tags: ['integration', 'graphql'] }, () => {
	// The reason the naming matters: `stonecrop-schema generate` points at exactly this schema, and
	// every field it emits becomes a column in the middleware's SELECT.
	it('derives the surrogate key and invents no phantom column', () => {
		const [item] = convertGraphQLSchema(printSchema(schema), { include: ['ScItem'] })
		expect(item.fields.find(f => f.primaryKey)?.fieldname).toBe('id')
		expect(item.fields.map(f => f.fieldname)).not.toContain('rowId')
	})

	it('derives no primary key for a natural-key table, rather than a wrong one', () => {
		// SDL cannot express which UNIQUE column is the key, so declaring it is the author's job.
		// The failure this guards against is worse than deriving nothing: Relay's `id` used to be
		// stamped `primaryKey`, producing a doctype whose every read failed on a missing column.
		const [code] = convertGraphQLSchema(printSchema(schema), { include: ['ScCode'] })
		expect(code.fields.map(f => f.fieldname)).not.toContain('id')
		expect(code.fields.some(f => f.primaryKey)).toBe(false)
	})
})
