export type * from '@stonecrop/aform/types'
export type * from '@stonecrop/atable/types'

import { useStonecrop } from './composable'
import DoctypeMeta from './doctype'
import plugin from './plugins'
import Registry from './registry'
import { Stonecrop } from './stonecrop'
import { HST, createHST, type HSTNode } from './stores/hst'
export type * from './types'
export type { BaseStonecropReturn, HSTChangeData, HSTStonecropReturn, StonecropReturn } from './composable'

export {
	DoctypeMeta,
	Registry,
	Stonecrop,
	useStonecrop,
	// HST exports for advanced usage
	HST,
	createHST,
	HSTNode,
}

// Default export is the Vue plugin
export default plugin
