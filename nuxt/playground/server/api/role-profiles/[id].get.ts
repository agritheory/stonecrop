export default defineEventHandler(event => {
	const id = getRouterParam(event, 'id')

	// Mock role profile data by ID - would query database
	const roleProfiles: Record<string, any> = {
		1: {
			id: '1',
			profile_name: 'System Administrator',
			description: 'Full system access profile',
			roles: [{ role: '1' }],
			active: true,
		},
		2: {
			id: '2',
			profile_name: 'Department Manager',
			description: 'Department management profile',
			roles: [{ role: '2' }],
			active: true,
		},
		3: {
			id: '3',
			profile_name: 'Team Lead',
			description: 'Team leadership and coordination',
			roles: [{ role: '2' }, { role: '3' }],
			active: true,
		},
		4: {
			id: '4',
			profile_name: 'Standard User',
			description: 'Standard employee access',
			roles: [{ role: '3' }],
			active: true,
		},
	}

	const profile = roleProfiles[id || '']
	if (!profile) {
		throw createError({
			status: 404,
			message: `Role Profile '${id}' not found`,
		})
	}

	return profile
})
