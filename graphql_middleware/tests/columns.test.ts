import { describe, it, expect, beforeEach } from 'vitest'

import { getColumnSelections } from '../src/plugin/postgraphile'
import { loadDoctypesFromObject, getMeta, clearRegistry } from '../src/registry/doctypes'

// ===========================================================================
// getColumnSelections — SQL column selection rules
//
// Regression guard for the display/mode conflation: the SELECT-column builder
// must key the "no backing DB column" decision off `component: 'ATextInput', computed: true`
// ONLY. `mode` is an interaction/rendering concern ('edit' | 'read' | 'display')
// and a `mode: 'display'` field still has a real column that must be selected.
// (See schema/src/mode.ts and schema/src/component-meta.ts.)
//
// Each test asserts the whole selection, so a column wrongly kept and one wrongly dropped both fail.
// ===========================================================================

describe('getColumnSelections', { tags: ['unit', 'graphql'] }, () => {
	beforeEach(() => {
		clearRegistry()
	})

	it('selects mode:"display" columns but excludes computed fields', () => {
		loadDoctypesFromObject({
			ColumnSample: {
				name: 'ColumnSample',
				fields: [
					{ kind: 'field', fieldname: 'id', component: 'ATextInput', primaryKey: true, label: 'ID' },
					{ kind: 'field', fieldname: 'name', component: 'ATextInput', label: 'Name' },
					// real column the author renders read-only as plain text — MUST be selected
					{ kind: 'field', fieldname: 'createdAt', component: 'ADateTime', label: 'Created At', mode: 'display' },
					// real column rendered read-only with form chrome — MUST be selected
					{ kind: 'field', fieldname: 'status', component: 'ATextInput', label: 'Status', mode: 'read' },
					// computed, no backing column — MUST be excluded
					{
						kind: 'field',
						fieldname: 'computedTotal',
						component: 'ATextInput',
						computed: true,
						label: 'Computed Total',
					},
				],
			},
		})

		expect(getColumnSelections(getMeta('ColumnSample')!)).toEqual([
			{ column: 'id', alias: 'id' },
			{ column: 'name', alias: 'name' },
			// mode:'display' field is selected, aliased camel<-snake
			{ column: 'created_at', alias: 'createdAt' },
			// mode:'read' field is selected
			{ column: 'status', alias: 'status' },
		])
	})

	it('excludes computed:true fields and selects the primaryKey column (component-primary)', () => {
		loadDoctypesFromObject({
			ComputedSample: {
				name: 'ComputedSample',
				fields: [
					{ kind: 'field', fieldname: 'id', component: 'ATextInput', primaryKey: true, label: 'ID' },
					{ kind: 'field', fieldname: 'name', component: 'ATextInput', label: 'Name' },
					// computed, no backing column — MUST be excluded
					{ kind: 'field', fieldname: 'total', component: 'ANumericInput', computed: true, label: 'Total' },
				],
			},
		})

		expect(getColumnSelections(getMeta('ComputedSample')!)).toEqual([
			{ column: 'id', alias: 'id' },
			{ column: 'name', alias: 'name' },
		])
	})

	it('flattens Fieldset children into columns and omits the container', () => {
		loadDoctypesFromObject({
			FieldsetSample: {
				name: 'FieldsetSample',
				fields: [
					{ kind: 'field', fieldname: 'id', component: 'ATextInput', primaryKey: true, label: 'ID' },
					{
						fieldname: 'basicInfo_fieldset',

						component: 'AFieldset',
						schema: [
							{ fieldname: 'itemName', component: 'ATextInput', label: 'Name' },
							{ fieldname: 'itemColor', component: 'ATextInput', label: 'Color', mode: 'display' },
						],
					},
				],
			},
		})

		// children are flattened into the SELECT, a mode:'display' child included, and the container is not a column
		expect(getColumnSelections(getMeta('FieldsetSample')!)).toEqual([
			{ column: 'id', alias: 'id' },
			{ column: 'item_name', alias: 'itemName' },
			{ column: 'item_color', alias: 'itemColor' },
		])
	})

	it('still selects an inline link FK column even though it has a links declaration', () => {
		// An inline component means the link is not expanded, so `userId` is a real FK column on this
		// table and must be SELECTed. Excluding every declared link would silently strip it from queries.
		loadDoctypesFromObject({
			InlineLinkSample: {
				name: 'InlineLinkSample',
				fields: [
					{ kind: 'field', fieldname: 'id', component: 'ATextInput', primaryKey: true, label: 'ID' },
					{ kind: 'field', fieldname: 'userId', component: 'AFormLink', doctype: 'user', label: 'User' },
				],
				links: {
					userId: { target: 'user', cardinality: 'atMostOne' as const, fieldname: 'userId' },
				},
			},
		})

		expect(getColumnSelections(getMeta('InlineLinkSample')!)).toEqual([
			{ column: 'id', alias: 'id' },
			{ column: 'user_id', alias: 'userId' },
		])
	})

	it('excludes Link fields that have an explicit links declaration', () => {
		loadDoctypesFromObject({
			LinkSample: {
				name: 'LinkSample',
				fields: [
					{ kind: 'field', fieldname: 'id', component: 'ATextInput', primaryKey: true, label: 'ID' },
					{ kind: 'field', fieldname: 'name', component: 'ATextInput', label: 'Name' },
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

		// the declared link is not a scalar column on this table
		expect(getColumnSelections(getMeta('LinkSample')!)).toEqual([
			{ column: 'id', alias: 'id' },
			{ column: 'name', alias: 'name' },
		])
	})
})
