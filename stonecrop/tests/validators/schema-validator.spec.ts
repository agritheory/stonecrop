import type { DoctypeField } from '@stonecrop/schema'
import { List, Map as ImmutableMap } from 'immutable'
import { describe, expect, it } from 'vitest'

import type Registry from '../../src/registry'
import { SchemaValidator, createValidator, validateSchema } from '../../src/schema-validator'

describe('SchemaValidator class', { tags: ['unit'] }, () => {
	describe('constructor options', () => {
		it('defaults all validation flags to true', () => {
			const validator = new SchemaValidator()
			// validating with defaults should succeed on empty schema
			const result = validator.validate('Test', [])
			expect(result.valid).toBe(true)
		})

		it('disables specific validations via options', () => {
			const validator = new SchemaValidator({
				validateRequiredProperties: false,
				validateLinkTargets: false,
				validateWorkflows: false,
				validateActions: false,
			})

			// A schema with missing fieldname should pass when requiredProperties is off
			const schema = [{ fieldtype: 'Data' } as any]
			const result = validator.validate('Test', schema)
			expect(result.valid).toBe(true)
			expect(result.errorCount).toBe(0)
		})
	})

	describe('validate — schema input types', () => {
		it('accepts undefined schema', () => {
			const validator = new SchemaValidator()
			const result = validator.validate('Test', undefined)
			expect(result.valid).toBe(true)
		})

		it('accepts a plain array', () => {
			const validator = new SchemaValidator()
			const result = validator.validate('Test', [{ fieldname: 'a', fieldtype: 'Data' } as any])
			expect(result.valid).toBe(true)
		})

		it('accepts an Immutable.List', () => {
			const validator = new SchemaValidator()
			const schema = List<DoctypeField>([{ fieldname: 'a', fieldtype: 'Data' } as any])
			const result = validator.validate('Test', schema)
			expect(result.valid).toBe(true)
		})
	})

	describe('required properties validation', () => {
		it('reports error when fieldname is missing', () => {
			const validator = new SchemaValidator()
			const result = validator.validate('Doc', [{ fieldtype: 'Data' } as any])
			expect(result.errorCount).toBe(1)
			expect(result.issues[0].rule).toBe('required-fieldname')
		})

		it('reports error when both component and fieldtype are missing', () => {
			const validator = new SchemaValidator()
			const result = validator.validate('Doc', [{ kind: 'field' as const, fieldname: 'x' } as any])
			expect(result.errorCount).toBe(1)
			expect(result.issues[0].rule).toBe('required-component-or-fieldtype')
		})

		it('passes when component is present without fieldtype', () => {
			const validator = new SchemaValidator()
			const result = validator.validate('Doc', [{ kind: 'field' as const, fieldname: 'x', component: 'Comp' } as any])
			expect(result.valid).toBe(true)
		})

		it('validates nested schemas recursively', () => {
			const validator = new SchemaValidator()
			const schema = [
				{
					kind: 'fieldset' as const,
					fieldname: 'address',
					component: 'AForm',
					schema: [
						{ fieldtype: 'Data' }, // Missing fieldname
					],
				} as any,
			]
			const result = validator.validate('Doc', schema)
			expect(result.errorCount).toBe(1)
			expect(result.issues[0].rule).toBe('required-fieldname')
		})
	})

	describe('Link field validation', () => {
		const registryWithUser = {
			registry: { user: {} },
		} as unknown as Registry

		it('reports error when Link has no options', () => {
			const validator = new SchemaValidator({ registry: registryWithUser })
			const schema = [{ kind: 'field' as const, fieldname: 'ref', fieldtype: 'Link' } as any]
			const result = validator.validate('Doc', schema)
			expect(result.issues.some(i => i.rule === 'link-missing-options')).toBe(true)
		})

		it('reports error when Link options is non-string', () => {
			const validator = new SchemaValidator({ registry: registryWithUser })
			const schema = [{ kind: 'field' as const, fieldname: 'ref', fieldtype: 'Link', options: 123 } as any]
			const result = validator.validate('Doc', schema)
			expect(result.issues.some(i => i.rule === 'link-invalid-options')).toBe(true)
		})

		it('reports error when Link target doctype does not exist in registry', () => {
			const validator = new SchemaValidator({ registry: registryWithUser })
			const schema = [{ kind: 'field' as const, fieldname: 'ref', fieldtype: 'Link', options: 'nonexistent' } as any]
			const result = validator.validate('Doc', schema)
			expect(result.issues.some(i => i.rule === 'link-invalid-target')).toBe(true)
		})

		it('passes when Link target doctype exists in registry', () => {
			const validator = new SchemaValidator({ registry: registryWithUser })
			const schema = [{ kind: 'field' as const, fieldname: 'ref', fieldtype: 'Link', options: 'user' } as any]
			const result = validator.validate('Doc', schema)
			expect(result.valid).toBe(true)
		})

		it('validates Link fields inside nested schemas', () => {
			const validator = new SchemaValidator({ registry: registryWithUser })
			const schema = [
				{
					kind: 'fieldset' as const,
					fieldname: 'details',
					component: 'AForm',
					schema: [{ kind: 'field' as const, fieldname: 'linked', fieldtype: 'Link', options: 'missing' }],
				} as any,
			]
			const result = validator.validate('Doc', schema)
			expect(result.issues.some(i => i.rule === 'link-invalid-target')).toBe(true)
		})
	})

	describe('workflow validation', () => {
		it('warns when workflow has neither initial nor type', () => {
			const validator = new SchemaValidator()
			const workflow = { states: { s1: {} } }
			const result = validator.validate('Doc', [], workflow)
			expect(result.issues.some(i => i.rule === 'workflow-missing-initial')).toBe(true)
		})

		it('does not warn when workflow has a type (e.g. parallel)', () => {
			const validator = new SchemaValidator()
			const workflow = { type: 'parallel' as const, states: { a: {}, b: {} } }
			const result = validator.validate('Doc', [], workflow)
			expect(result.issues.some(i => i.rule === 'workflow-missing-initial')).toBe(false)
		})

		it('warns when workflow has no states', () => {
			const validator = new SchemaValidator()
			const workflow = { initial: 'draft', states: {} }
			const result = validator.validate('Doc', [], workflow)
			expect(result.issues.some(i => i.rule === 'workflow-no-states')).toBe(true)
		})

		it('warns when states is undefined', () => {
			const validator = new SchemaValidator()
			const workflow = { initial: 'draft' } as any
			const result = validator.validate('Doc', [], workflow)
			expect(result.issues.some(i => i.rule === 'workflow-no-states')).toBe(true)
		})

		it('reports error when initial state does not exist in states', () => {
			const validator = new SchemaValidator()
			const workflow = { initial: 'nonexistent', states: { draft: {} } }
			const result = validator.validate('Doc', [], workflow)
			expect(result.issues.some(i => i.rule === 'workflow-invalid-initial')).toBe(true)
		})

		it('detects unreachable states', () => {
			const validator = new SchemaValidator()
			const workflow = {
				initial: 'draft',
				states: {
					draft: { on: { submit: { target: 'review' } } },
					review: { on: { approve: { target: 'done' } } },
					done: { type: 'final' as const },
					orphan: {}, // unreachable
				},
			}
			const result = validator.validate('Doc', [], workflow)
			expect(
				result.issues.some(i => i.rule === 'workflow-unreachable-state' && i.context?.stateName === 'orphan')
			).toBe(true)
		})

		it('handles string transition targets', () => {
			const validator = new SchemaValidator()
			const workflow = {
				initial: 'a',
				states: {
					a: { on: { go: 'b' } },
					b: {},
				},
			}
			const result = validator.validate('Doc', [], workflow)
			// b is reachable via string target
			expect(result.issues.some(i => i.rule === 'workflow-unreachable-state' && i.context?.stateName === 'b')).toBe(
				false
			)
		})

		it('handles array transition targets', () => {
			const validator = new SchemaValidator()
			const workflow = {
				initial: 'a',
				states: {
					a: { on: { go: { target: ['b', 'c'] } } },
					b: {},
					c: {},
				},
			}
			const result = validator.validate('Doc', [], workflow)
			expect(result.issues.filter(i => i.rule === 'workflow-unreachable-state')).toHaveLength(0)
		})
	})

	describe('action validation', () => {
		it('reports error when action values are not arrays', () => {
			const validator = new SchemaValidator()
			// Use Immutable.Map since the code calls .toObject() on non-native Maps
			const actions = ImmutableMap({ load: 'notAnArray' as any })
			const result = validator.validate('Doc', [], undefined, actions)
			expect(result.issues.some(i => i.rule === 'action-invalid-format')).toBe(true)
		})

		it('warns when referenced actions are not registered', () => {
			const validator = new SchemaValidator()
			const actions = ImmutableMap({ load: ['unregisteredAction'] })
			const result = validator.validate('Doc', [], undefined, actions)
			expect(result.issues.some(i => i.rule === 'action-not-registered')).toBe(true)
			expect(result.warningCount).toBeGreaterThan(0)
		})

		it('accepts Immutable.Map for actions', () => {
			const validator = new SchemaValidator()
			const actions = ImmutableMap({ load: ['someAction'] })
			const result = validator.validate('Doc', [], undefined, actions)
			// Should not throw, will produce warnings for unregistered actions
			expect(result).toBeDefined()
		})
	})

	describe('result aggregation', () => {
		it('counts errors, warnings, and info', () => {
			const validator = new SchemaValidator()
			// Missing fieldname  = error; workflow with unreachable state = warning
			const schema = [{ fieldtype: 'Data' } as any]
			const workflow = {
				initial: 'a',
				states: { a: {}, orphan: {} },
			}
			const result = validator.validate('Doc', schema, workflow)
			expect(result.errorCount).toBeGreaterThan(0)
			expect(result.warningCount).toBeGreaterThan(0)
			expect(result.valid).toBe(false)
		})

		it('returns valid=true when there are only warnings', () => {
			const validator = new SchemaValidator({ validateRequiredProperties: false })
			const workflow = {
				initial: 'a',
				states: { a: {}, orphan: {} },
			}
			const result = validator.validate('Doc', [], workflow)
			expect(result.warningCount).toBeGreaterThan(0)
			expect(result.errorCount).toBe(0)
			expect(result.valid).toBe(true)
		})
	})
})

