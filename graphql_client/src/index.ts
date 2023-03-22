import { request, gql } from 'graphql-request'

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

export const Query = async () => {
	const data = await request('https://swapi-graphql.netlify.app/.netlify/functions/index', query)
	return data
}
