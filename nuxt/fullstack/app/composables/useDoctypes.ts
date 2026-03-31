/**
 * Utilities for doctype schema resolution and data fetching.
 * Based on patterns from the fab application.
 */

import type { DoctypeRef } from '@stonecrop/schema'
import type { DoctypeConfig } from '@stonecrop/stonecrop'

import { useNuxtApp } from 'nuxt/app'

const modules = import.meta.glob<DoctypeConfig>('../doctypes/*.json', {
	eager: true,
	import: 'default',
})

const doctypeMap = new Map<string, DoctypeConfig>()
for (const [path, doctype] of Object.entries(modules)) {
	const slug = path.split('/').pop()!.replace('.json', '')
	doctypeMap.set(slug, doctype)
}

export { doctypeMap }

export function useDoctypeConfig(slug: string): DoctypeConfig | undefined {
	// Try exact match first, then lowercase
	let config = doctypeMap.get(slug)
	if (!config) {
		config = doctypeMap.get(slug.toLowerCase())
	}
	return config
}

export function useDoctypeList(): Array<{ slug: string; name: string; tableName: string }> {
	return Array.from(doctypeMap.entries())
		.map(([slug, dt]) => ({
			slug,
			name: dt.name,
			tableName: dt.tableName || '',
		}))
		.sort((a, b) => a.name.localeCompare(b.name))
}

export async function fetchDoctypeRecords(doctype: DoctypeRef, limit = 200): Promise<{ data: any[]; count: number }> {
	const { $stonecropClient } = useNuxtApp()
	const data = (await $stonecropClient.getRecords({ name: doctype.name }, { limit })) as any[]
	return { data, count: data.length }
}

export async function fetchDoctypeRecord(
	doctype: DoctypeRef,
	recordId: string
): Promise<Record<string, unknown> | null> {
	const { $stonecropClient } = useNuxtApp()
	return $stonecropClient.getRecord(doctype, recordId)
}

export interface ActionResult {
	success: boolean
	data?: unknown
	error?: string | null
}

export async function runDoctypeAction(
	doctype: DoctypeConfig,
	action: string,
	args: { id: string; data?: Record<string, unknown> }
): Promise<ActionResult> {
	const { $stonecropClient } = useNuxtApp()
	return $stonecropClient.runAction({ name: doctype.name }, action, [args])
}
