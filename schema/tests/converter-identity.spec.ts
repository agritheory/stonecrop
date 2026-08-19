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

describe('a schema that declares Relay’s Node interface', { tags: ['unit'] }, () => {
	// The node id is an opaque global identifier with no column behind it, so emitting one is not a
	// cosmetic defect — it becomes a column in the middleware's SELECT and every read fails.
	//
	// Which field carries it is a **declaration**, not a name: PostGraphile exposes it through
	// `nodeIdFieldName`, so it is `id` under the un-overridden Amber preset, `nodeId` under
	// Stonecrop's, and whatever a foreign host chose under theirs. The interface says which.

	// A foreign PostGraphile server on a natural-key table, un-overridden: Relay takes `id`, and
	// because there is no `id` column to displace, nothing is renamed to `rowId` — so the
	// both-`id`-and-`rowId` guard never fires and the node id looks exactly like a surrogate key.
	const foreignAmberSdl = `
		interface Node { id: ID! }
		type Uom implements Node { id: ID! code: String! uomName: String! }
		type Query { uoms: [Uom!]! node(id: ID!): Node }
	`

	it('does not emit the node id as a column', () => {
		const [uom] = convertGraphQLSchema(foreignAmberSdl, { include: ['Uom'] })
		expect(uom.fields.map(f => f.fieldname)).not.toContain('id')
		expect(uom.fields.map(f => f.fieldname)).toEqual(['code', 'uomName'])
	})

	it('derives no primary key from it', () => {
		// The defect this guards: `id` is non-null and scalar, which is exactly the one shape the
		// converter *does* derive from — so it stamped `primaryKey: true` on an opaque identifier.
		const [uom] = convertGraphQLSchema(foreignAmberSdl, { include: ['Uom'] })
		expect(uom.fields.some(f => f.primaryKey)).toBe(false)
	})

	it('reads the interface’s own field name, so a renamed identifier is still skipped', () => {
		// Stonecrop's preset moves it to `nodeId`; a foreign host may pick anything. Both are
		// covered because the name is read off the interface rather than matched against a list.
		const [item] = convertGraphQLSchema(
			`
				interface Node { globalId: ID! }
				type Item implements Node { globalId: ID! id: Int! itemName: String! }
				type Query { items: [Item!]! }
			`,
			{ include: ['Item'] }
		)
		expect(item.fields.map(f => f.fieldname)).not.toContain('globalId')
		expect(item.fields.find(f => f.fieldname === 'id')?.primaryKey).toBe(true)
	})

	it('keeps a real column named `nodeId` when nothing declares it an identifier', () => {
		// The over-skip direction. A hardcoded name drops this column silently, and the doctype
		// then omits a field the table really has.
		const [graph] = convertGraphQLSchema(
			`
				type Graph { id: ID! nodeId: String! }
				type Query { graphs: [Graph!]! }
			`,
			{ include: ['Graph'] }
		)
		expect(graph.fields.map(f => f.fieldname)).toContain('nodeId')
	})

	it('leaves a single-field interface called Node alone when that field is not an identifier', () => {
		// The other half of the marker's shape. `Node` here is a domain interface with one field,
		// so the field count alone cannot tell it apart — only the declared `ID!` can.
		const [namedThing] = convertGraphQLSchema(
			`
				interface Node { label: String! }
				type NamedThing implements Node { label: String! id: ID! }
				type Query { namedThings: [NamedThing!]! }
			`,
			{ include: ['NamedThing'] }
		)
		expect(namedThing.fields.map(f => f.fieldname)).toContain('label')
	})

	it('leaves a nullable identifier alone, which Relay’s spec does not permit', () => {
		const [thing] = convertGraphQLSchema(
			`
				interface Node { id: ID }
				type Thing implements Node { id: ID thingName: String! }
				type Query { things: [Thing!]! }
			`,
			{ include: ['Thing'] }
		)
		expect(thing.fields.map(f => f.fieldname)).toContain('id')
	})

	it('leaves a domain interface that happens to be called Node alone', () => {
		// Relay's marker declares exactly one field, of type `ID!`, and nothing else. An interface
		// carrying domain fields is not it, and skipping against it would drop real columns.
		const [treeNode] = convertGraphQLSchema(
			`
				interface Node { id: ID! label: String! }
				type TreeNode implements Node { id: ID! label: String! depth: Int! }
				type Query { treeNodes: [TreeNode!]! }
			`,
			{ include: ['TreeNode'] }
		)
		expect(treeNode.fields.map(f => f.fieldname)).toEqual(['id', 'label', 'depth'])
		expect(treeNode.fields.find(f => f.fieldname === 'id')?.primaryKey).toBe(true)
	})
})
