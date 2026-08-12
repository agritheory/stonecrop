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

/** A doctype with one scalar field, plus whatever links the case under test needs. */
const withLinks = (links: Record<string, unknown>, fields?: unknown[]) => ({
	Task: {
		slug: 'task',
		fields: fields ?? [{ kind: 'field', fieldname: 'ownerId', component: 'AFormLink', label: 'Owner' }],
		links,
	},
	Owner: { slug: 'owner', fields: [] },
})

describe('validateReferences', { tags: ['unit', 'graphql'] }, () => {
	beforeEach(() => clearRegistry())

	// A link target is a SLUG and the registry is keyed by NAME. Every fixture here therefore
	// declares both, because the earlier fixtures declared only a name and targeted it by name —
	// a shape no real doctype uses, which is why five green tests never caught the check resolving
	// through the raw Map. Measured against the two in-repo hosts at the time: 12 reported errors,
	// 12 of them false.
	it('resolves a link that targets a doctype by slug', () => {
		loadDoctypesFromObject({
			User: { slug: 'user', fields: [] },
			Task: {
				slug: 'task',
				fields: [{ kind: 'field', fieldname: 'owner', component: 'AFormLink', label: 'Owner', doctype: 'user' }],
			},
		})
		expect(validateReferences()).toHaveLength(0)
	})

	it('resolves a link that targets a doctype by name', () => {
		// `getMeta` accepts either, so a consumer keying by name is not broken by the slug fix.
		loadDoctypesFromObject({
			User: { slug: 'user', fields: [] },
			Task: {
				slug: 'task',
				fields: [{ kind: 'field', fieldname: 'owner', component: 'AFormLink', label: 'Owner', doctype: 'User' }],
			},
		})
		expect(validateReferences()).toHaveLength(0)
	})

	it('resolves a links-map target by slug', () => {
		loadDoctypesFromObject({
			Country: { slug: 'country', fields: [] },
			Continent: {
				slug: 'continent',
				fields: [],
				links: { countries: { target: 'country', cardinality: 'noneOrMany', backlink: 'continentId' } },
			},
		})
		expect(validateReferences()).toHaveLength(0)
	})

	it('reports error for unknown inherits reference', () => {
		loadDoctypesFromObject({ Task: { slug: 'task', fields: [], inherits: 'BaseTask' } })
		const errors = validateReferences()
		expect(errors.some(e => e.message.includes('BaseTask'))).toBe(true)
	})

	it('reports error for Link field targeting unknown doctype', () => {
		loadDoctypesFromObject({
			Task: {
				slug: 'task',
				fields: [{ kind: 'field', fieldname: 'owner', component: 'AFormLink', label: 'Owner', doctype: 'nonesuch' }],
			},
		})
		const errors = validateReferences()
		expect(errors.some(e => e.message.includes('nonesuch'))).toBe(true)
	})

	it('reports error for links-map target that nothing declares', () => {
		loadDoctypesFromObject({
			Continent: {
				slug: 'continent',
				fields: [],
				links: { countries: { target: 'nonesuch', cardinality: 'noneOrMany', backlink: 'continentId' } },
			},
		})
		const errors = validateReferences()
		expect(errors.some(e => e.path.includes('links') && e.message.includes('nonesuch'))).toBe(true)
	})

	it('does not treat a field with options but no doctype as a link', () => {
		// `options` carries choices/config and never names a link target — `doctype` does. A select
		// whose choices happen to look like doctype names must not be resolved as a reference.
		loadDoctypesFromObject({
			Task: {
				slug: 'task',
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

	it('collects every broken reference rather than stopping at the first', () => {
		// The plugin turns this list into one throw, so a consumer with several fixes them in one pass.
		loadDoctypesFromObject({
			Task: {
				slug: 'task',
				fields: [{ kind: 'field', fieldname: 'owner', component: 'AFormLink', label: 'Owner', doctype: 'nonesuch' }],
				inherits: 'BaseTask',
				links: { notes: { target: 'alsonone', cardinality: 'noneOrMany', backlink: 'taskId' } },
			},
		})
		const errors = validateReferences()
		expect(errors).toHaveLength(3)
		expect(errors.map(e => e.message).join(' ')).toContain('BaseTask')
	})

	// =======================================================================
	// Link bindings — a link whose target resolves can still name no way to
	// reach the rows. The reader answers that with `continue` or a `null`,
	// which on the wire is indistinguishable from an empty relation.
	// =======================================================================

	it('reports a many-side link that names no backlink', () => {
		loadDoctypesFromObject(withLinks({ owners: { target: 'owner', cardinality: 'noneOrMany' } }))
		const errors = validateReferences()
		expect(errors).toHaveLength(1)
		expect(errors[0].path).toEqual(['Task', 'links', 'owners', 'backlink'])
	})

	it('accepts a one-side link bound by the map key alone', () => {
		// The canonical form: the key IS the fieldname. Requiring an explicit `fieldname` here
		// would outlaw the shape `getSqlColumns` and the client resolver both already bind.
		loadDoctypesFromObject(withLinks({ ownerId: { target: 'owner', cardinality: 'one' } }))
		expect(validateReferences()).toHaveLength(0)
	})

	it('accepts a one-side link bound by an explicit fieldname', () => {
		loadDoctypesFromObject(withLinks({ owner: { target: 'owner', cardinality: 'one', fieldname: 'ownerId' } }))
		expect(validateReferences()).toHaveLength(0)
	})

	it('reports a one-side link whose resolved fieldname matches no declared field', () => {
		// FAB's shape before it was cleaned up: neither the key nor a `fieldname` named a field, so
		// the FK was never read and the link resolved to null on every record, forever.
		loadDoctypesFromObject(withLinks({ owner: { target: 'owner', cardinality: 'one' } }))
		const errors = validateReferences()
		expect(errors).toHaveLength(1)
		expect(errors[0].message).toContain('binds to field "owner"')
	})

	it('reports a one-side link bound to a computed field', () => {
		// `computed` means "no backing DB column", and `getSqlColumns` skips such a field. A link
		// bound to one has no foreign key to read, so the record read fails on a missing column —
		// taking the whole record with it, not just the link. Refuse it at load instead.
		loadDoctypesFromObject(
			withLinks({ virtualRef: { target: 'owner', cardinality: 'one' } }, [
				{ kind: 'field', fieldname: 'virtualRef', component: 'ATextInput', computed: true, label: 'Virtual' },
			])
		)
		const errors = validateReferences()
		expect(errors).toHaveLength(1)
		expect(errors[0].message).toContain('no database column')
	})

	it('reports a one-side link bound to a container field', () => {
		// A table field is a relation, not a column — same absence, different cause.
		loadDoctypesFromObject(
			withLinks({ rows: { target: 'owner', cardinality: 'one' } }, [
				{ kind: 'table', fieldname: 'rows', component: 'ATable', label: 'Rows', columns: [{ fieldname: 'x' }] },
			])
		)
		const errors = validateReferences()
		expect(errors).toHaveLength(1)
		expect(errors[0].message).toContain('no database column')
	})

	it('accepts a one-side link whose field is nested inside a fieldset', () => {
		// A fieldset is a layout grouping, not a scope — `getSqlColumns` descends into it, so a
		// checker that did not would report this working declaration as broken.
		loadDoctypesFromObject(
			withLinks({ ownerId: { target: 'owner', cardinality: 'one' } }, [
				{
					kind: 'fieldset',
					fieldname: 'details',
					label: 'Details',
					schema: [{ kind: 'field', fieldname: 'ownerId', component: 'AFormLink', label: 'Owner' }],
				},
			])
		)
		expect(validateReferences()).toHaveLength(0)
	})

	it('exempts a custom fetch strategy from both binding checks', () => {
		// A custom handler is handed the row and the declaration and finds the target however it
		// likes; the runtime returns before consulting either binding.
		loadDoctypesFromObject(
			withLinks({
				owners: { target: 'owner', cardinality: 'noneOrMany', fetch: { method: 'custom', handler: 'h' } },
				absent: { target: 'owner', cardinality: 'one', fetch: { method: 'custom', handler: 'h' } },
			})
		)
		expect(validateReferences()).toHaveLength(0)
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
