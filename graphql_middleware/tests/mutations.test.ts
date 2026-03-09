import type { DoctypeMeta } from '@stonecrop/schema'
import { describe, it, expect } from 'vitest'

import {
	defaultCreateMutationName,
	defaultUpdateMutationName,
	defaultDeleteMutationName,
	defaultRecordTypeName,
	buildCreateMutation,
	buildUpdateMutation,
	buildDeleteMutation,
	extractMutationResult,
	BUILTIN_WRITE_ACTIONS,
} from '../src/plugin/postgraphile'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const scalarOnlyMeta: DoctypeMeta = {
	name: 'Resource',
	tableName: 'resources',
	fields: [
		{ fieldname: 'id', fieldtype: 'Data', label: 'ID' },
		{ fieldname: 'name', fieldtype: 'Data', label: 'Name' },
		{ fieldname: 'quantity', fieldtype: 'Int', label: 'Quantity' },
		{ fieldname: 'is_active', fieldtype: 'Check', label: 'Active' },
	],
}

const mixedFieldsMeta: DoctypeMeta = {
	name: 'Recipe',
	tableName: 'recipes',
	fields: [
		{ fieldname: 'id', fieldtype: 'Data', label: 'ID' },
		{ fieldname: 'title', fieldtype: 'Data', label: 'Title' },
		{ fieldname: 'created_at', fieldtype: 'Datetime', label: 'Created' },
		{ fieldname: 'userByCreatedBy', fieldtype: 'Link', label: 'Creator', options: 'user' },
		{
			fieldname: 'recipeIngredientsByRecipeId',
			fieldtype: 'Doctype',
			label: 'Ingredients',
			options: 'recipe-ingredient',
		},
		{ fieldname: 'rating', fieldtype: 'Float', label: 'Rating' },
	],
}

// ===========================================================================
// BUILTIN_WRITE_ACTIONS
// ===========================================================================

describe('BUILTIN_WRITE_ACTIONS', () => {
	it('contains create, update, delete', () => {
		expect(BUILTIN_WRITE_ACTIONS.has('create')).toBe(true)
		expect(BUILTIN_WRITE_ACTIONS.has('update')).toBe(true)
		expect(BUILTIN_WRITE_ACTIONS.has('delete')).toBe(true)
	})

	it('does not contain other action names', () => {
		expect(BUILTIN_WRITE_ACTIONS.has('submit')).toBe(false)
		expect(BUILTIN_WRITE_ACTIONS.has('approve')).toBe(false)
	})
})

// ===========================================================================
// buildCreateMutation
// ===========================================================================

describe('buildCreateMutation', () => {
	it('generates a typed input mutation with correct field', () => {
		const mutation = buildCreateMutation(scalarOnlyMeta, defaultCreateMutationName, defaultRecordTypeName)
		expect(mutation).toContain('mutation CreateRecord($input: CreateResourceInput!)')
		expect(mutation).toContain('createResource(input: $input)')
		expect(mutation).toContain('resource {')
	})

	it('includes scalar fields in the selection set', () => {
		const mutation = buildCreateMutation(scalarOnlyMeta, defaultCreateMutationName, defaultRecordTypeName)
		expect(mutation).toContain('id')
		expect(mutation).toContain('name')
		expect(mutation).toContain('quantity')
	})

	it('excludes relation fields from selection', () => {
		const mutation = buildCreateMutation(mixedFieldsMeta, defaultCreateMutationName, defaultRecordTypeName)
		expect(mutation).toContain('title')
		expect(mutation).not.toContain('userByCreatedBy')
		expect(mutation).not.toContain('recipeIngredientsByRecipeId')
	})

	it('uses snake_case table names correctly', () => {
		const mutation = buildCreateMutation(mixedFieldsMeta, defaultCreateMutationName, defaultRecordTypeName)
		expect(mutation).toContain('createRecipe(input: $input)')
		expect(mutation).toContain('recipe {')
	})

	it('accepts custom inflection', () => {
		const mutation = buildCreateMutation(
			scalarOnlyMeta,
			() => 'insertResource',
			() => 'resource'
		)
		expect(mutation).toContain('mutation CreateRecord($input: InsertResourceInput!)')
		expect(mutation).toContain('insertResource(input: $input)')
	})
})

// ===========================================================================
// buildUpdateMutation
// ===========================================================================

describe('buildUpdateMutation', () => {
	it('generates a typed input mutation', () => {
		const mutation = buildUpdateMutation(scalarOnlyMeta, defaultUpdateMutationName, defaultRecordTypeName)
		expect(mutation).toContain('mutation UpdateRecord($input: UpdateResourceByIdInput!)')
		expect(mutation).toContain('updateResourceById(input: $input)')
		expect(mutation).toContain('resource {')
	})

	it('includes scalar fields in the selection set', () => {
		const mutation = buildUpdateMutation(scalarOnlyMeta, defaultUpdateMutationName, defaultRecordTypeName)
		expect(mutation).toContain('id')
		expect(mutation).toContain('name')
	})

	it('excludes relation fields from selection', () => {
		const mutation = buildUpdateMutation(mixedFieldsMeta, defaultUpdateMutationName, defaultRecordTypeName)
		expect(mutation).not.toContain('userByCreatedBy')
	})
})

// ===========================================================================
// buildDeleteMutation
// ===========================================================================

describe('buildDeleteMutation', () => {
	it('generates a typed input mutation', () => {
		const mutation = buildDeleteMutation(scalarOnlyMeta, defaultDeleteMutationName, defaultRecordTypeName)
		expect(mutation).toContain('mutation DeleteRecord($input: DeleteResourceByIdInput!)')
		expect(mutation).toContain('deleteResourceById(input: $input)')
		expect(mutation).toContain('resource {')
	})

	it('includes scalar fields in the deletion result selection', () => {
		const mutation = buildDeleteMutation(scalarOnlyMeta, defaultDeleteMutationName, defaultRecordTypeName)
		expect(mutation).toContain('id')
		expect(mutation).toContain('name')
	})
})

// ===========================================================================
// extractMutationResult
// ===========================================================================

describe('extractMutationResult', () => {
	it('extracts the nested record from a create mutation result', () => {
		const record = { id: '1', name: 'New Item' }
		const result = { createResource: { resource: record } }
		expect(extractMutationResult(result, 'createResource', 'resource')).toBe(record)
	})

	it('extracts the nested record from an update mutation result', () => {
		const record = { id: '2', name: 'Updated' }
		const result = { updateResourceById: { resource: record } }
		expect(extractMutationResult(result, 'updateResourceById', 'resource')).toBe(record)
	})

	it('extracts the nested record from a delete mutation result', () => {
		const record = { id: '3', name: 'Deleted' }
		const result = { deleteResourceById: { resource: record } }
		expect(extractMutationResult(result, 'deleteResourceById', 'resource')).toBe(record)
	})

	it('returns undefined when mutation field is absent', () => {
		expect(extractMutationResult({}, 'createResource', 'resource')).toBeUndefined()
	})

	it('returns undefined when type name is absent in mutation result', () => {
		const result = { createResource: {} }
		expect(extractMutationResult(result, 'createResource', 'resource')).toBeUndefined()
	})
})
