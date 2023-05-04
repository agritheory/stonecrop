import { gql } from 'graphql-request'

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
