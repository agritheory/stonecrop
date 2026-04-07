import { describe, it, expect } from 'vitest'
import { validateField, validateDoctype, parseField, parseDoctype, type ValidationResult } from '../src/validation'
import { ZodError } from 'zod'

describe('Field Validation', () => {
	describe('validateField', () => {
		it('should validate a correct field', () => {
			const field = {
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
				fieldname: 'name',
				fieldtype: 'Data',
			}
			const result = validateField(field)

			expect(result.success).toBe(true)
			expect(result.errors).toEqual([])
		})

		it('should reject field missing fieldname', () => {
			const field = {
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
				fieldname: 'test',
			}
			const result = validateField(field)

			expect(result.success).toBe(false)
			expect(result.errors.length).toBeGreaterThan(0)
			expect(result.errors[0].path).toContain('fieldtype')
		})

		it('should reject invalid fieldtype', () => {
			const field = {
				fieldname: 'test',
				fieldtype: 'InvalidType',
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
				value: 'active',
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
				fieldname: 'email',
				fieldtype: 'Data',
			}
			const parsed = parseField(field)

			expect(parsed.fieldname).toBe('email')
			expect(parsed.fieldtype).toBe('Data')
		})

		it('should throw ZodError for invalid field', () => {
			const field = {
				fieldname: 'test',
				// Missing fieldtype
			}
			expect(() => parseField(field)).toThrow(ZodError)
		})

		it('should throw ZodError for invalid fieldtype', () => {
			const field = {
				fieldname: 'test',
				fieldtype: 'NotAValidType',
			}
			expect(() => parseField(field)).toThrow(ZodError)
		})
	})
})

describe('Doctype Validation', () => {
	describe('validateDoctype', () => {
		it('should validate a correct doctype', () => {
			const doctype = {
				name: 'User',
				slug: 'user',
				tableName: 'users',
				fields: [
					{ fieldname: 'id', fieldtype: 'Data' },
					{ fieldname: 'name', fieldtype: 'Data' },
				],
			}
			const result = validateDoctype(doctype)

			expect(result.success).toBe(true)
			expect(result.errors).toEqual([])
		})

		it('should validate a minimal doctype', () => {
			const doctype = {
				name: 'Task',
				fields: [{ fieldname: 'title', fieldtype: 'Data' }],
			}
			const result = validateDoctype(doctype)

			expect(result.success).toBe(true)
			expect(result.errors).toEqual([])
		})

		it('should reject doctype missing name', () => {
			const doctype = {
				fields: [{ fieldname: 'id', fieldtype: 'Data' }],
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
					{ fieldname: 'id', fieldtype: 'Data' },
					{ fieldname: 'invalid' }, // Missing fieldtype
				],
			}
			const result = validateDoctype(doctype)

			expect(result.success).toBe(false)
			expect(result.errors.length).toBeGreaterThan(0)
		})

		it('should validate doctype with workflow', () => {
			const doctype = {
				name: 'Order',
				fields: [{ fieldname: 'id', fieldtype: 'Data' }],
				workflow: {
					states: ['Draft', 'Submitted', 'Approved'],
					actions: {
						submit: {
							label: 'Submit',
							handler: 'submitOrder',
							requiredFields: ['customer', 'items'],
							allowedStates: ['Draft'],
							confirm: true,
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
				fields: [{ fieldname: 'id', fieldtype: 'Data' }],
				workflow: {
					actions: {
						submit: {
							// Missing required 'label' and 'handler'
							confirm: true,
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
				fields: [{ fieldname: 'employeeId', fieldtype: 'Data' }],
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
					{ fieldname: 'name', fieldtype: 'Data' },
					{ fieldname: 'status', fieldtype: 'Data' },
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
				fields: [{ fieldname: 'name', fieldtype: 'Data' }],
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
				fields: [{ fieldname: 'name', fieldtype: 'Data' }],
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
				fields: [{ fieldname: 'name', fieldtype: 'Data' }],
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
				fields: [{ fieldname: 'name', fieldtype: 'Data' }],
				links: {
					tasks: { target: 'recipe-task', cardinality: 'many' },
				},
			}
			const result = validateDoctype(doctype)

			expect(result.success).toBe(false)
			expect(result.errors.length).toBeGreaterThan(0)
		})

		it('should validate all cardinality values on FieldMeta', () => {
			const cardinalities = ['one', 'atMostOne', 'noneOrMany', 'atLeastOne'] as const
			for (const cardinality of cardinalities) {
				const field = {
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
					{ fieldname: 'name', fieldtype: 'Data' },
					{ fieldname: 'tasks', fieldtype: 'Link', options: 'recipe-task' },
					{ fieldname: 'status', fieldtype: 'Data' },
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
					{ fieldname: 'name', fieldtype: 'Data' },
					{ fieldname: 'tasks', fieldtype: 'Link', options: 'recipe-task' },
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
				fields: [{ fieldname: 'id', fieldtype: 'Data' }],
			}
			const parsed = parseDoctype(doctype)

			expect(parsed.name).toBe('User')
			expect(parsed.fields.length).toBe(1)
			expect(parsed.fields[0].fieldname).toBe('id')
		})

		it('should throw ZodError for invalid doctype', () => {
			const doctype = {
				// Missing name
				fields: [{ fieldname: 'id', fieldtype: 'Data' }],
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
					{ fieldname: 'id', fieldtype: 'Data' },
					{ fieldname: 'invalid' }, // Missing fieldtype
				],
			}
			expect(() => parseDoctype(doctype)).toThrow(ZodError)
		})

		it('should parse a doctype with links and Link fields', () => {
			const doctype = {
				name: 'Recipe',
				fields: [
					{ fieldname: 'name', fieldtype: 'Data' },
					{ fieldname: 'status', fieldtype: 'Data' },
					{ fieldname: 'tasks', fieldtype: 'Link', options: 'recipe-task' },
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

describe('Error Path Information', () => {
	it('should provide detailed path for nested errors', () => {
		const doctype = {
			name: 'User',
			fields: [
				{ fieldname: 'id', fieldtype: 'Data' },
				{ fieldname: 'email' }, // Missing fieldtype at index 1
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

describe('LinkDeclaration Validation', () => {
	it('should accept all four valid cardinality values on a link', () => {
		const cardinalities = ['one', 'atMostOne', 'noneOrMany', 'atLeastOne'] as const
		for (const cardinality of cardinalities) {
			const doctype = {
				name: 'Recipe',
				fields: [{ fieldname: 'name', fieldtype: 'Data' }],
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
			fields: [{ fieldname: 'name', fieldtype: 'Data' }],
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
			fields: [{ fieldname: 'name', fieldtype: 'Data' }],
			links: {
				tasks: { target: '', cardinality: 'noneOrMany' },
			},
		}
		const result = validateDoctype(doctype)
		expect(result.success).toBe(false)
		expect(result.errors.length).toBeGreaterThan(0)
	})
})
