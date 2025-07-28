import { createPinia } from 'pinia'

import { HST } from './hst'

const hst = HST.getInstance()
const pinia = createPinia()

export { hst, pinia }
