import { readFileSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'

import { parseDoctype } from '@stonecrop/schema'
import type { DoctypeConfig } from '@stonecrop/stonecrop'
import { describe, it, expect } from 'vitest'

import { buildDoctypeRoutes } from '../src/runtime/app/composables/useDoctypeRoutes'

const FIXTURE_DIR = resolve(__dirname, 'fixtures/route-key/doctypes')

function filenameToSlug(filename: string): string {
	return filename
		.replace(/([a-z])([A-Z])/g, '$1-$2')
		.replace(/[\s_]+/g, '-')
		.toLowerCase()
}

/**
 * Loads the fixture doctypes through the real schema parser, so a `route` the schema would reject
 * cannot reach the resolver here and pass. The two packages enforce one rule between them, and
 * this is where they are checked against the same files.
 */
function loadFixtureDoctypes() {
	const doctypeMap = new Map<string, DoctypeConfig>()

	for (const file of readdirSync(FIXTURE_DIR).filter(name => name.endsWith('.json'))) {
		const slug = filenameToSlug(file.replace('.json', ''))
		const parsed = parseDoctype(JSON.parse(readFileSync(join(FIXTURE_DIR, file), 'utf-8')))
		doctypeMap.set(slug, parsed as DoctypeConfig)
	}

	return { doctypeMap, routes: buildDoctypeRoutes(doctypeMap) }
}

describe('route-key fixtures', { tags: ['unit', 'nuxt'] }, () => {
	const { doctypeMap, routes } = loadFixtureDoctypes()

	/** What `registerMeta` does with a URL: resolve it, then take that doctype's field labels. */
	const labelsAt = (segments: string[]) => {
		const { slug } = routes.resolve(segments)
		return doctypeMap.get(slug)?.fields?.map(field => field.label) ?? []
	}

	it('serves the curated list schema at the projected URL', () => {
		expect(routes.resolve(['transactional-doctype'])).toMatchObject({
			view: 'records',
			slug: 'transactional-doctype-list',
		})
		expect(labelsAt(['transactional-doctype'])).toEqual(['List Column'])
	})

	it('serves the full form schema at the record URL of the same path', () => {
		expect(routes.resolve(['transactional-doctype', '1'])).toMatchObject({
			view: 'record',
			slug: 'transactional-doctype',
			recordId: '1',
		})
		expect(labelsAt(['transactional-doctype', '1'])).toEqual(['Form Detail'])
	})

	it('serves a singleton at its base path and nothing below it', () => {
		expect(routes.resolve(['singleton-doctype'])).toMatchObject({ view: 'record', slug: 'singleton-doctype' })
		expect(labelsAt(['singleton-doctype'])).toEqual(['Singleton Setting'])
		expect(routes.resolve(['singleton-doctype', '1']).view).toBe('notFound')
	})

	it('serves both views of an aliased doctype under its alias', () => {
		expect(routes.resolve(['aliased'])).toMatchObject({ view: 'records', slug: 'aliased-doctype' })
		expect(routes.resolve(['aliased', 'A-1'])).toMatchObject({
			view: 'record',
			slug: 'aliased-doctype',
			recordId: 'A-1',
		})
		expect(routes.resolve(['aliased-doctype']).view).toBe('notFound')
	})

	it('leaves a doctype declaring neither key on its slug path', () => {
		expect(routes.resolve(['customer'])).toMatchObject({ view: 'records', slug: 'customer' })
		expect(routes.resolve(['customer', 'CUST-001'])).toMatchObject({ view: 'record', slug: 'customer' })
	})

	it('404s a URL no fixture declares', () => {
		expect(routes.resolve(['missing-doctype']).view).toBe('notFound')
		expect(routes.resolve(['missing-doctype']).slug).toBe('')
	})
})
