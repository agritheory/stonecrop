import { describe, it, expect } from 'vite-plus/test'

import { getGlobalTriggerEngine, registerTransitionAction, triggerTransition } from '../../src/field-triggers'
import { createHST } from '../../src/stores/hst'

const settle = () => new Promise(resolve => setTimeout(resolve, 0))

describe('a rule reads and sets its own record by field name', { tags: ['unit'] }, () => {
	it('sets a field of the saved record whose field changed', async () => {
		const engine = getGlobalTriggerEngine()
		engine.registerAction('fillTasksFromRecipe', context => {
			context.set('tasks', [{ name: `first task of ${String(context.get('recipeId'))}` }])
		})
		engine.registerDoctypeActions('job', { recipeId: ['fillTasksFromRecipe'] })
		const store = createHST({ job: { j1: { recipeId: null, tasks: [] } } }, 'StonecropStore')

		store.set('job.j1.recipeId', 'r1')
		await settle()

		expect(store.get('job.j1.tasks')).toEqual([{ name: 'first task of r1' }])
	})

	it('runs the rules of the field a rule sets', async () => {
		const engine = getGlobalTriggerEngine()
		const seen: unknown[] = []
		engine.registerAction('planOnOwner', context => {
			context.set('status', 'planned')
		})
		engine.registerAction('noteStatus', context => {
			seen.push(context.afterValue)
		})
		engine.registerDoctypeActions('plan', { owner: ['planOnOwner'], status: ['noteStatus'] })
		const store = createHST({ plan: { p1: { owner: null, status: 'draft' } } }, 'StonecropStore')

		store.set('plan.p1.owner', 'u1')
		await settle()

		expect(seen).toEqual(['planned'])
	})

	it('still runs a rule that sets its record by store path', async () => {
		const engine = getGlobalTriggerEngine()
		engine.registerAction('fillByPath', context => {
			context.store?.set(`${context.doctype}.${context.recordId}.tasks`, [{ name: 'by path' }])
		})
		engine.registerDoctypeActions('order', { recipeId: ['fillByPath'] })
		const store = createHST({ order: { o1: { recipeId: null, tasks: [] } } }, 'StonecropStore')

		store.set('order.o1.recipeId', 'r1')
		await settle()

		expect(store.get('order.o1.tasks')).toEqual([{ name: 'by path' }])
	})
})

describe('a transition reads and sets the record it runs on', { tags: ['unit'] }, () => {
	it('sets a field of the record it is triggered on', async () => {
		registerTransitionAction('stampSubmittedTitle', context => {
			context.set('submittedTitle', context.get('title'))
		})
		getGlobalTriggerEngine().registerDoctypeActions('memo', { SUBMIT: ['stampSubmittedTitle'] })
		const store = createHST({ memo: { m1: { title: 'Q3 plan' } } }, 'StonecropStore')

		await store.getNode('memo.m1').triggerTransition('SUBMIT')

		expect(store.get('memo.m1.submittedTitle')).toBe('Q3 plan')
	})

	it('has no record to reach when triggered above any record, and says why', async () => {
		registerTransitionAction('readAboveRecord', context => {
			context.get('title')
		})
		getGlobalTriggerEngine().registerDoctypeActions('brief', { ARCHIVE: ['readAboveRecord'] })
		const store = createHST({ brief: { b1: { title: 'Q3 plan' } } }, 'StonecropStore')

		const results = await store.getNode('brief').triggerTransition('ARCHIVE')

		expect(results[0]?.error?.message).toBe(
			'Transition "ARCHIVE" was triggered above any record, so it has no record to read or set'
		)
	})

	it('has no record to reach when triggered without a store, and says why', async () => {
		registerTransitionAction('readWithoutStore', context => {
			context.get('title')
		})
		getGlobalTriggerEngine().registerDoctypeActions('note', { ARCHIVE: ['readWithoutStore'] })

		const results = await triggerTransition('note', 'ARCHIVE', { recordId: 'n1' })

		expect(results[0]?.error?.message).toBe(
			'Transition "ARCHIVE" was triggered without a store, so it has no record to read or set'
		)
	})
})
