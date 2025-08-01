import { createPinia } from 'pinia'
import { PiniaSharedState } from 'pinia-shared-state'

import { HST } from './hst'

const hst = HST.getInstance()
const pinia = createPinia()

// Pass the plugin to your application's pinia plugin
pinia.use(
	PiniaSharedState({
		enable: true,
		initialize: true,
	})
)

export { hst, pinia }
