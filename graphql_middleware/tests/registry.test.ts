import type { DoctypeMeta as DoctypeMetaType } from '@stonecrop/schema'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import {
	registerHandler,
	getHandler,
	hasHandler,
	clearHandlers,
	builtinHandlers,
	registerBuiltinHandlers,
} from '../src/registry/actions'
import {
	loadDoctypes,
	loadDoctypesFromObject,
	getMeta,
	getAllMeta,
	hasMeta,
	clearRegistry,
	validateReferences,
	DoctypeValidationError,
} from '../src/registry/doctypes'
import type { ActionContext } from '../src/types'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const mockExecutor = { query: vi.fn(), mutate: vi.fn() }

function makeContext(doctype: DoctypeMetaType): ActionContext {
	return { doctype, executor: mockExecutor }
}

const minimalDoctype: DoctypeMetaType = { name: 'Task', fields: [] }

// ===========================================================================
// registry/actions.ts — handler registry
// ===========================================================================

describe('handler registry', { tags: ['unit', 'graphql'] }, () => {
	beforeEach(() => clearHandlers())

	it('registers and retrieves a handler', () => {
		const fn = vi.fn().mockResolvedValue('ok')
		registerHandler('myAction', fn)
		expect(getHandler('myAction')).toBe(fn)
	})

	it('hasHandler returns false for unknown name', () => {
		expect(hasHandler('unknown')).toBe(false)
	})

	it('hasHandler returns true after registration', () => {
		registerHandler('present', vi.fn())
		expect(hasHandler('present')).toBe(true)
	})

	it('getHandler returns undefined for unregistered name', () => {
		expect(getHandler('nope')).toBeUndefined()
	})

	it('clearHandlers removes all registered handlers', () => {
		registerHandler('a', vi.fn())
		registerHandler('b', vi.fn())
		clearHandlers()
		expect(hasHandler('a')).toBe(false)
		expect(hasHandler('b')).toBe(false)
	})

	it('later registration overwrites earlier one', () => {
		const fn1 = vi.fn()
		const fn2 = vi.fn()
		registerHandler('duplicate', fn1)
		registerHandler('duplicate', fn2)
		expect(getHandler('duplicate')).toBe(fn2)
	})
})

describe('registerBuiltinHandlers', { tags: ['unit', 'graphql'] }, () => {
	beforeEach(() => {
		clearHandlers()
		registerBuiltinHandlers()
	})

	it('registers validateRequiredFields', () => {
		expect(hasHandler('validateRequiredFields')).toBe(true)
	})

	it('registers validateFieldTypes', () => {
		expect(hasHandler('validateFieldTypes')).toBe(true)
	})

	it('registers noop', () => {
		expect(hasHandler('noop')).toBe(true)
	})

	it('builtinHandlers export contains the 3 built-ins', () => {
		expect(Object.keys(builtinHandlers)).toContain('validateRequiredFields')
		expect(Object.keys(builtinHandlers)).toContain('validateFieldTypes')
		expect(Object.keys(builtinHandlers)).toContain('noop')
	})
})

// ===========================================================================
// noop handler
// ===========================================================================

describe('noop handler', { tags: ['unit', 'graphql'] }, () => {
	it('returns { ok: true }', async () => {
		const result = await builtinHandlers.noop([], makeContext(minimalDoctype))
		expect(result).toEqual({ ok: true })
	})
})

// ===========================================================================
// validateRequiredFields handler
// ===========================================================================

