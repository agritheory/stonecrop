import type { DoctypeConfig } from '@stonecrop/stonecrop'

import { buildRouteToSlugMap } from '@route-utils'

const modules = import.meta.glob<DoctypeConfig>('../doctypes/*.json', {
	eager: true,
	import: 'default',
})

export const doctypeMap = new Map<string, DoctypeConfig>()
const routeEntries: Array<[string, Pick<DoctypeConfig, 'route'>]> = []

for (const [path, doctype] of Object.entries(modules)) {
	const filename = path.split('/').pop()!.replace('.json', '')
	const slug = filename
		.replace(/([a-z])([A-Z])/g, '$1-$2')
		.replace(/[\s_]+/g, '-')
		.toLowerCase()
	doctypeMap.set(slug, doctype)
	routeEntries.push([slug, doctype])
}

export const routeToSlugMap = buildRouteToSlugMap(routeEntries)
