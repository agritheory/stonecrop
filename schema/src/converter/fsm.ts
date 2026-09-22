/**
 * Map Orpin state machines onto Stonecrop {@link WorkflowMeta}.
 *
 * Accepts the state-machine catalog (`allStateMachines`), the Stonecrop bridge query
 * (`getStonecropWorkflowMeta`), and the XState JSON from `GET_MACHINE_CONFIG`.
 *
 * @packageDocumentation
 */

import type { ActionDefinition, WorkflowMeta } from '../doctype'
import { pascalToSnake, snakeToLabel } from '../naming'
import type { ConvertedGraphQLDoctype } from './types'

/**
 * Normalized machine shape both adapters produce before mapping to {@link WorkflowMeta}.
 *
 * @public
 */
export interface StateMachineConfig {
	/** SQL doctype name (snake_case), e.g. `registered_function`. */
	doctype: string
	initialState: string
	states: { key: string; name?: string }[]
	transitions: { from: string; to: string; event?: string; description?: string }[]
}

/** Payload returned by Orpin's `getStonecropWorkflowMeta` GraphQL query. @public */
export interface StonecropBridgeWorkflow {
	entityType: string
	machineId?: string
	initialState: string
	states?: { key: string; name?: string; type?: string }[] | null
	events?: { type: string; description?: string | null }[] | null
	transitions?: { from: string; to: string; event: string; priority?: number | null }[] | null
}

/** XState-compatible JSON from `GET_MACHINE_CONFIG`. @public */
export interface MachineConfigJson {
	id?: string
	version?: string
	initial?: string
	context?: unknown
	states?: Record<
		string,
		{
			on?: { target?: string; event?: string; guard?: string; actions?: unknown }[]
			type?: string
			meta?: { label?: string }
		}
	>
}

/**
 * GraphQL type names for FSM framework tables and bridge types — never business doctypes.
 *
 * @public
 */
export const FSM_GRAPHQL_TYPE_NAMES = new Set([
	'StatechartMachine',
	'StatechartState',
	'StatechartEvent',
	'StatechartTransition',
	'StateMachine',
	'StateMachineState',
	'StateMachineEvent',
	'StateMachineTransition',
	'StateMachineEventLog',
	'WorkflowMeta',
	'WorkflowState',
	'WorkflowEvent',
	'WorkflowTransition',
])

/**
 * Adapt the live Stonecrop bridge query result to {@link StateMachineConfig}.
 *
 * @public
 */
export function fromStonecropBridge(payload: StonecropBridgeWorkflow): StateMachineConfig {
	const eventDescriptions = new Map<string, string>()
	for (const event of payload.events ?? []) {
		if (event.description) eventDescriptions.set(event.type, event.description)
	}

	return {
		doctype: payload.entityType,
		initialState: payload.initialState,
		states: (payload.states ?? []).map(state => ({ key: state.key, name: state.name })),
		transitions: (payload.transitions ?? []).map(transition => ({
			from: transition.from,
			to: transition.to,
			event: transition.event,
			description: eventDescriptions.get(transition.event),
		})),
	}
}

/**
 * Adapt `GET_MACHINE_CONFIG` JSON to {@link StateMachineConfig}.
 *
 * @public
 */
export function fromMachineConfig(doctype: string, config: MachineConfigJson): StateMachineConfig {
	const states: { key: string; name?: string }[] = []
	const transitions: { from: string; to: string; event?: string }[] = []

	for (const [key, state] of Object.entries(config.states ?? {})) {
		states.push({ key, name: state.meta?.label })
		for (const edge of state.on ?? []) {
			if (!edge.target) continue
			transitions.push({
				from: key,
				to: edge.target,
				event: edge.event,
			})
		}
	}

	return {
		doctype,
		initialState: config.initial ?? states[0]?.key ?? '',
		states,
		transitions,
	}
}

function orderedStates(machine: StateMachineConfig): string[] {
	const seen = new Set<string>()
	const ordered: string[] = []

	const push = (key: string) => {
		if (!key || seen.has(key)) return
		seen.add(key)
		ordered.push(key)
	}

	push(machine.initialState)
	for (const state of machine.states) push(state.key)
	for (const transition of machine.transitions) {
		push(transition.from)
		push(transition.to)
	}

	return ordered
}

