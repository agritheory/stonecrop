import type { ExecutionRequest } from '@graphql-tools/utils'
import { wrapSchema } from '@graphql-tools/wrap'
import { buildClientSchema, print } from 'graphql'
import { fetch } from 'ofetch'

import type { RemoteSchema } from './types'

const INTROSPECTION_QUERY = `
  query IntrospectionQuery {
    __schema {
      queryType { name }
      mutationType { name }
      subscriptionType { name }
      types {
        ...FullType
      }
      directives {
        name
        description
        locations
        args {
          ...InputValue
        }
      }
    }
  }

  fragment FullType on __Type {
    kind
    name
    description
    fields(includeDeprecated: true) {
      name
      description
      args {
        ...InputValue
      }
      type {
        ...TypeRef
      }
      isDeprecated
      deprecationReason
    }
    inputFields {
      ...InputValue
    }
    interfaces {
      ...TypeRef
    }
    enumValues(includeDeprecated: true) {
      name
      description
      isDeprecated
      deprecationReason
    }
    possibleTypes {
      ...TypeRef
    }
  }

  fragment InputValue on __InputValue {
    name
    description
    type { ...TypeRef }
    defaultValue
  }

  fragment TypeRef on __Type {
    kind
    name
    ofType {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
              }
            }
          }
        }
      }
    }
  }
`

async function createExecutor(url: string, headers?: HeadersInit) {
	return async ({ document, variables }: ExecutionRequest) => {
		const query = print(document)
		const fetchResult = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...headers,
			},
			body: JSON.stringify({ query, variables }),
		})
		return fetchResult.json()
	}
}

async function fetchRemoteSchema(url: string) {
	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ query: INTROSPECTION_QUERY }),
		})

		const result = await response.json()

		if (result.errors) {
			console.error('Remote schema introspection failed:', result.errors)
			return null
		}

		const schema = buildClientSchema(result.data)
		const executor = await createExecutor(url)

		return wrapSchema({
			schema,
			executor,
		})
	} catch (error) {
		console.error('Failed to fetch remote schema:', error)
		return null
	}
}

export async function loadRemoteSchemas(configs: RemoteSchema[] = []) {
	const remoteSchemas = await Promise.all(
		configs.map(async ({ url, prefix }) => {
			console.log(`Fetching remote schema from ${url}`)
			const schema = await fetchRemoteSchema(url)

			if (!schema) {
				console.warn(`Failed to load remote schema from ${url}`)
				return null
			}

			// Apply prefix if specified
			if (prefix) {
				return wrapSchema({
					schema,
					executor: await createExecutor(url),
					transforms: [
						{
							transformSchema: schema => {
								// Add prefix logic here if needed
								return schema
							},
						},
					],
				})
			}

			return schema
		})
	)

	return remoteSchemas.filter(el => el !== null)
}
