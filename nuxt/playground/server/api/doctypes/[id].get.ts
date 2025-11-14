export default defineEventHandler(event => {
	const id = getRouterParam(event, 'id')

	// Mock doctype data by ID - would query database
	const doctypes: Record<string, any> = {
		1: {
			id: '1',
			name: 'User',
			module: 'Core',
			description: 'User account management',
			is_submittable: false,
			is_tree: false,
			fields: [
				{ fieldname: 'username', label: 'Username', fieldtype: 'Data', required: true, read_only: false },
				{ fieldname: 'disabled', label: 'Disabled', fieldtype: 'Check', required: false, read_only: false },
			],
			state_machine_id: null,
		},
		2: {
			id: '2',
			name: 'Role',
			module: 'Core',
			description: 'User roles for permission management',
			is_submittable: false,
			is_tree: true,
			fields: [
				{ fieldname: 'role_name', label: 'Role Name', fieldtype: 'Data', required: true, read_only: false },
				{ fieldname: 'description', label: 'Description', fieldtype: 'Text', required: false, read_only: false },
				{ fieldname: 'parent_role', label: 'Parent Role', fieldtype: 'Link', required: false, read_only: false },
			],
			state_machine_id: null,
		},
		3: {
			id: '3',
			name: 'Task',
			module: 'Projects',
			description: 'Project task management',
			is_submittable: true,
			is_tree: false,
			fields: [
				{ fieldname: 'title', label: 'Title', fieldtype: 'Data', required: true, read_only: false },
				{ fieldname: 'status', label: 'Status', fieldtype: 'Select', required: true, read_only: false },
			],
			state_machine_id: 'task_workflow',
		},
	}

	const doctype = doctypes[id || '']
	if (!doctype) {
		throw createError({
			statusCode: 404,
			message: `DocType '${id}' not found`,
		})
	}

	return doctype
})
