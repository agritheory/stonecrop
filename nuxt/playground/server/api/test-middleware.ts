// Sample DDL for testing converter
const sampleDDL = `
CREATE TABLE users (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	username VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	disabled BOOLEAN NOT NULL DEFAULT false,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE roles (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	role_name VARCHAR(255) NOT NULL,
	description TEXT,
	parent_role_id UUID REFERENCES roles(id) ON DELETE SET NULL
);

CREATE TABLE tasks (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	title VARCHAR(255) NOT NULL,
	status VARCHAR(50) NOT NULL DEFAULT 'Draft',
	priority INTEGER NOT NULL DEFAULT 0,
	due_date DATE,
	estimated_hours NUMERIC(5, 2)
);
`

// Cache the import
let middleware: any = null

async function getMiddleware() {
	if (!middleware) {
		middleware = await import('@stonecrop/graphql-middleware')
	}
	return middleware
}

export default defineEventHandler(async event => {
	let mw: any
	try {
		mw = await getMiddleware()
	} catch (e) {
		return {
			success: false,
			error: 'Failed to import @stonecrop/graphql-middleware',
			details: e instanceof Error ? e.message : String(e),
		}
	}

	const {
		convertSchema,
		loadDoctypesFromObject,
		getMeta,
		getAllMeta,
		clearRegistry,
		validateReferences,
		validateDoctype,
	} = mw

	const query = getQuery(event)
	const action = query.action as string

	try {
		switch (action) {
			case 'convert': {
				const doctypes = convertSchema(sampleDDL, {
					inheritanceMode: 'flatten',
					includeUnmappedMeta: true,
				})
				return {
					success: true,
					action: 'convert',
					description: 'Converted PostgreSQL DDL to Stonecrop doctypes',
					result: doctypes,
				}
			}

			case 'load': {
				clearRegistry()
				const converted = convertSchema(sampleDDL, { inheritanceMode: 'flatten' })
				const doctypeMap: Record<string, any> = {}
				for (const dt of converted) {
					doctypeMap[dt.name] = dt
				}
				loadDoctypesFromObject(doctypeMap)
				return {
					success: true,
					action: 'load',
					description: 'Loaded converted doctypes into registry',
					loaded: getAllMeta().map((d: any) => d.name),
				}
			}

			case 'validate-refs': {
				clearRegistry()
				const converted = convertSchema(sampleDDL, { inheritanceMode: 'flatten' })
				const doctypeMap: Record<string, any> = {}
				for (const dt of converted) {
					doctypeMap[dt.name] = dt
				}
				loadDoctypesFromObject(doctypeMap)
				const errors = validateReferences()
				return {
					success: errors.length === 0,
					action: 'validate-refs',
					description: 'Validated cross-doctype references',
					errors,
				}
			}

			case 'validate-schema': {
				const goodDoctype = {
					name: 'TestDoctype',
					fields: [
						{
							fieldname: 'title',
							fieldtype: 'Data',
							component: 'ATextInput',
							label: 'Title',
							required: true,
						},
					],
				}

				const badDoctype = {
					name: '',
					fields: [
						{
							fieldname: 'test',
							fieldtype: 'InvalidType',
							component: 'ATextInput',
						},
					],
				}

				return {
					success: true,
					action: 'validate-schema',
					description: 'Tested Zod schema validation',
					results: {
						validDoctype: validateDoctype(goodDoctype),
						invalidDoctype: validateDoctype(badDoctype),
					},
				}
			}

			case 'get-meta': {
				const doctype = query.doctype as string
				if (!doctype) {
					return { success: false, error: 'Missing doctype parameter' }
				}

				if (getAllMeta().length === 0) {
					clearRegistry()
					const converted = convertSchema(sampleDDL, { inheritanceMode: 'flatten' })
					const doctypeMap: Record<string, any> = {}
					for (const dt of converted) {
						doctypeMap[dt.name] = dt
					}
					loadDoctypesFromObject(doctypeMap)
				}

				const meta = getMeta(doctype)
				return {
					success: !!meta,
					action: 'get-meta',
					doctype,
					result: meta ?? null,
					available: getAllMeta().map((d: any) => d.name),
				}
			}

			default:
				return {
					success: true,
					action: 'help',
					description: 'GraphQL Middleware Test Endpoint',
					availableActions: [
						{ action: 'convert', description: 'Convert sample DDL to doctypes' },
						{ action: 'load', description: 'Load converted doctypes into registry' },
						{ action: 'validate-refs', description: 'Validate cross-doctype references' },
						{ action: 'validate-schema', description: 'Test Zod schema validation' },
						{ action: 'get-meta', description: 'Get doctype from registry' },
					],
				}
		}
	} catch (error) {
		return {
			success: false,
			action,
			error: error instanceof Error ? error.message : String(error),
			stack: error instanceof Error ? error.stack : undefined,
		}
	}
})
