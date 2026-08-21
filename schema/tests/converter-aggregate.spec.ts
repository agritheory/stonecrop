import { describe, expect, it } from 'vitest'

import {
	aggregateDoctypeName,
	buildAggregateDoctype,
	convertGraphQLSchema,
	formatDoctypeDrift,
	mergeIntrospectedDoctype,
	planGeneration,
} from '../src/converter/index'
import { validateDoctype } from '../src/validation'

/**
 * Aggregate derivation. Each table generates two doctypes — the entity, carrying every column, and
 * the aggregate that backs its collection view. The aggregate starts at identity alone because the
 * useful default for a collection is the column that opens a row, not all forty.
 */

const naturalKeySdl = `
	type Uom { code: ID! uomName: String! }
	type Query { uoms: [Uom!]! }
`

const surrogateKeySdl = `
	type Widget {
		id: ID!
		widgetName: String!
		widgetNote: String
	}
	type Query { widgets: [Widget!]! }
`

describe('buildAggregateDoctype', { tags: ['unit'] }, () => {
	it('holds identity alone, dropping every other column', () => {
		const [widget] = convertGraphQLSchema(surrogateKeySdl, { include: ['Widget'] })
		expect(widget.fields.length).toBeGreaterThan(1)

		const aggregate = buildAggregateDoctype(widget)!
		expect(aggregate.fields).toHaveLength(1)
		expect(aggregate.fields[0].fieldname).toBe('id')
		expect(aggregate.fields[0].primaryKey).toBe(true)
	})

	it('names and slugs the aggregate as a peer doctype', () => {
		const [order] = convertGraphQLSchema(
			`
				type SalesOrder { id: ID! total: Float }
				type Query { salesOrders: [SalesOrder!]! }
			`,
			{ include: ['SalesOrder'] }
		)
		const aggregate = buildAggregateDoctype(order)!
		expect(aggregate.name).toBe('SalesOrders')
		expect(aggregate.slug).toBe('sales-orders')
	})

	it('follows the doctype name, not the GraphQL type name', () => {
		// `slug` addresses the file the CLI writes and the route it is served at, so an aggregate
		// of a renamed doctype must land beside its entity, not beside the type it came from.
		const [person] = convertGraphQLSchema(surrogateKeySdl, {
			include: ['Widget'],
			doctypeNames: { Widget: 'Gadget' },
		})
		const aggregate = buildAggregateDoctype(person)!
		expect(aggregate.name).toBe(aggregateDoctypeName('Gadget'))
		expect(aggregate.slug).toBe('gadgets')
	})

	it('emits a doctype the load gate accepts', () => {
		const [widget] = convertGraphQLSchema(surrogateKeySdl, { include: ['Widget'] })
		expect(validateDoctype(buildAggregateDoctype(widget)).success).toBe(true)
	})

	it('copies the field rather than aliasing it', () => {
		// The two doctypes are written to separate files; an edit to one must not reach the other.
		const [widget] = convertGraphQLSchema(surrogateKeySdl, { include: ['Widget'] })
		const aggregate = buildAggregateDoctype(widget)!
		expect(aggregate.fields[0]).not.toBe(widget.fields.find(f => f.fieldname === 'id'))
	})

	it('falls back to a conventional id when no primary key was derived', () => {
		// A nullable `id` is not derivable as a primary key, but it is still what the client keys
		// records by — `getRecordIdField`'s documented fallback. The aggregate must agree with it.
		const [widget] = convertGraphQLSchema(
			`
				type Widget { id: ID widgetName: String! }
				type Query { widgets: [Widget!]! }
			`,
			{ include: ['Widget'] }
		)
		expect(widget.fields.find(f => f.fieldname === 'id')?.primaryKey).toBeUndefined()
		expect(buildAggregateDoctype(widget)!.fields[0].fieldname).toBe('id')
	})

	it('emits nothing for a natural key the converter refuses to guess', () => {
		// An aggregate with an empty `fields` array is a valid doctype that renders a table with no
		// columns — a silent wrong answer. Returning undefined lets the CLI say so instead.
		const [uom] = convertGraphQLSchema(
			`
				type Uom { code: ID! uomName: String! }
				type Query { uoms: [Uom!]! }
			`,
			{ include: ['Uom'] }
		)
		expect(buildAggregateDoctype(uom)).toBeUndefined()
	})

	it('leaves convertGraphQLSchema returning one doctype per entity type', () => {
		// Aggregates are derived, not converted. Folding them into the converter's return would
		// change a documented contract every existing caller depends on.
		const doctypes = convertGraphQLSchema(surrogateKeySdl)
		expect(doctypes).toHaveLength(1)
	})
})

