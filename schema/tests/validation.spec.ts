import { describe, it, expect } from 'vitest'
import { validateField, validateDoctype, parseField, parseDoctype } from '../src/validation'
import type { ValueField } from '../src/field'
import { TriggerDefinition } from '../src/doctype'
import { ZodError } from 'zod'

describe('Field Validation', { tags: ['unit'] }, () => {
	describe('validateField', () => {
		it('should validate a correct field', () => {
			const field = {
				kind: 'field' as const,
				fieldname: 'email',
				fieldtype: 'Data',
				component: 'ATextInput',
				label: 'Email',
			}
			const result = validateField(field)

			expect(result.success).toBe(true)
			expect(result.errors).toEqual([])
		})

		it('should validate a minimal field', () => {
			const field = {
				kind: 'field' as const,
				fieldname: 'name',
				fieldtype: 'Data',
			}
			const result = validateField(field)

			expect(result.success).toBe(true)
			expect(result.errors).toEqual([])
		})

		it('should reject field missing fieldname', () => {
			const field = {
				kind: 'field',
				fieldtype: 'Data',
			}
			const result = validateField(field)

			expect(result.success).toBe(false)
			expect(result.errors.length).toBeGreaterThan(0)
			expect(result.errors[0].path).toContain('fieldname')
			expect(result.errors[0].message).toBeTruthy()
		})

		it('should reject field missing fieldtype', () => {
			const field = {
				kind: 'field' as const,
				fieldname: 'test',
			}
			const result = validateField(field)

			expect(result.success).toBe(false)
			expect(result.errors.length).toBeGreaterThan(0)
			expect(result.errors[0].path).toContain('fieldtype')
		})

		it('should accept custom fieldtypes not in the builtin list', () => {
			// StonecropFieldType is now an open string — any non-empty string is valid
			const field = {
				kind: 'field' as const,
				fieldname: 'test',
				fieldtype: 'Phone',
			}
			const result = validateField(field)

			expect(result.success).toBe(true)
		})

		it('should reject empty string fieldtype', () => {
			const field = {
				kind: 'field' as const,
				fieldname: 'test',
				fieldtype: '',
			}
			const result = validateField(field)

			expect(result.success).toBe(false)
			expect(result.errors.length).toBeGreaterThan(0)
			expect(result.errors[0].path).toContain('fieldtype')
		})

		it('should reject invalid options type', () => {
			const field = {
				fieldname: 'test',
				fieldtype: 'Data',
				options: 123, // Should be string, string[], or Record
			}
			const result = validateField(field)

			expect(result.success).toBe(false)
			expect(result.errors.length).toBeGreaterThan(0)
		})

		it('should validate field with all optional properties', () => {
			const field = {
				kind: 'field' as const,
				fieldname: 'status',
				fieldtype: 'Select',
				component: 'ADropdown',
				label: 'Status',
				width: '200px',
				align: 'center' as const,
				required: true,
				readOnly: false,
				edit: true,
				hidden: false,
				default: 'pending',
				options: ['pending', 'active', 'completed'],
				mask: '###-###',
			}
			const result = validateField(field)

			expect(result.success).toBe(true)
			expect(result.errors).toEqual([])
		})
	})

	describe('parseField', () => {
		it('should parse a valid field', () => {
			const field = {
				kind: 'field' as const,
				fieldname: 'email',
				fieldtype: 'Data',
			}
			const parsed = parseField(field)

			expect(parsed.fieldname).toBe('email')
			expect(parsed.kind).toBe('field')
			expect((parsed as ValueField).fieldtype).toBe('Data')
		})

		it('should throw ZodError for invalid field', () => {
			const field = {
				fieldname: 'test',
				// Missing fieldtype
			}
			expect(() => parseField(field)).toThrow(ZodError)
		})

		it('should throw ZodError for empty fieldtype', () => {
			const field = {
				fieldname: 'test',
				fieldtype: '',
			}
			expect(() => parseField(field)).toThrow(ZodError)
		})
	})
})