describe('createValidator helper', { tags: ['unit'] }, () => {
	it('creates a validator with registry', () => {
		const registry = { registry: {} } as unknown as Registry
		const validator = createValidator(registry)
		expect(validator).toBeInstanceOf(SchemaValidator)
	})

	it('passes additional options', () => {
		const registry = { registry: {} } as unknown as Registry
		const validator = createValidator(registry, { validateWorkflows: false })
		// Should not validate workflows
		const result = validator.validate('Doc', [], { initial: 'missing' })
		expect(result.issues.length).toBe(0)
	})
})

describe('validateSchema helper', { tags: ['unit'] }, () => {
	it('delegates to SchemaValidator.validate', () => {
		const registry = { registry: {} } as unknown as Registry
		const result = validateSchema('Doc', [], registry)
		expect(result.valid).toBe(true)
	})

	it('passes workflow and actions through', () => {
		const registry = { registry: {} } as unknown as Registry
		const workflow = { initial: 'a', states: { a: {} } }
		const actions = ImmutableMap({ load: ['action1'] })
		const result = validateSchema('Doc', [], registry, workflow, actions)
		expect(result).toBeDefined()
	})

	it('handles nested table fields (resolved Doctype with cardinality: many)', () => {
		const validator = new SchemaValidator()
		const schema = [
			{
				fieldname: 'items',
				label: 'Items',
				component: 'ATable',
				options: 'item',
				cardinality: 'noneOrMany',
			} as DoctypeField,
		]
		const result = validator.validate('Doc', schema)
		expect(result.valid).toBe(true)
	})

	it('validates Select fieldtype', () => {
		const validator = new SchemaValidator()
		const schema = [
			{
				fieldname: 'status',
				label: 'Status',
				fieldtype: 'Select',
			} as DoctypeField,
		]
		const result = validator.validate('Doc', schema)
		expect(result.valid).toBe(true)
	})
})

