export default defineEventHandler(event => {
	const id = getRouterParam(event, 'id')

	// Mock ability rule data by ID - would query database
	const abilityRules: Record<string, any> = {
		1: {
			id: '1',
			role_id: '1',
			doctype: 'user',
			action: 'create',
			subject: 'all',
			conditions: null,
			inverted: false,
			active: true,
		},
		2: {
			id: '2',
			role_id: '1',
			doctype: 'user',
			action: 'read',
			subject: 'all',
			conditions: null,
			inverted: false,
			active: true,
		},
		3: {
			id: '3',
			role_id: '1',
			doctype: 'user',
			action: 'update',
			subject: 'all',
			conditions: null,
			inverted: false,
			active: true,
		},
		4: {
			id: '4',
			role_id: '1',
			doctype: 'user',
			action: 'delete',
			subject: 'all',
			conditions: null,
			inverted: false,
			active: true,
		},
		5: {
			id: '5',
			role_id: '2',
			doctype: 'role',
			action: 'read',
			subject: 'all',
			conditions: null,
			inverted: false,
			active: true,
		},
		6: {
			id: '6',
			role_id: '3',
			doctype: 'user',
			action: 'read',
			subject: 'own',
			conditions: { user_id: '{{ user.id }}' },
			inverted: false,
			active: true,
		},
	}

	const rule = abilityRules[id || '']
	if (!rule) {
		throw createError({
			status: 404,
			message: `Ability Rule '${id}' not found`,
		})
	}

	return rule
})
