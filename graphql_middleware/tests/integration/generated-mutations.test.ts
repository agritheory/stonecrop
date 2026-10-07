// `postgraphile/graphql` rather than `graphql`: the schema is built by PostGraphile's instance, and
// graphql-js rejects types from a different module realm.
import type { GraphQLSchema } from 'postgraphile/graphql'
import { makeSchema } from 'postgraphile'
import { makePgService } from 'postgraphile/adaptors/pg'
import { describe, it, expect, beforeAll, inject } from 'vitest'

import { createStonecropPlugin, createStonecropPreset } from '../../src'

/**
 * The writes a server built on the preset offers.
 *
 * Stonecrop does not follow CRUD: every write is an action, dispatched through `stonecropAction`,
 * where the doctype's guard runs. Amber generates a create, update and delete mutation for every
 * table, each of which writes past that guard, so the preset turns them off.
 */

let schema: GraphQLSchema

beforeAll(async () => {
	const { schema: built } = await makeSchema({
		extends: [createStonecropPreset()],
		plugins: [createStonecropPlugin()],
		// An app that disables a plugin of its own, as FAB does, keeps the preset's list: the lists merge.
		disablePlugins: ['PgRemoveExtensionResourcesPlugin'],
		pgServices: [makePgService({ connectionString: inject('generatedMutationsTestDatabaseUrl') })],
	})
	schema = built
}, 60_000)

describe('writes a server built on the preset offers', { tags: ['integration', 'graphql'] }, () => {
	it('offers stonecropAction as its only mutation', () => {
		expect(Object.keys(schema.getMutationType()?.getFields() ?? {})).toEqual(['stonecropAction'])
	})

	// The control: a schema that introspected no table would offer no generated mutation either.
	it('still reads every table', () => {
		const queries = Object.keys(schema.getQueryType()?.getFields() ?? {})
		expect(queries).toEqual(expect.arrayContaining(['allScItems', 'scItemById', 'allScLines']))
	})
})
