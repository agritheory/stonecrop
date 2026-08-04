/**
 * Stonecrop GraphQL Resolvers
 *
 * Uses Grafast plan resolvers — functions that return Steps (execution plans)
 * rather than raw data. The key step functions used here:
 *
 * - constant(value)           — return a static value
 * - lambda($step, fn)         — transform a step SYNCHRONOUSLY (no async/await)
 * - loadOne($step, fn)        — batch-load data ASYNCHRONOUSLY (for DB queries)
 * - object({ ... })           — group multiple steps into a single step object
 *
 * Data reads go through loadOne. Workflow outcomes are applied by the stonecropAction
 * resolver itself (server-owns-transition, guarded by allowedStates), and anything a
 * doctype cannot express — a Command with no state change — goes through the
 * `actionHandlers` map below.
 *
 * To connect a real database, replace the imports from ./data with your
 * PostGraphile setup. See: https://stonecrop.io/docs/guides/postgraphile
 */

import { constant, lambda, loadOne, object } from 'grafast'
import { getMeta, getAllMeta, applyGuardedTransition } from '@stonecrop/graphql-middleware'
import { getPrimaryKeyField } from '@stonecrop/schema'
import type { DoctypeMeta } from '@stonecrop/schema'
import { projects, tasks, type Project, type Task } from './data'

// ============================================================
// Formatting helpers (shape doctype metadata for the GraphQL
// response type defined in server/schema.graphql)
// ============================================================

export function formatDoctypeMeta(meta: DoctypeMeta) {
	// Fields and actions pass through verbatim — the SDL alone decides what is
	// selectable. Enumerating keys here silently drops any field the schema gains
	// later; the only computed addition is `name` (an action's key in the
	// WorkflowMeta.actions record, flattened into the list the SDL declares).
	const actions = meta.workflow?.actions
	const actionList = actions
		? Object.entries(actions as Record<string, Record<string, unknown>>).map(([name, action]) => ({
				name,
				...action,
			}))
		: []
	return {
		name: meta.name,
		slug: meta.slug ?? null,
		fields: meta.fields,
		workflow: meta.workflow
			? {
					states: meta.workflow.states ?? null,
					actions: actionList,
				}
			: null,
		inherits: meta.inherits ?? null,
	}
}

// ============================================================
// Record helpers — read/write the in-memory Maps by doctype
// ============================================================

/**
 * The field an incoming `stonecropRecord(id:)` argument is matched against.
 *
 * Part of the adapter contract — see test/adapter-conformance.test.ts, which runs the same
 * expectations against every host. A doctype that declares a `primaryKey` is keyed by that
 * field; the client resolves the same field via `@stonecrop/schema`'s `getRecordIdentity`,
 * so an adapter that ignores the declaration looks records up by a key the client never sent.
 *
 * The `id` fallback covers doctypes that declare no `primaryKey`. Every doctype in this repo now
 * declares one, enforced by test/doctype-fixtures.test.ts, so in-repo the fallback is inert.
 * It stays for consumer doctypes that have not adopted the rule: the Postgres adapter refuses
 * those outright (`data: null`), and this host stays permissive. The conformance suite records
 * that difference rather than asserting one answer.
 */
export function recordLookupField(meta: DoctypeMeta): string {
	return getPrimaryKeyField(meta.fields)?.fieldname ?? 'id'
}

function getRecord(doctype: string, id: string, lookupField = 'id'): Project | Task | null {
	const d = doctype.toLowerCase()
	const store = d === 'project' ? projects : d === 'task' ? tasks : null
	if (!store) return null
	if (lookupField === 'id') return store.get(id) ?? null
	// A natural key is not the Map key, so the store is scanned. Values are compared as
	// strings because the `id` argument arrives from GraphQL as `String!`. Only primitives
	// are usable keys — stringifying an object would compare "[object Object]".
	for (const record of store.values()) {
		const value: unknown = Reflect.get(record, lookupField)
		if ((typeof value === 'string' || typeof value === 'number') && String(value) === id) return record
	}
	return null
}

function getRecords(doctype: string, filters?: Record<string, unknown>): (Project | Task)[] {
	const d = doctype.toLowerCase()
	if (d === 'project') {
		return Array.from(projects.values())
	}
	if (d === 'task') {
		let all = Array.from(tasks.values())
		if (filters?.projectId) {
			all = all.filter(t => t.projectId === filters.projectId)
		}
		return all
	}
	return []
}

