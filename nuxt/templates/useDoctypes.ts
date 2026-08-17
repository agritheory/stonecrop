import type { DoctypeConfig } from '@stonecrop/stonecrop'

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

/**
 * URL routing for every doctype in this app, from their `route` and `view` keys.
 *
 * Built once from the whole map rather than per lookup: two doctypes claiming one URL role is an
 * error, and that is only knowable with all of them in hand. Throwing here fails the app at boot
 * with both doctype names, which is the point — the alternative silently drops one of them.
 */
export const doctypeRoutes = buildDoctypeRoutes(doctypeMap)

export function useDoctypeConfig(slug: string): DoctypeConfig | undefined {
	return doctypeMap.get(slug)
}

// There are deliberately no fetch helpers here. Fetching is not the whole job: the result has to
// land in the store under the identity the doctype declares, and something has to decide whether a
// read is warranted at all. `Stonecrop.getRecord`/`getRecords` own all of it and reach your backend
// through the client registered in `stonecrop.client.ts` — call those instead.
//
// The pair that used to live here also hardcoded `limit = 200`, which is a decision about what the
// backend can afford and therefore the server's to make, not a page's.

// Actions are deliberately not dispatched from here. Dispatching is only half the job: the result
// has to land in the store under the identity the server settled on, which is not always the id
// that was dispatched — a Save against a record that does not exist creates one. `useClientAction`
// (auto-imported from @stonecrop/nuxt) owns both halves; app/pages/index.vue binds it directly.
