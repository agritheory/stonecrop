import type { DoctypeRef } from '@stonecrop/schema'
import type { DoctypeConfig } from '@stonecrop/stonecrop'
import { useNuxtApp } from 'nuxt/app'

const modules = import.meta.glob<DoctypeConfig>('../../doctypes/*.json', {
	eager: true,
	import: 'default',
})

export const doctypeMap = new Map<string, DoctypeConfig>()

for (const [path, doctype] of Object.entries(modules)) {
	const filename = path.split('/').pop()!.replace('.json', '')
	const slug = filename
		.replace(/([a-z])([A-Z])/g, '$1-$2')
		.replace(/[\s_]+/g, '-')
		.toLowerCase()
	doctypeMap.set(slug, doctype)
}

export function useDoctypeConfig(slug: string): DoctypeConfig | undefined {
	return doctypeMap.get(slug)
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
	const result = await $stonecropClient.getRecord(doctype, recordId)
	return result.record
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