describe('SchemaValidator — link declarations', { tags: ['unit'] }, () => {
	// Mock registry with doctypes that have links
	const mockRegistry = {
		registry: {
			recipe: {
				links: {
					tasks: { target: 'recipe-task', cardinality: 'noneOrMany', backlink: 'recipe' },
					supersededBy: { target: 'recipe', cardinality: 'atMostOne', backlink: 'supersededBy' },
				},
			},
			'recipe-task': {
				links: {
					recipe: { target: 'recipe', cardinality: 'one', backlink: 'tasks' },
				},
			},
			location: {
				links: {
					parentLocation: { target: 'location', cardinality: 'atMostOne', backlink: 'childLocations' },
					childLocations: { target: 'location', cardinality: 'noneOrMany', backlink: 'parentLocation' },
				},
			},
		},
	} as unknown as Registry

	const schema = [{ fieldname: 'name', fieldtype: 'Data' } as any]

	it('passes when all link targets resolve', () => {
		const validator = new SchemaValidator({ registry: mockRegistry })
		const result = validator.validate('recipe', schema, undefined, undefined, {
			tasks: { target: 'recipe-task', cardinality: 'noneOrMany', backlink: 'recipe' },
		})
		expect(result.valid).toBe(true)
		expect(result.errorCount).toBe(0)
	})

	it('reports error when link target does not exist in registry', () => {
		const validator = new SchemaValidator({ registry: mockRegistry })
		const result = validator.validate('recipe', schema, undefined, undefined, {
			tasks: { target: 'nonexistent', cardinality: 'noneOrMany' },
		})
		expect(result.valid).toBe(false)
		expect(result.issues.some(i => i.rule === 'link-invalid-target')).toBe(true)
	})

	it('reports warning on self-referential link', () => {
		const validator = new SchemaValidator({ registry: mockRegistry })
		const result = validator.validate('recipe', schema, undefined, undefined, {
			supersededBy: { target: 'recipe', cardinality: 'atMostOne', backlink: 'supersededBy' },
		})
		expect(result.valid).toBe(true) // warnings don't block
		expect(result.issues.some(i => i.rule === 'link-self-referential')).toBe(true)
	})

	it('reports error when backlink is missing on target', () => {
		const validator = new SchemaValidator({ registry: mockRegistry })
		const result = validator.validate('recipe', schema, undefined, undefined, {
			tasks: { target: 'recipe-task', cardinality: 'noneOrMany', backlink: 'nonexistent' },
		})
		expect(result.valid).toBe(false)
		expect(result.issues.some(i => i.rule === 'link-backlink-missing')).toBe(true)
	})

	it('reports warning when backlink points to wrong doctype', () => {
		const validator = new SchemaValidator({ registry: mockRegistry })
		const result = validator.validate('location', schema, undefined, undefined, {
			badLink: { target: 'recipe-task', cardinality: 'one', backlink: 'recipe' },
		})
		expect(result.valid).toBe(true) // warnings don't block
		expect(result.issues.some(i => i.rule === 'link-backlink-mismatch')).toBe(true)
	})

	it('can disable link validation via options', () => {
		const validator = new SchemaValidator({
			registry: mockRegistry,
			validateLinks: false,
		})
		const result = validator.validate('recipe', schema, undefined, undefined, {
			bad: { target: 'nonexistent', cardinality: 'noneOrMany' },
		})
		expect(result.valid).toBe(true) // links not validated, so no error
	})

	it('accepts a link field with no corresponding link declaration — a plain FK', () => {
		// The `links` map is additive — it carries expansion metadata — and is not required. A link
		// with no declaration is a plain foreign key, which `Registry.resolveFields` resolves to an
		// inline picker.
		const validator = new SchemaValidator({ registry: mockRegistry })
		const schemaWithLinkField = [
			{ kind: 'field' as const, fieldname: 'name', fieldtype: 'Data' } as any,
			{ kind: 'field' as const, fieldname: 'assignee', component: 'AFormLink', doctype: 'recipe-task' } as any,
		]
		const result = validator.validate('recipe', schemaWithLinkField, undefined, undefined, {})
		expect(result.issues).toEqual([])
	})

	it('mixes an expanded relation and a plain FK on one doctype without error', () => {
		const validator = new SchemaValidator({ registry: mockRegistry })
		const mixedSchema = [
			{ kind: 'field' as const, fieldname: 'tasks', component: 'ATable', doctype: 'recipe-task' } as any,
			{ kind: 'field' as const, fieldname: 'assignee', component: 'AFormLink', doctype: 'recipe-task' } as any,
		]
		const result = validator.validate('recipe', mixedSchema, undefined, undefined, {
			tasks: { target: 'recipe-task', cardinality: 'noneOrMany', fieldname: 'tasks' },
		})
		expect(result.issues).toEqual([])
	})

	it('reports error when Link field target does not match link declaration target', () => {
		const validator = new SchemaValidator({ registry: mockRegistry })
		const schemaWithLinkField = [
			{ kind: 'field' as const, fieldname: 'name', fieldtype: 'Data' } as any,
			{ kind: 'field' as const, fieldname: 'tasks', fieldtype: 'Link', options: 'different-target' } as any,
		]
		const result = validator.validate('recipe', schemaWithLinkField, undefined, undefined, {
			tasks: { target: 'recipe-task', cardinality: 'noneOrMany', fieldname: 'tasks' },
		})
		expect(result.valid).toBe(false)
		expect(result.issues.some(i => i.rule === 'link-field-target-mismatch')).toBe(true)
	})

	it('passes when Link field has corresponding link declaration with matching target', () => {
		const validator = new SchemaValidator({ registry: mockRegistry })
		const schemaWithLinkField = [
			{ fieldname: 'name', fieldtype: 'Data' } as DoctypeField,
			{ fieldname: 'tasks', fieldtype: 'Link', options: 'recipe-task' } as DoctypeField,
		]
		const result = validator.validate('recipe', schemaWithLinkField, undefined, undefined, {
			tasks: { target: 'recipe-task', cardinality: 'noneOrMany', fieldname: 'tasks' },
		})
		expect(result.valid).toBe(true)
		expect(result.errorCount).toBe(0)
	})

	it('allows link declaration without corresponding Link field (link without field is ok)', () => {
		const validator = new SchemaValidator({ registry: mockRegistry })
		const schemaWithLinkField = [{ fieldname: 'name', fieldtype: 'Data' } as any]
		const result = validator.validate('recipe', schemaWithLinkField, undefined, undefined, {
			tasks: { target: 'recipe-task', cardinality: 'noneOrMany' },
		})
		expect(result.valid).toBe(true)
	})
})
