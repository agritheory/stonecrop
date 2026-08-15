import { describe, it, expect } from 'vitest'

import {
	buildRouteToSlugMap,
	resolveDoctypeSlugFromSegments,
	resolveRouteView,
} from '../src/runtime/app/composables/useDoctypeRoutes'

const routeToSlugMap = buildRouteToSlugMap([
	['customer', {}],
	['transactional-doctype-list', { route: '/transactional-doctype' }],
	['transactional-doctype', {}],
	['singleton-doctype', { route: '/singleton-doctype' }],
])

function adapterView(segments: string[]): 'doctypes' | 'records' | 'record' {
	if (!segments.length) return 'doctypes'
	const view = resolveRouteView(segments, routeToSlugMap)
	if (view === 'notFound') return 'records'
	return view
}

function adapterDoctype(segments: string[]): string {
	if (!segments.length) return ''
	return resolveDoctypeSlugFromSegments(segments, routeToSlugMap)
}

function adapterRecordId(segments: string[]): string {
	if (segments.length > 1) return segments[1] ?? ''
	return ''
}

describe('route adapter view selection', { tags: ['unit', 'nuxt'] }, () => {
	it('returns doctypes view for home', () => {
		expect(adapterView([])).toBe('doctypes')
	})

	it('returns records view for standard list URLs', () => {
		expect(adapterView(['customer'])).toBe('records')
		expect(adapterDoctype(['customer'])).toBe('customer')
	})

	it('returns record view for standard record URLs', () => {
		expect(adapterView(['customer', 'CUST-001'])).toBe('record')
		expect(adapterDoctype(['customer', 'CUST-001'])).toBe('customer')
		expect(adapterRecordId(['customer', 'CUST-001'])).toBe('CUST-001')
	})

	it('returns records view for transactional list URLs', () => {
		expect(adapterView(['transactional-doctype'])).toBe('records')
		expect(adapterDoctype(['transactional-doctype'])).toBe('transactional-doctype-list')
	})

	it('returns record view for transactional record URLs', () => {
		expect(adapterView(['transactional-doctype', '1'])).toBe('record')
		expect(adapterDoctype(['transactional-doctype', '1'])).toBe('transactional-doctype')
		expect(adapterRecordId(['transactional-doctype', '1'])).toBe('1')
	})

	it('returns record view for singleton base URLs', () => {
		expect(adapterView(['singleton-doctype'])).toBe('record')
		expect(adapterDoctype(['singleton-doctype'])).toBe('singleton-doctype')
		expect(adapterRecordId(['singleton-doctype'])).toBe('')
	})

	it('detects singleton record URLs as notFound for page-level 404 handling', () => {
		expect(resolveRouteView(['singleton-doctype', '1'], routeToSlugMap)).toBe('notFound')
	})
})
