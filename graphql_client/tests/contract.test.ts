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

	// ---------------------------------------------------------------------------
	// The reverse direction. `validate()` above only catches the client selecting a
	// field the server dropped. It is silent on the opposite failure: the server
	// publishes a field and the client never selects it, so the value arrives
	// `undefined` on every record and whatever reads it silently degrades. Nothing
	// throws, no test goes red — the feature just quietly does nothing.
	//
	// That is not hypothetical. Before this check existed, `StonecropFieldMeta`
	// published `primaryKey`/`computed`/`language` and `StonecropWorkflowAction`
	// published `nextState`/`stateless`/`selfTransition`/`clientHandler`, none of
	// which were selected — which disabled client-handler dispatch outright
	// (useClientAction reads `clientHandler`) and made `getAvailableCommands()`
	// always return empty (Doctype filters on `stateless`).
	//
	// Exact set equality, so *adding* an SDL field also fails here until the client
	// opts in or the field is deliberately excluded below.
	// ---------------------------------------------------------------------------

	/** Selection sets are compared per type, so a field must be reachable from the query root. */
	function selectedFields(query: string, typeName: string): string[] {
		const type = schema.getType(typeName)
		if (!type || !('getFields' in type)) throw new Error(`${typeName} is not an object type in the SDL`)

		const wanted = new Set(Object.keys(type.getFields()))
		const found = new Set<string>()

		// Walk every selection set in the document and collect field names that belong to the
		// target type. Field names are unique enough across these small metadata types that a
		// name-based match is sufficient and avoids a full type-aware visitor.
		JSON.stringify(parse(query), (key, value) => {
			if (key === 'selections' && Array.isArray(value)) {
				const names = value
					.filter((sel: { kind: string }) => sel.kind === 'Field')
					.map((sel: { name: { value: string } }) => sel.name.value)
				// Only count a selection set whose members are a subset of the target type's
				// fields — otherwise a sibling set could contribute same-named fields.
				if (names.length > 0 && names.every((n: string) => wanted.has(n))) {
					for (const n of names) found.add(n)
				}
			}
			return value
		})

		return [...found].toSorted()
	}

	const META_QUERIES: [string, string][] = [
		['GET_META_QUERY', GET_META_QUERY],
		['GET_ALL_META_QUERY', GET_ALL_META_QUERY],
	]

	for (const [name, query] of META_QUERIES) {
		it(`${name} selects every StonecropFieldMeta field the SDL publishes`, () => {
			const sdlFields = Object.keys(
				(schema.getType('StonecropFieldMeta') as { getFields: () => object }).getFields()
			).toSorted()
			expect(selectedFields(query, 'StonecropFieldMeta')).toEqual(sdlFields)
		})

		it(`${name} selects every StonecropWorkflowAction field the SDL publishes`, () => {
			const sdlFields = Object.keys(
				(schema.getType('StonecropWorkflowAction') as { getFields: () => object }).getFields()
			).toSorted()
			expect(selectedFields(query, 'StonecropWorkflowAction')).toEqual(sdlFields)
		})
	}
})
