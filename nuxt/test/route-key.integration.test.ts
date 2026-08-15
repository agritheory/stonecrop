import { readFileSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'

import type { DoctypeConfig } from '@stonecrop/stonecrop'
import { describe, it, expect } from 'vitest'

import {
	buildRouteToSlugMap,
	resolveDoctypeSlugFromSegments,
	resolveRouteView,
} from '../src/runtime/app/composables/useDoctypeRoutes'

const FIXTURE_DIR = resolve(__dirname, 'fixtures/route-key/doctypes')

function filenameToSlug(filename: string): string {
	return filename
		.replace(/([a-z])([A-Z])/g, '$1-$2')
		.replace(/[\s_]+/g, '-')
		.toLowerCase()
}

function loadFixtureDoctypes(): {
	doctypeMap: Map<string, DoctypeConfig>
	routeToSlugMap: Map<string, string>
} {
	const doctypeMap = new Map<string, DoctypeConfig>()
	const routeEntries: Array<[string, Pick<DoctypeConfig, 'route'>]> = []

	for (const file of readdirSync(FIXTURE_DIR).filter(name => name.endsWith('.json'))) {
		const slug = filenameToSlug(file.replace('.json', ''))
		const config = JSON.parse(readFileSync(join(FIXTURE_DIR, file), 'utf-8')) as DoctypeConfig
		doctypeMap.set(slug, config)
		routeEntries.push([slug, config])
	}

	return {
		doctypeMap,
		routeToSlugMap: buildRouteToSlugMap(routeEntries),
	}
}

function resolveMetaSlug(segments: string[], routeToSlugMap: Map<string, string>): string {
	return resolveDoctypeSlugFromSegments(segments, routeToSlugMap)
}

function simulateRegisterMeta(
	segments: string[],
	doctypeMap: Map<string, DoctypeConfig>,
	routeToSlugMap: Map<string, string>
) {
	const slug = resolveMetaSlug(segments, routeToSlugMap)
	const localDoctype = doctypeMap.get(slug)
	if (!localDoctype) {
		throw new Error(`No doctype registered for slug: ${slug}`)
	}
	return {
		name: localDoctype.name,
		fieldLabels: localDoctype.fields?.map(field => field.label).filter(Boolean) ?? [],
	}
}

describe('route-key integration fixtures', { tags: ['unit', 'nuxt'] }, () => {
	const { doctypeMap, routeToSlugMap } = loadFixtureDoctypes()

	it('resolves transactional list schema at the public URL', () => {
		const doctype = simulateRegisterMeta(['transactional-doctype'], doctypeMap, routeToSlugMap)

		expect(doctype.name).toBe('TransactionalDoctypeList')
		expect(doctype.fieldLabels).toEqual(['List Column'])
		expect(resolveRouteView(['transactional-doctype'], routeToSlugMap)).toBe('records')
	})

	it('resolves transactional form schema for record URLs', () => {
		const doctype = simulateRegisterMeta(['transactional-doctype', '1'], doctypeMap, routeToSlugMap)

		expect(doctype.name).toBe('TransactionalDoctype')
		expect(doctype.fieldLabels).toEqual(['Form Detail'])
		expect(resolveRouteView(['transactional-doctype', '1'], routeToSlugMap)).toBe('record')
	})

	it('resolves singleton form schema at the base URL', () => {
		const doctype = simulateRegisterMeta(['singleton-doctype'], doctypeMap, routeToSlugMap)

		expect(doctype.name).toBe('SingletonDoctype')
		expect(doctype.fieldLabels).toEqual(['Singleton Setting'])
		expect(resolveRouteView(['singleton-doctype'], routeToSlugMap)).toBe('record')
	})

	it('marks singleton record URLs as notFound', () => {
		expect(resolveRouteView(['singleton-doctype', '1'], routeToSlugMap)).toBe('notFound')
	})

	it('resolves standard slug-based doctypes unchanged', () => {
		const doctype = simulateRegisterMeta(['customer'], doctypeMap, routeToSlugMap)

		expect(doctype.name).toBe('Customer')
		expect(resolveRouteView(['customer'], routeToSlugMap)).toBe('records')
		expect(resolveRouteView(['customer', 'CUST-001'], routeToSlugMap)).toBe('record')
	})

	it('throws when registerMeta cannot resolve a slug', () => {
		expect(() => simulateRegisterMeta(['missing-doctype'], doctypeMap, routeToSlugMap)).toThrow(
			'No doctype registered for slug: missing-doctype'
		)
	})
})
