import { createPinia } from 'pinia'
import { PiniaSharedState } from 'pinia-shared-state'
// import { PiniaUndo } from 'pinia-undo'

const pinia = createPinia()

// Pass the plugin to your application's pinia plugin
pinia.use(
	PiniaSharedState({
		enable: true,
		initialize: true,
	})
)
// pinia.use(PiniaUndo)

export { pinia }
