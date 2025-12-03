export default defineEventHandler(async event => {
	const query = getQuery(event)
	const entityType = query.entity_type as string

	// Mock data - would query statechart_machine table from Orpin
	const machines: Record<string, any> = {
		user: {
			id: '1',
			entity_type: 'user',
			machine_id: 'user-lifecycle',
			name: 'User Lifecycle',
			version: '1.0.0',
			initial_state: 'active',
			is_active: true,
			states: [
				{ state_key: 'active', state_type: 'atomic', display_name: 'Active' },
				{ state_key: 'suspended', state_type: 'atomic', display_name: 'Suspended' },
				{ state_key: 'disabled', state_type: 'final', display_name: 'Disabled' },
			],
			transitions: [
				{
					source_state_key: 'active',
					target_state_key: 'suspended',
					event_type: 'SUSPEND',
					guard_name: 'can_manage_users',
				},
				{
					source_state_key: 'suspended',
					target_state_key: 'active',
					event_type: 'REACTIVATE',
					guard_name: 'can_manage_users',
				},
				{ source_state_key: 'active', target_state_key: 'disabled', event_type: 'DISABLE', guard_name: null },
				{ source_state_key: 'suspended', target_state_key: 'disabled', event_type: 'DISABLE', guard_name: null },
			],
		},
		role: {
			id: '2',
			entity_type: 'role',
			machine_id: 'role-workflow',
			name: 'Role Workflow',
			version: '1.0.0',
			initial_state: 'draft',
			is_active: true,
			states: [
				{ state_key: 'draft', state_type: 'atomic', display_name: 'Draft' },
				{ state_key: 'active', state_type: 'atomic', display_name: 'Active' },
				{ state_key: 'deprecated', state_type: 'final', display_name: 'Deprecated' },
			],
			transitions: [
				{ source_state_key: 'draft', target_state_key: 'active', event_type: 'ACTIVATE', guard_name: null },
				{
					source_state_key: 'active',
					target_state_key: 'deprecated',
					event_type: 'DEPRECATE',
					guard_name: 'can_manage_roles',
				},
			],
		},
	}

	if (entityType) {
		const machine = machines[entityType.toLowerCase()]
		if (!machine) {
			return null
		}
		return machine
	}

	// Return all machines if no filter
	return Object.values(machines)
})
