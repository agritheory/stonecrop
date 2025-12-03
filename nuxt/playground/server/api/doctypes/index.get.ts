export default defineEventHandler(() => {
	// Mock doctype list data - would query database for doctype table
	const doctypes = [
		{
			id: '1',
			name: 'User',
			module: 'Core',
			is_submittable: false,
			is_tree: false,
		},
		{
			id: '2',
			name: 'Role',
			module: 'Core',
			is_submittable: false,
			is_tree: true,
		},
		{
			id: '3',
			name: 'Task',
			module: 'Projects',
			is_submittable: true,
			is_tree: false,
		},
		{
			id: '4',
			name: 'Role Profile',
			module: 'Core',
			is_submittable: false,
			is_tree: false,
		},
		{
			id: '5',
			name: 'Ability Rule',
			module: 'Core',
			is_submittable: false,
			is_tree: false,
		},
		{
			id: '6',
			name: 'DocType',
			module: 'Core',
			is_submittable: false,
			is_tree: false,
		},
	]

	return doctypes
})