describe('Doctype Validation', { tags: ['unit'] }, () => {
	describe('validateDoctype', () => {
		it('should validate a correct doctype', () => {
			const doctype = {
				name: 'User',
				slug: 'user',
				fields: [
					{ kind: 'field', fieldname: 'id', fieldtype: 'Data' },
					{ kind: 'field', fieldname: 'name', fieldtype: 'Data' },
				],
			}
			const result = validateDoctype(doctype)

			expect(result.success).toBe(true)
			expect(result.errors).toEqual([])
		})

		it('should validate a minimal doctype', () => {
			const doctype = {
				name: 'Task',
				fields: [{ kind: 'field', fieldname: 'title', fieldtype: 'Data' }],
			}
			const result = validateDoctype(doctype)

			expect(result.success).toBe(true)
			expect(result.errors).toEqual([])
		})

		it('should reject doctype missing name', () => {
			const doctype = {
				fields: [{ kind: 'field', fieldname: 'id', fieldtype: 'Data' }],
			}
			const result = validateDoctype(doctype)

			expect(result.success).toBe(false)
			expect(result.errors.length).toBeGreaterThan(0)
			expect(result.errors[0].path).toContain('name')
		})

		it('should reject doctype missing fields', () => {
			const doctype = {
				name: 'User',
			}
			const result = validateDoctype(doctype)

			expect(result.success).toBe(false)
			expect(result.errors.length).toBeGreaterThan(0)
			expect(result.errors[0].path).toContain('fields')
		})

		it('should reject doctype with invalid field', () => {
			const doctype = {
				name: 'User',
				fields: [
					{ kind: 'field', fieldname: 'id', fieldtype: 'Data' },
					{ kind: 'field', fieldname: 'invalid' }, // Missing fieldtype
				],
			}
			const result = validateDoctype(doctype)

			expect(result.success).toBe(false)
			expect(result.errors.length).toBeGreaterThan(0)
		})

		it('should validate doctype with workflow', () => {
			const doctype = {
				name: 'Order',
				fields: [{ kind: 'field', fieldname: 'id', fieldtype: 'Data' }],
				workflow: {
					states: ['Draft', 'Submitted', 'Approved'],
					actions: {
						submit: {
							label: 'Submit',
							handler: 'submitOrder',
							requiredFields: ['customer', 'items'],
							allowedStates: ['Draft'],
						},
					},
				},
			}
			const result = validateDoctype(doctype)

			expect(result.success).toBe(true)
			expect(result.errors).toEqual([])
		})

		it('should reject doctype with invalid workflow action', () => {
			const doctype = {
				name: 'Order',
				fields: [{ kind: 'field', fieldname: 'id', fieldtype: 'Data' }],
				workflow: {
					actions: {
						submit: {
							// Missing required 'label' and 'handler'
						},
					},
				},
			}
			const result = validateDoctype(doctype)

			expect(result.success).toBe(false)
			expect(result.errors.length).toBeGreaterThan(0)
		})

		it('should validate doctype with workflow triggers', () => {
			const doctype = {
				name: 'Order',
				fields: [{ kind: 'field', fieldname: 'id', fieldtype: 'Data' }],
				workflow: {
					states: ['Draft', 'Submitted'],
					triggers: {
						dateOrder: {
							label: 'Date order',
							on: ['start_date', 'end_date'],
							clientHandler: "if (record.end_date < record.start_date) setError('end_date', 'End before start')",
						},
					},
				},
			}
			const result = validateDoctype(doctype)

			expect(result.success).toBe(true)
			expect(result.errors).toEqual([])
		})

		it('should preserve workflow triggers through parseDoctype (not stripped)', () => {
			const doctype = {
				name: 'Order',
				fields: [{ kind: 'field', fieldname: 'id', fieldtype: 'Data' }],
				workflow: {
					triggers: {
						dateOrder: {
							on: ['start_date', 'end_date'],
							clientHandler: "setError('end_date', 'bad')",
						},
					},
				},
			}
			const parsed = parseDoctype(doctype)

			expect(parsed.workflow?.triggers).toBeDefined()
			expect(parsed.workflow?.triggers?.dateOrder.on).toEqual(['start_date', 'end_date'])
			expect(parsed.workflow?.triggers?.dateOrder.clientHandler).toBe("setError('end_date', 'bad')")
		})

		it('should reject a trigger missing clientHandler', () => {
			const doctype = {
				name: 'Order',
				fields: [{ kind: 'field', fieldname: 'id', fieldtype: 'Data' }],
				workflow: {
					triggers: {
						dateOrder: {
							on: ['start_date'],
							// clientHandler missing
						},
					},
				},
			}
			const result = validateDoctype(doctype)

			expect(result.success).toBe(false)
			expect(result.errors.length).toBeGreaterThan(0)
		})

		it('should validate doctype with inheritance', () => {
			const doctype = {
				name: 'Employee',
				fields: [{ kind: 'field', fieldname: 'employeeId', fieldtype: 'Data' }],
				inherits: 'Person',
			}
			const result = validateDoctype(doctype)

			expect(result.success).toBe(true)
			expect(result.errors).toEqual([])
		})

		it('should validate doctype with links', () => {
			const doctype = {
				name: 'Recipe',
				fields: [
					{ kind: 'field', fieldname: 'name', fieldtype: 'Data' },
					{ kind: 'field', fieldname: 'status', fieldtype: 'Data' },
				],
				links: {
					tasks: { target: 'recipe-task', cardinality: 'noneOrMany', backlink: 'recipe' },
					supersededBy: { target: 'recipe', cardinality: 'atMostOne', backlink: 'supersededBy' },
				},
			}
			const result = validateDoctype(doctype)

			expect(result.success).toBe(true)
			expect(result.errors).toEqual([])
		})

		it('should validate doctype with links without backlink', () => {
			const doctype = {
				name: 'Recipe',
				fields: [{ kind: 'field', fieldname: 'name', fieldtype: 'Data' }],
				links: {
					tasks: { target: 'recipe-task', cardinality: 'noneOrMany' },
				},
			}
			const result = validateDoctype(doctype)

			expect(result.success).toBe(true)
			expect(result.errors).toEqual([])
		})

		it('should reject link with missing target', () => {
			const doctype = {
				name: 'Recipe',
				fields: [{ kind: 'field', fieldname: 'name', fieldtype: 'Data' }],
				links: {
					tasks: { cardinality: 'noneOrMany' },
				},
			}
			const result = validateDoctype(doctype)

			expect(result.success).toBe(false)
			expect(result.errors.length).toBeGreaterThan(0)
		})

		it('should reject link with missing cardinality', () => {
			const doctype = {
				name: 'Recipe',
				fields: [{ kind: 'field', fieldname: 'name', fieldtype: 'Data' }],
				links: {
					tasks: { target: 'recipe-task' },
				},
			}
			const result = validateDoctype(doctype)

			expect(result.success).toBe(false)
			expect(result.errors.length).toBeGreaterThan(0)
		})

		it('should reject link with invalid cardinality', () => {
			const doctype = {
				name: 'Recipe',
				fields: [{ kind: 'field', fieldname: 'name', fieldtype: 'Data' }],
				links: {
					tasks: { target: 'recipe-task', cardinality: 'many' },
				},
			}
			const result = validateDoctype(doctype)

			expect(result.success).toBe(false)
			expect(result.errors.length).toBeGreaterThan(0)
		})

		it('should validate all cardinality values on ValueField', () => {
			const cardinalities = ['one', 'atMostOne', 'noneOrMany', 'atLeastOne'] as const
			for (const cardinality of cardinalities) {
				const field = {
					kind: 'field' as const,
					fieldname: 'child',
					fieldtype: 'Data',
					cardinality,
				}
				const result = validateField(field)
				expect(result.success).toBe(true)
			}
		})

		it('should validate doctype with Link fields', () => {
			const doctype = {
				name: 'Recipe',
				fields: [
					{ kind: 'field', fieldname: 'name', fieldtype: 'Data' },
					{ kind: 'field', fieldname: 'tasks', fieldtype: 'Link', options: 'recipe-task' },
					{ kind: 'field', fieldname: 'status', fieldtype: 'Data' },
				],
				links: {
					tasks: { target: 'recipe-task', cardinality: 'noneOrMany', fieldname: 'tasks' },
				},
			}
			const result = validateDoctype(doctype)

			expect(result.success).toBe(true)
			expect(result.errors).toEqual([])
		})

		it('should validate Link field and link declaration correspondence', () => {
			const doctype = {
				name: 'Recipe',
				fields: [
					{ kind: 'field', fieldname: 'name', fieldtype: 'Data' },
					{ kind: 'field', fieldname: 'tasks', fieldtype: 'Link', options: 'recipe-task' },
				],
				links: {
					tasks: { target: 'recipe-task', cardinality: 'noneOrMany', fieldname: 'tasks' },
				},
			}
			const result = validateDoctype(doctype)
			expect(result.success).toBe(true)
		})
	})

	describe('parseDoctype', () => {
		it('should parse a valid doctype', () => {
			const doctype = {
				name: 'User',
				fields: [{ kind: 'field', fieldname: 'id', fieldtype: 'Data' }],
			}
			const parsed = parseDoctype(doctype)

			expect(parsed.name).toBe('User')
			expect(parsed.fields.length).toBe(1)
			expect(parsed.fields[0].fieldname).toBe('id')
		})

		it('should throw ZodError for invalid doctype', () => {
			const doctype = {
				// Missing name
				fields: [{ kind: 'field', fieldname: 'id', fieldtype: 'Data' }],
			}
			expect(() => parseDoctype(doctype)).toThrow(ZodError)
		})

		it('should throw ZodError for missing fields', () => {
			const doctype = {
				name: 'User',
				// Missing fields array
			}
			expect(() => parseDoctype(doctype)).toThrow(ZodError)
		})

		it('should throw ZodError for invalid field in fields array', () => {
			const doctype = {
				name: 'User',
				fields: [
					{ kind: 'field', fieldname: 'id', fieldtype: 'Data' },
					{ kind: 'field', fieldname: 'invalid' }, // Missing fieldtype
				],
			}
			expect(() => parseDoctype(doctype)).toThrow(ZodError)
		})

		it('should parse a doctype with links and Link fields', () => {
			const doctype = {
				name: 'Recipe',
				fields: [
					{ kind: 'field', fieldname: 'name', fieldtype: 'Data' },
					{ kind: 'field', fieldname: 'status', fieldtype: 'Data' },
					{ kind: 'field', fieldname: 'tasks', fieldtype: 'Link', options: 'recipe-task' },
				],
				links: {
					tasks: { target: 'recipe-task', cardinality: 'noneOrMany', backlink: 'recipe', fieldname: 'tasks' },
				},
			}
			const parsed = parseDoctype(doctype)

			expect(parsed.name).toBe('Recipe')
			expect(parsed.links).toBeDefined()
			expect(parsed.links!.tasks.target).toBe('recipe-task')
			expect(parsed.links!.tasks.cardinality).toBe('noneOrMany')
			expect(parsed.links!.tasks.backlink).toBe('recipe')
			expect(parsed.links!.tasks.fieldname).toBe('tasks')
		})
	})
})

