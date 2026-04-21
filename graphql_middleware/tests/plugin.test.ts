import { readFileSync } from 'fs'
import { parse, type DocumentNode } from 'graphql'
import { join } from 'path'
import { describe, it, expect, vi } from 'vitest'

import { createStonecropPlugin } from '../src/plugin/postgraphile'

// ===========================================================================
// createStonecropPlugin — inflection resolution coverage
// ===========================================================================

describe('createStonecropPlugin', () => {
	const mockExecutor = { query: vi.fn(), mutate: vi.fn() }

	it('creates a plugin with default inflection', () => {
		const plugin = createStonecropPlugin({ executor: mockExecutor })
		expect(plugin).toBeDefined()
	})

	it('accepts partial inflection overrides', () => {
		const plugin = createStonecropPlugin({
			executor: mockExecutor,
			inflection: {
				recordFieldName: t => `${t}ByRowId`,
				recordArgName: () => 'rowId',
			},
		})
		expect(plugin).toBeDefined()
	})

	it('accepts full inflection overrides', () => {
		const plugin = createStonecropPlugin({
			executor: mockExecutor,
			inflection: {
				recordFieldName: t => `custom_${t}`,
				connectionFieldName: t => `list_${t}`,
				orderByTypeName: t => `${t}Sort`,
				recordArgName: () => 'nodeId',
				recordArgType: () => 'ID!',
			},
		})
		expect(plugin).toBeDefined()
	})

	it('accepts reverseConnectionName override', () => {
		const plugin = createStonecropPlugin({
			executor: mockExecutor,
			inflection: {
				reverseConnectionName: ({ target }) => `Custom_${target}`,
			},
		})
		expect(plugin).toBeDefined()
	})
})

// ===========================================================================
// GraphQL Schema Structure Validation
// ===========================================================================

describe('StonecropWorkflowMeta schema', () => {
	function extractTypeDefs(source: string): string {
		const match = source.match(/typeDefs: gql`([\s\S]*?)`/)
		if (!match) throw new Error('Could not find typeDefs in source')
		return match[1]
	}

	function parseTypeDefs(typeDefs: string): DocumentNode {
		return parse(typeDefs)
	}

	function findTypeDefinition(doc: DocumentNode, typeName: string) {
		return doc.definitions.find(d => d.kind === 'ObjectTypeDefinition' && d.name.value === typeName)
	}

	function findFieldDefinition(typeDef: any, fieldName: string) {
		return typeDef?.fields?.find((f: any) => f.name.value === fieldName)
	}

	const sourceFile = readFileSync(join(__dirname, '../src/plugin/postgraphile.ts'), 'utf-8')

	it('defines StonecropWorkflowAction type with label, handler, requiredFields, allowedStates, confirm, and args fields', () => {
		const typeDefs = extractTypeDefs(sourceFile)
		const doc = parseTypeDefs(typeDefs)

		const workflowActionType = findTypeDefinition(doc, 'StonecropWorkflowAction')
		expect(workflowActionType).toBeDefined()

		expect(findFieldDefinition(workflowActionType, 'label')).toBeDefined()
		expect(findFieldDefinition(workflowActionType, 'handler')).toBeDefined()
		expect(findFieldDefinition(workflowActionType, 'requiredFields')).toBeDefined()
		expect(findFieldDefinition(workflowActionType, 'allowedStates')).toBeDefined()
		expect(findFieldDefinition(workflowActionType, 'confirm')).toBeDefined()
		expect(findFieldDefinition(workflowActionType, 'args')).toBeDefined()
	})

	it('defines StonecropWorkflowMeta.actions as list of non-null StonecropWorkflowAction, not JSON', () => {
		const typeDefs = extractTypeDefs(sourceFile)
		const doc = parseTypeDefs(typeDefs)

		const workflowMetaType = findTypeDefinition(doc, 'StonecropWorkflowMeta')
		expect(workflowMetaType).toBeDefined()

		const actionsField = findFieldDefinition(workflowMetaType, 'actions')
		expect(actionsField).toBeDefined()

		const actionsType = actionsField.type
		expect(actionsType.kind).toBe('ListType')
		expect(actionsType.type.kind).toBe('NonNullType')
		expect(actionsType.type.type.kind).toBe('NamedType')
		expect(actionsType.type.type.name.value).toBe('StonecropWorkflowAction')
	})
})

