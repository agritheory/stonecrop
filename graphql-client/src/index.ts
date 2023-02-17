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

export const Query = () => {
	return request('https://api.spacex.land/graphql/', query).then(data => console.log(data))
}
