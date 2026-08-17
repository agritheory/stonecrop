import type { DoctypeConfig } from '@stonecrop/stonecrop'

import { buildDoctypeRoutes } from '@route-utils'

const modules = import.meta.glob<DoctypeConfig>('../doctypes/*.json', {
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

export const doctypeRoutes = buildDoctypeRoutes(doctypeMap)
