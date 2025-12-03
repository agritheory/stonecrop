export default defineEventHandler(() => {
	// Mock user data - would query database for user table
	const users = [
		{
			id: '1',
			username: 'admin',
			disabled: false,
			created_at: '2024-01-01',
			modified_at: '2024-01-15',
		},
		{
			id: '2',
			username: 'user1',
			disabled: false,
			created_at: '2024-01-02',
			modified_at: '2024-01-16',
		},
		{
			id: '3',
			username: 'user2',
			disabled: true,
			created_at: '2024-01-03',
			modified_at: '2024-01-17',
		},
		{
			id: '4',
			username: 'jane.smith',
			disabled: false,
			created_at: '2024-01-05',
			modified_at: '2024-01-20',
		},
		{
			id: '5',
			username: 'bob.johnson',
			disabled: false,
			created_at: '2024-01-08',
			modified_at: '2024-01-22',
		},
		{
			id: '6',
			username: 'alice.brown',
			disabled: true,
			created_at: '2024-01-10',
			modified_at: '2024-01-25',
		},
	]

	return users
})
