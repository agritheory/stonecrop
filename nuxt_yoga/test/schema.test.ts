import { join } from 'node:path'
import { describe, it, expect } from 'vitest'

import { loadSchemaFromFiles } from '../src/schema_loader'

describe('schema loader', () => {
	it('should load a single schema file', async () => {
		const schemaPath = join(__dirname, 'fixtures/basic/schema.graphql')
		const schema = await loadSchemaFromFiles(schemaPath)

		expect(schema).toBeDefined()
		expect(schema.getQueryType()).toBeDefined()
		expect(schema.getMutationType()).toBeDefined()
	})

	it('should handle glob patterns', async () => {
		const schemaPath = join(__dirname, 'fixtures/basic/*.graphql')
		const schema = await loadSchemaFromFiles(schemaPath)

		expect(schema).toBeDefined()
	})
})
