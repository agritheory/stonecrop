import { describe, it, expect, beforeEach } from 'vitest'

import { getSqlColumns } from '../src/plugin/postgraphile'
import { loadDoctypesFromObject, getMeta, clearRegistry } from '../src/registry/doctypes'

// ===========================================================================
// getSqlColumns — SQL column selection rules
//
// Regression guard for the display/mode conflation: the SELECT-column builder
// must key the "no backing DB column" decision off `fieldtype: 'Display'`
// ONLY. `mode` is an interaction/rendering concern ('edit' | 'read' | 'display')
// and a `mode: 'display'` field still has a real column that must be selected.
// (See schema/src/mode.ts and schema/src/fieldtype.ts.)
// ===========================================================================

describe('getSqlColumns', { tags: ['unit', 'graphql'] }, () => {
	beforeEach(() => {
		clearRegistry()
	})

	it('selects mode:"display" columns but excludes fieldtype:"Display" fields', () => {
		loadDoctypesFromObject({
			ColumnSample: {
				name: 'ColumnSample',
				fields: [
					{ kind: 'field', fieldname: 'id', fieldtype: 'PrimaryKey', label: 'ID' },
					{ kind: 'field', fieldname: 'name', fieldtype: 'Data', label: 'Name' },
					// real column the author renders read-only as plain text — MUST be selected
					{ kind: 'field', fieldname: 'createdAt', fieldtype: 'Datetime', label: 'Created At', mode: 'display' },
					// real column rendered read-only with form chrome — MUST be selected
					{ kind: 'field', fieldname: 'status', fieldtype: 'Data', label: 'Status', mode: 'read' },
					// computed, no backing column — MUST be excluded
					{ kind: 'field', fieldname: 'computedTotal', fieldtype: 'Display', label: 'Computed Total' },
				],
			},
		})

		const columns = getSqlColumns(getMeta('ColumnSample')!)

		// mode:'display' field is selected, aliased camel<-snake
		expect(columns).toContain('"created_at" AS "createdAt"')
		// mode:'read' field is selected
		expect(columns).toContain('"status"')
		// plain editable field is selected
		expect(columns).toContain('"name"')
		// fieldtype:'Display' field is NOT selected (no backing column)
		expect(columns).not.toContain('computed_total')
		expect(columns).not.toContain('computedTotal')
	})

	it('excludes computed:true fields and selects the primaryKey column (component-primary)', () => {
		loadDoctypesFromObject({
			ComputedSample: {
				name: 'ComputedSample',
				fields: [
					{ kind: 'field', fieldname: 'id', component: 'ATextInput', primaryKey: true, label: 'ID' },
					{ kind: 'field', fieldname: 'name', component: 'ATextInput', label: 'Name' },
					// computed, no backing column — MUST be excluded (was fieldtype:'Display')
					{ kind: 'field', fieldname: 'total', component: 'ANumericInput', computed: true, label: 'Total' },
				],
			},
		})

		const columns = getSqlColumns(getMeta('ComputedSample')!)

		expect(columns).toContain('"id"')
		expect(columns).toContain('"name"')
		expect(columns).not.toContain('total')
	})

	it('flattens Fieldset children into columns and omits the container', () => {
		loadDoctypesFromObject({
			FieldsetSample: {
				name: 'FieldsetSample',
				fields: [
					{ kind: 'field', fieldname: 'id', fieldtype: 'PrimaryKey', label: 'ID' },
					{
						fieldname: 'basicInfo_fieldset',
						fieldtype: 'Fieldset',
						component: 'AFieldset',
						schema: [
							{ fieldname: 'itemName', fieldtype: 'Data', label: 'Name' },
							{ fieldname: 'itemColor', fieldtype: 'Data', label: 'Color', mode: 'display' },
						],
					},
				],
			},
		})

		const columns = getSqlColumns(getMeta('FieldsetSample')!)

		// children are flattened into the SELECT
		expect(columns).toContain('"item_name" AS "itemName"')
		// a mode:'display' child is still selected
		expect(columns).toContain('"item_color" AS "itemColor"')
		// the Fieldset container itself is not a column
		expect(columns).not.toContain('basicInfo_fieldset')
		expect(columns).not.toContain('basic_info_fieldset')
	})

	it('still selects an inline link FK column even though it has a links declaration', () => {
		// An inline component means the link is not expanded, so `userId` is a real FK column on this
		// table and must be SELECTed. Excluding every declared link would silently strip it from queries.
		loadDoctypesFromObject({
			InlineLinkSample: {
				name: 'InlineLinkSample',
				fields: [
					{ kind: 'field', fieldname: 'id', primaryKey: true, label: 'ID' },
					{ kind: 'field', fieldname: 'userId', component: 'AFormLink', doctype: 'user', label: 'User' },
				],
				links: {
					userId: { target: 'user', cardinality: 'atMostOne' as const, fieldname: 'userId' },
				},
			},
		})

		const columns = getSqlColumns(getMeta('InlineLinkSample')!)

		expect(columns).toContain('"user_id" AS "userId"')
	})

	it('excludes Link fields that have an explicit links declaration', () => {
		loadDoctypesFromObject({
			LinkSample: {
				name: 'LinkSample',
				fields: [
					{ kind: 'field', fieldname: 'id', fieldtype: 'PrimaryKey', label: 'ID' },
					{ kind: 'field', fieldname: 'name', fieldtype: 'Data', label: 'Name' },
				],
				links: {
					children: {
						target: 'ColumnSample',
						cardinality: 'noneOrMany' as const,
						backlink: 'parent_id',
					},
				},
			},
		})

		const columns = getSqlColumns(getMeta('LinkSample')!)

		expect(columns).toContain('"name"')
		// the declared link is not a scalar column on this table
		expect(columns).not.toContain('children')
	})
})
