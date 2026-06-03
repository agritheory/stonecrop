import { describe, it, expect, vi, beforeEach } from 'vitest'
import { List, Map } from 'immutable'
import { createRouter, createWebHistory } from 'vue-router'
import type { UnknownMachineConfig } from 'xstate'

import Registry from '../../src/registry'
import { Stonecrop } from '../../src/stonecrop'
import Doctype from '../../src/doctype'
import type { SchemaTypes } from '@stonecrop/aform'

// Helper: creates a Doctype with links
const createDoctypeWithLinks = (name: string, links?: Record<string, any>) => {
	const mockSchema = List([{ fieldname: 'title', component: 'ATextInput', label: 'Title' }] as SchemaTypes[])

	const mockWorkflow: UnknownMachineConfig = {
		id: name.toLowerCase(),
		initial: 'draft',
		states: { draft: {} },
	}

	return new Doctype(name, mockSchema, mockWorkflow, Map(), undefined, links)
}

function createMockDoctype(name: string) {
	const mockSchema = List([
		{
			fieldname: 'title',
			component: 'ATextInput',
			label: 'Title',
		},
	] as SchemaTypes[])

	const mockWorkflow: UnknownMachineConfig = {
		id: name.toLowerCase(),
		initial: 'draft',
		states: {
			draft: { on: { load: { target: 'pending' } } },
			pending: {
				on: {
					approve: { target: 'completed' },
					reject: { target: 'draft' },
				},
			},
			completed: { type: 'final' },
		},
	}

	const mockActions = Map({
		load: ['loadData'],
		save: ['validateData', 'saveData'],
	})

	return new Doctype(name, mockSchema, mockWorkflow, mockActions)
}

