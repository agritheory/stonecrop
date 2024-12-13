import { gql } from 'graphql-request'

/**
 * Queries for the GraphQL API.
 * @public
 */
const queries = {
	getMeta: gql`
		query getDoctype($doctype: String!) {
			getMeta(doctype: $doctype) {
				id
				name
				workflow
				schema
				actions
			}
		}
	`,
}

export { queries }
