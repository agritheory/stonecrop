export type * from '@stonecrop/aform/types'
export type * from '@stonecrop/atable/types'

import { type StonecropReturn, useStonecrop } from './composable'
import DoctypeMeta from './doctype'
import plugin from './plugins'
import Registry from './registry'
import { Stonecrop } from './stonecrop'
import { HST, createHST, type HSTNode } from './stores/hst'
export type * from './types'

export {
	DoctypeMeta,
	Registry,
	Stonecrop,
	StonecropReturn,
	useStonecrop,
	// HST exports for advanced usage
	HST,
	createHST,
	HSTNode,
}

// Default export is the Vue plugin
export default plugin