describe('Registry class', { tags: ['unit'] }, () => {
	let registry: Registry
	let mockRouter: any

	beforeEach(() => {
		// Reset the static instance
		Registry._root = undefined as any
		Stonecrop._root = undefined as any

		mockRouter = createRouter({
			history: createWebHistory(),
			routes: [],
		})
	})

	it('creates a Registry instance with default properties', () => {
		registry = new Registry()

		expect(registry.name).toBe('Registry')
		expect(registry.registry).toEqual({})
		expect(registry.router).toBeUndefined()
		expect(registry.getMeta).toBeUndefined()
	})

	it('creates a Registry instance with router', () => {
		registry = new Registry(mockRouter)

		expect(registry.router).toBe(mockRouter)
	})

	it('creates a Registry instance with getMeta function', () => {
		const mockGetMeta = vi.fn()
		registry = new Registry(undefined, mockGetMeta)

		expect(registry.getMeta).toBe(mockGetMeta)
	})

	it('implements singleton pattern', () => {
		const registry1 = new Registry()
		const registry2 = new Registry()

		expect(registry1).toBe(registry2)
		expect(Registry._root).toBe(registry1)
	})

	it('adds a doctype to the registry', () => {
		registry = new Registry()
		const mockDoctype = createMockDoctype('Task')

		registry.addDoctype(mockDoctype)

		expect(registry.registry[mockDoctype.slug]).toBe(mockDoctype)
		expect(registry.registry['task']).toBe(mockDoctype)
	})

	it('does not add duplicate doctypes', () => {
		registry = new Registry()
		const mockDoctype1 = createMockDoctype('Task')
		const mockDoctype2 = createMockDoctype('Task')

		registry.addDoctype(mockDoctype1)
		registry.addDoctype(mockDoctype2)

		expect(Object.keys(registry.registry)).toHaveLength(1)
	})

	it('adds router route when doctype has component and router is available', () => {
		registry = new Registry(mockRouter)
		const mockComponent = { name: 'TaskComponent' }
		const mockDoctype = new Doctype(
			'Task',
			List([]),
			{ id: 'task', initial: 'draft', states: { draft: { type: 'final' } } },
			Map({}),
			mockComponent
		)

		const hasRouteSpy = vi.spyOn(mockRouter, 'hasRoute').mockReturnValue(false)
		const addRouteSpy = vi.spyOn(mockRouter, 'addRoute').mockImplementation(() => {})

		registry.addDoctype(mockDoctype)

		expect(hasRouteSpy).toHaveBeenCalledWith('Task')
		expect(addRouteSpy).toHaveBeenCalledWith({
			path: '/task',
			name: 'task',
			component: mockComponent,
		})
	})

	it('does not add router route if route already exists', () => {
		registry = new Registry(mockRouter)
		const mockComponent = { name: 'TaskComponent' }
		const mockDoctype = new Doctype(
			'Task',
			List([]),
			{ id: 'task', initial: 'draft', states: { draft: { type: 'final' } } },
			Map({}),
			mockComponent
		)

		const hasRouteSpy = vi.spyOn(mockRouter, 'hasRoute').mockReturnValue(true)
		const addRouteSpy = vi.spyOn(mockRouter, 'addRoute').mockImplementation(() => {})

		registry.addDoctype(mockDoctype)

		expect(hasRouteSpy).toHaveBeenCalledWith('Task')
		expect(addRouteSpy).not.toHaveBeenCalled()
	})

	it('does not add router route if no router is available', () => {
		registry = new Registry()
		const mockComponent = { name: 'TaskComponent' }
		const mockDoctype = new Doctype(
			'Task',
			List([]),
			{ id: 'task', initial: 'draft', states: { draft: { type: 'final' } } },
			Map({}),
			mockComponent
		)

		// Should not throw an error
		expect(() => registry.addDoctype(mockDoctype)).not.toThrow()
		expect(registry.registry['task']).toBe(mockDoctype)
	})

	it('does not add router route if doctype has no component', () => {
		registry = new Registry(mockRouter)
		const mockDoctype = createMockDoctype('Task')

		const addRouteSpy = vi.spyOn(mockRouter, 'addRoute').mockImplementation(() => {})

		registry.addDoctype(mockDoctype)

		expect(addRouteSpy).not.toHaveBeenCalled()
		expect(registry.registry['task']).toBe(mockDoctype)
	})

	describe('getDoctype', () => {
		it('returns the Doctype for a registered slug', () => {
			registry = new Registry()
			const mockDoctype = createMockDoctype('Task')
			registry.addDoctype(mockDoctype)

			const result = registry.getDoctype('task')
			expect(result).toBe(mockDoctype)
		})

		it('returns undefined for an unknown slug', () => {
			registry = new Registry()

			const result = registry.getDoctype('nonexistent')
			expect(result).toBeUndefined()
		})

		it('returns undefined when the registry is empty', () => {
			registry = new Registry()

			expect(registry.getDoctype('task')).toBeUndefined()
		})

		it('returns the correct doctype among multiple registered doctypes', () => {
			registry = new Registry()
			const task = createMockDoctype('Task')
			const note = createMockDoctype('Note')
			registry.addDoctype(task)
			registry.addDoctype(note)

			expect(registry.getDoctype('task')).toBe(task)
			expect(registry.getDoctype('note')).toBe(note)
		})
	})

	describe('getDescendantLinks', () => {
		it('returns links array for a doctype with links', () => {
			registry = new Registry()
			const recipe = createDoctypeWithLinks('Recipe', {
				tasks: { target: 'recipe-task', cardinality: 'noneOrMany', backlink: 'recipe' },
				supersededBy: { target: 'recipe', cardinality: 'atMostOne', backlink: 'supersededBy' },
			})
			registry.addDoctype(recipe)

			const links = registry.getDescendantLinks('recipe')
			expect(links).toHaveLength(2)
			expect(links[0].fieldname).toBe('tasks')
			expect(links[0].target).toBe('recipe-task')
			expect(links[0].cardinality).toBe('noneOrMany')
			expect(links[1].fieldname).toBe('supersededBy')
			expect(links[1].target).toBe('recipe')
		})

		it('returns empty array for a doctype without links', () => {
			registry = new Registry()
			const task = createMockDoctype('Task')
			registry.addDoctype(task)

			expect(registry.getDescendantLinks('task')).toEqual([])
		})

		it('returns empty array for non-existent doctype', () => {
			registry = new Registry()
			expect(registry.getDescendantLinks('nonexistent')).toEqual([])
		})

		it('includes fieldname on each entry', () => {
			registry = new Registry()
			const recipe = createDoctypeWithLinks('Recipe', {
				tasks: { target: 'recipe-task', cardinality: 'noneOrMany' },
			})
			registry.addDoctype(recipe)

			const links = registry.getDescendantLinks('recipe')
			expect(links[0]).toHaveProperty('fieldname', 'tasks')
			expect(links[0]).toHaveProperty('target', 'recipe-task')
		})
	})

	describe('getAncestorLinks', () => {
		it('returns links on other doctypes targeting this one', () => {
			registry = new Registry()
			const recipe = createDoctypeWithLinks('Recipe', {
				tasks: { target: 'recipe-task', cardinality: 'noneOrMany', backlink: 'recipe' },
			})
			const recipeTask = createDoctypeWithLinks('RecipeTask', {
				recipe: { target: 'recipe', cardinality: 'one', backlink: 'tasks' },
			})
			registry.addDoctype(recipe)
			registry.addDoctype(recipeTask)

			const ancestors = registry.getAncestorLinks('recipe-task')
			expect(ancestors).toHaveLength(1)
			expect(ancestors[0].fieldname).toBe('tasks')
			expect(ancestors[0].target).toBe('recipe-task')
			expect(ancestors[0].doctype).toBe('recipe')
		})

		it('returns empty array when nothing targets the given doctype', () => {
			registry = new Registry()
			const recipe = createDoctypeWithLinks('Recipe', {
				tasks: { target: 'recipe-task', cardinality: 'noneOrMany' },
			})
			registry.addDoctype(recipe)

			expect(registry.getAncestorLinks('recipe-task')).toEqual([])
		})

		it('returns empty array for non-existent doctype', () => {
			registry = new Registry()
			expect(registry.getAncestorLinks('nonexistent')).toEqual([])
		})

		it('handles self-referential links — both getDescendantLinks and getAncestorLinks return reciprocal', () => {
			registry = new Registry()
			const location = createDoctypeWithLinks('Location', {
				parentLocation: { target: 'location', cardinality: 'atMostOne', backlink: 'childLocations' },
				childLocations: { target: 'location', cardinality: 'noneOrMany', backlink: 'parentLocation' },
			})
			registry.addDoctype(location)

			const descendant = registry.getDescendantLinks('location')
			expect(descendant).toHaveLength(2)
			expect(descendant.map(l => l.fieldname).toSorted()).toEqual(['childLocations', 'parentLocation'])

			const ancestor = registry.getAncestorLinks('location')
			expect(ancestor).toHaveLength(2)
			expect(ancestor.map(l => l.fieldname).toSorted()).toEqual(['childLocations', 'parentLocation'])
		})

		it('returns entries from multiple doctypes when both target the same doctype', () => {
			registry = new Registry()
			const recipe = createDoctypeWithLinks('Recipe', {
				tasks: { target: 'recipe-task', cardinality: 'noneOrMany', backlink: 'recipe' },
			})
			const recipeVariant = createDoctypeWithLinks('RecipeVariant', {
				baseTasks: { target: 'recipe-task', cardinality: 'noneOrMany', backlink: 'recipeVariant' },
			})
			const recipeTask = createDoctypeWithLinks('RecipeTask', {
				recipe: { target: 'recipe', cardinality: 'one', backlink: 'tasks' },
				recipeVariant: { target: 'recipe-variant', cardinality: 'atMostOne', backlink: 'baseTasks' },
			})
			registry.addDoctype(recipe)
			registry.addDoctype(recipeVariant)
			registry.addDoctype(recipeTask)

			const ancestors = registry.getAncestorLinks('recipe-task')
			expect(ancestors).toHaveLength(2)

			const slugs = ancestors.map(a => a.doctype).toSorted()
			expect(slugs).toEqual(['recipe', 'recipe-variant'])
		})

		it('returns the same result on a second call without adding doctypes (cached index)', () => {
			registry = new Registry()
			const recipe = createDoctypeWithLinks('Recipe', {
				tasks: { target: 'recipe-task', cardinality: 'noneOrMany', backlink: 'recipe' },
			})
			const recipeTask = createDoctypeWithLinks('RecipeTask', {
				recipe: { target: 'recipe', cardinality: 'one', backlink: 'tasks' },
			})
			registry.addDoctype(recipe)
			registry.addDoctype(recipeTask)

			const first = registry.getAncestorLinks('recipe-task')
			// Second call with no addDoctype in between — index is not dirty, early-return path
			const second = registry.getAncestorLinks('recipe-task')

			expect(second).toHaveLength(first.length)
			expect(second[0].doctype).toBe(first[0].doctype)
		})

		it('skips doctypes that have no links when building the ancestor index', () => {
			registry = new Registry()
			// plain doctype with no links — must be skipped during index build without throwing
			const task = createMockDoctype('Task')
			const recipe = createDoctypeWithLinks('Recipe', {
				tasks: { target: 'task', cardinality: 'noneOrMany', backlink: 'recipe' },
			})
			registry.addDoctype(task)
			registry.addDoctype(recipe)

			const ancestors = registry.getAncestorLinks('task')
			expect(ancestors).toHaveLength(1)
			expect(ancestors[0].doctype).toBe('recipe')
		})

		it('groups multiple doctypes that share the same backlink name', () => {
			registry = new Registry()
			// Both recipe and recipe-variant use 'recipe' as the backlink name
			const recipe = createDoctypeWithLinks('Recipe', {
				tasks: { target: 'recipe-task', cardinality: 'noneOrMany', backlink: 'recipe' },
			})
			const recipeVariant = createDoctypeWithLinks('RecipeVariant', {
				tasks: { target: 'recipe-task', cardinality: 'noneOrMany', backlink: 'recipe' },
			})
			registry.addDoctype(recipe)
			registry.addDoctype(recipeVariant)

			const ancestors = registry.getAncestorLinks('recipe-task')
			expect(ancestors).toHaveLength(2)
			expect(ancestors.map(a => a.doctype).toSorted()).toEqual(['recipe', 'recipe-variant'])
		})

		it('rebuilds ancestor index after a new doctype is added', () => {
			registry = new Registry()
			const recipe = createDoctypeWithLinks('Recipe', {
				tasks: { target: 'recipe-task', cardinality: 'noneOrMany', backlink: 'recipe' },
			})
			const recipeTask = createDoctypeWithLinks('RecipeTask', {
				recipe: { target: 'recipe', cardinality: 'one', backlink: 'tasks' },
			})
			registry.addDoctype(recipe)
			registry.addDoctype(recipeTask)

			// First call builds the index
			const before = registry.getAncestorLinks('recipe-task')
			expect(before).toHaveLength(1)

			// Add a new doctype that also links to recipe-task
			const recipeVariant = createDoctypeWithLinks('RecipeVariant', {
				baseTasks: { target: 'recipe-task', cardinality: 'noneOrMany', backlink: 'recipeVariant' },
			})
			registry.addDoctype(recipeVariant)

			// Dirty flag is set — next call should rebuild and include the new entry
			const after = registry.getAncestorLinks('recipe-task')
			expect(after).toHaveLength(2)
			expect(after.map(a => a.doctype).toSorted()).toEqual(['recipe', 'recipe-variant'])
		})
	})

	describe('resolveSchema schema delegation', () => {
		it('produces kind: "table" and schema array (not columns) for a 1:many link', () => {
			registry = new Registry()
			const taskSchema = List([
				{ kind: 'field' as const, fieldname: 'name', fieldtype: 'Data', component: 'ATextInput', label: 'Name' },
				{ kind: 'field' as const, fieldname: 'qty', fieldtype: 'Int', component: 'ATextInput', label: 'Qty' },
			])
			const taskWorkflow = { id: 'task', initial: 'draft', states: { draft: {} } }
			const task = new Doctype('Task', taskSchema as any, taskWorkflow as any, Map())

			const parentSchema = List([
				{ kind: 'field' as const, fieldname: 'title', fieldtype: 'Data', component: 'ATextInput', label: 'Title' },
				{
					kind: 'field' as const,
					fieldname: 'tasks',
					fieldtype: 'Link',
					component: 'ATable',
					label: 'Tasks',
					options: 'task',
					cardinality: 'noneOrMany',
				},
			])
			const parentWorkflow = { id: 'parent', initial: 'draft', states: { draft: {} } }
			const parent = new Doctype('Parent', parentSchema as any, parentWorkflow as any, Map(), undefined, {
				tasks: { target: 'task', cardinality: 'noneOrMany', backlink: 'parent' },
			})

			registry.addDoctype(task)
			registry.addDoctype(parent)

			const resolved = registry.resolveSchema(parent)
			const tasksField = resolved.find(f => f.fieldname === 'tasks') as any

			expect(tasksField).toBeDefined()
			expect(tasksField.kind).toBe('table')
			expect(Array.isArray(tasksField.schema)).toBe(true)
			expect('columns' in tasksField).toBe(false)
		})

		it('resolves a 1:1 link to a ResolvedLink with kind: "link"', () => {
			registry = new Registry()
			const addressSchema = List([
				{ kind: 'field' as const, fieldname: 'street', fieldtype: 'Data', component: 'ATextInput', label: 'Street' },
			])
			const addressWorkflow = { id: 'address', initial: 'draft', states: { draft: {} } }
			const address = new Doctype('Address', addressSchema as any, addressWorkflow as any, Map())

			const personSchema = List([
				{ kind: 'field' as const, fieldname: 'name', fieldtype: 'Data', component: 'ATextInput', label: 'Name' },
				{
					kind: 'field' as const,
					fieldname: 'address',
					fieldtype: 'Link',
					label: 'Address',
					options: 'address',
					cardinality: 'one',
				},
			])
			const personWorkflow = { id: 'person', initial: 'draft', states: { draft: {} } }
			const person = new Doctype('Person', personSchema as any, personWorkflow as any, Map(), undefined, {
				address: { target: 'address', cardinality: 'one', backlink: 'person' },
			})

			registry.addDoctype(address)
			registry.addDoctype(person)

			const resolved = registry.resolveSchema(person)
			const addressField = resolved.find(f => f.fieldname === 'address') as any

			expect(addressField).toBeDefined()
			expect(addressField.kind).toBe('link')
			expect(Array.isArray(addressField.schema)).toBe(true)
		})
	})

	describe('initializeRecord kind detection', () => {
		it('initializes a field with kind: "table" to []', () => {
			registry = new Registry()
			const schema = [
				{
					kind: 'table' as const,
					fieldname: 'items',
					component: 'ATable',
					schema: [],
					config: { view: 'list' as const },
				},
			]
			const record = registry.initializeRecord(schema)
			expect(record.items).toEqual([])
		})

		it('initializes a field with kind: "link" to {}', () => {
			registry = new Registry()
			const schema = [{ kind: 'link' as const, fieldname: 'address', component: 'AForm', schema: [] }]
			const record = registry.initializeRecord(schema)
			expect(record.address).toEqual({})
		})

		it('initializes a field with kind: "fieldset" to {} via recursive initialization', () => {
			registry = new Registry()
			const schema = [
				{
					kind: 'fieldset' as const,
					fieldname: 'details',
					schema: [{ kind: 'field' as const, fieldname: 'email', fieldtype: 'Data', component: 'ATextInput' }],
				},
			]
			const record = registry.initializeRecord(schema)
			expect(record.details).toEqual({ email: '' })
		})

		it('initializes a field with kind: "field" and an explicit default to that default value', () => {
			registry = new Registry()
			const schema = [
				{ kind: 'field' as const, fieldname: 'status', fieldtype: 'Select', component: 'ADropdown', default: 'Draft' },
				{ kind: 'field' as const, fieldname: 'active', fieldtype: 'Check', component: 'ACheckbox', default: true },
			]
			const record = registry.initializeRecord(schema)
			expect(record.status).toBe('Draft')
			expect(record.active).toBe(true)
		})
	})
})