function actionLabel(event: string | undefined, description: string | undefined, target: string): string {
	if (description) return description
	if (event) return snakeToLabel(event)
	return `Move to ${snakeToLabel(target)}`
}

/**
 * Map a normalized machine onto Stonecrop {@link WorkflowMeta}.
 *
 * @public
 */
export function machineToWorkflow(machine: StateMachineConfig): WorkflowMeta {
	const actions: Record<string, ActionDefinition> = {}
	const withEvent: { from: string; to: string; event: string; description?: string }[] = []
	const withoutEvent: { from: string; to: string }[] = []

	for (const transition of machine.transitions) {
		if (transition.event) {
			withEvent.push({
				from: transition.from,
				to: transition.to,
				event: transition.event,
				description: transition.description,
			})
		} else {
			withoutEvent.push({ from: transition.from, to: transition.to })
		}
	}

	const byEvent = new Map<string, typeof withEvent>()
	for (const transition of withEvent) {
		const group = byEvent.get(transition.event) ?? []
		group.push(transition)
		byEvent.set(transition.event, group)
	}

	for (const [event, transitions] of byEvent) {
		const byTarget = new Map<string, typeof transitions>()
		for (const transition of transitions) {
			const group = byTarget.get(transition.to) ?? []
			group.push(transition)
			byTarget.set(transition.to, group)
		}

		const targets = [...byTarget.keys()]
		for (const target of targets) {
			const group = byTarget.get(target)!
			const allowedStates = [...new Set(group.map(t => t.from))]
			const description = group.find(t => t.description)?.description
			const key = targets.length === 1 ? event : `${event}_to_${target}`

			if (allowedStates.every(from => from === target)) {
				actions[key] = {
					label: actionLabel(event, description, target),
					allowedStates,
					selfTransition: true,
				}
			} else {
				actions[key] = {
					label: actionLabel(event, description, target),
					allowedStates,
					nextState: target,
				}
			}
		}
	}

	for (const transition of withoutEvent) {
		const key = `to_${transition.to}`
		if (transition.from === transition.to) {
			actions[key] = {
				label: actionLabel(undefined, undefined, transition.to),
				allowedStates: [transition.from],
				selfTransition: true,
			}
		} else {
			actions[key] = {
				label: actionLabel(undefined, undefined, transition.to),
				allowedStates: [transition.from],
				nextState: transition.to,
			}
		}
	}

	return {
		states: orderedStates(machine),
		actions,
	}
}

function machineLookupKey(doctype: ConvertedGraphQLDoctype): string {
	const graphqlName = doctype._graphqlTypeName ?? doctype.name
	return pascalToSnake(graphqlName)
}

/**
 * Attach `workflow` to converted doctypes that have a matching machine.
 *
 * Joins on `pascalToSnake` of the GraphQL type name (`Resource` → `resource`). A `doctypeNames`
 * remap does not change the join — the machine is keyed by the SQL doctype.
 *
 * @public
 */
export function attachWorkflows(
	doctypes: ConvertedGraphQLDoctype[],
	machines: readonly StateMachineConfig[]
): ConvertedGraphQLDoctype[] {
	const byDoctype = new Map(machines.map(machine => [machine.doctype, machine]))

	return doctypes.map(doctype => {
		const machine = byDoctype.get(machineLookupKey(doctype))
		if (!machine) return doctype
		return { ...doctype, workflow: machineToWorkflow(machine) }
	})
}

/**
 * One page of `allStateMachines`, including the states, events, and transitions PostGraphile nests
 * on each machine. This is the inventory. `listWorkflowEntityTypes` is a host allow-list and is not.
 *
 * @public
 */
export interface StateMachineCatalogNode {
	doctype: string
	isActive?: boolean | null
	initialState: string
	stateMachineStatesByMachineId?: {
		nodes?: { stateKey: string; displayName?: string | null }[] | null
	} | null
	stateMachineEventsByMachineId?: {
		nodes?: { eventType: string; description?: string | null }[] | null
	} | null
	stateMachineTransitionsByMachineId?: {
		nodes?:
			| {
					sourceStateKey: string
					targetStateKey: string
					eventType?: string | null
					isActive?: boolean | null
			  }[]
			| null
	} | null
}