describe('TriggerDefinition validation', { tags: ['unit'] }, () => {
	it('should accept a valid trigger', () => {
		const result = TriggerDefinition.safeParse({
			on: ['start_date', 'end_date'],
			clientHandler: "setError('end_date', 'bad')",
		})
		expect(result.success).toBe(true)
	})

	it('should accept an optional label', () => {
		const result = TriggerDefinition.safeParse({
			label: 'Date order',
			on: ['start_date'],
			clientHandler: 'noop()',
		})
		expect(result.success).toBe(true)
	})

	it('should reject a trigger missing on', () => {
		const result = TriggerDefinition.safeParse({ clientHandler: 'noop()' })
		expect(result.success).toBe(false)
	})

	it('should reject a trigger missing clientHandler', () => {
		const result = TriggerDefinition.safeParse({ on: ['start_date'] })
		expect(result.success).toBe(false)
	})

	it('should reject a non-array on', () => {
		const result = TriggerDefinition.safeParse({ on: 'start_date', clientHandler: 'noop()' })
		expect(result.success).toBe(false)
	})

	it('should strip unknown keys (plain object, like ActionDefinition)', () => {
		const result = TriggerDefinition.safeParse({
			on: ['start_date'],
			clientHandler: 'noop()',
			bogus: 'nope',
		})
		expect(result.success).toBe(true)
		expect(result.success && 'bogus' in result.data).toBe(false)
	})
})