describe('aggregate naming — plurals and collisions', { tags: ['unit'] }, () => {
	const entityNamed = (name: string) =>
		convertGraphQLSchema(`type ${name} { id: ID! label: String }\ntype Query { q: [${name}!]! }`, {
			include: [name],
		})[0]

	// Verified against FAB's 41 hand-authored aggregate doctypes: `pluralize` + `toSlug` reproduces
	// every one of their names, slugs and filenames exactly, irregulars included. A naive `+ 's'`
	// gets five of them wrong.
	it.each([
		['Currency', 'Currencies', 'currencies'],
		['JournalEntry', 'JournalEntries', 'journal-entries'],
		['TaskDependency', 'TaskDependencies', 'task-dependencies'],
		['DeliveryNote', 'DeliveryNotes', 'delivery-notes'],
		['Item', 'Items', 'items'],
	])('pluralises %s to %s', (singular, plural, slug) => {
		const aggregate = buildAggregateDoctype(entityNamed(singular))!
		expect(aggregate.name).toBe(plural)
		expect(aggregate.slug).toBe(slug)
	})

	// The failure this prevents is silent twice over: the CLI writes `settings.json` once as the
	// entity and again as the aggregate in the same run, and the middleware registry is a Map keyed
	// by name, so whichever file `readdirSync` yields last wins. The old `-aggregate` suffix was
	// accidentally collision-proof; plurals are not.
	it.each(['Settings', 'Series', 'Data', 'Media', 'News', 'Equipment'])(
		'refuses to derive an aggregate for %s, whose plural is itself',
		name => {
			expect(buildAggregateDoctype(entityNamed(name))).toBeUndefined()
		}
	)

	it('refuses when the plural is already another converted doctype', () => {
		// Two types whose names collide under pluralisation. Only `planGeneration` can see this —
		// it is the one that holds the whole set — so the check lives there, not in the builder.
		const entities = convertGraphQLSchema(
			`
				type Person { id: ID! name: String }
				type People { id: ID! headcount: Int }
				type Query { people: [Person!]! groups: [People!]! }
			`,
			{ include: ['Person', 'People'] }
		)
		const warnings: string[] = []
		const plan = planGeneration(entities, { onWarning: m => warnings.push(m) })

		// Both entities still written; neither aggregate, because each would claim a taken name.
		expect(plan.filter(p => !p.subset)).toHaveLength(2)
		expect(plan.filter(p => p.subset)).toHaveLength(0)
		expect(warnings.join(' ')).toContain('People')
	})

	it('warns, and still writes the entity, when the plural collides with itself', () => {
		const entities = convertGraphQLSchema(
			`type Settings { id: ID! theme: String }\ntype Query { settings: [Settings!]! }`,
			{ include: ['Settings'] }
		)
		const warnings: string[] = []
		const plan = planGeneration(entities, { onWarning: m => warnings.push(m) })
		expect(plan.map(p => p.generated.slug)).toEqual(['settings'])
		expect(warnings).toHaveLength(1)
		// Asserts the *cause*, not just the doctype name. `Settings` appears in the no-identity
		// warning too, so matching the name alone passed with this branch deleted — verified by
		// mutation, which is the only way that was going to surface.
		expect(warnings[0]).toContain('already plural')
	})
})

