/**
 * Workflow Scaffolding Utilities
 * Generates XState workflow configurations from SQL schema patterns
 * @packageDocumentation
 */

import type { AnyStateNodeConfig } from 'xstate'
import type { SQLColumn, SQLTable } from './sql-introspection'

/**
 * Workflow scaffolding result
 * @public
 */
export interface WorkflowScaffold {
	/** Generated XState machine configuration */
	workflow: AnyStateNodeConfig
	/** Actions map with stubbed action names */
	actions: Record<string, string[]>
	/** Source column that workflow was generated from */
	sourceColumn?: string
}

/**
 * Detects status/state columns in SQL table
 * @param table - Parsed SQL table
 * @returns Status column if found
 * @public
 */
export function detectStatusColumn(table: SQLTable): SQLColumn | undefined {
	// Look for columns matching common status patterns
	const statusPatterns = [/^status$/i, /^state$/i, /^workflow_state$/i, /^document_status$/i, /_status$/i, /_state$/i]

	for (const column of table.columns) {
		for (const pattern of statusPatterns) {
			if (pattern.test(column.name)) {
				// Check if it's an enum type or has check constraints
				if (column.enumValues || column.checkConstraint) {
					return column
				}
			}
		}
	}

	return undefined
}

/**
 * Extracts state values from status column
 * @param column - Status column
 * @returns Array of state names
 * @public
 */
export function extractStateValues(column: SQLColumn): string[] {
	// Use enum values if available
	if (column.enumValues && column.enumValues.length > 0) {
		return column.enumValues
	}

	// Try to extract from CHECK constraint
	if (column.checkConstraint) {
		// Match patterns like: status IN ('draft', 'pending', 'approved')
		const inMatch = column.checkConstraint.match(/IN\s*\(([^)]+)\)/i)
		if (inMatch) {
			return inMatch[1]
				.split(',')
				.map(v => v.trim().replace(/^'|'$/g, ''))
				.filter(Boolean)
		}

		// Match patterns like: status = 'draft' OR status = 'pending' OR status = 'approved'
		const orMatch = column.checkConstraint.match(/'([^']+)'/g)
		if (orMatch) {
			return orMatch.map(v => v.replace(/'/g, '')).filter(Boolean)
		}
	}

	// Return common defaults if no values detected
	return ['draft', 'pending', 'approved', 'rejected']
}

/**
 * Generates transition event names from state pairs
 * @param fromState - Source state
 * @param toState - Target state
 * @returns Uppercase transition event name
 * @public
 * @example
 * ```typescript
 * generateTransitionName('draft', 'pending') // 'SUBMIT'
 * generateTransitionName('pending', 'approved') // 'APPROVE'
 * generateTransitionName('approved', 'rejected') // 'REJECT'
 * ```
 */
export function generateTransitionName(fromState: string, toState: string): string {
	// Common transition patterns
	const transitionMap: Record<string, string> = {
		'draft->pending': 'SUBMIT',
		'draft->submitted': 'SUBMIT',
		'pending->approved': 'APPROVE',
		'pending->accepted': 'APPROVE',
		'submitted->approved': 'APPROVE',
		'pending->rejected': 'REJECT',
		'submitted->rejected': 'REJECT',
		'approved->rejected': 'REJECT',
		'approved->closed': 'CLOSE',
		'rejected->draft': 'REOPEN',
		'closed->draft': 'REOPEN',
		'active->inactive': 'DEACTIVATE',
		'inactive->active': 'ACTIVATE',
		'new->draft': 'SAVE',
	}

	const key = `${fromState.toLowerCase()}->${toState.toLowerCase()}`
	if (transitionMap[key]) {
		return transitionMap[key]
	}

	// Generate uppercase event name from target state
	// e.g., 'approved' -> 'APPROVE', 'completed' -> 'COMPLETE'
	const verb = toState.toUpperCase()
	if (verb.endsWith('ED')) {
		return verb.slice(0, -1) // 'APPROVED' -> 'APPROVE'
	}
	return verb
}

/**
 * Scaffolds a basic workflow from detected states
 * @param states - Array of state names
 * @param machineId - Machine identifier
 * @returns Workflow scaffold with machine config and actions
 * @public
 */
export function scaffoldWorkflow(states: string[], machineId: string): WorkflowScaffold {
	if (states.length === 0) {
		throw new Error('Cannot scaffold workflow: no states provided')
	}

	// Capitalize state names for consistency
	const capitalizedStates = states.map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())

	// Use first state as initial
	const initialState = capitalizedStates[0]

	// Build state machine configuration
	const stateConfig: Record<
		string,
		{ on: Record<string, string>; type?: 'final' | 'history' | 'atomic' | 'compound' | 'parallel' }
	> = {}
	const actions: Record<string, string[]> = {}

	for (let i = 0; i < capitalizedStates.length; i++) {
		const currentState = capitalizedStates[i]
		stateConfig[currentState] = { on: {} }

		// Create transitions to subsequent states
		for (let j = i + 1; j < capitalizedStates.length; j++) {
			const targetState = capitalizedStates[j]
			const eventName = generateTransitionName(currentState, targetState)

			stateConfig[currentState].on[eventName] = targetState

			// Add stub action for this transition
			if (!actions[eventName]) {
				actions[eventName] = []
			}
		}

		// Add a CANCEL transition back to first state (except from first state)
		if (i > 0 && currentState !== initialState) {
			stateConfig[currentState].on['CANCEL'] = initialState
			if (!actions['CANCEL']) {
				actions['CANCEL'] = []
			}
		}
	}

	// Mark last state as final (optional)
	const lastState = capitalizedStates[capitalizedStates.length - 1]
	if (
		lastState.toLowerCase().includes('close') ||
		lastState.toLowerCase().includes('reject') ||
		lastState.toLowerCase().includes('complet')
	) {
		stateConfig[lastState].type = 'final'
	}

	const workflow: AnyStateNodeConfig = {
		id: machineId,
		initial: initialState,
		states: stateConfig,
	}

	return {
		workflow,
		actions,
	}
}

/**
 * Scaffolds workflow from SQL table
 * @param table - Parsed SQL table
 * @param machineId - Optional machine ID (defaults to table name)
 * @returns Workflow scaffold or undefined if no status column found
 * @public
 */
export function scaffoldWorkflowFromTable(table: SQLTable, machineId?: string): WorkflowScaffold | undefined {
	const statusColumn = detectStatusColumn(table)
	if (!statusColumn) {
		return undefined
	}

	const states = extractStateValues(statusColumn)
	const scaffold = scaffoldWorkflow(states, machineId || table.name)

	return {
		...scaffold,
		sourceColumn: statusColumn.name,
	}
}

/**
 * Generates default workflow layout positions for visual editor
 * @param states - Array of state names
 * @param horizontal - Whether to layout horizontally (default) or vertically
 * @returns Layout object with position coordinates
 * @public
 */
export function generateWorkflowLayout(
	states: string[],
	horizontal: boolean = true
): Record<string, { position: { x: number; y: number } }> {
	const layout: Record<string, { position: { x: number; y: number } }> = {}
	const spacing = horizontal ? 250 : 100
	const offsetX = 50
	const offsetY = 50

	for (let i = 0; i < states.length; i++) {
		const state = states[i].charAt(0).toUpperCase() + states[i].slice(1).toLowerCase()
		layout[state] = {
			position: horizontal ? { x: offsetX + i * spacing, y: offsetY } : { x: offsetX, y: offsetY + i * spacing },
		}
	}

	return layout
}