describe('Error Path Information', { tags: ['unit'] }, () => {
	it('should provide detailed path for nested errors', () => {
		const doctype = {
			name: 'User',
			fields: [
				{ kind: 'field', fieldname: 'id', fieldtype: 'Data' },
				{ kind: 'field', fieldname: 'email' }, // Missing fieldtype at index 1
			],
		}
		const result = validateDoctype(doctype)

		expect(result.success).toBe(false)
		expect(result.errors.length).toBeGreaterThan(0)

		// Check that path includes the array index
		const error = result.errors.find(e => e.path.includes('fields'))
		expect(error).toBeDefined()
		expect(error!.path).toContain('fields')
	})

	it('should provide message for each validation error', () => {
		const field = {
			fieldname: 'test',
			fieldtype: 'InvalidType',
			required: 'not-a-boolean', // Invalid type
		}
		const result = validateField(field)

		expect(result.success).toBe(false)
		expect(result.errors.length).toBeGreaterThan(0)

		// Each error should have a message
		for (const error of result.errors) {
			expect(error.message).toBeTruthy()
			expect(typeof error.message).toBe('string')
		}
	})
})

describe('LinkDeclaration Validation', { tags: ['unit'] }, () => {
	it('should accept all four valid cardinality values on a link', () => {
		const cardinalities = ['one', 'atMostOne', 'noneOrMany', 'atLeastOne'] as const
		for (const cardinality of cardinalities) {
			const doctype = {
				name: 'Recipe',
				fields: [{ kind: 'field', fieldname: 'name', fieldtype: 'Data' }],
				links: {
					items: { target: 'recipe-task', cardinality },
				},
			}
			const result = validateDoctype(doctype)
			expect(result.success).toBe(true)
		}
	})

	it('should accept component on a link declaration', () => {
		const doctype = {
			name: 'Recipe',
			fields: [{ kind: 'field', fieldname: 'name', fieldtype: 'Data' }],
			links: {
				tasks: { target: 'recipe-task', cardinality: 'noneOrMany', component: 'MyCustomTable' },
			},
		}
		const result = validateDoctype(doctype)
		expect(result.success).toBe(true)
	})

	it('should reject link with empty string target', () => {
		const doctype = {
			name: 'Recipe',
			fields: [{ kind: 'field', fieldname: 'name', fieldtype: 'Data' }],
			links: {
				tasks: { target: '', cardinality: 'noneOrMany' },
			},
		}
		const result = validateDoctype(doctype)
		expect(result.success).toBe(false)
		expect(result.errors.length).toBeGreaterThan(0)
	})
})

