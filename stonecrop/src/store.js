import { createPinia, defineStore } from 'pinia'
import { createMachine, assign } from 'xstate'
import xstate from 'pinia-xstate'
import { PiniaSharedState } from 'pinia-shared-state'
import { PiniaUndo } from 'pinia-undo'

const pinia = createPinia()

// Pass the plugin to your application's pinia plugin
pinia.use(
	PiniaSharedState({
		enable: true,
		initialize: true,
	})
)
pinia.use(PiniaUndo)

const increment = context => context.count + 1
const decrement = context => context.count - 1

export const counterMachine = createMachine({
	id: 'counter',
	initial: 'active',
	context: {
		count: 0,
	},
	states: {
		active: {
			on: {
				INC: { actions: assign({ count: increment }) },
				DEC: { actions: assign({ count: decrement }) },
			},
		},
	},
})

// create a store using the xstate middleware
export const counterStore = defineStore(counterMachine.id, xstate(counterMachine))

export default { pinia }
