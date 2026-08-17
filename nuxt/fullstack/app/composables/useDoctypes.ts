/**
 * Utilities for doctype schema resolution. Data fetching is Stonecrop's — see the note below.
 */

import type { DoctypeConfig } from '@stonecrop/stonecrop'

const modules = import.meta.glob<DoctypeConfig>('../../doctypes/*.json', {
	eager: true,
	import: 'default',
})

const doctypeMap = new Map<string, DoctypeConfig>()

for (const [path, doctype] of Object.entries(modules)) {
	const filename = path.split('/').pop()!.replace('.json', '')
	// Use the same slug computation as Doctype.slug so URL lookups match map keys
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
 * error, and that is only knowable with all of them in hand.
 */
const doctypeRoutes = buildDoctypeRoutes(doctypeMap)

export { doctypeMap, doctypeRoutes }

export function useDoctypeConfig(slug: string): DoctypeConfig | undefined {
	return doctypeMap.get(slug)
}

export function useDoctypeList(): Array<{ slug: string; name: string }> {
	return Array.from(doctypeMap.entries())
		.map(([slug, dt]) => ({
			slug,
			name: dt.name,
		}))
		.sort((a, b) => a.name.localeCompare(b.name))
}

// There are deliberately no fetch helpers here. Fetching is not the whole job: the result has to
// land in the store under the identity the doctype declares, and something has to decide whether a
// read is warranted at all. `Stonecrop.getRecord`/`getRecords` own all of it and reach this app's
// backend through the registered client — call those instead.
//
// The pair that used to live here also hardcoded `limit = 200`, which is a decision about what the
// backend can afford and therefore the server's to make, not a page's.
//
// There is deliberately no `runDoctypeAction` either. Dispatching is not the whole job: the result
// has to land in the store under the identity the server settled on, which is not always the id
// that was dispatched. `useClientAction` owns both halves — call that instead.
