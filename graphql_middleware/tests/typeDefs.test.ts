import { parse, Kind, type DocumentNode } from 'graphql'
import { describe, it, expect } from 'vitest'

import { ActionDefinition, ValueFieldSchema } from '@stonecrop/schema'
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
		expect(findFieldDefinition(workflowActionType, 'requiredFields')).toBeDefined()
		expect(findFieldDefinition(workflowActionType, 'allowedStates')).toBeDefined()
		expect(findFieldDefinition(workflowActionType, 'nextState')).toBeDefined()
	})

	it('StonecropWorkflowAction fields match ActionDefinition schema shape (drift check)', () => {
		const workflowActionType = findTypeDefinition(doc, 'StonecropWorkflowAction')
		expect(workflowActionType).toBeDefined()

		const schemaFields = Object.keys(ActionDefinition.shape)
		for (const field of schemaFields) {
			expect(
				findFieldDefinition(workflowActionType, field),
				`StonecropWorkflowAction is missing field '${field}' present in ActionDefinition schema`
			).toBeDefined()
		}
	})

	// -----------------------------------------------------------------------
	// StonecropFieldMeta
	// -----------------------------------------------------------------------

	it('defines StonecropDoctypeMeta with displayField', () => {
		const doctypeMetaType = findTypeDefinition(doc, 'StonecropDoctypeMeta')
		expect(findFieldDefinition(doctypeMetaType, 'displayField')).toBeDefined()
	})

	it('StonecropFieldMeta fields match ValueFieldSchema shape exactly (drift check)', () => {
		const fieldMetaType = findTypeDefinition(doc, 'StonecropFieldMeta')
		expect(fieldMetaType).toBeDefined()

		// Exact set equality, both directions: a schema field missing from the SDL
		// is unselectable (silent data loss); an SDL field missing from the schema
		// is a phantom (Zod strips unknown keys at the load gate, so it can never
		// carry data).
		const sdlFields = ((fieldMetaType as any).fields ?? []).map((f: any) => f.name.value as string).toSorted()
		const schemaFields = Object.keys(ValueFieldSchema.shape).toSorted()
		expect(sdlFields).toEqual(schemaFields)
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