describe('validateRequiredFields handler', { tags: ['unit', 'graphql'] }, () => {
	const doctypeWithRequired: DoctypeMetaType = {
		name: 'StrictTask',
		fields: [
			{ kind: 'field', fieldname: 'title', fieldtype: 'Data', label: 'Title', required: true },
			{ kind: 'field', fieldname: 'status', fieldtype: 'Data', label: 'Status', required: true },
			{ kind: 'field', fieldname: 'notes', fieldtype: 'Text', label: 'Notes' },
		],
	}

	it('passes when all required fields are present', async () => {
		const record = { title: 'Fix bug', status: 'open' }
		const result = await builtinHandlers.validateRequiredFields([record], makeContext(doctypeWithRequired))
		expect(result).toEqual({ valid: true })
	})

	it('passes when optional fields are absent', async () => {
		const record = { title: 'Fix bug', status: 'open' }
		const result = await builtinHandlers.validateRequiredFields([record], makeContext(doctypeWithRequired))
		expect(result).toEqual({ valid: true })
	})

	it('throws when a required field is undefined', async () => {
		const record = { title: 'Fix bug' } // status missing
		await expect(builtinHandlers.validateRequiredFields([record], makeContext(doctypeWithRequired))).rejects.toThrow(
			'Missing required fields'
		)
	})

	it('throws when a required field is null', async () => {
		const record = { title: 'Fix bug', status: null }
		await expect(builtinHandlers.validateRequiredFields([record], makeContext(doctypeWithRequired))).rejects.toThrow(
			'Status'
		)
	})

	it('includes the field label in the error message', async () => {
		const record = {} // both title and status missing
		await expect(builtinHandlers.validateRequiredFields([record], makeContext(doctypeWithRequired))).rejects.toThrow(
			'Title'
		)
	})

	it('uses fieldname when label is absent', async () => {
		const doctype: DoctypeMetaType = {
			name: 'X',
			fields: [{ kind: 'field', fieldname: 'ref_id', fieldtype: 'Data', required: true }],
		}
		await expect(builtinHandlers.validateRequiredFields([{}], makeContext(doctype))).rejects.toThrow('ref_id')
	})
})

// ===========================================================================
// validateFieldTypes handler
// ===========================================================================

describe('validateFieldTypes handler', { tags: ['unit', 'graphql'] }, () => {
	const typedDoctype: DoctypeMetaType = {
		name: 'Typed',
		fields: [
			{ kind: 'field', fieldname: 'count', fieldtype: 'Int', label: 'Count' },
			{ kind: 'field', fieldname: 'amount', fieldtype: 'Float', label: 'Amount' },
			{ kind: 'field', fieldname: 'decimal_val', fieldtype: 'Decimal', label: 'Decimal' },
			{ kind: 'field', fieldname: 'currency_val', fieldtype: 'Currency', label: 'Currency' },
			{ kind: 'field', fieldname: 'qty', fieldtype: 'Quantity', label: 'Qty' },
			{ kind: 'field', fieldname: 'is_active', fieldtype: 'Check', label: 'Active' },
			{ kind: 'field', fieldname: 'name', fieldtype: 'Data', label: 'Name' },
			{ kind: 'field', fieldname: 'note', fieldtype: 'Text', label: 'Note' },
			{ kind: 'field', fieldname: 'code_val', fieldtype: 'Code', label: 'Code' },
			{ kind: 'field', fieldname: 'link_val', fieldtype: 'Link', label: 'Link' },
			{ kind: 'field', fieldname: 'due_date', fieldtype: 'Date', label: 'Date' },
			{ kind: 'field', fieldname: 'meeting_time', fieldtype: 'Time', label: 'Time' },
			{ kind: 'field', fieldname: 'created_at', fieldtype: 'Datetime', label: 'Datetime' },
			{ kind: 'field', fieldname: 'meta', fieldtype: 'JSON', label: 'Meta' },
		],
		links: {
			items: { target: 'item', cardinality: 'noneOrMany' },
			parent: { target: 'parent', cardinality: 'one' },
		},
	}

	it('passes with all correctly-typed values', async () => {
		const record = {
			count: 5,
			amount: 9.99,
			decimal_val: '1.23',
			currency_val: 100,
			qty: 3,
			is_active: true,
			name: 'hello',
			note: 'a note',
			code_val: 'const x = 1',
			link_val: 'SomeDoctype',
			due_date: '2024-01-01',
			meeting_time: '10:00',
			created_at: '2024-01-01T10:00:00Z',
			meta: { key: 'value' },
			items: [{ row: 1 }],
			parent: { name: 'parent' },
		}
		const result = await builtinHandlers.validateFieldTypes([record], makeContext(typedDoctype))
		expect(result).toEqual({ valid: true })
	})

	it('skips null and undefined field values', async () => {
		const record = { count: null, amount: undefined }
		const result = await builtinHandlers.validateFieldTypes([record], makeContext(typedDoctype))
		expect(result).toEqual({ valid: true })
	})

	it('throws for a non-integer Int value (float)', async () => {
		await expect(builtinHandlers.validateFieldTypes([{ count: 3.14 }], makeContext(typedDoctype))).rejects.toThrow(
			'expected integer'
		)
	})

	it('throws for a non-integer Int value (string)', async () => {
		await expect(builtinHandlers.validateFieldTypes([{ count: 'five' }], makeContext(typedDoctype))).rejects.toThrow(
			'count'
		)
	})

	it('throws for a non-boolean Check value', async () => {
		await expect(builtinHandlers.validateFieldTypes([{ is_active: 'yes' }], makeContext(typedDoctype))).rejects.toThrow(
			'expected boolean'
		)
	})

	it('throws for a non-string Data value', async () => {
		await expect(builtinHandlers.validateFieldTypes([{ name: 42 }], makeContext(typedDoctype))).rejects.toThrow(
			'expected string'
		)
	})

	it('throws for a non-string Text value', async () => {
		await expect(builtinHandlers.validateFieldTypes([{ note: 99 }], makeContext(typedDoctype))).rejects.toThrow(
			'expected string'
		)
	})

	it('throws for a non-string Code value', async () => {
		await expect(builtinHandlers.validateFieldTypes([{ code_val: true }], makeContext(typedDoctype))).rejects.toThrow(
			'expected string'
		)
	})

	it('throws for a non-string Link value', async () => {
		await expect(builtinHandlers.validateFieldTypes([{ link_val: 123 }], makeContext(typedDoctype))).rejects.toThrow(
			'expected string'
		)
	})

	it('throws for a non-number Float value', async () => {
		await expect(builtinHandlers.validateFieldTypes([{ amount: true }], makeContext(typedDoctype))).rejects.toThrow(
			'expected number'
		)
	})

	it('throws for a non-object JSON value', async () => {
		await expect(
			builtinHandlers.validateFieldTypes([{ meta: 'not-an-object' }], makeContext(typedDoctype))
		).rejects.toThrow('expected object')
	})

	it('throws for a non-array link value with cardinality noneOrMany', async () => {
		await expect(
			builtinHandlers.validateFieldTypes([{ items: 'not-an-array' }], makeContext(typedDoctype))
		).rejects.toThrow('expected array')
	})

	it('throws for a non-object link value with cardinality one (default)', async () => {
		await expect(
			builtinHandlers.validateFieldTypes([{ parent: 'not-an-object' }], makeContext(typedDoctype))
		).rejects.toThrow('expected object')
	})

	it('throws for an array link value with cardinality one (default)', async () => {
		await expect(
			builtinHandlers.validateFieldTypes([{ parent: [{ name: 'parent' }] }], makeContext(typedDoctype))
		).rejects.toThrow('expected object')
	})

	it('accepts a Date instance for Date field', async () => {
		const result = await builtinHandlers.validateFieldTypes(
			[{ due_date: new Date('2024-01-01') }],
			makeContext(typedDoctype)
		)
		expect(result).toEqual({ valid: true })
	})

	it('throws for a numeric Date field value', async () => {
		await expect(
			builtinHandlers.validateFieldTypes([{ due_date: 20240101 }], makeContext(typedDoctype))
		).rejects.toThrow('expected date string or Date')
	})

	it('unknown fieldtype passes without error', async () => {
		const doctype: DoctypeMetaType = {
			name: 'Unknown',
			fields: [{ kind: 'field', fieldname: 'x', fieldtype: 'CustomType' as 'Data', label: 'X' }],
		}
		const result = await builtinHandlers.validateFieldTypes([{ x: 'anything' }], makeContext(doctype))
		expect(result).toEqual({ valid: true })
	})
})

