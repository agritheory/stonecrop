import { describe, it, expect } from 'vitest'
import { buildSchema, introspectionFromSchema } from 'graphql'

import {
	attachWorkflows,
	compareWorkflowStructure,
	convertGraphQLSchema,
	fromMachineConfig,
	fromStonecropBridge,
	machinesFromCatalog,
	machineToWorkflow,
	mergeIntrospectedDoctype,
} from '../src/converter'
import type { MachineConfigJson, StonecropBridgeWorkflow } from '../src/converter/fsm'

const registeredFunctionMachineConfig: MachineConfigJson = {
	id: 'registered_function_machine',
	version: '1.0.0',
	initial: 'draft',
	context: {},
	states: {
		draft: {
			meta: { label: 'Draft' },
			on: [{ target: 'active', event: 'activate' }],
		},
		active: {
			meta: { label: 'Active' },
			on: [
				{ target: 'disabled', event: 'disable' },
				{ target: 'draft', event: 'edit' },
			],
		},
		disabled: {
			meta: { label: 'Disabled' },
			on: [
				{ target: 'active', event: 'activate' },
				{ target: 'draft', event: 'edit' },
			],
		},
	},
}

const registeredFunctionBridge: StonecropBridgeWorkflow = {
	entityType: 'registered_function',
	machineId: 'registered_function_machine',
	initialState: 'draft',
	states: [
		{ key: 'draft', name: 'Draft', type: 'atomic' },
		{ key: 'active', name: 'Active', type: 'atomic' },
		{ key: 'disabled', name: 'Disabled', type: 'atomic' },
	],
	events: [
		{ type: 'activate', description: 'Enable function for production use' },
		{ type: 'disable', description: 'Disable function' },
		{ type: 'edit', description: 'Return to draft for modifications' },
	],
	transitions: [
		{ from: 'draft', to: 'active', event: 'activate' },
		{ from: 'active', to: 'disabled', event: 'disable' },
		{ from: 'active', to: 'draft', event: 'edit' },
		{ from: 'disabled', to: 'active', event: 'activate' },
		{ from: 'disabled', to: 'draft', event: 'edit' },
	],
}

function expectedRegisteredFunctionWorkflowFromConfig() {
	return {
		states: ['draft', 'active', 'disabled'],
		actions: {
			activate: {
				label: 'Activate',
				allowedStates: ['draft', 'disabled'],
				nextState: 'active',
			},
			disable: {
				label: 'Disable',
				allowedStates: ['active'],
				nextState: 'disabled',
			},
			edit: {
				label: 'Edit',
				allowedStates: ['active', 'disabled'],
				nextState: 'draft',
			},
		},
	}
}

