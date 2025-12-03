export default defineEventHandler(() => {
	// Mock builder doctype list data - includes builder-specific metadata
	const doctypes = [
		{
			id: '1',
			name: 'user',
			displayName: 'User',
			module: 'Core',
			description: 'User accounts with role-based access control',
			hasStateMachine: true,
			fields: 3,
			abilityRules: 5,
		},
		{
			id: '2',
			name: 'role',
			displayName: 'Role',
			module: 'Core',
			description: 'User roles for permission management',
			hasStateMachine: false,
			fields: 4,
			abilityRules: 3,
		},
		{
			id: '3',
			name: 'role-profile',
			displayName: 'Role Profile',
			module: 'Core',
			description: 'Group of roles for easier assignment',
			hasStateMachine: false,
			fields: 3,
			abilityRules: 2,
		},
		{
			id: '4',
			name: 'ability-rule',
			displayName: 'Ability Rule',
			module: 'Core',
			description: 'Permission rules for role-based access control',
			hasStateMachine: false,
			fields: 5,
			abilityRules: 1,
		},
		{
			id: '5',
			name: 'doctype',
			displayName: 'DocType',
			module: 'Core',
			description: 'Document type definition with fields and metadata',
			hasStateMachine: false,
			fields: 8,
			abilityRules: 4,
		},
	]

	return doctypes
})
