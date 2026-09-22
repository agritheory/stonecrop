import { describe, expect, it, vi } from 'vitest'

import { useDocBuilderRouteAdapter } from '../src/runtime/app/composables/useDocBuilderRouteAdapter'

const push = vi.fn()

vi.mock('nuxt/app', () => ({
	useRoute: () => ({ params: { doctype: 'task' } }),
	useRouter: () => ({ push }),
}))

describe('useDocBuilderRouteAdapter', { tags: ['nuxt'] }, () => {
	it('navigates to every view Desktop can ask for', () => {
		const adapter = useDocBuilderRouteAdapter()

		adapter.navigate({ view: 'doctypes' })
		adapter.navigate({ view: 'records', doctype: 'task' })
		adapter.navigate({ view: 'record', doctype: 'task', recordId: 'new' })

		expect(push.mock.calls.map(call => call[0])).toEqual(['/', '/task', '/task/new'])
	})

	it('reads the doctype being edited from the route', () => {
		expect(useDocBuilderRouteAdapter().getCurrentDoctype()).toBe('task')
	})
})
