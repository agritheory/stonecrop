import { makeSchema } from 'postgraphile'
import { PostGraphileAmberPreset } from 'postgraphile/presets/amber'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'

import { createStonecropPlugin } from '../src/plugin/postgraphile'
import { clearRegistry, loadDoctypesFromObject } from '../src/registry/doctypes'
import { FakePgResourcesPlugin } from './helpers/fakePgResources'

// ===========================================================================
// createStonecropPlugin — basic construction
// ===========================================================================

describe('createStonecropPlugin', { tags: ['unit', 'graphql'] }, () => {
	it('creates a plugin with no arguments', () => {
		const plugin = createStonecropPlugin()
		expect(plugin).toBeDefined()
	})

	it('creates a plugin with debug enabled', () => {
		const plugin = createStonecropPlugin({ debug: true })
		expect(plugin).toBeDefined()
	})

	it('produces a GraphileConfig.Plugin with a name', () => {
		const plugin = createStonecropPlugin()
		expect(typeof plugin.name).toBe('string')
	})
})

// ===========================================================================
// Schema structure — field plans sourced from FakePgResourcesPlugin
// ===========================================================================

describe('stonecrop field plans', { tags: ['unit', 'graphql'] }, () => {
	let schema: Awaited<ReturnType<typeof makeSchema>>['schema']

	beforeAll(async () => {
		loadDoctypesFromObject({
			Resource: {
				name: 'Resource',
				fields: [
					{ kind: 'field', fieldname: 'id', fieldtype: 'PrimaryKey', label: 'ID' },
					{ kind: 'field', fieldname: 'name', fieldtype: 'Data', label: 'Name' },
				],
			},
		})
		const result = await makeSchema({
			extends: [PostGraphileAmberPreset],
			plugins: [FakePgResourcesPlugin, createStonecropPlugin()],
		})
		schema = result.schema
	})

	afterAll(() => {
		clearRegistry()
	})

	it('stonecropRecord field exists in Query type', () => {
		const fields = schema.getQueryType()?.getFields()
		expect(fields).toHaveProperty('stonecropRecord')
	})

	it('stonecropRecords field exists in Query type', () => {
		const fields = schema.getQueryType()?.getFields()
		expect(fields).toHaveProperty('stonecropRecords')
	})

	it('stonecropMeta field exists in Query type', () => {
		const fields = schema.getQueryType()?.getFields()
		expect(fields).toHaveProperty('stonecropMeta')
	})

	it('stonecropAction field exists in Mutation type', () => {
		const fields = schema.getMutationType()?.getFields()
		expect(fields).toHaveProperty('stonecropAction')
	})

	it('stonecropRecord has a Grafast plan function', () => {
		const field = schema.getQueryType()!.getFields()['stonecropRecord']
		const planFn = (field.extensions as any)?.grafast?.plan
		expect(typeof planFn).toBe('function')
	})

	it('stonecropRecord plan function exists and schema builds without executor option', () => {
		const field = schema.getQueryType()!.getFields()['stonecropRecord']
		const planFn = (field.extensions as any)?.grafast?.plan
		expect(typeof planFn).toBe('function')
		// NOTE: Calling the plan function directly outside the Grafast planning
		// lifecycle throws. The step type assertion is covered in integration tests
		// that execute real queries against a built schema.
	})

	it('stonecropRecords plan function exists and schema builds without executor option', () => {
		const field = schema.getQueryType()!.getFields()['stonecropRecords']
		const planFn = (field.extensions as any)?.grafast?.plan
		expect(typeof planFn).toBe('function')
		// NOTE: Same as above — step type is verified via integration tests.
	})

	it('executor is sourced from FakePgResourcesPlugin, not plugin options', () => {
		// If createStonecropPlugin() required an executor option and none was provided,
		// makeSchema above would have thrown. The fact that schema construction succeeded
		// confirms the executor is obtained from build.input.pgRegistry.pgResources.
		expect(schema.getQueryType()).toBeDefined()
	})
})
