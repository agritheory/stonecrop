/**
 * GraphQL query documents sent by {@link StonecropClient} to the middleware.
 *
 * These are the client's half of the wire contract with `@stonecrop/graphql-middleware`.
 * They live here as exported constants (rather than inline in the client methods) so the
 * cross-package contract test can validate the exact strings the client sends against the
 * middleware's published SDL — a field the server drops while a query still selects it must
 * fail CI, not production.
 *
 * @public
 */
export const GET_META_QUERY = `
	query GetMeta($doctype: String!) {
		stonecropMeta(doctype: $doctype) {
			name
			slug
			displayField
			fields {
				kind
				fieldname
				component
				primaryKey
				computed
				language
				doctype
				label
				width
				height
				align
				edit
				mask
				format
				mode
				options
				required
				readOnly
				hidden
				default
				validation
				cardinality
				source
				config
			}
			workflow {
				states
				actions {
					label
					requiredFields
					allowedStates
					nextState
					stateless
					selfTransition
					clientHandler
				}
			}
			inherits
		}
	}
`

/**
 * Mutation document for dispatching a workflow action (the server-owned transition).
 * @public
 */
export const RUN_ACTION_MUTATION = `
	mutation RunAction($doctype: String!, $action: String!, $args: JSON) {
		stonecropAction(doctype: $doctype, action: $action, args: $args) {
			success
			data
			error
			record
		}
	}
`

/**
 * Query document for fetching one record, through the `stonecropRecord` resolver.
 * @public
 */
export const GET_RECORD_QUERY = `
	query GetRecord($doctype: String!, $id: String!, $options: JSON) {
		stonecropRecord(doctype: $doctype, id: $id, options: $options) {
			data
			unknownLinks
		}
	}
`

/**
 * Query document for fetching a page of records, through the `stonecropRecords` resolver.
 * @public
 */
export const GET_RECORDS_QUERY = `
	query GetRecords(
		$doctype: String!
		$filters: JSON
		$orderBy: String
		$limit: Int
		$offset: Int
		$includeTotal: Boolean
	) {
		stonecropRecords(
			doctype: $doctype
			filters: $filters
			orderBy: $orderBy
			limit: $limit
			offset: $offset
			includeTotal: $includeTotal
		) {
			data
			hasMore
			count
		}
	}
`

/**
 * Query document for fetching all doctype metadata.
 * @public
 */
export const GET_ALL_META_QUERY = `
	query GetAllMeta {
		stonecropAllMeta {
			name
			slug
			displayField
			fields {
				kind
				fieldname
				component
				primaryKey
				computed
				language
				doctype
				label
				width
				height
				align
				edit
				mask
				format
				mode
				options
				required
				readOnly
				hidden
				default
				validation
				cardinality
				source
				config
			}
			workflow {
				states
				actions {
					label
					requiredFields
					allowedStates
					nextState
					stateless
					selfTransition
					clientHandler
				}
			}
			inherits
		}
	}
`
