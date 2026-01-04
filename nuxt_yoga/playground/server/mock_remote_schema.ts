import type { IExecutableSchemaDefinition } from '@graphql-tools/schema'
import { createSchema, createYoga } from 'graphql-yoga'
import { createServer } from 'node:http'

const typeDefs: IExecutableSchemaDefinition['typeDefs'] = `
	type Query {
		remoteUsers: [RemoteUser!]!
		remoteStatus: RemoteStatus!
	}

	type RemoteUser {
		id: ID!
		name: String!
		email: String!
		role: String!
	}

	type RemoteStatus {
		healthy: Boolean!
		timestamp: String!
		version: String!
		requestCount: Int!
	}
`

// Track request count for demo purposes
let requestCount = 0

const resolvers: IExecutableSchemaDefinition['resolvers'] = {
	Query: {
		remoteUsers: () => {
			requestCount++
			console.log(`[Mock Remote] Fetching users - Request #${requestCount}`)
			return [
				{ id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
				{ id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'editor' },
				{ id: '3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'viewer' },
			]
		},
		remoteStatus: () => {
			requestCount++
			console.log(`[Mock Remote] Fetching status - Request #${requestCount}`)
			return {
				healthy: true,
				timestamp: new Date().toISOString(),
				version: '1.0.0',
				requestCount,
			}
		},
	},
}

const yoga = createYoga({
	schema: createSchema({
		typeDefs,
		resolvers,
	}),

	graphiql: {
		title: 'Mock Remote GraphQL Server',
		defaultQuery: `
# Test the mock remote schema
query {
  remoteUsers {
    id
    name
    email
    role
  }
  
  remoteStatus {
    healthy
    timestamp
    version
    requestCount
  }
}
		`,
	},

	cors: {
		origin: '*',
		credentials: true,
		methods: ['GET', 'POST'],
	},

	// Add some latency to simulate network delay
	plugins: [
		{
			onRequest: async () => {
				// Simulate network latency (50-150ms)
				const delay = Math.floor(Math.random() * 100) + 50
				await new Promise(resolve => setTimeout(resolve, delay))
			},
		},
	],
})

const server = createServer(yoga)
const port = process.env.PORT || 4000

server.listen(port, () => {
	console.log(`🚀 Mock Remote GraphQL server running at http://localhost:${port}/graphql`)
	console.log(`📊 GraphiQL interface available at http://localhost:${port}/graphql`)
	console.log(`\n💡 This server simulates a remote GraphQL endpoint for schema stitching demos`)
	console.log(`   It adds 50-150ms latency to simulate network requests\n`)
})
