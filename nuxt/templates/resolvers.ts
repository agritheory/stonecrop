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
 * Data reads go through loadOne; data writes happen in server/plugins/stonecrop.ts
 * via registered action handlers (start_task, complete_task, archive_project).
 *
 * To connect a real database, replace the imports from ./data with your
 * PostGraphile setup. See: https://stonecrop.io/docs/guides/postgraphile
 */

import { constant, lambda, loadOne, object } from 'grafast'
import { getMeta, getAllMeta, getHandler } from '@stonecrop/graphql-middleware'
import type { ActionContext } from '@stonecrop/graphql-middleware'
import type { DoctypeMeta } from '@stonecrop/schema'
import { projects, tasks, type Project, type Task } from './data'

// ============================================================
// Formatting helpers (shape doctype metadata for the GraphQL
// response type defined in server/schema.graphql)
// ============================================================

function formatFieldMeta(field: { kind?: string; fieldname: string; fieldtype?: string; [key: string]: unknown }) {
	return {
		fieldname: field.fieldname,
		fieldtype: field.fieldtype ?? null,
		label: field.label ?? null,
		required: field.required ?? false,
		readOnly: field.readOnly ?? false,
		options: field.options ?? null,
		default: field.default ?? null,
		width: field.width ?? null,
		validation: field.validation ?? null,
		component: field.component ?? null,
		align: field.align ?? null,
		edit: field.edit ?? null,
		hidden: field.hidden ?? null,
		mask: field.mask ?? null,
		precision: field.precision ?? null,
		scale: field.scale ?? null,
		mode: field.mode ?? null,
	}
}

function formatDoctypeMeta(meta: DoctypeMeta) {
	const actions = meta.workflow?.actions
	const actionList = actions
		? Object.entries(actions as Record<string, Record<string, unknown>>).map(([name, action]) => ({
				name,
				label: action.label ?? null,
				handler: action.handler ?? null,
				requiredFields: (action.requiredFields as string[]) ?? [],
				allowedStates: (action.allowedStates as string[]) ?? [],
				nextState: action.nextState ?? null,
				stateless: action.stateless ?? false,
				clientHandler: action.clientHandler ?? null,
			}))
		: []
	return {
		name: meta.name,
		slug: meta.slug ?? null,
		fields: meta.fields.map(formatFieldMeta),
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

function getRecord(doctype: string, id: string): Project | Task | null {
	const d = doctype.toLowerCase()
	if (d === 'project') return projects.get(id) ?? null
	if (d === 'task') return tasks.get(id) ?? null
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
					return specs.map(spec => ({
						data: getRecord(spec.doctype, spec.id),
						doctype: spec.doctype,
					}))
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

								const handler = getHandler(actionDef.handler)
								if (!handler)
									return { success: false, data: null, error: `Handler not registered: ${actionDef.handler}` }

								// Pass doctype metadata via ActionContext. The handler in server/plugins/stonecrop.ts
								// imports and mutates the data Maps directly — it does not need additional context here.
								// In a PostGraphile setup, context.pgClient would provide the database connection instead.
								const actionContext: ActionContext = { doctype: meta }

								try {
									const result = await handler(spec.actionArgs ?? [], actionContext)
									return { success: true, data: result, error: null }
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
