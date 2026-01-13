# @stonecrop/graphql-middleware

GraphQL backend for the Stonecrop framework. Provides a generic, ORM-like interface over PostGraphile.

## Usage

### Server Setup

```typescript
import { createServer } from 'postgraphile/grafserv/h3/v1'
import { grafserv } from 'postgraphile/grafserv'
import { PostGraphileAmberPreset } from 'postgraphile/presets/amber'
import { makePgService } from 'postgraphile/adaptors/pg'
import {
	createStonecropPlugin,
	loadDoctypes,
	registerBuiltinHandlers,
	registerHandler,
} from '@stonecrop/graphql-middleware'

// Load doctype definitions from JSON files
loadDoctypes('./doctypes')

// Register action handlers
registerBuiltinHandlers()
registerHandler('submitOrder', async (args, ctx) => {
	const [orderId] = args as [string]
	// Custom business logic
	return { submitted: true }
})

// Create executor for the plugin to use
const executor = {
	async query(query: string, variables?: Record<string, unknown>) {
		// Execute against PostGraphile's internal schema
		return graphqlExecute(schema, query, variables)
	},
	async mutate(mutation: string, variables?: Record<string, unknown>) {
		return this.query(mutation, variables)
	},
}

const preset: GraphileConfig.Preset = {
	extends: [PostGraphileAmberPreset],
	plugins: [createStonecropPlugin({ executor })],
	pgServices: [
		makePgService({
			connectionString: process.env.DATABASE_URL,
		}),
	],
}
```

### Client Usage

```typescript
import { StonecropClient } from '@stonecrop/graphql-middleware'

const client = new StonecropClient({
	endpoint: 'http://localhost:4000/graphql',
})

// Get doctype metadata
const meta = await client.getMeta({ doctype: 'SalesOrder' })

// Fetch records
const orders = await client.getRecords(meta, {
	limit: 10,
	orderBy: 'createdAt',
})

// Fetch single record
const order = await client.getRecord(meta, 'uuid-here')

// Run an action
const result = await client.runAction(meta, 'submit', [order.id])
```

### Doctype Definition

```json
{
	"name": "SalesOrder",
	"tableName": "sales_orders",
	"fields": [
		{ "fieldname": "id", "fieldtype": "UUID" },
		{ "fieldname": "customer", "fieldtype": "Link", "required": true },
		{ "fieldname": "status", "fieldtype": "Select" },
		{ "fieldname": "total", "fieldtype": "Currency" }
	],
	"workflow": {
		"states": ["Draft", "Submitted", "Cancelled"],
		"actions": {
			"submit": {
				"label": "Submit",
				"handler": "submitOrder",
				"requiredFields": ["customer"],
				"allowedStates": ["Draft"]
			}
		}
	}
}
```

## API

### Registry Functions

- `loadDoctypes(dir: string)` - Load doctype JSON files from directory
- `loadDoctypesFromObject(doctypes)` - Load doctypes from an object
- `getMeta(name: string)` - Get a single doctype definition
- `getAllMeta()` - Get all loaded doctypes
- `registerHandler(name, handler)` - Register an action handler
- `registerBuiltinHandlers()` - Register built-in handlers

### Built-in Handlers

- `validateRequiredFields` - Validates that required fields are present
- `noop` - Does nothing, returns `{ ok: true }`

### GraphQL Schema

The plugin adds these operations:

```graphql
type Query {
	stonecropMeta(doctype: String!): DoctypeMeta
	stonecropAllMeta: [DoctypeMeta!]!
	stonecropRecord(doctype: String!, id: String!): RecordResult
	stonecropRecords(
		doctype: String!
		filters: JSON
		orderBy: String
		limit: Int
		offset: Int
	): RecordsResult
}

type Mutation {
	stonecropAction(doctype: String!, action: String!, args: JSON): ActionResult!
}
```