function nextId(doctype: string): string {
	const d = doctype.toLowerCase()
	const ids = d === 'project' ? projects.keys() : tasks.keys()
	const max = Math.max(0, ...Array.from(ids, id => Number(id) || 0))
	return String(max + 1)
}

// ============================================================
// Server-side action effects
// ============================================================
// A doctype's workflow says whether an action may run (`allowedStates`) and what state results
// (`nextState`, `selfTransition`). It deliberately says nothing about what the action *does*: a
// doctype is runtime data edited in DocBuilder, and it must not name server code a different
// author owns. So the routing from action to effect lives here, keyed `[doctype name][action
// key]`, and is never published to the client.
//
// This is what makes a Command executable at all. An action with no `nextState` and no
// `selfTransition` has nothing for the dispatcher to apply, and without an entry here it fails
// loudly rather than reporting a false success.
//
// Add your own by registering under the doctype's `name`. Throwing rejects the action; returning
// the updated record makes it the client writeback payload.

type ActionHandler = (context: {
	recordId?: string
	/** Record field data the client sent. Unvalidated browser input — validate before trusting it. */
	data: Record<string, unknown>
	/** The state the guard read, or undefined when nothing about the action required reading it. */
	currentState?: string
}) => Promise<unknown>

export const actionHandlers: Record<string, Record<string, ActionHandler>> = {
	Task: {
		/**
		 * Push the due date out by a week.
		 *
		 * The example is deliberately a *stateless* command: snoozing does not move the task
		 * through its workflow, so there is no state for the doctype to declare — only an effect.
		 */
		async snooze({ recordId }) {
			const task = recordId != null ? tasks.get(recordId) : undefined
			if (!task) throw new Error(`Task ${recordId ?? '(none)'} not found`)

			const from = task.dueDate ? new Date(task.dueDate) : new Date()
			from.setDate(from.getDate() + 7)
			const updated: Task = { ...task, dueDate: from.toISOString().slice(0, 10) }
			tasks.set(task.id, updated)
			return Promise.resolve(updated)
		},
	},
}

// ============================================================
// Resolvers (Grafast plan format)
// ============================================================