describe('FetchStrategy Validation', { tags: ['unit'] }, () => {
	it('should validate sync fetch strategy', () => {
		const doctype = {
			name: 'Recipe',
			fields: [{ kind: 'field', fieldname: 'name', fieldtype: 'Data' }],
			links: {
				tasks: { target: 'recipe-task', cardinality: 'noneOrMany', fetch: { method: 'sync' } },
			},
		}
		const result = validateDoctype(doctype)
		expect(result.success).toBe(true)
		expect(result.errors).toEqual([])
	})

	it('should validate sync fetch strategy with limit', () => {
		const doctype = {
			name: 'Recipe',
			fields: [{ kind: 'field', fieldname: 'name', fieldtype: 'Data' }],
			links: {
				tasks: { target: 'recipe-task', cardinality: 'noneOrMany', fetch: { method: 'sync', limit: 25 } },
			},
		}
		const result = validateDoctype(doctype)
		expect(result.success).toBe(true)
		expect(result.errors).toEqual([])
	})

	it('should validate lazy fetch strategy', () => {
		const doctype = {
			name: 'Recipe',
			fields: [{ kind: 'field', fieldname: 'name', fieldtype: 'Data' }],
			links: {
				address: { target: 'address', cardinality: 'one', fetch: { method: 'lazy' } },
			},
		}
		const result = validateDoctype(doctype)
		expect(result.success).toBe(true)
		expect(result.errors).toEqual([])
	})

	it('should validate custom fetch strategy', () => {
		const doctype = {
			name: 'Recipe',
			fields: [{ kind: 'field', fieldname: 'name', fieldtype: 'Data' }],
			links: {
				tasks: {
					target: 'recipe-task',
					cardinality: 'noneOrMany',
					fetch: { method: 'custom', handler: 'function myHandler() { return true; }' },
				},
			},
		}
		const result = validateDoctype(doctype)
		expect(result.success).toBe(true)
		expect(result.errors).toEqual([])
	})

	it('should reject invalid fetch method', () => {
		const doctype = {
			name: 'Recipe',
			fields: [{ kind: 'field', fieldname: 'name', fieldtype: 'Data' }],
			links: {
				tasks: { target: 'recipe-task', cardinality: 'noneOrMany', fetch: { method: 'invalid' } },
			},
		}
		const result = validateDoctype(doctype)
		expect(result.success).toBe(false)
		expect(result.errors.length).toBeGreaterThan(0)
	})

	it('should reject sync fetch with negative limit', () => {
		const doctype = {
			name: 'Recipe',
			fields: [{ kind: 'field', fieldname: 'name', fieldtype: 'Data' }],
			links: {
				tasks: { target: 'recipe-task', cardinality: 'noneOrMany', fetch: { method: 'sync', limit: -1 } },
			},
		}
		const result = validateDoctype(doctype)
		expect(result.success).toBe(false)
		expect(result.errors.length).toBeGreaterThan(0)
	})

	it('should reject sync fetch with zero limit', () => {
		const doctype = {
			name: 'Recipe',
			fields: [{ kind: 'field', fieldname: 'name', fieldtype: 'Data' }],
			links: {
				tasks: { target: 'recipe-task', cardinality: 'noneOrMany', fetch: { method: 'sync', limit: 0 } },
			},
		}
		const result = validateDoctype(doctype)
		expect(result.success).toBe(false)
		expect(result.errors.length).toBeGreaterThan(0)
	})

	it('should reject sync fetch with non-integer limit', () => {
		const doctype = {
			name: 'Recipe',
			fields: [{ kind: 'field', fieldname: 'name', fieldtype: 'Data' }],
			links: {
				tasks: { target: 'recipe-task', cardinality: 'noneOrMany', fetch: { method: 'sync', limit: 5.5 } },
			},
		}
		const result = validateDoctype(doctype)
		expect(result.success).toBe(false)
		expect(result.errors.length).toBeGreaterThan(0)
	})

	it('should reject custom fetch without handler', () => {
		const doctype = {
			name: 'Recipe',
			fields: [{ kind: 'field', fieldname: 'name', fieldtype: 'Data' }],
			links: {
				tasks: { target: 'recipe-task', cardinality: 'noneOrMany', fetch: { method: 'custom' } },
			},
		}
		const result = validateDoctype(doctype)
		expect(result.success).toBe(false)
		expect(result.errors.length).toBeGreaterThan(0)
	})

	it('should accept link without fetch strategy', () => {
		const doctype = {
			name: 'Recipe',
			fields: [{ kind: 'field', fieldname: 'name', fieldtype: 'Data' }],
			links: {
				tasks: { target: 'recipe-task', cardinality: 'noneOrMany' },
			},
		}
		const result = validateDoctype(doctype)
		expect(result.success).toBe(true)
	})

	it('should accept all combinations of fetch strategy with all cardinalities', () => {
		const cardinalities = ['one', 'atMostOne', 'noneOrMany', 'atLeastOne'] as const
		const fetchMethods = [
			{ method: 'sync' },
			{ method: 'sync', limit: 50 },
			{ method: 'lazy' },
			{ method: 'custom', handler: 'function() {}' },
		] as const

		for (const cardinality of cardinalities) {
			for (const fetch of fetchMethods) {
				const doctype = {
					name: 'Recipe',
					fields: [{ kind: 'field', fieldname: 'name', fieldtype: 'Data' }],
					links: {
						items: { target: 'recipe-item', cardinality, fetch },
					},
				}
				const result = validateDoctype(doctype)
				expect(result.success).toBe(true)
			}
		}
	})
})

