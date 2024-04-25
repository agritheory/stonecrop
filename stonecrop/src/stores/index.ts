import { createPinia } from 'pinia'
import { PiniaSharedState } from 'pinia-shared-state'

const pinia = createPinia()

// Pass the plugin to your application's pinia plugin
pinia.use(
	PiniaSharedState({
		enable: true,
		initialize: true,
	})
)

export { pinia }
