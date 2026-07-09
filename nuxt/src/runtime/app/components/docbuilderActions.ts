import type { ActionDefinition, TriggerDefinition, WorkflowMeta } from '@stonecrop/schema'

/**
 * Pure projection + write helpers backing {@link DocBuilderActionsPanel}. Extracted from the SFC
 * so they are unit-testable in a plain node environment — the panel itself embeds a Monaco editor
 * (`ACodeEditor`) that cannot mount in the nuxt package's DOM-less test env, so its wiring is
 * browser-verified while this logic is covered by `nuxt/test/docbuilderActions.test.ts`.
 *
 * The panel authors two sibling maps at once: `workflow.actions` (Transitions + stateless Commands,
 * created via the graph) and `workflow.triggers` (field-validation Triggers, created here). Both are
 * projected into one table; writes are routed back to the correct map, always preserving the other.
 */

export type RowKind = 'transition' | 'command' | 'trigger'

/** A single table row — column scalars ATable renders via `row[name]`, plus `__`-prefixed backrefs. */
export interface ActionRow {
	key: string
	label: string
	type: 'Transition' | 'Command' | 'Trigger'
	kind: RowKind
	/** Comma-joined fire-set for Triggers; `'—'` for actions (they don't fire on field edits). */
	on: string
	allowedStates: string
	nextState: string
	__key: string
	__kind: RowKind
	__action?: ActionDefinition
	__trigger?: TriggerDefinition
}

const NA = '—'

/** Join a Trigger's `on` fire-set for display. */
export function formatOn(on: string[] | undefined): string {
	return (on ?? []).join(', ')
}

/** Parse the `on` text input (comma-separated fieldnames) into a trimmed, empty-free array. */
export function parseOnInput(value: string): string[] {
	return value
		.split(',')
		.map(part => part.trim())
		.filter(Boolean)
}

/**
 * Project both sibling maps into one row list — action rows first, then trigger rows. The `kind`
 * discriminant drives the Type badge and routes cell edits (a Trigger can never be mistaken for a
 * Transition/Command because it comes from a different map, not a `stateless` guess).
 */
export function projectWorkflowRows(workflow: WorkflowMeta | undefined): ActionRow[] {
	const actionRows: ActionRow[] = Object.entries(workflow?.actions ?? {}).map(([key, action]) => {
		const kind: RowKind = action.stateless ? 'command' : 'transition'
		return {
			key,
			label: action.label ?? '',
			type: action.stateless ? 'Command' : 'Transition',
			kind,
			on: NA,
			allowedStates: action.allowedStates?.join(', ') ?? '(all states)',
			nextState: action.stateless ? NA : (action.nextState ?? ''),
			__key: key,
			__kind: kind,
			__action: action,
		}
	})

	const triggerRows: ActionRow[] = Object.entries(workflow?.triggers ?? {}).map(([key, trigger]) => ({
		key,
		label: trigger.label ?? '',
		type: 'Trigger',
		kind: 'trigger',
		on: formatOn(trigger.on),
		allowedStates: NA,
		nextState: NA,
		__key: key,
		__kind: 'trigger',
		__trigger: trigger,
	}))

	return [...actionRows, ...triggerRows]
}

/** The lowest-numbered `triggerN` key not already present — deterministic (no RNG). */
export function nextTriggerKey(triggers: Record<string, TriggerDefinition> | undefined): string {
	let n = 1
	while (triggers && `trigger${n}` in triggers) n++
	return `trigger${n}`
}

/** The lowest-numbered `commandN` key not already present in the actions map — deterministic. */
export function nextCommandKey(actions: Record<string, ActionDefinition> | undefined): string {
	let n = 1
	while (actions && `command${n}` in actions) n++
	return `command${n}`
}

/** Write one field of an existing action, preserving every other action and the whole triggers map. */
export function writeActionField(workflow: WorkflowMeta, key: string, field: string, value: unknown): WorkflowMeta {
	const actions = workflow.actions ?? {}
	return {
		...workflow,
		actions: { ...actions, [key]: { ...actions[key], [field]: value } as ActionDefinition },
	}
}

/** Write one field of an existing trigger, preserving every other trigger and the whole actions map. */
export function writeTriggerField(workflow: WorkflowMeta, key: string, field: string, value: unknown): WorkflowMeta {
	const triggers = workflow.triggers ?? {}
	return {
		...workflow,
		triggers: { ...triggers, [key]: { ...triggers[key], [field]: value } as TriggerDefinition },
	}
}

/** Append an empty Trigger under a fresh `triggerN` key, seeding a workflow when there is none yet. */
export function addTrigger(workflow: WorkflowMeta | undefined): WorkflowMeta {
	const triggers = workflow?.triggers ?? {}
	const key = nextTriggerKey(triggers)
	return {
		...workflow,
		triggers: { ...triggers, [key]: { label: '', on: [], clientHandler: '' } },
	}
}

/**
 * Append a stateless Command under a fresh `commandN` key, seeding a workflow when there is none yet.
 * Unlike a Trigger, a Command needs a non-empty label — `ActionDefinition.label` is `.min(1)`, so an
 * empty seed would fail doctype validation the instant it is added. It carries no `allowedStates`, so
 * it is available in every state; per-state scoping is not authored here (deferred to the graph).
 */
export function addCommand(workflow: WorkflowMeta | undefined): WorkflowMeta {
	const actions = workflow?.actions ?? {}
	const key = nextCommandKey(actions)
	return {
		...workflow,
		actions: { ...actions, [key]: { label: 'New Command', stateless: true, clientHandler: '' } },
	}
}

/** Remove a Trigger, preserving every other trigger and the whole actions map. */
export function removeTrigger(workflow: WorkflowMeta, key: string): WorkflowMeta {
	const { [key]: _removed, ...rest } = workflow.triggers ?? {}
	return { ...workflow, triggers: rest }
}

/**
 * Remove an action from the actions map, preserving every other action and the triggers map. Used to
 * delete a Command from the panel — Transitions are never removed this way (they are graph-owned; you
 * delete a Transition by removing its edges), so the caller must guard by `kind`.
 */
export function removeAction(workflow: WorkflowMeta, key: string): WorkflowMeta {
	const { [key]: _removed, ...rest } = workflow.actions ?? {}
	return { ...workflow, actions: rest }
}
