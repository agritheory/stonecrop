import { describe, expect, it } from 'vitest'

import { convertGraphQLSchema } from '../src/converter/index'
import { mergeIntrospectedDoctype, type AuthoredDoctype } from '../src/converter/merge'

/**
 * The merge's contract is that the authored doctype wins. Generation confirms it and stamps
 * provenance; every disagreement is reported rather than applied. These tests exist because the
 * opposite polarity — schema wins on identity — is the intuitive design and is wrong: it re-keys
 * any doctype whose primary key is a natural business key, which the schema cannot express.
 */

const uomSdl = `
	scalar UUID
	type Uom {
		id: UUID!
		uomName: String!
		symbol: String
		active: Boolean
	}
	type Query { uoms: [Uom!]! }
`

const generatedUom = () => convertGraphQLSchema(uomSdl, { include: ['Uom'] })[0]

/** A hand-curated doctype keyed on its natural business key, as FAB's actually are. */
const authoredUom = (): AuthoredDoctype => ({
	name: 'Uom',
	slug: 'uom',
	fields: [
		{
			kind: 'field',
			fieldname: 'uomName',
			label: 'UOM Name',
			component: 'ATextInput',
			required: true,
			primaryKey: true,
			source: 'introspected',
		},
		{ kind: 'field', fieldname: 'symbol', label: 'Symbol', component: 'ATextInput', source: 'introspected' },
		{ kind: 'field', fieldname: 'active', label: 'Active', component: 'ACheckbox', source: 'introspected' },
	],
})

describe('mergeIntrospectedDoctype', { tags: ['unit'] }, () => {
	it('never rewrites an authored primary key', () => {
		const { doctype, drift } = mergeIntrospectedDoctype(authoredUom(), generatedUom())

		const pks = (doctype.fields as AuthoredDoctype[]).filter(f => f.primaryKey === true)
		expect(pks).toHaveLength(1)
		expect(pks[0].fieldname).toBe('uomName')
		// and the schema's own candidate was not smuggled in
		expect((doctype.fields as AuthoredDoctype[]).some(f => f.fieldname === 'id')).toBe(false)

		expect(drift.mode).toBe('partial')
		expect(drift.reason).toContain('uomName')
		expect(drift.omitted).toContain('id')
	})

	it('stamps provenance on fields confirmed against the schema', () => {
		const authored = authoredUom()
		// strip the markers so the stamping is observable
		for (const f of authored.fields as AuthoredDoctype[]) delete f.source

		const { doctype, drift } = mergeIntrospectedDoctype(authored, generatedUom())
		for (const f of doctype.fields as AuthoredDoctype[]) {
			expect(f.source, String(f.fieldname)).toBe('introspected')
		}
		expect(drift.tagged).toEqual(['uomName', 'symbol', 'active'])
	})

	it('preserves author-owned presentation and reports the disagreement instead', () => {
		const authored = authoredUom()
		const symbol = (authored.fields as AuthoredDoctype[])[1]
		symbol.label = 'Unit Symbol'
		symbol.component = 'ACodeEditor'
		symbol.readOnly = true

		const { doctype, drift } = mergeIntrospectedDoctype(authored, generatedUom())
		const merged = (doctype.fields as AuthoredDoctype[])[1]
		expect(merged.label).toBe('Unit Symbol')
		expect(merged.component).toBe('ACodeEditor')
		expect(merged.readOnly).toBe(true)
		expect(drift.componentDrift.join()).toContain('symbol')
	})

	it('preserves keys this package does not model', () => {
		// `handler` is stripped by the Zod parser, so a merge that round-tripped through validation
		// would silently delete it from every doctype that declares one.
		const authored = authoredUom()
		authored.workflow = { states: ['Draft'], actions: { save: { label: 'Save', handler: 'uom:save' } } }
		;(authored.fields as AuthoredDoctype[])[0].filterFunction = 'async () => []'

		const { doctype } = mergeIntrospectedDoctype(authored, generatedUom())
		expect(doctype.workflow).toEqual(authored.workflow)
		expect((doctype.fields as AuthoredDoctype[])[0].filterFunction).toBe('async () => []')
		expect(doctype.slug).toBe('uom')
	})

	it('keeps hand-added fields and reports them rather than dropping them', () => {
		const authored = authoredUom()
		;(authored.fields as AuthoredDoctype[]).push({
			kind: 'field',
			fieldname: 'conversions',
			label: 'Conversions',
			component: 'ATable',
		})

		const { doctype, drift } = mergeIntrospectedDoctype(authored, generatedUom())
		const added = (doctype.fields as AuthoredDoctype[]).find(f => f.fieldname === 'conversions')
		expect(added).toBeDefined()
		expect(added?.source).toBeUndefined()
		expect(drift.orphan).toEqual(['conversions'])
	})

	it('does not flag a computed field as orphaned', () => {
		const authored = authoredUom()
		;(authored.fields as AuthoredDoctype[]).push({
			kind: 'field',
			fieldname: 'displayLabel',
			component: 'ATextInput',
			computed: true,
		})

		const { drift } = mergeIntrospectedDoctype(authored, generatedUom())
		expect(drift.orphan).not.toContain('displayLabel')
	})

	it('descends into fieldsets', () => {
		const authored: AuthoredDoctype = {
			name: 'Uom',
			slug: 'uom',
			fields: [
				{
					kind: 'fieldset',
					fieldname: 'details',
					label: 'Details',
					schema: [{ kind: 'field', fieldname: 'symbol', label: 'Symbol', component: 'ATextInput' }],
				},
			],
		}

		const { doctype, drift } = mergeIntrospectedDoctype(authored, generatedUom())
		const fieldset = (doctype.fields as AuthoredDoctype[])[0]
		expect(fieldset.source).toBeUndefined()
		expect((fieldset.schema as AuthoredDoctype[])[0].source).toBe('introspected')
		expect(drift.tagged).toContain('symbol')
	})

	it('is idempotent — a second merge changes nothing', () => {
		const once = mergeIntrospectedDoctype(authoredUom(), generatedUom()).doctype
		const twice = mergeIntrospectedDoctype(structuredClone(once), generatedUom()).doctype
		expect(JSON.stringify(twice, null, '\t')).toBe(JSON.stringify(once, null, '\t'))
	})

	it('reports a required mismatch without applying it', () => {
		const authored = authoredUom()
		;(authored.fields as AuthoredDoctype[])[0].required = false

		const { doctype, drift } = mergeIntrospectedDoctype(authored, generatedUom())
		expect((doctype.fields as AuthoredDoctype[])[0].required).toBe(false)
		expect(drift.requiredDrift.join()).toContain('uomName')
	})

	it('reports agreement as clean when the authored key is the derivable one', () => {
		const authored: AuthoredDoctype = {
			name: 'Uom',
			slug: 'uom',
			fields: [
				{ kind: 'field', fieldname: 'id', label: 'Id', component: 'ATextInput', required: true, primaryKey: true },
				{ kind: 'field', fieldname: 'uomName', label: 'UOM Name', component: 'ATextInput', required: true },
				{ kind: 'field', fieldname: 'symbol', label: 'Symbol', component: 'ATextInput' },
				{ kind: 'field', fieldname: 'active', label: 'Active', component: 'ACheckbox' },
			],
		}

		const { drift } = mergeIntrospectedDoctype(authored, generatedUom())
		expect(drift.mode).toBe('clean')
		expect(drift.reason).toBeUndefined()
		expect(drift.identityDrift).toEqual([])
	})
})
