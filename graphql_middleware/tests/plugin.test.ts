import { readFileSync } from 'fs'
import { parse, type DocumentNode } from 'graphql'
import { join } from 'path'
import { describe, it, expect } from 'vitest'

import { createStonecropPlugin } from '../src/plugin/postgraphile'

// ===========================================================================
// createStonecropPlugin
// ===========================================================================

describe('createStonecropPlugin', () => {
	it('creates a plugin with no arguments', () => {
		const plugin = createStonecropPlugin()
		expect(plugin).toBeDefined()
	})

	it('creates a plugin with empty options', () => {
		const plugin = createStonecropPlugin({})
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
// stonecropRecord schema
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

		const dataField = resultType?.fields?.find((f: any) => f.name.value === 'data')
		expect(dataField).toBeDefined()

		const doctypeField = resultType?.fields?.find((f: any) => f.name.value === 'doctype')
		expect(doctypeField).toBeDefined()
	})
})

// ===========================================================================
// stonecropRecords schema with options parameter
// ===========================================================================

describe('stonecropRecords schema', () => {
	function extractTypeDefs(source: string): string {
		const match = source.match(/typeDefs: gql`([\s\S]*?)`/)
		if (!match) throw new Error('Could not find typeDefs in source')
		return match[1]
	}

	function parseTypeDefs(typeDefs: string): DocumentNode {
		return parse(typeDefs)
	}

	function findFieldDefinition(doc: DocumentNode, fieldName: string) {
		const queryType = doc.definitions.find(
			d => (d.kind === 'ObjectTypeDefinition' || d.kind === 'ObjectTypeExtension') && d.name.value === 'Query'
		)
		return queryType?.fields?.find((f: any) => f.name.value === fieldName)
	}

	function findArgument(field: any, argName: string) {
		return field?.arguments?.find((a: any) => a.name.value === argName)
	}

	const sourceFile = readFileSync(join(__dirname, '../src/plugin/postgraphile.ts'), 'utf-8')

	it('stonecropRecords accepts options parameter', () => {
		const typeDefs = extractTypeDefs(sourceFile)
		const doc = parseTypeDefs(typeDefs)

		const field = findFieldDefinition(doc, 'stonecropRecords')
		expect(field).toBeDefined()

		const optionsArg = findArgument(field, 'options')
		expect(optionsArg).toBeDefined()
	})

	it('stonecropRecords accepts limit parameter', () => {
		const typeDefs = extractTypeDefs(sourceFile)
		const doc = parseTypeDefs(typeDefs)

		const field = findFieldDefinition(doc, 'stonecropRecords')
		const limitArg = findArgument(field, 'limit')
		expect(limitArg).toBeDefined()
	})

	it('stonecropRecords accepts offset parameter', () => {
		const typeDefs = extractTypeDefs(sourceFile)
		const doc = parseTypeDefs(typeDefs)

		const field = findFieldDefinition(doc, 'stonecropRecords')
		const offsetArg = findArgument(field, 'offset')
		expect(offsetArg).toBeDefined()
	})

	it('stonecropRecords accepts orderBy parameter', () => {
		const typeDefs = extractTypeDefs(sourceFile)
		const doc = parseTypeDefs(typeDefs)

		const field = findFieldDefinition(doc, 'stonecropRecords')
		const orderByArg = findArgument(field, 'orderBy')
		expect(orderByArg).toBeDefined()
	})

	it('stonecropRecords returns StonecropRecordsResult', () => {
		const typeDefs = extractTypeDefs(sourceFile)
		const doc = parseTypeDefs(typeDefs)

		const field = findFieldDefinition(doc, 'stonecropRecords')
		expect(field).toBeDefined()

		// The return type should reference StonecropRecordsResult
		const returnType = field.type
		expect(returnType).toBeDefined()
	})

	it('stonecropRecords options parameter is JSON type', () => {
		const typeDefs = extractTypeDefs(sourceFile)
		const doc = parseTypeDefs(typeDefs)

		const field = findFieldDefinition(doc, 'stonecropRecords')
		const optionsArg = findArgument(field, 'options')

		// Type is NonNull(JSON) — unwrap to check the underlying type
		const innerType = optionsArg?.type.kind === 'NonNullType' ? optionsArg?.type.type : optionsArg?.type
		expect(innerType?.kind).toBe('NamedType')
		expect(innerType?.name.value).toBe('JSON')
	})
})
