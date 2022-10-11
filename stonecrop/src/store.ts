import { createPinia, defineStore } from 'pinia'
import { PiniaSharedState } from 'pinia-shared-state'
import { PiniaUndo } from 'pinia-undo'
import xstate from 'pinia-xstate'
import { createMachine } from 'xstate'

const pinia = createPinia()

// Pass the plugin to your application's pinia plugin
pinia.use(
	PiniaSharedState({
		enable: true,
		initialize: true,
	})
)
pinia.use(PiniaUndo)

export const counterMachine = createMachine(
	{
		id: 'counter',
		initial: 'active',
		context: {
			count: 0,
		},
		tsTypes: {} as import('./store.typegen').Typegen0,
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
export const counterStore = defineStore(counterMachine.id, xstate(counterMachine))

export default { pinia }