// ===========================================================================
// registry/doctypes.ts — DoctypeValidationError
// ===========================================================================

describe('DoctypeValidationError', { tags: ['unit', 'graphql'] }, () => {
	it('formats a multi-error message', () => {
		const err = new DoctypeValidationError('my-file.json', [
			{ path: ['name'], message: 'Required' },
			{ path: ['fields', 0, 'fieldname'], message: 'Invalid' },
		])
		expect(err.message).toContain('my-file.json')
		expect(err.message).toContain('name: Required')
		expect(err.name).toBe('DoctypeValidationError')
		expect(err.file).toBe('my-file.json')
		expect(err.errors).toHaveLength(2)
	})

	it('is an instance of Error', () => {
		const err = new DoctypeValidationError('f.json', [{ path: [], message: 'bad' }])
		expect(err).toBeInstanceOf(Error)
	})
})

// ===========================================================================
// registry/doctypes.ts — loadDoctypesFromObject
// ===========================================================================

describe('loadDoctypesFromObject', { tags: ['unit', 'graphql'] }, () => {
	beforeEach(() => clearRegistry())

	it('loads a single valid doctype by key name', () => {
		loadDoctypesFromObject({ Task: { fields: [] } })
		expect(hasMeta('Task')).toBe(true)
	})

	it('loads multiple valid doctypes', () => {
		loadDoctypesFromObject({ Task: { fields: [] }, Project: { fields: [] } })
		expect(hasMeta('Task')).toBe(true)
		expect(hasMeta('Project')).toBe(true)
		expect(getAllMeta()).toHaveLength(2)
	})

	it('throws DoctypeValidationError for invalid data by default', () => {
		expect(() => loadDoctypesFromObject({ Bad: { fields: 'not-array' } })).toThrow(DoctypeValidationError)
	})

	it('continues on error when continueOnError is true', () => {
		const onError = vi.fn()
		loadDoctypesFromObject({ Bad: { fields: 'not-array' }, Good: { fields: [] } }, { continueOnError: true, onError })
		expect(onError).toHaveBeenCalledOnce()
		expect(hasMeta('Good')).toBe(true)
		expect(hasMeta('Bad')).toBe(false)
	})

	it('calls onError with the key name', () => {
		const onError = vi.fn()
		loadDoctypesFromObject({ BrokenDoctype: { fields: 'bad' } }, { continueOnError: true, onError })
		expect(onError.mock.calls[0][0]).toBe('BrokenDoctype')
	})

	it('silently skips invalid without onError callback', () => {
		expect(() => loadDoctypesFromObject({ Bad: { fields: 'bad' } }, { continueOnError: true })).not.toThrow()
	})
})

