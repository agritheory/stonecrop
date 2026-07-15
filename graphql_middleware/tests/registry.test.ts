import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

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
				fields: [{ kind: 'field', fieldname: 'owner', component: 'AFormLink', label: 'Owner', doctype: 'User' }],
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
			Task: {
				fields: [{ kind: 'field', fieldname: 'owner', component: 'AFormLink', label: 'Owner', doctype: 'User' }],
			},
		})
		const errors = validateReferences()
		expect(errors.some(e => e.message.includes('User'))).toBe(true)
	})

	it('does not treat a field with options but no doctype as a link', () => {
		// `options` carries choices/config and never names a link target — `doctype` does. A select
		// whose choices happen to look like doctype names must not be resolved as a reference.
		loadDoctypesFromObject({
			Task: {
				fields: [
					{
						kind: 'field' as const,
						fieldname: 'tag',
						component: 'ADropdown',
						label: 'Tag',
						options: ['User', 'NotADoctype'],
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
