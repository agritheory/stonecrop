import { describe, it, expect } from 'vitest'
import { buildSchema, introspectionFromSchema, type IntrospectionQuery } from 'graphql'

import {
	convertGraphQLSchema,
	GQL_SCALAR_MAP,
	WELL_KNOWN_SCALARS,
	INTERNAL_SCALARS,
	buildScalarMap,
	defaultIsEntityType,
	defaultIsEntityField,
	classifyFieldType,
} from '../src/converter'
import { CANONICAL_COMPONENTS } from '../src/component-meta'
import { validateDoctype, parseDoctype } from '../src/validation'

// ═══════════════════════════════════════════════════════════════
// Helper: Build introspection from SDL for testing
// ═══════════════════════════════════════════════════════════════

function sdlToIntrospection(sdl: string): IntrospectionQuery {
	const schema = buildSchema(sdl)
	return introspectionFromSchema(schema)
}

// ═══════════════════════════════════════════════════════════════
// Test SDL schemas
// ═══════════════════════════════════════════════════════════════

const basicSdl = `
type Query {
	user(id: ID!): User
	users: UserConnection
	post(id: ID!): Post
}

type User {
	id: ID!
	name: String!
	email: String
	active: Boolean!
	age: Int
	score: Float
}

type Post {
	id: ID!
	title: String!
	body: String
	author: User!
	status: PostStatus!
	comments: CommentConnection
}

type Comment {
	id: ID!
	text: String!
	author: User!
}

enum PostStatus {
	DRAFT
	PUBLISHED
	ARCHIVED
}

type UserConnection {
	edges: [UserEdge]
	totalCount: Int
}

type UserEdge {
	node: User
	cursor: String
}

type CommentConnection {
	edges: [CommentEdge]
	totalCount: Int
}

type CommentEdge {
	node: Comment
	cursor: String
}

type UserInput {
	name: String!
	email: String
}

type UserPatch {
	name: String
	email: String
}

type CreateUserPayload {
	user: User
}
`

// ═══════════════════════════════════════════════════════════════
// Scalar Maps
// ═══════════════════════════════════════════════════════════════

describe('GQL_SCALAR_MAP', { tags: ['unit'] }, () => {
	it('should map all standard GraphQL scalars', () => {
		expect(GQL_SCALAR_MAP.String).toEqual({ component: 'ATextInput' })
		expect(GQL_SCALAR_MAP.Int).toEqual({ component: 'ANumericInput' })
		expect(GQL_SCALAR_MAP.Float).toEqual({ component: 'ANumericInput' })
		expect(GQL_SCALAR_MAP.Boolean).toEqual({ component: 'ACheckbox' })
		expect(GQL_SCALAR_MAP.ID).toEqual({ component: 'ATextInput' })
	})
})

describe('WELL_KNOWN_SCALARS', { tags: ['unit'] }, () => {
	it('should map common custom scalars', () => {
		expect(WELL_KNOWN_SCALARS.BigFloat).toEqual({ component: 'ANumericInput' })
		expect(WELL_KNOWN_SCALARS.UUID).toEqual({ component: 'ATextInput' })
		expect(WELL_KNOWN_SCALARS.DateTime).toEqual({ component: 'ADateTime' })
		expect(WELL_KNOWN_SCALARS.Datetime).toEqual({ component: 'ADateTime' })
		expect(WELL_KNOWN_SCALARS.Date).toEqual({ component: 'ADate' })
		expect(WELL_KNOWN_SCALARS.Time).toEqual({ component: 'ATextInput' })
		expect(WELL_KNOWN_SCALARS.JSON).toEqual({ component: 'ACodeEditor' })
		expect(WELL_KNOWN_SCALARS.BigInt).toEqual({ component: 'ANumericInput' })
		expect(WELL_KNOWN_SCALARS.Duration).toEqual({ component: 'ADuration' })
	})

	it('should map every entry to a component Stonecrop actually ships', () => {
		// The converter's output is authored data nobody reviews by hand, so a scalar mapped to a
		// component that does not exist renders nothing at all — the `ACombobox`/`ADatepicker` class
		// of bug. CANONICAL_COMPONENTS is the real set, so this cannot drift from a hand-kept list.
		const offenders = Object.entries(WELL_KNOWN_SCALARS)
			.filter(([, template]) => !CANONICAL_COMPONENTS.includes(template.component))
			.map(([name, template]) => `${name} → ${template.component}`)
		expect(offenders).toEqual([])
	})
})