/**
 * Verifying an aggregate against the schema. An aggregate is a curated subset of its entity's
 * columns, so it is merged against the *entity*, not against its own one-field generation — and
 * the two drift buckets that assume a doctype models every column have to change accordingly.
 */
describe('merging a curated aggregate', { tags: ['unit'] }, () => {
	const entityOf = (sdl: string, name: string) => convertGraphQLSchema(sdl, { include: [name] })[0]

	const widenedAggregate = {
		name: 'Widgets',
		slug: 'widgets',
		fields: [
			{ kind: 'field', fieldname: 'id', component: 'ATextInput', primaryKey: true, required: true },
			{ kind: 'field', fieldname: 'widgetName', component: 'ATextInput', required: true },
		],
	}

	it('does not report curated columns as orphans', () => {
		// The regression this exists for: comparing the aggregate against its own generation made
		// every hand-added column look like one the table had dropped, on every run forever.
		const entity = entityOf(surrogateKeySdl, 'Widget')
		const { drift } = mergeIntrospectedDoctype(widenedAggregate, entity, { subset: true })
		expect(drift.orphan).toEqual([])
	})

	it('does not report the columns an aggregate deliberately leaves out', () => {
		const entity = entityOf(surrogateKeySdl, 'Widget')
		const { drift } = mergeIntrospectedDoctype(widenedAggregate, entity, { subset: true })
		expect(drift.omitted).toEqual([])
	})

	it('still reports a column that no longer exists on the table', () => {
		// Suppressing the noise must not suppress the finding. `widgetName` is gone from this SDL.
		const entity = entityOf(
			`
				type Widget { id: ID! }
				type Query { widgets: [Widget!]! }
			`,
			'Widget'
		)
		const { drift } = mergeIntrospectedDoctype(widenedAggregate, entity, { subset: true })
		expect(drift.orphan).toEqual(['widgetName'])
	})

	it('leaves a non-subset merge reporting omissions as before', () => {
		const entity = entityOf(surrogateKeySdl, 'Widget')
		const { drift } = mergeIntrospectedDoctype(widenedAggregate, entity)
		expect(drift.omitted).toEqual(['widgetNote'])
	})

	it('stamps provenance on the curated columns it confirms', () => {
		const entity = entityOf(surrogateKeySdl, 'Widget')
		const { doctype } = mergeIntrospectedDoctype(widenedAggregate, entity, { subset: true })
		const fields = doctype.fields as Array<Record<string, unknown>>
		expect(fields.map(f => f.source)).toEqual(['introspected', 'introspected'])
	})
})

/**
 * The generation plan — which files get written, and what each is verified against. The basis
 * pairing is the part that fails silently: getting it wrong does not throw, it reports drift that
 * is not there on every run, which both spams `--check` and buries real findings.
 */
