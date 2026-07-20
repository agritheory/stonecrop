import { buildSchema, parse, print, validate } from 'graphql'
import { describe, it, expect } from 'vitest'

import { typeDefs } from '@stonecrop/graphql-middleware'
import { GET_META_QUERY, GET_ALL_META_QUERY, RUN_ACTION_MUTATION } from '../src/queries'

// ---------------------------------------------------------------------------
// Cross-package contract: the client's query selection sets must only reference
// fields the middleware's published SDL actually defines. This is the one check
// that fails when the server drops a field (e.g. StonecropWorkflowAction.handler)
// while a client query still selects it — a break invisible to either package's
// own unit tests, which never run the real query against the real schema.
// ---------------------------------------------------------------------------

// The middleware typeDefs only `extend`s Query/Mutation and references a `JSON` scalar, so it is
// not a standalone schema. Supply the minimal base PostGraphile provides at runtime so buildSchema
// can merge the extensions; the types under test (StonecropWorkflowAction et al.) are full
// definitions in the SDL, so this stub does not affect what the queries are validated against.
const BASE_SDL = `
	scalar JSON
	type Query { _empty: Boolean }
	type Mutation { _empty: Boolean }
`

function buildMiddlewareSchema() {
	return buildSchema(`${BASE_SDL}\n${print(typeDefs)}`)
}

describe('client ⟷ middleware query contract', { tags: ['unit'] }, () => {
	const schema = buildMiddlewareSchema()

	it('GET_META_QUERY selects only fields the middleware SDL defines', () => {
		const errors = validate(schema, parse(GET_META_QUERY))
		expect(errors.map(e => e.message)).toEqual([])
	})

	it('GET_ALL_META_QUERY selects only fields the middleware SDL defines', () => {
		const errors = validate(schema, parse(GET_ALL_META_QUERY))
		expect(errors.map(e => e.message)).toEqual([])
	})

	it('RUN_ACTION_MUTATION selects only fields the middleware SDL defines', () => {
		const errors = validate(schema, parse(RUN_ACTION_MUTATION))
		expect(errors.map(e => e.message)).toEqual([])
	})
})