export const resolvers = {
	Query: {
		plans: {
			healthCheck() {
				return constant({ status: 'healthy', timestamp: new Date().toISOString(), version: '1.0.0' })
			},

			getMeta(_: unknown, { $doctype }: any) {
				return lambda($doctype, (doctype: unknown) => {
					const meta = getMeta(doctype as string)
					return meta ? formatDoctypeMeta(meta) : null
				})
			},

			stonecropMeta(_: unknown, { $doctype }: any) {
				return lambda($doctype, (doctype: unknown) => {
					const meta = getMeta(doctype as string)
					return meta ? formatDoctypeMeta(meta) : null
				})
			},

			stonecropAllMeta() {
				return constant(getAllMeta().map(formatDoctypeMeta))
			},

			stonecropRecord(_: unknown, { $doctype, $id, $options }: any) {
				return loadOne(object({ doctype: $doctype, id: $id, options: $options }), async (specs: readonly any[]) => {
					return specs.map(spec => {
						const meta = getMeta(spec.doctype)
						return {
							data: meta ? getRecord(spec.doctype, spec.id, recordLookupField(meta)) : null,
							doctype: spec.doctype,
						}
					})
				})
			},

			stonecropRecords(_: unknown, { $doctype, $filters, $orderBy, $limit, $offset, $options }: any) {
				return loadOne(
					object({
						doctype: $doctype,
						filters: $filters,
						orderBy: $orderBy,
						limit: $limit,
						offset: $offset,
						options: $options,
					}),
					async (specs: readonly any[]) => {
						return specs.map(spec => {
							const all = getRecords(spec.doctype, spec.filters ?? {})
							const offset = spec.offset ?? 0
							const limit = spec.limit ?? 100
							return {
								data: all.slice(offset, offset + limit),
								doctype: spec.doctype,
								count: all.length,
							}
						})
					}
				)
			},
		},
	},

	Mutation: {
		plans: {
			stonecropAction(_: unknown, { $doctype, $action, $args: $actionArgs }: any) {
				return loadOne(
					object({ doctype: $doctype, action: $action, actionArgs: $actionArgs }),
					async (specs: readonly any[]) => {
						return Promise.all(
							specs.map(async spec => {
								const meta = getMeta(spec.doctype)
								if (!meta) return { success: false, data: null, error: `Unknown doctype: ${spec.doctype}` }

								const actionDef = meta.workflow?.actions?.[spec.action]
								if (!actionDef) return { success: false, data: null, error: `Unknown action: ${spec.action}` }

								// Record envelope: [{ id, data }] — the transition keys off the record id, and a
								// self-transition persists the edited field `data` in place.
								const argList = Array.isArray(spec.actionArgs) ? spec.actionArgs : []
								const recordId = argList[0]?.id != null ? String(argList[0].id) : undefined
								const recordData: Record<string, unknown> = argList[0]?.data ?? {}
								const d = spec.doctype.toLowerCase()
								const handler = actionHandlers[meta.name]?.[String(spec.action)]

								try {
									// The server owns the transition: read current state, guard against allowedStates,
									// write nextState. Reads/writes go straight to the in-memory Maps; a PostGraphile
									// setup swaps in pgClient SQL instead.
									return await applyGuardedTransition(
										actionDef,
										{
											readState: async () => {
												if (recordId == null) return undefined
												const record = getRecord(d, recordId)
												return record?.status == null ? undefined : String(record.status)
											},
											writeState: async (nextState: string) => {
												if (recordId == null) return
												const existing = getRecord(d, recordId)
												if (!existing) return
												if (d === 'project') projects.set(recordId, { ...existing, status: nextState } as Project)
												else if (d === 'task') tasks.set(recordId, { ...existing, status: nextState } as Task)
											},
											// Self-transition data write: merge the edited fields into the record (status
											// untouched) and return the full record for the client writeback.
											writeData: async (patch: Record<string, unknown>) => {
												if (recordId == null) return {}
												const existing = getRecord(d, recordId)
												if (!existing) return {}
												const updated = { ...existing, ...patch }
												if (d === 'project') projects.set(recordId, updated as Project)
												else if (d === 'task') tasks.set(recordId, updated as Task)
												return updated as Record<string, unknown>
											},
											// The server-owned effect for this action, if one is registered above.
											runEffect: handler
												? (currentState: string | undefined) => handler({ recordId, data: recordData, currentState })
												: undefined,
										},
										recordData
									)
								} catch (err) {
									return { success: false, data: null, error: err instanceof Error ? err.message : String(err) }
								}
							})
						)
					}
				)
			},

			stonecropCreate(_: unknown, { $doctype, $input }: any) {
				return loadOne(object({ doctype: $doctype, input: $input }), async (specs: readonly any[]) => {
					return specs.map(spec => {
						const d = spec.doctype.toLowerCase()
						const id = nextId(d)
						const now = new Date().toISOString()
						if (d === 'project') {
							const record: Project = { id, createdAt: now, status: 'Active', description: '', ...spec.input }
							projects.set(id, record)
							return { data: record, doctype: spec.doctype }
						}
						if (d === 'task') {
							const record: Task = { id, createdAt: now, status: 'Todo', description: '', dueDate: null, ...spec.input }
							tasks.set(id, record)
							return { data: record, doctype: spec.doctype }
						}
						return { data: null, doctype: spec.doctype }
					})
				})
			},

			stonecropUpdate(_: unknown, { $doctype, $id, $patch }: any) {
				return loadOne(object({ doctype: $doctype, id: $id, patch: $patch }), async (specs: readonly any[]) => {
					return specs.map(spec => {
						const d = spec.doctype.toLowerCase()
						const existing = getRecord(d, spec.id)
						if (!existing) return null
						if (d === 'project') {
							const updated = { ...existing, ...spec.patch } as Project
							projects.set(spec.id, updated)
							return { data: updated, doctype: spec.doctype }
						}
						if (d === 'task') {
							const updated = { ...existing, ...spec.patch } as Task
							tasks.set(spec.id, updated)
							return { data: updated, doctype: spec.doctype }
						}
						return null
					})
				})
			},

			stonecropDelete(_: unknown, { $doctype, $id }: any) {
				return loadOne(object({ doctype: $doctype, id: $id }), async (specs: readonly any[]) => {
					return specs.map(spec => {
						const d = spec.doctype.toLowerCase()
						let deleted = false
						if (d === 'project') deleted = projects.delete(spec.id)
						else if (d === 'task') deleted = tasks.delete(spec.id)
						return {
							success: deleted,
							data: deleted ? { id: spec.id } : null,
							error: deleted ? null : 'Record not found',
						}
					})
				})
			},
		},
	},
}

export default resolvers
