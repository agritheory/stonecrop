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

describe('Registry class', () => {
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

	const createMockDoctype = (name: string) => {
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
			expect(descendant.map(l => l.fieldname).sort()).toEqual(['childLocations', 'parentLocation'])

			const ancestor = registry.getAncestorLinks('location')
			expect(ancestor).toHaveLength(2)
			expect(ancestor.map(l => l.fieldname).sort()).toEqual(['childLocations', 'parentLocation'])
		})
	})
})
