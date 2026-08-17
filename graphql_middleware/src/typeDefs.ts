import { gql } from 'postgraphile/utils'

/**
 * GraphQL type definitions for Stonecrop's middleware API.
 * Includes stonecropMeta, stonecropRecord, stonecropRecords, stonecropAction, and related types.
 * @public
 */
export const typeDefs = gql`
	type StonecropFieldMeta {
		kind: String!
		fieldname: String!
		component: String
		primaryKey: Boolean
		computed: Boolean
		language: String
		doctype: String
		label: String
		width: String
		align: String
		edit: Boolean
		mask: String
		format: String
		mode: String
		options: JSON
		required: Boolean
		readOnly: Boolean
		hidden: Boolean
		default: JSON
		validation: JSON
		cardinality: String
		source: String
	}

	type StonecropWorkflowAction {
		label: String!
		requiredFields: [String!]
		allowedStates: [String!]
		nextState: String
		stateless: Boolean
		selfTransition: Boolean
		clientHandler: String
	}

	type StonecropWorkflowMeta {
		states: [String!]
		actions: [StonecropWorkflowAction!]
	}

	type StonecropDoctypeMeta {
		name: String!
		slug: String
		"""
		URL path this doctype is served at, replacing the slug-based default. Carried alongside
		slug because routing is the client's decision and a server-sourced doctype would otherwise
		be unable to state one — the key would parse, ship, and quietly do nothing for every host
		that does not bundle its doctypes as local JSON.
		"""
		route: String
		"""
		Which URL shape this doctype answers: list, form or singleton. Null means it answers both
		its collection and its records, which is the default.
		"""
		view: String
		fields: [StonecropFieldMeta!]!
		workflow: StonecropWorkflowMeta
		inherits: String
	}

	type StonecropRecordResult {
		data: JSON
		doctype: String!
		unknownLinks: [String!]
		"""
		Fields whose linked rows were cut short by a row cap, so data holds a prefix of the
		relation rather than all of it. Null when nothing was truncated. A link cannot be paged,
		so a client that sees a name here must not write that relation back — the rows it never
		received would be deleted.
		"""
		truncatedLinks: [String!]
	}

	type StonecropRecordsResult {
		data: [JSON!]!
		doctype: String!
		"""
		Whether further records exist beyond this page. Always answered — it is read from the
		page itself (one extra row is requested and discarded), so it costs no second query.
		"""
		hasMore: Boolean!
		"""
		Total matching the filters, ignoring limit/offset. Null unless the query asked for it
		with includeTotal, because counting is a full scan on most backends.
		"""
		count: Int
	}

	type StonecropActionResult {
		success: Boolean!
		data: JSON
		error: String
		"""
		Keys the write discarded because the doctype declares no column for them, or because the
		value was a nested relation rather than a column value. Null when everything sent was
		stored. The action still succeeded — this is what it did not keep, and a client that
		reports an unqualified success without checking it tells the user data was saved that
		was not.
		"""
		droppedFields: [String!]
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
			includeTotal: Boolean
			options: JSON
		): StonecropRecordsResult
	}

	extend type Mutation {
		stonecropAction(doctype: String!, action: String!, args: JSON): StonecropActionResult!
	}
`
