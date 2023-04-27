import { request, gql } from 'graphql-request'
import type { App } from 'vue'

import { Doctype, useStonecrop } from '@agritheory/stonecrop'

const query = gql`
	{
		allFilms {
			films {
				title
				director
				releaseDate
				speciesConnection {
					species {
						name
						classification
						homeworld {
							name
						}
					}
				}
			}
		}
	}
`

const Query = async () => {
	const data = await request('https://swapi-graphql.netlify.app/.netlify/functions/index', query)
	return data
}

const StonecropGraphQl = {
	install: (app: App /* options: InstallOptions */) => {
		// TODO: accept and set introspection endpoint?

		// TODO: accept and set graphql endpoint

		const { stonecrop } = useStonecrop()
		if (!(stonecrop.value || stonecrop.value.registry)) {
			throw new Error('Please setup Stonecrop before the GraphQL client')
		}

		// TODO: setup queries and update API methods in the Stonecrop class
		const queries = {
			getMeta: gql`
				query getDoctype($doctype: String!) {
					getMeta(doctype: $doctype) {
						id
						name
						workflow {
							name
						}
						schema {
							id
							label
						}
						actions {
							eventName
						}
					}
				}
			`,
		}

		Object.assign(stonecrop.value, {
			getMeta: async (doctype: Doctype) => {
				const data = await request('http://localhost:3000/graphql', queries.getMeta, { doctype: doctype.doctype })
				return data
			},
		})

		app.provide('$gqlQueries', queries)
	},
}

export { Query, StonecropGraphQl }
