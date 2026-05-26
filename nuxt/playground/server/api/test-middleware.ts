// Sample doctypes for testing middleware
const sampleDoctypes: Record<string, any> = {
	Users: {
		name: 'Users',
		slug: 'users',
		fields: [
			{ fieldname: 'id', fieldtype: 'Data', component: 'ATextInput', label: 'Id' },
			{ fieldname: 'username', fieldtype: 'Data', component: 'ATextInput', label: 'Username', required: true },
			{ fieldname: 'email', fieldtype: 'Data', component: 'ATextInput', label: 'Email', required: true },
			{ fieldname: 'disabled', fieldtype: 'Check', component: 'ACheckbox', label: 'Disabled', default: false },
			{ fieldname: 'createdAt', fieldtype: 'Datetime', component: 'ADatetimePicker', label: 'Created At' },
		],
	},
	Roles: {
		name: 'Roles',
		slug: 'roles',
		fields: [
			{ fieldname: 'id', fieldtype: 'Data', component: 'ATextInput', label: 'Id' },
			{ fieldname: 'roleName', fieldtype: 'Data', component: 'ATextInput', label: 'Role Name', required: true },
			{ fieldname: 'description', fieldtype: 'Text', component: 'ATextInput', label: 'Description' },
			{ fieldname: 'parentRoleId', fieldtype: 'Link', component: 'ALink', label: 'Parent Role', options: 'Roles' },
		],
	},
	Tasks: {
		name: 'Tasks',
		slug: 'tasks',
		fields: [
			{ fieldname: 'id', fieldtype: 'Data', component: 'ATextInput', label: 'Id' },
			{ fieldname: 'title', fieldtype: 'Data', component: 'ATextInput', label: 'Title', required: true },
			{ fieldname: 'status', fieldtype: 'Data', component: 'ATextInput', label: 'Status', default: 'Draft' },
			{ fieldname: 'priority', fieldtype: 'Int', component: 'ANumericInput', label: 'Priority', default: 0 },
			{ fieldname: 'dueDate', fieldtype: 'Date', component: 'ADatePicker', label: 'Due Date' },
			{ fieldname: 'estimatedHours', fieldtype: 'Decimal', component: 'ADecimalInput', label: 'Estimated Hours' },
		],
	},
}

// Cache the imports
let middleware: any = null
let schemaValidation: any = null

async function getMiddleware() {
	if (!middleware) {
		middleware = await import('@stonecrop/graphql-middleware')
	}
	return middleware
}

async function getSchemaValidation() {
	if (!schemaValidation) {
		schemaValidation = await import('@stonecrop/schema')
	}
	return schemaValidation
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

	const { loadDoctypesFromObject, getMeta, getAllMeta, clearRegistry, validateReferences, validateDoctype } = mw

	const query = getQuery(event)
	const action = query.action as string

	try {
		switch (action) {
			case 'load': {
				clearRegistry()
				loadDoctypesFromObject(sampleDoctypes)
				return {
					success: true,
					action: 'load',
					description: 'Loaded sample doctypes into registry',
					loaded: getAllMeta().map((d: any) => d.name),
				}
			}

			case 'validate-refs': {
				clearRegistry()
				loadDoctypesFromObject(sampleDoctypes)
				const errors = validateReferences()
				return {
					success: errors.length === 0,
					action: 'validate-refs',
					description: 'Validated cross-doctype references',
					errors,
				}
			}

			case 'validate-schema': {
				const schema = await getSchemaValidation()
				const { validateDoctype, validateField, parseDoctype } = schema

				const goodDoctype = {
					name: 'TestDoctype',
					slug: 'test-doctype',
					fields: [
						{
							fieldname: 'title',
							fieldtype: 'Data',
							component: 'ATextInput',
							label: 'Title',
							required: true,
						},
						{
							fieldname: 'status',
							fieldtype: 'Select',
							component: 'ADropdown',
							label: 'Status',
							options: ['Draft', 'Published'],
						},
					],
				}

				const badDoctype = {
					name: '', // Invalid: empty name
					fields: [
						{
							fieldname: 'test',
							fieldtype: 'InvalidType', // Invalid: not a valid fieldtype
							component: 'ATextInput',
						},
					],
				}

				const missingFieldtype = {
					name: 'BadDoctype',
					fields: [
						{
							fieldname: 'test',
							// Missing fieldtype!
							component: 'ATextInput',
						},
					],
				}

				const goodValidation = validateDoctype(goodDoctype)
				const badValidation = validateDoctype(badDoctype)
				const missingValidation = validateDoctype(missingFieldtype)

				// Test parseDoctype (throws on invalid)
				let parseResult
				try {
					parseResult = {
						success: true,
						parsed: parseDoctype(goodDoctype),
					}
				} catch (e) {
					parseResult = {
						success: false,
						error: e instanceof Error ? e.message : String(e),
					}
				}

				return {
					success: true,
					action: 'validate-schema',
					description: 'Tested @stonecrop/schema validation APIs',
					results: {
						validDoctype: {
							input: goodDoctype,
							validation: goodValidation,
							parsed: parseResult,
						},
						invalidDoctype: {
							input: badDoctype,
							validation: badValidation,
							errors: badValidation.errors,
						},
						missingFieldtype: {
							input: missingFieldtype,
							validation: missingValidation,
							errors: missingValidation.errors,
						},
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
					loadDoctypesFromObject(sampleDoctypes)
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
						{ action: 'load', description: 'Load sample doctypes into registry' },
						{ action: 'validate-refs', description: 'Validate cross-doctype references' },
						{ action: 'validate-schema', description: 'Test @stonecrop/schema validation APIs' },
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