describe('FSM workflow conversion', () => {
	it('maps GET_MACHINE_CONFIG JSON to WorkflowMeta for registered_function', () => {
		const machine = fromMachineConfig('registered_function', registeredFunctionMachineConfig)
		const workflow = machineToWorkflow(machine)
		expect(workflow).toEqual(expectedRegisteredFunctionWorkflowFromConfig())
	})

	it('maps Stonecrop bridge payload to the same workflow structure as GET_MACHINE_CONFIG', () => {
		const fromConfig = machineToWorkflow(fromMachineConfig('registered_function', registeredFunctionMachineConfig))
		const fromBridge = machineToWorkflow(fromStonecropBridge(registeredFunctionBridge))

		expect(compareWorkflowStructure(fromConfig, fromBridge)).toEqual([])
		expect(fromBridge.actions?.activate?.label).toBe('Enable function for production use')
		expect(fromBridge.actions?.edit?.allowedStates).toEqual(['active', 'disabled'])
		expect(fromBridge.actions?.edit?.nextState).toBe('draft')
	})

	it('lists the initial state first in workflow.states', () => {
		const machine = fromMachineConfig('plan', {
			initial: 'review',
			states: {
				draft: { on: [{ target: 'review', event: 'submit' }] },
				review: { on: [{ target: 'approved', event: 'approve' }] },
				approved: {},
			},
		})
		const workflow = machineToWorkflow(machine)
		expect(workflow.states?.[0]).toBe('review')
	})

	it('creates self-transition actions without nextState', () => {
		const workflow = machineToWorkflow({
			doctype: 'task',
			initialState: 'open',
			states: [{ key: 'open' }],
			transitions: [{ from: 'open', to: 'open', event: 'save', description: 'Save changes' }],
		})

		expect(workflow.actions?.save).toEqual({
			label: 'Save changes',
			allowedStates: ['open'],
			selfTransition: true,
		})
		expect(workflow.actions?.save.nextState).toBeUndefined()
	})

	it('splits actions when one event targets different states', () => {
		const workflow = machineToWorkflow({
			doctype: 'doc',
			initialState: 'draft',
			states: [{ key: 'draft' }, { key: 'planning' }, { key: 'review' }, { key: 'approved' }],
			transitions: [
				{ from: 'draft', to: 'review', event: 'submit' },
				{ from: 'planning', to: 'approved', event: 'submit' },
			],
		})

		expect(workflow.actions?.submit_to_review).toEqual({
			label: 'Submit',
			allowedStates: ['draft'],
			nextState: 'review',
		})
		expect(workflow.actions?.submit_to_approved).toEqual({
			label: 'Submit',
			allowedStates: ['planning'],
			nextState: 'approved',
		})
	})

	it('keys eventless transitions as to_<target>', () => {
		const workflow = machineToWorkflow({
			doctype: 'doc',
			initialState: 'draft',
			states: [{ key: 'draft' }, { key: 'archived' }],
			transitions: [{ from: 'draft', to: 'archived' }],
		})

		expect(workflow.actions?.to_archived).toEqual({
			label: 'Move to Archived',
			allowedStates: ['draft'],
			nextState: 'archived',
		})
	})

	it('reads every active machine from the state-machine catalog, not a host allow-list', () => {
		const machines = machinesFromCatalog([
			{
				doctype: 'registered_function',
				isActive: true,
				initialState: 'draft',
				stateMachineStatesByMachineId: {
					nodes: [
						{ stateKey: 'draft', displayName: 'Draft' },
						{ stateKey: 'active', displayName: 'Active' },
						{ stateKey: 'disabled', displayName: 'Disabled' },
					],
				},
				stateMachineEventsByMachineId: {
					nodes: [
						{ eventType: 'activate', description: 'Enable function for production use' },
						{ eventType: 'disable', description: 'Disable function' },
						{ eventType: 'edit', description: 'Return to draft for modifications' },
					],
				},
				stateMachineTransitionsByMachineId: {
					nodes: [
						{ sourceStateKey: 'draft', targetStateKey: 'active', eventType: 'activate', isActive: true },
						{ sourceStateKey: 'active', targetStateKey: 'disabled', eventType: 'disable', isActive: true },
						{ sourceStateKey: 'active', targetStateKey: 'draft', eventType: 'edit', isActive: true },
						{ sourceStateKey: 'disabled', targetStateKey: 'active', eventType: 'activate', isActive: true },
						{ sourceStateKey: 'disabled', targetStateKey: 'draft', eventType: 'edit', isActive: true },
						{ sourceStateKey: 'draft', targetStateKey: 'disabled', eventType: 'retire', isActive: false },
					],
				},
			},
			{
				doctype: 'sales_order',
				isActive: true,
				initialState: 'draft',
				stateMachineStatesByMachineId: {
					nodes: [
						{ stateKey: 'draft', displayName: 'Draft' },
						{ stateKey: 'confirmed', displayName: 'Confirmed' },
					],
				},
				stateMachineTransitionsByMachineId: {
					nodes: [{ sourceStateKey: 'draft', targetStateKey: 'confirmed', eventType: 'confirm', isActive: true }],
				},
			},
			{
				doctype: 'retired',
				isActive: false,
				initialState: 'draft',
				stateMachineStatesByMachineId: { nodes: [{ stateKey: 'draft', displayName: 'Draft' }] },
			},
		])

		expect(machines.map(machine => machine.doctype)).toEqual(['registered_function', 'sales_order'])
		const registered = machineToWorkflow(machines[0]!)
		expect(
			compareWorkflowStructure(registered, machineToWorkflow(fromStonecropBridge(registeredFunctionBridge)))
		).toEqual([])
		expect(registered.actions?.activate?.label).toBe('Enable function for production use')
		expect(registered.actions?.retire).toBeUndefined()
		expect(machineToWorkflow(machines[1]!).actions?.confirm?.nextState).toBe('confirmed')
	})

	it('attaches workflow to doctypes by GraphQL type name', () => {
		const [doctype] = attachWorkflows(
			[
				{
					name: 'RegisteredFunction',
					slug: 'registered-function',
					fields: [],
					_graphqlTypeName: 'RegisteredFunction',
				},
			],
			[fromMachineConfig('registered_function', registeredFunctionMachineConfig)]
		)

		expect(doctype.workflow).toEqual(expectedRegisteredFunctionWorkflowFromConfig())
	})

	it('does not emit FSM framework types as doctypes', () => {
		const sdl = `
			type Query { noop: Boolean }
			type StatechartMachine { id: ID! }
			type WorkflowMeta { entityType: String! }
			type Resource { id: ID! name: String! }
		`
		const introspection = introspectionFromSchema(buildSchema(sdl))
		const doctypes = convertGraphQLSchema(introspection)

		expect(doctypes.map(d => d.name)).toEqual(['Resource'])
	})

	it('fills a missing authored workflow from generated output', () => {
		const generated = {
			name: 'Resource',
			slug: 'resource',
			fields: [],
			workflow: expectedRegisteredFunctionWorkflowFromConfig(),
		}

		const { doctype, drift } = mergeIntrospectedDoctype({ name: 'Resource', fields: [] }, generated)

		expect(doctype.workflow).toEqual(expectedRegisteredFunctionWorkflowFromConfig())
		expect(drift.workflowDrift).toEqual([])
	})

	it('reports workflow drift without overwriting an authored workflow', () => {
		const generated = {
			name: 'Resource',
			slug: 'resource',
			fields: [],
			workflow: expectedRegisteredFunctionWorkflowFromConfig(),
		}

		const authored = {
			name: 'Resource',
			fields: [],
			workflow: {
				states: ['draft', 'active'],
				actions: {
					activate: {
						label: 'Activate',
						allowedStates: ['draft'],
						nextState: 'active',
						clientHandler: 'custom handler',
					},
				},
			},
		}

		const { doctype, drift } = mergeIntrospectedDoctype(authored, generated)

		expect(doctype.workflow).toEqual(authored.workflow)
		expect(drift.workflowDrift.length).toBeGreaterThan(0)
		expect(compareWorkflowStructure(authored.workflow, generated.workflow)).toEqual(drift.workflowDrift)
	})
})