// =============================================================================
// DoctypeField discriminated union — FieldsetField and TableField variants
// =============================================================================

describe('DoctypeField — FieldsetField variant', { tags: ['unit'] }, () => {
	it('should validate a valid FieldsetField', () => {
		const field = {
			kind: 'fieldset' as const,
			fieldname: 'details',
			label: 'Details',
			collapsible: true,
			schema: [
				{ kind: 'field' as const, fieldname: 'email', fieldtype: 'Data' },
				{ kind: 'field' as const, fieldname: 'phone', fieldtype: 'Data' },
			],
		}
		const result = validateField(field)
		expect(result.success).toBe(true)
		expect(result.errors).toEqual([])
	})

	it('should validate a FieldsetField with empty schema', () => {
		const field = {
			kind: 'fieldset' as const,
			fieldname: 'details',
			schema: [],
		}
		const result = validateField(field)
		expect(result.success).toBe(true)
	})

	it('should validate a recursive FieldsetField — fieldset nested inside fieldset', () => {
		const field = {
			kind: 'fieldset' as const,
			fieldname: 'outer',
			schema: [
				{
					kind: 'fieldset' as const,
					fieldname: 'inner',
					schema: [{ kind: 'field' as const, fieldname: 'name', fieldtype: 'Data' }],
				},
			],
		}
		const result = validateField(field)
		expect(result.success).toBe(true)
	})

	it('should reject a FieldsetField missing fieldname', () => {
		const field = {
			kind: 'fieldset' as const,
			schema: [{ kind: 'field' as const, fieldname: 'email', fieldtype: 'Data' }],
		}
		const result = validateField(field)
		expect(result.success).toBe(false)
		expect(result.errors.length).toBeGreaterThan(0)
	})

	it('should reject a FieldsetField with an invalid child field', () => {
		const field = {
			kind: 'fieldset' as const,
			fieldname: 'details',
			schema: [
				{ kind: 'field' as const, fieldname: 'email' }, // missing fieldtype
			],
		}
		const result = validateField(field)
		expect(result.success).toBe(false)
	})

	it('should parse a FieldsetField and return the correct kind', () => {
		const field = {
			kind: 'fieldset' as const,
			fieldname: 'details',
			schema: [{ kind: 'field' as const, fieldname: 'email', fieldtype: 'Data' }],
		}
		const parsed = parseField(field)
		expect(parsed.kind).toBe('fieldset')
	})
})