/**
 * Map a page of state-machine rows onto {@link StateMachineConfig}.
 *
 * Inactive machines and inactive transitions are omitted. Event descriptions become action labels.
 *
 * @public
 */
export function machinesFromCatalog(nodes: readonly StateMachineCatalogNode[]): StateMachineConfig[] {
	const machines: StateMachineConfig[] = []

	for (const node of nodes) {
		if (node.isActive === false) continue

		const descriptions = new Map<string, string>()
		for (const event of node.stateMachineEventsByMachineId?.nodes ?? []) {
			if (event.description) descriptions.set(event.eventType, event.description)
		}

		machines.push({
			doctype: node.doctype,
			initialState: node.initialState,
			states: (node.stateMachineStatesByMachineId?.nodes ?? []).map(state => ({
				key: state.stateKey,
				name: state.displayName || undefined,
			})),
			transitions: (node.stateMachineTransitionsByMachineId?.nodes ?? [])
				.filter(transition => transition.isActive !== false)
				.map(transition => ({
					from: transition.sourceStateKey,
					to: transition.targetStateKey,
					event: transition.eventType || undefined,
					description: transition.eventType ? descriptions.get(transition.eventType) : undefined,
				})),
		})
	}

	return machines
}

const CATALOG_PAGE = 100
const CHILD_PAGE = 200

const CATALOG_QUERY = `query StateMachineCatalog($first: Int!, $offset: Int!, $childFirst: Int!) {
	allStateMachines(first: $first, offset: $offset) {
		nodes {
			doctype
			isActive
			initialState
			stateMachineStatesByMachineId(first: $childFirst) {
				nodes { stateKey displayName }
			}
			stateMachineEventsByMachineId(first: $childFirst) {
				nodes { eventType description }
			}
			stateMachineTransitionsByMachineId(first: $childFirst) {
				nodes { sourceStateKey targetStateKey eventType isActive }
			}
		}
	}
}`

/**
 * Fetch FSM definitions from a GraphQL endpoint.
 *
 * Reads `allStateMachines` and the states, events, and transitions on each row. That table is the
 * inventory: a host allow-list such as `listWorkflowEntityTypes` is only the fallback for a server
 * that does not expose the catalog.
 *
 * @public
 */
export async function fetchWorkflowMachines(
	endpoint: string,
	headers?: Record<string, string>
): Promise<StateMachineConfig[]> {
	const catalog = await fetchCatalogMachines(endpoint, headers)
	if (catalog !== undefined) return catalog
	return fetchBridgeMachines(endpoint, headers)
}

async function fetchCatalogMachines(
	endpoint: string,
	headers?: Record<string, string>
): Promise<StateMachineConfig[] | undefined> {
	const nodes: StateMachineCatalogNode[] = []
	let offset = 0

	for (;;) {
		let page: { allStateMachines: { nodes?: StateMachineCatalogNode[] | null } }
		try {
			page = await graphqlRequest(endpoint, CATALOG_QUERY, headers, {
				first: CATALOG_PAGE,
				offset,
				childFirst: CHILD_PAGE,
			})
		} catch (error) {
			if (offset === 0 && queryLacksField(error, 'allStateMachines')) return undefined
			throw error
		}

		const batch = page.allStateMachines.nodes ?? []
		nodes.push(...batch)
		if (batch.length < CATALOG_PAGE) break
		offset += CATALOG_PAGE
	}

	for (const node of nodes) {
		assertChildPage(node.doctype, 'states', node.stateMachineStatesByMachineId?.nodes)
		assertChildPage(node.doctype, 'events', node.stateMachineEventsByMachineId?.nodes)
		assertChildPage(node.doctype, 'transitions', node.stateMachineTransitionsByMachineId?.nodes)
	}

	return machinesFromCatalog(nodes)
}

function assertChildPage(doctype: string, kind: string, nodes: readonly unknown[] | null | undefined): void {
	if ((nodes?.length ?? 0) >= CHILD_PAGE) {
		throw new Error(`State machine "${doctype}" returned ${CHILD_PAGE} ${kind}, so later rows may be missing.`)
	}
}

