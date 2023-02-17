import { test, describe, it, expect } from 'vitest'
import { Query } from '../src/index.ts'

test('query is defined', () => {
	expect(Query()).toBeDefined()
})