describe('INTERNAL_SCALARS', { tags: ['unit'] }, () => {
	it('should include Cursor', () => {
		expect(INTERNAL_SCALARS.has('Cursor')).toBe(true)
	})
})

describe('buildScalarMap', { tags: ['unit'] }, () => {
	it('should merge standard and well-known scalars', () => {
		const map = buildScalarMap()
		expect(map.String).toEqual(GQL_SCALAR_MAP.String)
		expect(map.BigFloat).toEqual(WELL_KNOWN_SCALARS.BigFloat)
	})

	it('should let standard scalars override well-known names', () => {
		const map = buildScalarMap()
		// String is in both (should always use the standard one)
		expect(map.String).toEqual(GQL_SCALAR_MAP.String)
	})

	it('should let custom scalars override everything', () => {
		const map = buildScalarMap({
			String: { component: 'CustomInput' },
			MyScalar: { component: 'MyComponent' },
		})
		expect(map.String).toEqual({ component: 'CustomInput' })
		expect(map.MyScalar).toEqual({ component: 'MyComponent' })
	})

	it('should default the component for a custom scalar that names none', () => {
		const map = buildScalarMap({
			Partial: {},
		})
		expect(map.Partial).toEqual({ component: 'ATextInput' })
	})
})

// ═══════════════════════════════════════════════════════════════
// Entity Type Detection
// ═══════════════════════════════════════════════════════════════

describe('defaultIsEntityType', { tags: ['unit'] }, () => {
	const schema = buildSchema(basicSdl)
	const typeMap = schema.getTypeMap()

	function getObjectType(name: string) {
		const type = typeMap[name]
		if (!type || type.constructor.name !== 'GraphQLObjectType') {
			throw new Error(`${name} is not an object type`)
		}
		return type as any
	}

	it('should identify entity types', () => {
		expect(defaultIsEntityType('User', getObjectType('User'))).toBe(true)
		expect(defaultIsEntityType('Post', getObjectType('Post'))).toBe(true)
		expect(defaultIsEntityType('Comment', getObjectType('Comment'))).toBe(true)
	})

	it('should exclude Connection types', () => {
		expect(defaultIsEntityType('UserConnection', getObjectType('UserConnection'))).toBe(false)
		expect(defaultIsEntityType('CommentConnection', getObjectType('CommentConnection'))).toBe(false)
	})

	it('should exclude Edge types', () => {
		expect(defaultIsEntityType('UserEdge', getObjectType('UserEdge'))).toBe(false)
		expect(defaultIsEntityType('CommentEdge', getObjectType('CommentEdge'))).toBe(false)
	})

	it('should exclude Input types', () => {
		expect(defaultIsEntityType('UserInput', getObjectType('UserInput'))).toBe(false)
	})

	it('should exclude Patch types', () => {
		expect(defaultIsEntityType('UserPatch', getObjectType('UserPatch'))).toBe(false)
	})

	it('should exclude Payload types', () => {
		expect(defaultIsEntityType('CreateUserPayload', getObjectType('CreateUserPayload'))).toBe(false)
	})

	it('should exclude root operation types', () => {
		expect(defaultIsEntityType('Query', getObjectType('Query'))).toBe(false)
	})

	it('should exclude introspection types', () => {
		// __Schema, __Type, etc. start with __
		expect(defaultIsEntityType('__Schema', getObjectType('__Schema'))).toBe(false)
		expect(defaultIsEntityType('__Type', getObjectType('__Type'))).toBe(false)
	})
})

// ═══════════════════════════════════════════════════════════════
// Entity Field Detection
// ═══════════════════════════════════════════════════════════════

describe('defaultIsEntityField', { tags: ['unit'] }, () => {
	const schema = buildSchema(basicSdl)
	const userType = schema.getType('User') as any
	const userFields = userType.getFields()

	it('should include regular fields', () => {
		expect(defaultIsEntityField('id', userFields.id, userType)).toBe(true)
		expect(defaultIsEntityField('name', userFields.name, userType)).toBe(true)
		expect(defaultIsEntityField('email', userFields.email, userType)).toBe(true)
	})

	it('should skip nodeId', () => {
		expect(defaultIsEntityField('nodeId', userFields.id, userType)).toBe(false)
	})

	it('should skip __typename', () => {
		expect(defaultIsEntityField('__typename', userFields.id, userType)).toBe(false)
	})

	it('should skip clientMutationId', () => {
		expect(defaultIsEntityField('clientMutationId', userFields.id, userType)).toBe(false)
	})
})

