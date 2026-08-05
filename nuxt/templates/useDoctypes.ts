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

// Actions are deliberately not dispatched from here. Dispatching is only half the job: the result
// has to land in the store under the identity the server settled on, which is not always the id
// that was dispatched — a Save against a record that does not exist creates one. `useClientAction`
// (auto-imported from @stonecrop/nuxt) owns both halves; app/pages/index.vue binds it directly.
