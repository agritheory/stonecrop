export default defineEventHandler(event => {
	const id = getRouterParam(event, 'id')

	// Mock user data by ID - would query database
	const users: Record<string, any> = {
		1: {
			id: '1',
			username: 'admin',
			disabled: false,
			created_at: '2024-01-01',
			modified_at: '2024-01-15',
			has_roles: [
				{ role_id: '1', role_name: 'Administrator', active: true },
				{ role_id: '2', role_name: 'Manager', active: true },
			],
		},
		2: {
			id: '2',
			username: 'user1',
			disabled: false,
			created_at: '2024-01-02',
			modified_at: '2024-01-16',
			has_roles: [{ role_id: '3', role_name: 'User', active: true }],
		},
		3: {
			id: '3',
			username: 'user2',
			disabled: true,
			created_at: '2024-01-03',
			modified_at: '2024-01-17',
			has_roles: [{ role_id: '3', role_name: 'User', active: true }],
		},
		4: {
			id: '4',
			username: 'jane.smith',
			disabled: false,
			created_at: '2024-01-05',
			modified_at: '2024-01-20',
			has_roles: [{ role_id: '2', role_name: 'Manager', active: true }],
		},
		5: {
			id: '5',
			username: 'bob.johnson',
			disabled: false,
			created_at: '2024-01-08',
			modified_at: '2024-01-22',
			has_roles: [{ role_id: '3', role_name: 'User', active: true }],
		},
	}

	const user = users[id || '']
	if (!user) {
		throw createError({
			status: 404,
			message: `User '${id}' not found`,
		})
	}

	return user
})