// ===========================================================================
// registry/doctypes.ts — getMeta / getAllMeta / hasMeta / clearRegistry
// ===========================================================================

describe('getMeta / getAllMeta / hasMeta / clearRegistry', { tags: ['unit', 'graphql'] }, () => {
	beforeEach(() => clearRegistry())

	it('getMeta returns undefined for unknown doctype', () => {
		expect(getMeta('Unknown')).toBeUndefined()
	})

	it('getAllMeta returns empty array when registry is empty', () => {
		expect(getAllMeta()).toHaveLength(0)
	})

	it('getMeta returns the registered doctype', () => {
		loadDoctypesFromObject({ Task: { fields: [] } })
		const meta = getMeta('Task')
		expect(meta).toBeDefined()
		expect(meta?.name).toBe('Task')
	})

	it('getMeta finds doctype by slug when name lookup fails', () => {
		loadDoctypesFromObject({
			RecipeTask: { name: 'RecipeTask', slug: 'recipe-task', fields: [] },
		})
		expect(getMeta('RecipeTask')).toBeDefined()
		expect(getMeta('recipe-task')).toBeDefined()
		expect(getMeta('recipe-task')?.name).toBe('RecipeTask')
		expect(getMeta('unknown-slug')).toBeUndefined()
	})

	it('hasMeta returns false before loading', () => {
		expect(hasMeta('Task')).toBe(false)
	})

	it('hasMeta returns true after loading', () => {
		loadDoctypesFromObject({ Task: { fields: [] } })
		expect(hasMeta('Task')).toBe(true)
	})

	it('clearRegistry removes all doctypes', () => {
		loadDoctypesFromObject({ Task: { fields: [] }, Project: { fields: [] } })
		clearRegistry()
		expect(hasMeta('Task')).toBe(false)
		expect(getAllMeta()).toHaveLength(0)
	})
})

// ===========================================================================
// registry/doctypes.ts — validateReferences
// ===========================================================================

describe('validateReferences', { tags: ['unit', 'graphql'] }, () => {
	beforeEach(() => clearRegistry())

	it('returns empty array when all references are valid', () => {
		loadDoctypesFromObject({
			User: { fields: [] },
			Task: {
				fields: [{ kind: 'field', fieldname: 'owner', fieldtype: 'Link', label: 'Owner', options: 'User' }],
			},
		})
		expect(validateReferences()).toHaveLength(0)
	})

	it('reports error for unknown inherits reference', () => {
		loadDoctypesFromObject({ Task: { fields: [], inherits: 'BaseTask' } })
		const errors = validateReferences()
		expect(errors.some(e => e.message.includes('BaseTask'))).toBe(true)
	})

	it('reports error for Link field targeting unknown doctype', () => {
		loadDoctypesFromObject({
			Task: { fields: [{ kind: 'field', fieldname: 'owner', fieldtype: 'Link', label: 'Owner', options: 'User' }] },
		})
		const errors = validateReferences()
		expect(errors.some(e => e.message.includes('User'))).toBe(true)
	})

	it('does not report error for Link field with non-string options', () => {
		loadDoctypesFromObject({
			Task: {
				fields: [
					{
						kind: 'field' as const,
						fieldname: 'tag',
						fieldtype: 'Link',
						label: 'Tag',
						options: { component: 'Select' } as unknown as string,
					},
				],
			},
		})
		const errors = validateReferences()
		expect(errors.filter(e => e.path.includes('tag'))).toHaveLength(0)
	})

	it('returns multiple errors when multiple broken references exist', () => {
		loadDoctypesFromObject({
			Task: {
				fields: [],
				inherits: 'BaseTask',
			},
		})
		const errors = validateReferences()
		expect(errors.length).toBeGreaterThanOrEqual(1)
	})
})

