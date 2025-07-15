import { defineStore } from 'pinia'
import { xstate } from 'pinia-xstate'
import { setup } from 'xstate'

export const counterMachine = setup({
	types: {} as {
		context: {
			count: number
		}
		events: {
			type: 'INC' | 'DEC'
		}
	},
	actions: {
		increment: ({ context }) => {
			context.count = context.count + 1
		},
		decrement: ({ context }) => {
			context.count = context.count - 1
		},
	},
}).createMachine({
	id: 'counter',
	initial: 'active',
	context: {
		count: 0,
	},
	states: {
		active: {
			on: {
				INC: { actions: 'increment' },
				DEC: { actions: 'decrement' },
			},
		},
	},
})

// create a store using the xstate middleware
export const useCounterStore = defineStore(counterMachine.id, xstate(counterMachine))
