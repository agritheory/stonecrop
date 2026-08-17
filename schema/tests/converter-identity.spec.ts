import { describe, expect, it, vi } from 'vitest'

import { convertGraphQLSchema } from '../src/converter/index'

/**
 * Identity emission. The converter derives `primaryKey` for exactly one shape — a non-null `id`
 * scalar — and refuses to guess for anything else, because a wrong primary key is not a cosmetic
 * defect: the middleware builds its SQL identity predicate from it and the client keys records by
 * it, so a bad guess silently addresses the wrong row.
 */

const surrogateKeySdl = `
	type Widget {
		id: ID!
		widgetName: String!
	}
	type Query { widgets: [Widget!]! }
`

describe('primaryKey derivation', { tags: ['unit'] }, () => {
	it('marks a non-null id as the primary key', () => {
		const [widget] = convertGraphQLSchema(surrogateKeySdl, { include: ['Widget'] })
		const id = widget.fields.find(f => f.fieldname === 'id')
		expect(id?.primaryKey).toBe(true)
		expect(widget.fields.filter(f => f.primaryKey)).toHaveLength(1)
	})

	it('marks it regardless of how the scalar maps to a widget', () => {
		// FAB's `id` is `UUID!`, an unmapped custom scalar. Identity is a schema fact and must not
		// depend on whether a component could be chosen for it.
		const [widget] = convertGraphQLSchema(
			`
				scalar UUID
				type Widget { id: UUID! widgetName: String! }
				type Query { widgets: [Widget!]! }
			`,
			{ include: ['Widget'] }
		)
		expect(widget.fields.find(f => f.fieldname === 'id')?.primaryKey).toBe(true)
	})

	it('does not mark a nullable id', () => {
		const [widget] = convertGraphQLSchema(
			`
				type Widget { id: ID widgetName: String! }
				type Query { widgets: [Widget!]! }
			`,
			{ include: ['Widget'] }
		)
		expect(widget.fields.find(f => f.fieldname === 'id')?.primaryKey).toBeUndefined()
	})

	it('emits nothing for a natural key, which SDL cannot distinguish from any other column', () => {
		// `code` here is a UNIQUE business key. Nothing in the SDL says so, and a table may carry
		// several such columns — so the author declares it, not the converter.
		const [uom] = convertGraphQLSchema(
			`
				type Uom { code: ID! uomName: String! symbol: String }
				type Query { uoms: [Uom!]! }
			`,
			{ include: ['Uom'] }
		)
		expect(uom.fields.some(f => f.primaryKey)).toBe(false)
	})

	it('places primaryKey between required and source so output stays byte-stable', () => {
		const [widget] = convertGraphQLSchema(surrogateKeySdl, { include: ['Widget'] })
		const id = widget.fields.find(f => f.fieldname === 'id')!
		expect(Object.keys(id)).toEqual(['kind', 'fieldname', 'label', 'component', 'required', 'primaryKey', 'source'])
	})
})

describe('un-normalized PostGraphile Amber', { tags: ['unit'] }, () => {
	// Amber's default inflection gives the Relay global identifier the name `id`, displacing the
	// real column to `rowId`. Neither is usable verbatim: `id` is an opaque node id, and `rowId`
	// resolves to a `row_id` column that does not exist. The converter refuses to paper over it.
	const amberSdl = `
		scalar UUID
		type Widget {
			id: ID!
			rowId: UUID!
			widgetName: String!
		}
		type Query { widgets: [Widget!]! }
	`

	it('drops the Relay identifier rather than emitting it as a column', () => {
		const [widget] = convertGraphQLSchema(amberSdl, { include: ['Widget'] })
		expect(widget.fields.map(f => f.fieldname)).not.toContain('id')
		expect(widget.fields.map(f => f.fieldname)).toContain('rowId')
	})

	it('derives no primary key, because neither candidate names a real column', () => {
		const [widget] = convertGraphQLSchema(amberSdl, { include: ['Widget'] })
		expect(widget.fields.some(f => f.primaryKey)).toBe(false)
	})

	it('warns, naming the type and the fix', () => {
		const onWarning = vi.fn()
		convertGraphQLSchema(amberSdl, { include: ['Widget'], onWarning })

		expect(onWarning).toHaveBeenCalledTimes(1)
		const message = onWarning.mock.calls[0][0]
		expect(message).toContain('Widget')
		expect(message).toContain('_attributeName')
	})

	it('stays silent for a schema that has been normalized', () => {
		const onWarning = vi.fn()
		convertGraphQLSchema(surrogateKeySdl, { include: ['Widget'], onWarning })
		expect(onWarning).not.toHaveBeenCalled()
	})
})
