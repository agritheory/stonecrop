import { describe, it, expect } from 'vitest'
import {
	detectStatusColumn,
	scaffoldWorkflow,
	scaffoldWorkflowFromTable,
	generateWorkflowLayout,
} from '../src/workflow-scaffolder'
import type { SQLTable } from '../src/sql-introspection'

describe('Workflow Scaffolder', () => {
	describe('detectStatusColumn', () => {
		it('should detect is_active boolean column with check constraint', () => {
			const table: SQLTable = {
				name: 'users',
				columns: [
					{ name: 'id', sqlType: 'INT', notNull: true, primaryKey: true, unique: false },
					{
						name: 'status',
						sqlType: 'VARCHAR',
						notNull: false,
						primaryKey: false,
						unique: false,
						checkConstraint: "status IN ('active', 'inactive')",
					},
				],
			}

			const result = detectStatusColumn(table)
			expect(result).toBeDefined()
			expect(result?.name).toBe('status')
		})

		it('should detect status enum column', () => {
			const table: SQLTable = {
				name: 'orders',
				columns: [
					{ name: 'id', sqlType: 'INT', notNull: true, primaryKey: true, unique: false },
					{
						name: 'status',
						sqlType: 'status_enum',
						notNull: false,
						primaryKey: false,
						unique: false,
						enumValues: ['pending', 'approved', 'rejected'],
					},
				],
			}

			const result = detectStatusColumn(table)
			expect(result).toBeDefined()
			expect(result?.name).toBe('status')
		})

		it('should return first matching status column', () => {
			const table: SQLTable = {
				name: 'tasks',
				columns: [
					{ name: 'id', sqlType: 'INT', notNull: true, primaryKey: true, unique: false },
					{
						name: 'workflow_status',
						sqlType: 'VARCHAR',
						notNull: false,
						primaryKey: false,
						unique: false,
						checkConstraint: "workflow_status IN ('new', 'done')",
					},
					{
						name: 'status',
						sqlType: 'VARCHAR',
						notNull: false,
						primaryKey: false,
						unique: false,
						enumValues: ['active', 'inactive'],
					},
				],
			}

			const result = detectStatusColumn(table)
			expect(result?.name).toBe('workflow_status')
		})

		it('should return undefined if no status column', () => {
			const table: SQLTable = {
				name: 'simple',
				columns: [{ name: 'id', sqlType: 'INT', notNull: true, primaryKey: true, unique: false }],
			}

			const result = detectStatusColumn(table)
			expect(result).toBeUndefined()
		})
	})

	describe('scaffoldWorkflow', () => {
		it('should create workflow from state list', () => {
			const states = ['draft', 'pending', 'approved', 'rejected']
			const result = scaffoldWorkflow(states, 'approval_workflow')

			expect(result.workflow).toBeDefined()
			expect(result.workflow.id).toBe('approval_workflow')
			expect(result.workflow.initial).toBe('Draft')
			expect(result.workflow.states).toBeDefined()
			expect(Object.keys(result.workflow.states || {})).toHaveLength(4)
			expect(result.actions).toBeDefined()
		})

		it('should generate transitions between states', () => {
			const states = ['new', 'active', 'closed']
			const result = scaffoldWorkflow(states, 'task_workflow')

			expect(result.workflow.states).toBeDefined()
			const newState = result.workflow.states?.['New']
			expect(newState).toBeDefined()
			expect(newState?.on).toBeDefined()
			expect(Object.keys(newState?.on || {}).length).toBeGreaterThan(0)
		})

		it('should mark initial state', () => {
			const states = ['draft', 'published']
			const result = scaffoldWorkflow(states, 'post_workflow')

			expect(result.workflow.initial).toBe('Draft')
			expect(result.workflow.states?.['Draft']).toBeDefined()
		})
	})

	describe('scaffoldWorkflowFromTable', () => {
		it('should scaffold workflow from table with status enum', () => {
			const table: SQLTable = {
				name: 'tasks',
				columns: [
					{ name: 'id', sqlType: 'INT', notNull: true, primaryKey: true, unique: false },
					{
						name: 'status',
						sqlType: 'task_status',
						notNull: false,
						primaryKey: false,
						unique: false,
						enumValues: ['todo', 'in_progress', 'done'],
					},
				],
			}

			const result = scaffoldWorkflowFromTable(table, 'task_workflow')

			expect(result).toBeDefined()
			expect(result?.workflow.id).toBe('task_workflow')
			expect(result?.sourceColumn).toBe('status')
			const stateNames = Object.keys(result?.workflow.states || {})
			expect(stateNames).toContain('Todo')
		})

		it('should scaffold workflow from boolean is_active field', () => {
			const table: SQLTable = {
				name: 'products',
				columns: [
					{ name: 'id', sqlType: 'INT', notNull: true, primaryKey: true, unique: false },
					{
						name: 'status',
						sqlType: 'BOOLEAN',
						notNull: false,
						primaryKey: false,
						unique: false,
						checkConstraint: "status IN ('active', 'inactive')",
					},
				],
			}

			const result = scaffoldWorkflowFromTable(table, 'product_workflow')

			expect(result).toBeDefined()
			expect(result?.sourceColumn).toBe('status')
			const stateNames = Object.keys(result?.workflow.states || {})
			expect(stateNames.length).toBeGreaterThanOrEqual(2)
		})

		it('should return undefined if no workflow fields', () => {
			const table: SQLTable = {
				name: 'simple',
				columns: [
					{ name: 'id', sqlType: 'INT', notNull: true, primaryKey: true, unique: false },
					{ name: 'name', sqlType: 'VARCHAR', notNull: false, primaryKey: false, unique: false },
				],
			}

			const result = scaffoldWorkflowFromTable(table)
			expect(result).toBeUndefined()
		})

		it('should use table name as machineId if not provided', () => {
			const table: SQLTable = {
				name: 'orders',
				columns: [
					{ name: 'id', sqlType: 'INT', notNull: true, primaryKey: true, unique: false },
					{
						name: 'order_status',
						sqlType: 'order_status_enum',
						notNull: false,
						primaryKey: false,
						unique: false,
						enumValues: ['pending', 'shipped'],
					},
				],
			}

			const result = scaffoldWorkflowFromTable(table)

			expect(result).toBeDefined()
			expect(result?.workflow.id).toBe('orders')
		})
	})

	describe('generateWorkflowLayout', () => {
		it('should generate node positions for states', () => {
			const states = ['draft', 'pending', 'approved']
			const layout = generateWorkflowLayout(states)

			expect(Object.keys(layout)).toHaveLength(3)
			expect(layout['Draft']).toBeDefined()
			expect(layout['Draft'].position.x).toBeGreaterThanOrEqual(0)
			expect(layout['Draft'].position.y).toBeGreaterThanOrEqual(0)
		})

		it('should create layout with capitalized state names', () => {
			const states = ['new', 'active']
			const layout = generateWorkflowLayout(states)

			expect(layout['New']).toBeDefined()
			expect(layout['Active']).toBeDefined()
		})

		it('should space nodes horizontally', () => {
			const states = ['state1', 'state2', 'state3']
			const layout = generateWorkflowLayout(states, true)

			const xPositions = Object.values(layout).map(n => n.position.x)
			expect(xPositions[1]).toBeGreaterThan(xPositions[0])
			expect(xPositions[2]).toBeGreaterThan(xPositions[1])
		})

		it('should space nodes vertically when specified', () => {
			const states = ['draft', 'published']
			const layout = generateWorkflowLayout(states, false)

			const yPositions = Object.values(layout).map(n => n.position.y)
			expect(yPositions[1]).toBeGreaterThan(yPositions[0])
		})
	})
})
