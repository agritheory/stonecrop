/**
 * In-memory data store
 *
 * This module holds the in-memory Maps used as the data layer for this app.
 * Both server/resolvers.ts (for reading) and server/plugins/stonecrop.ts (for
 * writing via action handlers) import from here.
 *
 * To connect a real database, replace this module with your PostGraphile + pgClient setup.
 * See: https://stonecrop.io/docs/guides/postgraphile
 */

export interface Project {
	id: string
	title: string
	description: string
	status: 'Active' | 'Archived'
	createdAt: string
}

export interface Task {
	id: string
	title: string
	projectId: string
	status: 'Todo' | 'In Progress' | 'Done'
	description: string
	dueDate: string | null
	createdAt: string
}

export const projects = new Map<string, Project>([
	[
		'1',
		{
			id: '1',
			title: 'Website Redesign',
			description: 'Redesign the company website with a modern look and feel',
			status: 'Active',
			createdAt: '2025-01-01T00:00:00Z',
		},
	],
	[
		'2',
		{
			id: '2',
			title: 'Mobile App',
			description: 'Build the iOS and Android app for field staff',
			status: 'Active',
			createdAt: '2025-01-02T00:00:00Z',
		},
	],
])

export const tasks = new Map<string, Task>([
	[
		'1',
		{
			id: '1',
			title: 'Create wireframes',
			projectId: '1',
			status: 'Todo',
			description: 'Draft initial wireframes for all main pages',
			dueDate: '2025-02-01',
			createdAt: '2025-01-05T00:00:00Z',
		},
	],
	[
		'2',
		{
			id: '2',
			title: 'Set up design system',
			projectId: '1',
			status: 'In Progress',
			description: 'Configure colors, typography, and component library',
			dueDate: null,
			createdAt: '2025-01-06T00:00:00Z',
		},
	],
	[
		'3',
		{
			id: '3',
			title: 'Define API contract',
			projectId: '2',
			status: 'Todo',
			description: 'Document all API endpoints needed for the mobile app',
			dueDate: '2025-01-20',
			createdAt: '2025-01-07T00:00:00Z',
		},
	],
])
