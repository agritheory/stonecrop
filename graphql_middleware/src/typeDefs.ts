import { gql } from 'postgraphile/utils'

/**
 * GraphQL type definitions for Stonecrop's middleware API.
 * Includes stonecropMeta, stonecropRecord, stonecropRecords, stonecropAction, and related types.
 * @public
 */
export const typeDefs = gql`
	type StonecropFieldMeta {
		fieldname: String!
		fieldtype: String!
		component: String
		label: String
		width: String
		align: String
		required: Boolean
		readOnly: Boolean
		edit: Boolean
		hidden: Boolean
		default: JSON
		options: JSON
		mask: String
		precision: Int
		scale: Int
		mode: String
		validation: JSON
	}

	type StonecropWorkflowAction {
		label: String!
		handler: String!
		requiredFields: [String!]
		allowedStates: [String!]
		confirm: Boolean
		args: JSON
	}

	type StonecropWorkflowMeta {
		states: [String!]
		actions: [StonecropWorkflowAction!]
	}

	type StonecropDoctypeMeta {
		name: String!
		slug: String
		fields: [StonecropFieldMeta!]!
		workflow: StonecropWorkflowMeta
		inherits: String
	}

	type StonecropRecordResult {
		data: JSON
		doctype: String!
		unknownLinks: [String!]
	}

	type StonecropRecordsResult {
		data: [JSON!]!
		doctype: String!
		count: Int!
	}

	type StonecropActionResult {
		success: Boolean!
		data: JSON
		error: String
	}

	extend type Query {
		stonecropMeta(doctype: String!): StonecropDoctypeMeta
		stonecropAllMeta: [StonecropDoctypeMeta!]!
		stonecropRecord(doctype: String!, id: String!, options: JSON): StonecropRecordResult
		stonecropRecords(
			doctype: String!
			filters: JSON
			orderBy: String
			limit: Int
			offset: Int
			options: JSON
		): StonecropRecordsResult
	}

	extend type Mutation {
		stonecropAction(doctype: String!, action: String!, args: JSON): StonecropActionResult!
	}
`
