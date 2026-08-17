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
import { getRecordIdField } from '@stonecrop/schema'
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
		route: meta.route ?? null,
		view: meta.view ?? null,
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
 * It stays for consumer doctypes that have not adopted the rule, and every host now applies it —
 * the Postgres adapter used to omit it and refuse those doctypes outright, which is what made the
 * hosts disagree. This is a thin wrapper on the shared rule, kept for the `meta`-shaped signature
 * the resolvers call it with.
 */
export function recordLookupField(meta: DoctypeMeta): string {
	return getRecordIdField(meta.fields)
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

/**
 * Write a record into its store under `key`.
 *
 * `key` is the record's identity under the doctype's declared `primaryKey` — the same field
 * `getRecord` matches against — so the store is keyed by whatever the doctype says identifies a
 * record, not by a hardcoded `id`. Both doctypes here declare `id`, so the two coincide today.
 */
function setRecord(doctype: string, key: string, record: Record<string, unknown>): void {
	const d = doctype.toLowerCase()
	if (d === 'project') projects.set(key, record as unknown as Project)
	else if (d === 'task') tasks.set(key, record as unknown as Task)
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

			stonecropRecords(_: unknown, { $doctype, $filters, $orderBy, $limit, $offset, $includeTotal, $options }: any) {
				return loadOne(
					object({
						doctype: $doctype,
						filters: $filters,
						orderBy: $orderBy,
						limit: $limit,
						offset: $offset,
						includeTotal: $includeTotal,
						options: $options,
					}),
					async (specs: readonly any[]) => {
						return specs.map(spec => {
							const all = getRecords(spec.doctype, spec.filters ?? {})
							const offset = spec.offset ?? 0
							const limit = spec.limit ?? 100
							const page = all.slice(offset, offset + limit)
							return {
								data: page,
								doctype: spec.doctype,
								hasMore: offset + page.length < all.length,
								// This store is in memory, so counting is free — but it stays opt-in anyway,
								// because the scaffold is what a real adapter gets copied from and a backend
								// that answers a total nobody asked for teaches the wrong default.
								count: spec.includeTotal === true ? all.length : null,
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
								// The field a record is identified by. The read path already resolved records
								// through this; the action path used to assume `id`, so an action on a
								// natural-keyed doctype looked up a key the client never sent.
								const lookupField = recordLookupField(meta)

								try {
									// The server owns the transition: read current state, guard against allowedStates,
									// write nextState. Reads/writes go straight to the in-memory Maps; a PostGraphile
									// setup swaps in pgClient SQL instead.
									return await applyGuardedTransition(
										actionDef,
										{
											readState: async () => {
												// `null` means "no such record" and `undefined` means "exists, no
												// state" — the dispatcher rejects the first outright. Returning
												// `undefined` for both is what let a Save on a record that was
												// never created report success while persisting nothing.
												if (recordId == null) return null
												const record = getRecord(d, recordId, lookupField)
												if (!record) return null
												return record.status == null ? undefined : String(record.status)
											},
											writeState: async (nextState: string) => {
												if (recordId == null) return
												const existing = getRecord(d, recordId, lookupField)
												if (!existing) return
												setRecord(d, recordId, { ...existing, status: nextState })
											},
											// Save is an upsert, and it is the only write path — there is no create action
											// and no create mutation. Updating merges the edited fields in place (status
											// untouched); creating derives the identity from the doctype's declared
											// primary key when the submitted data carries it, which is how a
											// natural-keyed doctype is identified, and mints one only otherwise.
											// Either way the full record comes back for the client writeback.
											writeData: async (patch: Record<string, unknown>, exists: boolean) => {
												if (exists) {
													if (recordId == null) return {}
													const existing = getRecord(d, recordId, lookupField)
													if (!existing) return {}
													const updated = { ...existing, ...patch }
													setRecord(d, recordId, updated)
													return updated as Record<string, unknown>
												}

												const declared = patch[lookupField]
												const identity =
													typeof declared === 'string' && declared !== ''
														? declared
														: typeof declared === 'number'
															? String(declared)
															: nextId(d)
												const defaults =
													d === 'project'
														? { status: 'Active', description: '' }
														: { status: 'Todo', description: '', dueDate: null }
												const record = {
													...defaults,
													...patch,
													[lookupField]: identity,
													createdAt: new Date().toISOString(),
												}
												setRecord(d, identity, record)
												return record
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
		},
	},
}

export default resolvers