describe('DoctypeField — TableField variant', { tags: ['unit'] }, () => {
	it('should validate a valid TableField', () => {
		const field = {
			kind: 'table' as const,
			fieldname: 'items',
			label: 'Line Items',
			columns: [
				{ fieldname: 'qty', label: 'Qty', fieldtype: 'Int' },
				{ fieldname: 'unit_price', label: 'Unit Price', fieldtype: 'Currency' },
			],
		}
		const result = validateField(field)
		expect(result.success).toBe(true)
		expect(result.errors).toEqual([])
	})

	it('should validate a TableField with config', () => {
		const field = {
			kind: 'table' as const,
			fieldname: 'items',
			columns: [{ fieldname: 'qty', fieldtype: 'Int' }],
			config: { view: 'list' as const },
		}
		const result = validateField(field)
		expect(result.success).toBe(true)
	})

	it('should validate all TableViewConfig view types', () => {
		const views = ['list', 'uncounted', 'list-expansion', 'tree', 'gantt', 'tree-gantt'] as const
		for (const view of views) {
			const field = {
				kind: 'table' as const,
				fieldname: 'items',
				columns: [{ fieldname: 'id', fieldtype: 'Data' }],
				config: { view },
			}
			const result = validateField(field)
			expect(result.success).toBe(true)
		}
	})

	it('should reject a TableField missing fieldname', () => {
		const field = {
			kind: 'table' as const,
			columns: [{ fieldname: 'qty', fieldtype: 'Int' }],
		}
		const result = validateField(field)
		expect(result.success).toBe(false)
	})

	it('should reject a TableField whose column is missing fieldname', () => {
		const field = {
			kind: 'table' as const,
			fieldname: 'items',
			columns: [{ label: 'Qty', fieldtype: 'Int' }],
		}
		const result = validateField(field)
		expect(result.success).toBe(false)
	})

	it('should parse a TableField and return the correct kind', () => {
		const field = {
			kind: 'table' as const,
			fieldname: 'items',
			columns: [{ fieldname: 'qty', fieldtype: 'Int' }],
		}
		const parsed = parseField(field)
		expect(parsed.kind).toBe('table')
	})
})