// ===========================================================================
// registry/doctypes.ts — loadDoctypes (filesystem)
// ===========================================================================

describe('loadDoctypes', { tags: ['unit', 'graphql'] }, () => {
	let tmpDir: string

	beforeEach(() => {
		clearRegistry()
		tmpDir = join(tmpdir(), `stonecrop-test-${Date.now()}-${Math.random().toString(36).slice(2)}`)
		mkdirSync(tmpDir, { recursive: true })
	})

	afterEach(() => {
		rmSync(tmpDir, { recursive: true, force: true })
	})

	it('loads a valid doctype JSON file', () => {
		writeFileSync(join(tmpDir, 'task.json'), JSON.stringify({ name: 'Task', fields: [] }))
		loadDoctypes(tmpDir)
		expect(hasMeta('Task')).toBe(true)
	})

	it('loads multiple JSON files from a directory', () => {
		writeFileSync(join(tmpDir, 'task.json'), JSON.stringify({ name: 'Task', fields: [] }))
		writeFileSync(join(tmpDir, 'project.json'), JSON.stringify({ name: 'Project', fields: [] }))
		loadDoctypes(tmpDir)
		expect(hasMeta('Task')).toBe(true)
		expect(hasMeta('Project')).toBe(true)
	})

	it('skips non-JSON files', () => {
		writeFileSync(join(tmpDir, 'readme.txt'), 'not a doctype')
		writeFileSync(join(tmpDir, 'task.json'), JSON.stringify({ name: 'Task', fields: [] }))
		loadDoctypes(tmpDir)
		expect(getAllMeta()).toHaveLength(1)
	})

	it('recurses into subdirectories', () => {
		const subDir = join(tmpDir, 'sub')
		mkdirSync(subDir)
		writeFileSync(join(subDir, 'nested.json'), JSON.stringify({ name: 'Nested', fields: [] }))
		loadDoctypes(tmpDir)
		expect(hasMeta('Nested')).toBe(true)
	})

	it('throws DoctypeValidationError on invalid JSON by default', () => {
		writeFileSync(join(tmpDir, 'bad.json'), '{ not valid json')
		expect(() => loadDoctypes(tmpDir)).toThrow(DoctypeValidationError)
	})

	it('throws DoctypeValidationError on valid JSON that fails schema validation', () => {
		writeFileSync(join(tmpDir, 'bad.json'), JSON.stringify({ name: 'Bad', fields: 'not-array' }))
		expect(() => loadDoctypes(tmpDir)).toThrow(DoctypeValidationError)
	})

	it('continues on invalid JSON with continueOnError', () => {
		const onError = vi.fn()
		writeFileSync(join(tmpDir, 'bad.json'), '{ not valid json')
		writeFileSync(join(tmpDir, 'good.json'), JSON.stringify({ name: 'Good', fields: [] }))
		loadDoctypes(tmpDir, { continueOnError: true, onError })
		expect(onError).toHaveBeenCalledOnce()
		expect(hasMeta('Good')).toBe(true)
	})

	it('continues on schema validation error with continueOnError', () => {
		const onError = vi.fn()
		writeFileSync(join(tmpDir, 'bad.json'), JSON.stringify({ name: 'Bad', fields: 'not-array' }))
		writeFileSync(join(tmpDir, 'good.json'), JSON.stringify({ name: 'Good', fields: [] }))
		loadDoctypes(tmpDir, { continueOnError: true, onError })
		expect(onError).toHaveBeenCalledOnce()
		expect(hasMeta('Good')).toBe(true)
	})

	it('silently skips invalid files without onError callback', () => {
		writeFileSync(join(tmpDir, 'bad.json'), '{ bad json')
		expect(() => loadDoctypes(tmpDir, { continueOnError: true })).not.toThrow()
	})
})
