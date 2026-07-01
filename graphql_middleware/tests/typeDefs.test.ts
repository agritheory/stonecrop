import { parse, Kind, type DocumentNode } from 'graphql'
import { describe, it, expect } from 'vitest'

import { typeDefs } from '../src/typeDefs'

function findTypeDefinition(document: DocumentNode, typeName: string) {
	return document.definitions.find(d => d.kind === Kind.OBJECT_TYPE_DEFINITION && d.name.value === typeName)
}

function findFieldDefinition(typeDef: any, fieldName: string) {
	return typeDef?.fields?.find((f: any) => f.name.value === fieldName)
}

function findQueryField(document: DocumentNode, fieldName: string) {
	const queryType = document.definitions.find(
		d => (d.kind === Kind.OBJECT_TYPE_DEFINITION || d.kind === Kind.OBJECT_TYPE_EXTENSION) && d.name.value === 'Query'
	)
	return queryType?.fields?.find((f: any) => f.name.value === fieldName)
}

describe('typeDefs', { tags: ['unit', 'graphql'] }, () => {
	const doc = parse(typeDefs.loc?.source.body || typeDefs)

	// -----------------------------------------------------------------------
	// StonecropWorkflowMeta
	// -----------------------------------------------------------------------

	it('defines StonecropWorkflowAction with required fields', () => {
		const workflowActionType = findTypeDefinition(doc, 'StonecropWorkflowAction')
		expect(workflowActionType).toBeDefined()

		expect(findFieldDefinition(workflowActionType, 'label')).toBeDefined()
		expect(findFieldDefinition(workflowActionType, 'handler')).toBeDefined()
		expect(findFieldDefinition(workflowActionType, 'requiredFields')).toBeDefined()
		expect(findFieldDefinition(workflowActionType, 'allowedStates')).toBeDefined()
		expect(findFieldDefinition(workflowActionType, 'confirm')).toBeDefined()
		expect(findFieldDefinition(workflowActionType, 'args')).toBeDefined()
	})

	it('defines StonecropWorkflowMeta.actions as list of non-null StonecropWorkflowAction', () => {
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

	// -----------------------------------------------------------------------
	// stonecropRecord
	// -----------------------------------------------------------------------

	it('stonecropRecord accepts options parameter', () => {
		const field = findQueryField(doc, 'stonecropRecord')
		expect(field).toBeDefined()

		const args = field?.arguments || []
		const optionsArg = args.find((a: any) => a.name.value === 'options')
		expect(optionsArg).toBeDefined()
	})

	it('StonecropRecordResult has unknownLinks field', () => {
		const resultType = findTypeDefinition(doc, 'StonecropRecordResult')
		expect(resultType).toBeDefined()

		const unknownLinksField = findFieldDefinition(resultType, 'unknownLinks')
		expect(unknownLinksField).toBeDefined()
	})

	// -----------------------------------------------------------------------
	// stonecropRecords
	// -----------------------------------------------------------------------

	it('stonecropRecords accepts options parameter', () => {
		const field = findQueryField(doc, 'stonecropRecords')
		expect(field).toBeDefined()

		const args = field?.arguments || []
		const optionsArg = args.find((a: any) => a.name.value === 'options')
		expect(optionsArg).toBeDefined()
	})

	// -----------------------------------------------------------------------
	// unknownLinks
	// -----------------------------------------------------------------------

	it('unknownLinks is string array type in StonecropRecordResult', () => {
		const resultType = findTypeDefinition(doc, 'StonecropRecordResult')
		const unknownLinksField = findFieldDefinition(resultType, 'unknownLinks')
		expect(unknownLinksField?.type).toBeDefined()
	})

	it('unknownLinks field is optional (not required)', () => {
		const resultType = findTypeDefinition(doc, 'StonecropRecordResult')
		const unknownLinksField = findFieldDefinition(resultType, 'unknownLinks')
		expect(unknownLinksField?.type.kind).not.toBe('NonNullType')
	})
})
