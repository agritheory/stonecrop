import type { SchemaTypes } from '@stonecrop/aform'
import { List, Map as ImmutableMap } from 'immutable'
import { describe, expect, it } from 'vitest'

import type Registry from '../src/registry'
import { SchemaValidator, createValidator, validateSchema } from '../src/schema-validator'

describe('SchemaValidator class', () => {
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
			const schema = [{ fieldtype: 'Data' } as SchemaTypes]
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
			const result = validator.validate('Test', [{ fieldname: 'a', fieldtype: 'Data' } as SchemaTypes])
			expect(result.valid).toBe(true)
		})

		it('accepts an Immutable.List', () => {
			const validator = new SchemaValidator()
			const schema = List<SchemaTypes>([{ fieldname: 'a', fieldtype: 'Data' } as SchemaTypes])
			const result = validator.validate('Test', schema)
			expect(result.valid).toBe(true)
		})
	})

	describe('required properties validation', () => {
		it('reports error when fieldname is missing', () => {
			const validator = new SchemaValidator()
			const result = validator.validate('Doc', [{ fieldtype: 'Data' } as SchemaTypes])
			expect(result.errorCount).toBe(1)
			expect(result.issues[0].rule).toBe('required-fieldname')
		})

		it('reports error when both component and fieldtype are missing', () => {
			const validator = new SchemaValidator()
			const result = validator.validate('Doc', [{ fieldname: 'x' } as SchemaTypes])
			expect(result.errorCount).toBe(1)
			expect(result.issues[0].rule).toBe('required-component-or-fieldtype')
		})

		it('passes when component is present without fieldtype', () => {
			const validator = new SchemaValidator()
			const result = validator.validate('Doc', [{ fieldname: 'x', component: 'Comp' } as SchemaTypes])
			expect(result.valid).toBe(true)
		})

		it('validates nested schemas recursively', () => {
			const validator = new SchemaValidator()
			const schema = [
				{
					fieldname: 'address',
					fieldtype: 'Doctype',
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
			const schema = [{ fieldname: 'ref', fieldtype: 'Link' } as any]
			const result = validator.validate('Doc', schema)
			expect(result.issues.some(i => i.rule === 'link-missing-options')).toBe(true)
		})

		it('reports error when Link options is non-string', () => {
			const validator = new SchemaValidator({ registry: registryWithUser })
			const schema = [{ fieldname: 'ref', fieldtype: 'Link', options: 123 } as any]
			const result = validator.validate('Doc', schema)
			expect(result.issues.some(i => i.rule === 'link-invalid-options')).toBe(true)
		})

		it('reports error when Link target doctype does not exist in registry', () => {
			const validator = new SchemaValidator({ registry: registryWithUser })
			const schema = [{ fieldname: 'ref', fieldtype: 'Link', options: 'nonexistent' } as any]
			const result = validator.validate('Doc', schema)
			expect(result.issues.some(i => i.rule === 'link-invalid-target')).toBe(true)
		})

		it('passes when Link target doctype exists in registry', () => {
			const validator = new SchemaValidator({ registry: registryWithUser })
			const schema = [{ fieldname: 'ref', fieldtype: 'Link', options: 'user' } as any]
			const result = validator.validate('Doc', schema)
			expect(result.valid).toBe(true)
		})

		it('validates Link fields inside nested schemas', () => {
			const validator = new SchemaValidator({ registry: registryWithUser })
			const schema = [
				{
					fieldname: 'details',
					fieldtype: 'Doctype',
					schema: [{ fieldname: 'linked', fieldtype: 'Link', options: 'missing' }],
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
			const schema = [{ fieldtype: 'Data' } as SchemaTypes]
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

describe('createValidator helper', () => {
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

describe('validateSchema helper', () => {
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
})
