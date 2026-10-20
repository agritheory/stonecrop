import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vite-plus/test'

import { DRAFT_RECORD_ID } from '../../src/draft'
import { getGlobalTriggerEngine } from '../../src/field-triggers'
import Registry from '../../src/registry'
import { Stonecrop } from '../../src/stonecrop'
import { HST } from '../../src/stores/hst'

const settle = () => new Promise(resolve => setTimeout(resolve, 0))

describe('editRecord', { tags: ['unit'] }, () => {
	let stonecrop: Stonecrop

	beforeEach(() => {
		setActivePinia(createPinia())
		Registry._root = undefined as any
		Stonecrop._root = undefined as any
		;(HST as any).instance = undefined
		stonecrop = new Stonecrop(new Registry())
	})

	describe('a record not saved yet', () => {
		it('holds what is set on it, and nothing reaches the shared store', () => {
			const job = stonecrop.editRecord('job', DRAFT_RECORD_ID)

			job.set('name', 'Bread run')

			expect(job.get('name')).toBe('Bread run')
			expect(job.get('')).toEqual({ name: 'Bread run' })
			expect(stonecrop.getRecordIds('job')).toEqual([])
		})

		it("runs a field's rules, and a rule's set lands in the record", async () => {
			getGlobalTriggerEngine().registerAction('fillTasks', context => {
				context.set('tasks', [{ name: `first task of ${String(context.get('recipeId'))}` }])
			})
			getGlobalTriggerEngine().registerDoctypeActions('job', { recipeId: ['fillTasks'] })
			const job = stonecrop.editRecord('job', DRAFT_RECORD_ID)

			job.set('recipeId', 'r1')
			await settle()

			expect(job.get('tasks')).toEqual([{ name: 'first task of r1' }])
			expect(stonecrop.getRecordIds('job')).toEqual([])
		})

		it('runs the rules of the field a rule sets', async () => {
			const seen: unknown[] = []
			getGlobalTriggerEngine().registerAction('planOnOwner', context => {
				context.set('status', 'planned')
			})
			getGlobalTriggerEngine().registerAction('noteStatus', context => {
				seen.push(context.afterValue)
			})
			getGlobalTriggerEngine().registerDoctypeActions('plan', { owner: ['planOnOwner'], status: ['noteStatus'] })
			const plan = stonecrop.editRecord('plan', DRAFT_RECORD_ID)

			plan.set('owner', 'u1')
			await settle()

			expect(seen).toEqual(['planned'])
		})

		it('gives its rules no record id and no store path, since it has neither', async () => {
			const seen: Array<{ recordId?: string; path?: string; doctype: string }> = []
			getGlobalTriggerEngine().registerAction('noteContext', context => {
				seen.push({ recordId: context.recordId, path: context.path, doctype: context.doctype })
			})
			getGlobalTriggerEngine().registerDoctypeActions('memo', { title: ['noteContext'] })

			stonecrop.editRecord('memo', DRAFT_RECORD_ID).set('title', 'Hello')
			await settle()

			expect(seen).toEqual([{ recordId: undefined, path: undefined, doctype: 'memo' }])
		})

		// How a failing rule's changes are undone on a record not saved yet is still undecided; until it
		// is, they stay, and this pins that so changing it is deliberate.
		it('keeps what a failing rule set, and what the user typed while it waited', async () => {
			let answer: () => void = () => undefined
			getGlobalTriggerEngine().registerAction('fillThenFail', async context => {
				context.set('tasks', [{ name: 'half done' }])
				await new Promise<void>(resolve => {
					answer = resolve
				})
				throw new Error('recipe fetch failed')
			})
			getGlobalTriggerEngine().registerDoctypeActions('batch', { recipeId: ['fillThenFail'] })
			const batch = stonecrop.editRecord('batch', DRAFT_RECORD_ID)

			batch.set('recipeId', 'r1')
			await settle()
			batch.set('name', 'Typed while it waited')
			answer()
			await settle()

			expect(batch.get('')).toEqual({
				recipeId: 'r1',
				tasks: [{ name: 'half done' }],
				name: 'Typed while it waited',
			})
		})

		it('is a fresh record each time it is asked for', () => {
			stonecrop.editRecord('note', DRAFT_RECORD_ID).set('body', 'Abandoned')

			expect(stonecrop.editRecord('note', DRAFT_RECORD_ID).get('body')).toBeUndefined()
		})

		it('starts with the starting values it is given, without running their rules', async () => {
			const seen: unknown[] = []
			getGlobalTriggerEngine().registerAction('noteRecipe', context => {
				seen.push(context.afterValue)
			})
			getGlobalTriggerEngine().registerDoctypeActions('bake', { recipeId: ['noteRecipe'] })

			const bake = stonecrop.editRecord('bake', DRAFT_RECORD_ID, { recipeId: 'sourdough', steps: [] })
			await settle()

			expect(bake.get('')).toEqual({ recipeId: 'sourdough', steps: [] })
			expect(seen).toEqual([])

			bake.set('recipeId', 'rye')
			await settle()

			expect(seen).toEqual(['rye'])
		})

		it('sets a field inside a group it has', () => {
			const order = stonecrop.editRecord('order', DRAFT_RECORD_ID, { address: {}, lines: [{ quantity: 1 }] })

			order.set('address.city', 'Leeds')
			order.set('lines.0.quantity', 2)

			expect(order.get('')).toEqual({ address: { city: 'Leeds' }, lines: [{ quantity: 2 }] })
		})

		it('reads and sets field paths as the store does for a saved record', () => {
			const order = () => ({ lines: [{ quantity: 1 }], address: { city: 'York' } })
			stonecrop.addRecord('order', 'o1', order())
			const saved = stonecrop.editRecord('order', 'o1')
			const unsaved = stonecrop.editRecord('order', DRAFT_RECORD_ID, order())

			for (const record of [saved, unsaved]) {
				record.set('lines[0].quantity', 2)
				record.set('address..city', 'Leeds')
			}

			for (const path of ['lines[0].quantity', 'lines.0.quantity', 'address..city', 'lines[1].quantity']) {
				expect(unsaved.get(path), path).toEqual(saved.get(path))
			}
			expect(saved.get('')).toEqual({ lines: [{ quantity: 2 }], address: { city: 'Leeds' } })
			expect(unsaved.get('')).toEqual(saved.get(''))
		})

		it('refuses a set inside a group it does not have, as the store does for a saved record', () => {
			const order = stonecrop.editRecord('order', DRAFT_RECORD_ID)

			expect(() => order.set('address.city', 'Leeds')).toThrow(
				'Cannot set property on null/undefined path: address.city'
			)
			expect(order.get('')).toEqual({})
		})
	})

	describe('a saved record', () => {
		it('is read and set through the shared store, where its rules see its id', async () => {
			const seen: Array<string | undefined> = []
			getGlobalTriggerEngine().registerAction('noteId', context => {
				seen.push(context.recordId)
			})
			getGlobalTriggerEngine().registerDoctypeActions('order', { status: ['noteId'] })
			stonecrop.addRecord('order', 'o1', { status: 'draft', customer: 'Dover Street' })
			const order = stonecrop.editRecord('order', 'o1')

			order.set('status', 'confirmed')
			await settle()

			expect(stonecrop.getRecordById('order', 'o1')?.get('status')).toBe('confirmed')
			expect(order.get('customer')).toBe('Dover Street')
			expect(order.get('')).toEqual({ status: 'confirmed', customer: 'Dover Street' })
			expect(seen).toEqual(['o1'])
		})

		it('refuses a set with no field name, as a new record does, rather than replacing the record', () => {
			stonecrop.addRecord('order', 'o1', { status: 'draft' })
			const order = stonecrop.editRecord('order', 'o1')

			for (const fieldname of ['', '.']) {
				expect(() => order.set(fieldname, 'X'), fieldname).toThrow('Cannot set value on empty path')
				expect(() => stonecrop.editRecord('order', DRAFT_RECORD_ID).set(fieldname, 'X'), fieldname).toThrow(
					'Cannot set value on empty path'
				)
			}
			expect(order.get('')).toEqual({ status: 'draft' })
		})

		it('refuses starting values, which only a new record takes', () => {
			stonecrop.addRecord('order', 'o1', { status: 'draft' })

			expect(() => stonecrop.editRecord('order', 'o1', { status: 'confirmed' })).toThrow(
				'Starting values are only for a new record, not order o1'
			)
			expect(stonecrop.getRecordById('order', 'o1')?.get('status')).toBe('draft')
		})
	})
})