async function fetchBridgeMachines(endpoint: string, headers?: Record<string, string>): Promise<StateMachineConfig[]> {
	const listResponse = await graphqlRequest<{ listWorkflowEntityTypes: string[] | null }>(
		endpoint,
		`{ listWorkflowEntityTypes }`,
		headers
	)

	const entityTypes = listResponse.listWorkflowEntityTypes ?? []
	const machines: StateMachineConfig[] = []

	for (const entityType of entityTypes) {
		const meta = await graphqlRequest<{ getStonecropWorkflowMeta: StonecropBridgeWorkflow | null }>(
			endpoint,
			`query ($entityType: String!) {
				getStonecropWorkflowMeta(entityType: $entityType) {
					entityType
					initialState
					states { key name type }
					events { type description }
					transitions { from to event priority }
				}
			}`,
			headers,
			{ entityType }
		)

		if (meta.getStonecropWorkflowMeta) {
			machines.push(fromStonecropBridge(meta.getStonecropWorkflowMeta))
		}
	}

	return machines
}

function queryLacksField(error: unknown, field: string): boolean {
	const message = error instanceof Error ? error.message : String(error)
	return message.includes(`Cannot query field "${field}"`)
}

async function graphqlRequest<T>(
	endpoint: string,
	query: string,
	headers?: Record<string, string>,
	variables?: Record<string, unknown>
): Promise<T> {
	const response = await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			...headers,
		},
		body: JSON.stringify({ query, variables }),
	})

	if (!response.ok) {
		throw new Error(`Failed to fetch workflow machines: ${response.status} ${response.statusText}`)
	}

	const json: { data?: T; errors?: Array<{ message: string }> } = await response.json()

	if (json.errors?.length) {
		throw new Error(`GraphQL errors: ${json.errors.map(error => error.message).join(', ')}`)
	}

	if (!json.data) {
		throw new Error('No data in GraphQL response')
	}

	return json.data
}

/**
 * Compare generated workflow structure against an authored one for drift reporting.
 *
 * Compares `states` and each action's `allowedStates`, `nextState`, and `selfTransition`.
 * Labels and `clientHandler` are ignored — those are authored.
 *
 * @internal
 */
export function compareWorkflowStructure(authored: WorkflowMeta, generated: WorkflowMeta): string[] {
	const drifts: string[] = []

	if (JSON.stringify(authored.states ?? []) !== JSON.stringify(generated.states ?? [])) {
		drifts.push(
			`states: authored=${JSON.stringify(authored.states ?? [])} schema=${JSON.stringify(generated.states ?? [])}`
		)
	}

	const authoredActions = authored.actions ?? {}
	const generatedActions = generated.actions ?? {}
	const actionNames = new Set([...Object.keys(authoredActions), ...Object.keys(generatedActions)])

	for (const name of actionNames) {
		const authoredAction = authoredActions[name]
		const generatedAction = generatedActions[name]

		if (!authoredAction) {
			drifts.push(`action '${name}': absent in authored, present in schema`)
			continue
		}
		if (!generatedAction) {
			drifts.push(`action '${name}': present in authored, absent in schema`)
			continue
		}

		const sort = (values?: string[]) => [...(values ?? [])].sort()
		if (JSON.stringify(sort(authoredAction.allowedStates)) !== JSON.stringify(sort(generatedAction.allowedStates))) {
			drifts.push(
				`action '${name}'.allowedStates: authored=${JSON.stringify(authoredAction.allowedStates ?? [])} schema=${JSON.stringify(generatedAction.allowedStates ?? [])}`
			)
		}
		if (authoredAction.nextState !== generatedAction.nextState) {
			drifts.push(
				`action '${name}'.nextState: authored=${JSON.stringify(authoredAction.nextState)} schema=${JSON.stringify(generatedAction.nextState)}`
			)
		}
		if (Boolean(authoredAction.selfTransition) !== Boolean(generatedAction.selfTransition)) {
			drifts.push(
				`action '${name}'.selfTransition: authored=${Boolean(authoredAction.selfTransition)} schema=${Boolean(generatedAction.selfTransition)}`
			)
		}
	}

	return drifts
}