describe('planGeneration', { tags: ['unit'] }, () => {
	it('writes an entity and its aggregate as two peer files', () => {
		const entities = convertGraphQLSchema(surrogateKeySdl, { include: ['Widget'] })
		const plan = planGeneration(entities)
		expect(plan.map(p => p.generated.slug)).toEqual(['widget', 'widgets'])
	})

	it('verifies an aggregate against the entity, not against itself', () => {
		// The regression: an aggregate checked against its own one-field generation reports every
		// curated column as one the table dropped.
		const entities = convertGraphQLSchema(surrogateKeySdl, { include: ['Widget'] })
		const [, aggregate] = planGeneration(entities)
		expect(aggregate.subset).toBe(true)
		expect(aggregate.basis.fields.map(f => f.fieldname)).toEqual(entities[0].fields.map(f => f.fieldname))
	})

	it('passes the entity through as the basis, unrenamed', () => {
		// The basis used to be copied under the aggregate's name, on the belief that drift lines read
		// it. They do not — `mergeIntrospectedDoctype` reads only `fields` and `links` off the basis,
		// and names the report after the authored file. The copy was inert.
		const entities = convertGraphQLSchema(surrogateKeySdl, { include: ['Widget'] })
		const [, aggregate] = planGeneration(entities)
		expect(aggregate.basis).toBe(entities[0])
	})

	it('reports drift against the aggregate file being checked, not against its basis', () => {
		// The property the inert rename was there to buy, asserted where it actually comes from: a
		// reader told "Widget" would go looking in widget.json for a finding about widgets.json.
		const entities = convertGraphQLSchema(surrogateKeySdl, { include: ['Widget'] })
		const [, aggregate] = planGeneration(entities)
		const { drift } = mergeIntrospectedDoctype(
			{ name: 'Widgets', fields: [{ fieldname: 'goneAway', component: 'ATextInput' }] },
			aggregate.basis,
			{ subset: true }
		)
		expect(drift.doctype).toBe('Widgets')
		expect(formatDoctypeDrift(drift).join('\n')).toContain('Widgets: authored fields with no schema field: goneAway')
	})

	it('verifies an entity against itself, and not as a subset', () => {
		const entities = convertGraphQLSchema(surrogateKeySdl, { include: ['Widget'] })
		const [entity] = planGeneration(entities)
		expect(entity.subset).toBe(false)
		expect(entity.basis).toBe(entity.generated)
	})

	it('emits only entities under noAggregates', () => {
		const entities = convertGraphQLSchema(surrogateKeySdl, { include: ['Widget'] })
		expect(planGeneration(entities, { noAggregates: true }).map(p => p.generated.slug)).toEqual(['widget'])
	})

	it('keys the aggregate on an identity the author declared, which the schema cannot express', () => {
		// SDL cannot say which UNIQUE column is the key, so the converter derives nothing and the
		// author declares it in the file. Until the caller passes that declaration back, the
		// aggregate is unreachable: its warning says "declare a primaryKey and re-run", and re-running
		// after declaring one changes nothing.
		const entities = convertGraphQLSchema(naturalKeySdl, { include: ['Uom'] })
		const plan = planGeneration(entities, { identity: { Uom: 'code' } })
		expect(plan.map(p => p.generated.slug)).toEqual(['uom', 'uoms'])
	})

	it('marks the declared identity on the aggregate it copies', () => {
		// Without the marker `getRecordIdField` falls back to `id`, which an aggregate keyed on `code`
		// does not have — and every listed row is then silently dropped.
		const entities = convertGraphQLSchema(naturalKeySdl, { include: ['Uom'] })
		const [, aggregate] = planGeneration(entities, { identity: { Uom: 'code' } })
		expect(aggregate.generated.fields).toEqual([expect.objectContaining({ fieldname: 'code', primaryKey: true })])
	})

	it('refuses, naming the field, when the declared identity is not a column the schema has', () => {
		// A key naming a dropped column or a computed field. Building an aggregate around a field that
		// does not exist would produce a collection view whose only column is absent from every row.
		const entities = convertGraphQLSchema(naturalKeySdl, { include: ['Uom'] })
		const warnings: string[] = []
		const plan = planGeneration(entities, { identity: { Uom: 'legacyRef' }, onWarning: m => warnings.push(m) })
		expect(plan.map(p => p.generated.slug)).toEqual(['uom'])
		expect(warnings).toHaveLength(1)
		expect(warnings[0]).toContain('legacyRef')
	})

	it('leaves an identity declared for another doctype alone', () => {
		// Keyed by doctype name, so a map covering the whole run does not leak between entries.
		const entities = convertGraphQLSchema(naturalKeySdl, { include: ['Uom'] })
		expect(planGeneration(entities, { identity: { Other: 'code' } }).map(p => p.generated.slug)).toEqual(['uom'])
	})

	it('warns, and still writes the entity, when no aggregate can be derived', () => {
		const entities = convertGraphQLSchema(naturalKeySdl, { include: ['Uom'] })
		const warnings: string[] = []
		const plan = planGeneration(entities, { onWarning: m => warnings.push(m) })
		expect(plan.map(p => p.generated.slug)).toEqual(['uom'])
		expect(warnings).toHaveLength(1)
		expect(warnings[0]).toContain('primaryKey')
	})
})
