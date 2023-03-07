import { defineStore } from 'pinia'
import xstate from 'pinia-xstate'
import { createMachine } from 'xstate'

export const counterMachine = createMachine(
	{
		id: 'counter',
		initial: 'active',
		context: {
			count: 0,
		},
		tsTypes: {} as import('./xstate.typegen').Typegen0,
		states: {
			active: {
				on: {
					INC: { actions: 'increment' },
					DEC: { actions: 'decrement' },
				},
			},
		},
	},
	{
		actions: {
			increment: context => {
				context.count = context.count + 1
			},
			decrement: context => {
				context.count = context.count - 1
			},
		},
	}
)

// create a store using the xstate middleware
export const useCounterStore = defineStore(counterMachine.id, xstate(counterMachine))