describe('DoctypeField — discriminated union boundaries', { tags: ['unit'] }, () => {
	it('should accept a doctype with all three field kinds', () => {
		const doctype = {
			name: 'Order',
			fields: [
				{ kind: 'field' as const, fieldname: 'status', fieldtype: 'Select', options: ['Draft', 'Submitted'] },
				{
					kind: 'fieldset' as const,
					fieldname: 'billing',
					schema: [{ kind: 'field' as const, fieldname: 'address', fieldtype: 'Data' }],
				},
				{
					kind: 'table' as const,
					fieldname: 'line_items',
					columns: [{ fieldname: 'qty', fieldtype: 'Int' }],
				},
			],
		}
		const result = validateDoctype(doctype)
		expect(result.success).toBe(true)
	})

	it('should reject a field with an unknown kind', () => {
		const field = { kind: 'tab', fieldname: 'overview' }
		const result = validateField(field)
		expect(result.success).toBe(false)
	})

	it('should infer kind: field when fieldtype is present and schema/columns are absent', () => {
		const parsed = parseField({ fieldname: 'email', fieldtype: 'Data' })
		expect(parsed.kind).toBe('field')
	})

	it('should infer kind: fieldset when schema property is present', () => {
		const parsed = parseField({ fieldname: 'details', schema: [] })
		expect(parsed.kind).toBe('fieldset')
	})

	it('should infer kind: table when columns property is present', () => {
		const parsed = parseField({ fieldname: 'line_items', columns: [{ fieldname: 'qty', fieldtype: 'Int' }] })
		expect(parsed.kind).toBe('table')
	})
})