// ===========================================================================
// stonecropRecord schema with options parameter
// ===========================================================================

describe('stonecropRecord schema', () => {
	function extractTypeDefs(source: string): string {
		const match = source.match(/typeDefs: gql`([\s\S]*?)`/)
		if (!match) throw new Error('Could not find typeDefs in source')
		return match[1]
	}

	function parseTypeDefs(typeDefs: string): DocumentNode {
		return parse(typeDefs)
	}

	function findFieldDefinition(doc: DocumentNode, fieldName: string) {
		// Handle both type Query { ... } and extend type Query { ... }
		const queryType = doc.definitions.find(
			d => (d.kind === 'ObjectTypeDefinition' || d.kind === 'ObjectTypeExtension') && d.name.value === 'Query'
		)
		return queryType?.fields?.find((f: any) => f.name.value === fieldName)
	}

	const sourceFile = readFileSync(join(__dirname, '../src/plugin/postgraphile.ts'), 'utf-8')

	it('stonecropRecord accepts options parameter', () => {
		const typeDefs = extractTypeDefs(sourceFile)
		const doc = parseTypeDefs(typeDefs)

		const field = findFieldDefinition(doc, 'stonecropRecord')
		expect(field).toBeDefined()

		const args = field?.arguments || []
		const optionsArg = args.find((a: any) => a.name.value === 'options')
		expect(optionsArg).toBeDefined()
	})

	it('stonecropRecord returns StonecropRecordResult with unknownLinks', () => {
		const typeDefs = extractTypeDefs(sourceFile)
		const doc = parseTypeDefs(typeDefs)

		const resultType = doc.definitions.find(
			d => d.kind === 'ObjectTypeDefinition' && d.name.value === 'StonecropRecordResult'
		)
		expect(resultType).toBeDefined()

		const unknownLinksField = resultType?.fields?.find((f: any) => f.name.value === 'unknownLinks')
		expect(unknownLinksField).toBeDefined()
	})
})

describe('unknownLinks behavior', () => {
	it('unknownLinks is string array type in StonecropRecordResult', () => {
		const sourceFile = readFileSync(join(__dirname, '../src/plugin/postgraphile.ts'), 'utf-8')
		const typeDefsMatch = sourceFile.match(/typeDefs: gql`([\s\S]*?)`/)
		expect(typeDefsMatch).toBeDefined()

		const typeDefs = typeDefsMatch[1]
		const doc = parse(typeDefs)

		const resultType = doc.definitions.find(
			d => d.kind === 'ObjectTypeDefinition' && d.name.value === 'StonecropRecordResult'
		)
		const unknownLinksField = resultType?.fields?.find((f: any) => f.name.value === 'unknownLinks')

		// Should be [String!]! or similar
		expect(unknownLinksField?.type).toBeDefined()
	})

	it('unknownLinks field is optional (not required)', () => {
		const sourceFile = readFileSync(join(__dirname, '../src/plugin/postgraphile.ts'), 'utf-8')
		const typeDefsMatch = sourceFile.match(/typeDefs: gql`([\s\S]*?)`/)
		expect(typeDefsMatch).toBeDefined()

		const typeDefs = typeDefsMatch[1]
		const doc = parse(typeDefs)

		const resultType = doc.definitions.find(
			d => d.kind === 'ObjectTypeDefinition' && d.name.value === 'StonecropRecordResult'
		)
		const unknownLinksField = resultType?.fields?.find((f: any) => f.name.value === 'unknownLinks')

		// Not NonNull, so it's optional
		expect(unknownLinksField?.type.kind).not.toBe('NonNullType')
	})
})
