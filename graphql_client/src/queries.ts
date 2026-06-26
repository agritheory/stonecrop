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
			fields {
				fieldname
				fieldtype
				component
				label
				width
				align
				required
				readOnly
				edit
				hidden
				default
				options
				mask
				precision
				scale
				mode
				validation
			}
			workflow {
				states
				actions {
					label
					requiredFields
					allowedStates
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
			fields {
				fieldname
				fieldtype
				component
				label
				width
				align
				required
				readOnly
				edit
				hidden
				default
				options
				mask
				precision
				scale
				mode
				validation
			}
			workflow {
				states
				actions {
					label
					requiredFields
					allowedStates
				}
			}
			inherits
		}
	}
`
