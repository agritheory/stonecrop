export default defineEventHandler(() => {
	// Mock role data - would query database for role table
	const roles = [
		{
			id: '1',
			role_name: 'Administrator',
			description: 'Full system access',
			active: true,
			parent_role: null,
		},
		{
			id: '2',
			role_name: 'Manager',
			description: 'Manage team and resources',
			active: true,
			parent_role: '1',
		},
		{
			id: '3',
			role_name: 'User',
			description: 'Basic user access',
			active: true,
			parent_role: '2',
		},
		{
			id: '4',
			role_name: 'Guest',
			description: 'Read-only access',
			active: true,
			parent_role: '3',
		},
		{
			id: '5',
			role_name: 'Developer',
			description: 'Development and testing access',
			active: true,
			parent_role: '2',
		},
	]

	return roles
})
