export default defineEventHandler(event => {
	const id = getRouterParam(event, 'id')

	// Mock role data by ID - would query database
	const roles: Record<string, any> = {
		1: {
			id: '1',
			role_name: 'Administrator',
			description: 'Full system access',
			parent_role: null,
			active: true,
		},
		2: {
			id: '2',
			role_name: 'Manager',
			description: 'Manage team and resources',
			parent_role: '1',
			active: true,
		},
		3: {
			id: '3',
			role_name: 'User',
			description: 'Basic user access',
			parent_role: '2',
			active: true,
		},
		4: {
			id: '4',
			role_name: 'Guest',
			description: 'Read-only access',
			parent_role: '3',
			active: true,
		},
		5: {
			id: '5',
			role_name: 'Developer',
			description: 'Development and testing access',
			parent_role: '2',
			active: true,
		},
	}

	const role = roles[id || '']
	if (!role) {
		throw createError({
			statusCode: 404,
			message: `Role '${id}' not found`,
		})
	}

	return role
})
