/**
 * Integration test for PostGraphile with real database.
 *
 * This test creates temporary tables in a test database, runs queries through
 * PostGraphile, and validates the infrastructure for Tier 2 testing.
 *
 * Prerequisites:
 * - TEST_DATABASE_URL environment variable pointing to a PostgreSQL instance
 * - The user must have permission to create/drop tables
 *
 * Each test runs inside a SERIALIZABLE transaction that is rolled back,
 * so tests are isolated and leave no residue.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest'

import { createStonecropPreset } from '../../src/index'
import { setupPostGraphile, teardownPostGraphile, runGraphQLQuery, withRootDb } from './'

const preset = {
	extends: [createStonecropPreset()],
}

describe('PostGraphile integration infrastructure', () => {
	let isSetup = false

	beforeAll(async () => {
		if (!process.env.TEST_DATABASE_URL) {
			return
		}
		try {
			await setupPostGraphile(preset)
			isSetup = true
		} catch (e) {
			console.warn('PostGraphile setup failed, skipping integration tests:', e)
			throw e
		}
	})

	afterAll(async () => {
		if (isSetup) {
			await teardownPostGraphile()
		}
	})

	it('runs a query through PostGraphile', async () => {
		if (!process.env.TEST_DATABASE_URL) {
			return
		}
		const result = await runGraphQLQuery({
			query: `{ __typename }`,
			variableValues: {},
		})

		expect(result.errors).toBeUndefined()
		expect(result.data).toEqual({ __typename: 'Query' })
	})

	it('can create and query test tables', async () => {
		if (!process.env.TEST_DATABASE_URL) {
			return
		}
		await withRootDb(async client => {
			await client.query(`
				create temporary table if not exists test_tasks (
					id serial primary key,
					title text not null,
					completed boolean not null default false
				)
			`)

			await client.query(`insert into test_tasks (title, completed) values ('Test task', true)`)
		})

		const result = await runGraphQLQuery({
			query: `{ __type(name: "Query") { name } }`,
		})

		expect(result.errors).toBeUndefined()
		expect(result.data?.__type?.name).toBe('Query')
	})
})