// ═══════════════════════════════════════════════════════════════
// Field Classification
// ═══════════════════════════════════════════════════════════════

describe('classifyFieldType', { tags: ['unit'] }, () => {
	const schema = buildSchema(basicSdl)
	const entityTypes = new Set(['User', 'Post', 'Comment'])
	const postType = schema.getType('Post') as any
	const postFields = postType.getFields()
	const userType = schema.getType('User') as any
	const userFields = userType.getFields()

	it('should classify String as ATextInput', () => {
		const field = classifyFieldType('name', userFields.name, entityTypes)
		expect(field.component).toBe('ATextInput')
		expect(field.required).toBe(true) // String!
	})

	it('should classify ID as Data', () => {
		const field = classifyFieldType('id', userFields.id, entityTypes)
		expect(field.component).toBe('ATextInput')
		expect(field.required).toBe(true) // ID!
	})

	it('should classify Boolean as Check', () => {
		const field = classifyFieldType('active', userFields.active, entityTypes)
		expect(field.component).toBe('ACheckbox')
		expect(field.required).toBe(true) // Boolean!
	})

	it('should classify Int as Int', () => {
		const field = classifyFieldType('age', userFields.age, entityTypes)
		expect(field.component).toBe('ANumericInput')
		expect(field.required).toBeUndefined() // nullable Int
	})

	it('should classify Float as Float', () => {
		const field = classifyFieldType('score', userFields.score, entityTypes)
		expect(field.component).toBe('ANumericInput')
	})

	it('should classify optional String without required', () => {
		const field = classifyFieldType('email', userFields.email, entityTypes)
		expect(field.component).toBe('ATextInput')
		expect(field.required).toBeUndefined()
	})

	it('should classify enum as Select', () => {
		const field = classifyFieldType('status', postFields.status, entityTypes)
		expect(field.component).toBe('ADropdown')
		expect(field.options).toEqual(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
		expect(field.required).toBe(true) // PostStatus!
	})

	it('should classify entity reference as Link', () => {
		const field = classifyFieldType('author', postFields.author, entityTypes)
		expect(field.component).toBe('AFormLink')
		expect(field.doctype).toBe('user')
		expect(field.options).toBeUndefined()
		expect(field.required).toBe(true) // User!
	})

	it('should classify Connection field as a link (_isLink marker)', () => {
		const field = classifyFieldType('comments', postFields.comments, entityTypes)
		expect((field as any)._isLink).toBe(true)
		expect(field.component).toBe('ATable')
		expect(field.doctype).toBe('comment')
		expect(field.cardinality).toBe('noneOrMany')
	})

	it('should include unmapped meta when requested', () => {
		// Create a schema with a custom scalar
		const customSdl = `
			scalar MyCustomType
			type Query { test: TestEntity }
			type TestEntity { field1: MyCustomType }
		`
		const customSchema = buildSchema(customSdl)
		const testType = customSchema.getType('TestEntity') as any
		const testFields = testType.getFields()

		const field = classifyFieldType('field1', testFields.field1, new Set(['TestEntity']), {
			includeUnmappedMeta: true,
		})
		expect(field._unmapped).toBe(true)
		expect(field._graphqlType).toBe('MyCustomType')
	})

	it('should use custom scalars', () => {
		const customSdl = `
			scalar Money
			type Query { test: TestEntity }
			type TestEntity { amount: Money }
		`
		const customSchema = buildSchema(customSdl)
		const testType = customSchema.getType('TestEntity') as any
		const testFields = testType.getFields()

		const field = classifyFieldType('amount', testFields.amount, new Set(['TestEntity']), {
			customScalars: {
				Money: { component: 'ACurrencyInput' },
			},
		})
		expect(field.component).toBe('ACurrencyInput')
	})

	it('should generate a label from the field name', () => {
		const field = classifyFieldType('name', userFields.name, entityTypes)
		expect(field.label).toBe('Name')
	})
})

describe('classifyFieldType — foreign key (ID → Link)', { tags: ['unit'] }, () => {
	it('should classify ID field as Link when a matching entity type exists', () => {
		const sdl = `
			type Query { task: RecipeTask }
			type RecipeTask {
				id: ID!
				recipe: ID
				name: String!
			}
			type Recipe {
				id: ID!
				title: String!
			}
		`
		const schema = buildSchema(sdl)
		const recipeTaskType = schema.getType('RecipeTask') as any
		const fields = recipeTaskType.getFields()
		const entityTypesWithRecipe = new Set(['RecipeTask', 'Recipe'])

		const recipeField = classifyFieldType('recipe', fields.recipe, entityTypesWithRecipe)
		expect(recipeField.component).toBe('AFormLink')
		expect(recipeField.doctype).toBe('recipe')
	})

	it('should leave a plain ID field as a scalar when no matching entity type exists', () => {
		const schema = buildSchema(`
			type Query { user: User }
			type User { id: ID! name: String! }
		`)
		const userType = schema.getType('User') as any
		const fields = userType.getFields()

		const idField = classifyFieldType('id', fields.id, new Set(['User']))
		expect(idField.component).toBe('ATextInput')
		expect(idField.doctype).toBeUndefined()
	})

	it('should work end-to-end via convertGraphQLSchema', () => {
		const sdl = `
			type Query { task: RecipeTask }
			type RecipeTask {
				id: ID!
				recipe: ID
				name: String!
			}
			type Recipe {
				id: ID!
				title: String!
			}
		`
		const doctypes = convertGraphQLSchema(sdl)
		const recipeTask = doctypes.find(d => d.name === 'RecipeTask')!
		const recipeField = recipeTask.fields.find(f => f.fieldname === 'recipe')!

		expect(recipeField.component).toBe('AFormLink')
		expect(recipeField.doctype).toBe('recipe')
	})
})

// ═══════════════════════════════════════════════════════════════
// End-to-End Conversion
// ═══════════════════════════════════════════════════════════════

describe('convertGraphQLSchema', { tags: ['unit'] }, () => {
	describe('from SDL', () => {
		it('should convert entity types to doctypes', () => {
			const doctypes = convertGraphQLSchema(basicSdl)

			expect(doctypes.length).toBe(3) // User, Post, Comment
			const names = doctypes.map(d => d.name).toSorted()
			expect(names).toEqual(['Comment', 'Post', 'User'])
		})

		it('should exclude synthetic types', () => {
			const doctypes = convertGraphQLSchema(basicSdl)
			const names = doctypes.map(d => d.name)

			expect(names).not.toContain('UserConnection')
			expect(names).not.toContain('UserEdge')
			expect(names).not.toContain('CommentConnection')
			expect(names).not.toContain('CommentEdge')
			expect(names).not.toContain('UserInput')
			expect(names).not.toContain('UserPatch')
			expect(names).not.toContain('CreateUserPayload')
			expect(names).not.toContain('Query')
		})

		it('should generate correct slugs', () => {
			const doctypes = convertGraphQLSchema(basicSdl)
			const user = doctypes.find(d => d.name === 'User')!
			const post = doctypes.find(d => d.name === 'Post')!

			expect(user.slug).toBe('user')
			expect(post.slug).toBe('post')
		})

		it('should correctly classify fields on User', () => {
			const doctypes = convertGraphQLSchema(basicSdl)
			const user = doctypes.find(d => d.name === 'User')!

			const idField = user.fields.find(f => f.fieldname === 'id')!
			expect(idField.component).toBe('ATextInput')
			expect(idField.required).toBe(true)

			const nameField = user.fields.find(f => f.fieldname === 'name')!
			expect(nameField.component).toBe('ATextInput')
			expect(nameField.required).toBe(true)

			const emailField = user.fields.find(f => f.fieldname === 'email')!
			expect(emailField.component).toBe('ATextInput')
			expect(emailField.required).toBeUndefined()

			const activeField = user.fields.find(f => f.fieldname === 'active')!
			expect(activeField.component).toBe('ACheckbox')
			expect(activeField.required).toBe(true)

			const ageField = user.fields.find(f => f.fieldname === 'age')!
			expect(ageField.component).toBe('ANumericInput')

			const scoreField = user.fields.find(f => f.fieldname === 'score')!
			expect(scoreField.component).toBe('ANumericInput')
		})

		it('should correctly classify fields on Post', () => {
			const doctypes = convertGraphQLSchema(basicSdl)
			const post = doctypes.find(d => d.name === 'Post')!

			const authorField = post.fields.find(f => f.fieldname === 'author')!
			expect(authorField.component).toBe('AFormLink')
			expect(authorField.doctype).toBe('user')

			const statusField = post.fields.find(f => f.fieldname === 'status')!
			expect(statusField.component).toBe('ADropdown')
			expect(statusField.options).toEqual(['DRAFT', 'PUBLISHED', 'ARCHIVED'])

			// Connection fields are placed in doctype.links, not doctype.fields
			expect(post.fields.find(f => f.fieldname === 'comments')).toBeUndefined()
			expect(post.links?.comments).toBeDefined()
			expect(post.links?.comments?.target).toBe('comment')
			expect(post.links?.comments?.cardinality).toBe('noneOrMany')
		})
	})

	describe('from introspection', () => {
		it('should produce same results as SDL', () => {
			const fromSdl = convertGraphQLSchema(basicSdl)
			const introspection = sdlToIntrospection(basicSdl)
			const fromIntrospection = convertGraphQLSchema(introspection)

			expect(fromIntrospection.length).toBe(fromSdl.length)

			const sdlNames = fromSdl.map(d => d.name).toSorted()
			const introspectionNames = fromIntrospection.map(d => d.name).toSorted()
			expect(introspectionNames).toEqual(sdlNames)
		})
	})

	describe('options', () => {
		it('should filter by include list', () => {
			const doctypes = convertGraphQLSchema(basicSdl, {
				include: ['User'],
			})
			expect(doctypes.length).toBe(1)
			expect(doctypes[0].name).toBe('User')
		})

		it('should filter by exclude list', () => {
			const doctypes = convertGraphQLSchema(basicSdl, {
				exclude: ['Comment'],
			})
			const names = doctypes.map(d => d.name)
			expect(names).toContain('User')
			expect(names).toContain('Post')
			expect(names).not.toContain('Comment')
		})

		it('should apply type overrides', () => {
			const doctypes = convertGraphQLSchema(basicSdl, {
				typeOverrides: {
					User: {
						email: { component: 'ATextarea', label: 'Email Address' },
					},
				},
			})
			const user = doctypes.find(d => d.name === 'User')!
			const emailField = user.fields.find(f => f.fieldname === 'email')!
			expect(emailField.component).toBe('ATextarea')
			expect(emailField.label).toBe('Email Address')
		})

		it('should use custom isEntityType', () => {
			const doctypes = convertGraphQLSchema(basicSdl, {
				isEntityType: typeName => typeName === 'User',
			})
			expect(doctypes.length).toBe(1)
			expect(doctypes[0].name).toBe('User')
		})

		it('should use custom isEntityField', () => {
			const doctypes = convertGraphQLSchema(basicSdl, {
				isEntityField: fieldName => fieldName !== 'email',
			})
			const user = doctypes.find(d => d.name === 'User')!
			const fieldNames = user.fields.map(f => f.fieldname)
			expect(fieldNames).not.toContain('email')
			expect(fieldNames).toContain('name')
		})

		it('should use custom classifyField', () => {
			const doctypes = convertGraphQLSchema(basicSdl, {
				classifyField: fieldName => {
					if (fieldName === 'email') {
						return { component: 'ACodeEditor', language: 'json', label: 'Email Address' }
					}
					return null // fall through to default
				},
			})
			const user = doctypes.find(d => d.name === 'User')!
			const emailField = user.fields.find(f => f.fieldname === 'email')!
			expect(emailField.component).toBe('ACodeEditor')
			expect(emailField.language).toBe('json')
			expect(emailField.label).toBe('Email Address')
		})

		it('should include unmapped meta when requested', () => {
			const doctypes = convertGraphQLSchema(basicSdl, {
				includeUnmappedMeta: true,
			})
			const user = doctypes.find(d => d.name === 'User')!
			expect(user._graphqlTypeName).toBe('User')
		})

		it('should not include unmapped meta by default', () => {
			const doctypes = convertGraphQLSchema(basicSdl)
			const user = doctypes.find(d => d.name === 'User')!
			expect(user._graphqlTypeName).toBeUndefined()
		})

		it('should use custom scalars', () => {
			const customSdl = `
				scalar Money
				type Query { test: Product }
				type Product {
					id: ID!
					name: String!
					price: Money!
				}
			`
			const doctypes = convertGraphQLSchema(customSdl, {
				customScalars: {
					Money: { component: 'ACurrencyInput' },
				},
			})
			expect(doctypes.length).toBe(1)
			const product = doctypes[0]
			const priceField = product.fields.find(f => f.fieldname === 'price')!
			expect(priceField.component).toBe('ACurrencyInput')
			expect(priceField.component).toBe('ACurrencyInput')
		})
	})

	describe('multi-word type names', () => {
		it('should handle PascalCase type names', () => {
			const sdl = `
				type Query { order: SalesOrder }
				type SalesOrder {
					id: ID!
					orderNumber: String!
				}
			`
			const doctypes = convertGraphQLSchema(sdl)
			expect(doctypes.length).toBe(1)
			expect(doctypes[0].name).toBe('SalesOrder')
			expect(doctypes[0].slug).toBe('sales-order')
		})
	})

	describe('list fields', () => {
		it('should classify list of entity type as Doctype', () => {
			const sdl = `
				type Query { order: Order }
				type Order {
					id: ID!
					items: [OrderItem!]!
				}
				type OrderItem {
					id: ID!
					quantity: Int!
				}
			`
			const doctypes = convertGraphQLSchema(sdl)
			const order = doctypes.find(d => d.name === 'Order')!
			// List-of-entity fields are placed in doctype.links, not doctype.fields
			expect(order.fields.find(f => f.fieldname === 'items')).toBeUndefined()
			expect(order.links?.items).toBeDefined()
			expect(order.links?.items?.target).toBe('order-item')
			expect(order.links?.items?.cardinality).toBe('noneOrMany')
		})
	})

	describe('validation compatibility', () => {
		it('should produce doctypes that pass Zod validation', () => {
			const doctypes = convertGraphQLSchema(basicSdl)

			for (const doctype of doctypes) {
				const result = validateDoctype(doctype)
				expect(result.success).toBe(true)
			}
		})

		it('should produce fields that all have kind: "field"', () => {
			const doctypes = convertGraphQLSchema(basicSdl)

			for (const doctype of doctypes) {
				for (const field of doctype.fields) {
					expect(field.kind).toBe('field')
				}
			}
		})

		it('should preserve kind: "field" when typeOverrides are applied', () => {
			const doctypes = convertGraphQLSchema(basicSdl, {
				typeOverrides: {
					User: {
						email: { component: 'AEmailInput' },
					},
				},
			})

			const user = doctypes.find(d => d.name === 'User')!
			const emailField = user.fields.find(f => f.fieldname === 'email')
			expect(emailField?.kind).toBe('field')
			expect(emailField?.component).toBe('AEmailInput')
		})

		it('should produce kind: "field" when classifyField hook is used', () => {
			const doctypes = convertGraphQLSchema(basicSdl, {
				classifyField: fieldName => {
					if (fieldName === 'email') {
						return { component: 'AEmailInput' }
					}
					return null
				},
			})

			const user = doctypes.find(d => d.name === 'User')!
			const emailField = user.fields.find(f => f.fieldname === 'email')
			expect(emailField?.kind).toBe('field')
		})
	})
})

describe('provenance stamping (source: "introspected")', { tags: ['unit'] }, () => {
	it('stamps source: "introspected" on every emitted field', () => {
		const doctypes = convertGraphQLSchema(basicSdl)

		expect(doctypes.length).toBeGreaterThan(0)
		for (const doctype of doctypes) {
			for (const field of doctype.fields) {
				expect(field.source, `${doctype.name}.${field.fieldname}`).toBe('introspected')
			}
		}
	})

	it('preserves the marker when typeOverrides are applied', () => {
		const doctypes = convertGraphQLSchema(basicSdl, {
			typeOverrides: {
				User: {
					email: { label: 'Email Address', component: 'AEmailInput' },
				},
			},
		})

		const user = doctypes.find(d => d.name === 'User')!
		const emailField = user.fields.find(f => f.fieldname === 'email')
		expect(emailField?.label).toBe('Email Address')
		expect(emailField?.source).toBe('introspected')
	})

	it('stamps fields produced by the classifyField hook', () => {
		const doctypes = convertGraphQLSchema(basicSdl, {
			classifyField: fieldName => {
				if (fieldName === 'email') {
					return { component: 'AEmailInput' }
				}
				return null
			},
		})

		const user = doctypes.find(d => d.name === 'User')!
		expect(user.fields.find(f => f.fieldname === 'email')?.source).toBe('introspected')
	})

	it('survives a Zod parse round-trip (declared on ValueFieldSchema, not stripped)', () => {
		const doctypes = convertGraphQLSchema(basicSdl)

		for (const doctype of doctypes) {
			const parsed = parseDoctype(doctype)
			for (const field of parsed.fields) {
				expect(field, `${doctype.name}.${field.fieldname}`).toHaveProperty('source', 'introspected')
			}
		}
	})
})
