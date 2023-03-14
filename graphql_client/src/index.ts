import { request, gql } from 'graphql-request'

const query = gql`
	{
		company {
			ceo
		}
		roadster {
			apoapsis_au
		}
	}
`

export const Query = async () => {
	const data = await request('https://api.spacex.land/graphql/', query)
	return console.log(data)
}
