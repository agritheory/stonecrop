export default defineEventHandler(() => {
	// Mock role profile data - would query database for role_profile table
	const roleProfiles = [
		{
			id: '1',
			profile_name: 'System Administrator',
			description: 'Full system access profile',
			active: true,
		},
		{
			id: '2',
			profile_name: 'Department Manager',
			description: 'Department management profile',
			active: true,
		},
		{
			id: '3',
			profile_name: 'Team Lead',
			description: 'Team leadership and coordination',
			active: true,
		},
		{
			id: '4',
			profile_name: 'Standard User',
			description: 'Standard employee access',
			active: true,
		},
		{
			id: '5',
			profile_name: 'External Auditor',
			description: 'Read-only audit access',
			active: false,
		},
	]

	return roleProfiles
})
