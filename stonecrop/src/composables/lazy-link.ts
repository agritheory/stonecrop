import type { FetchStrategy, CustomFetch } from '@stonecrop/schema'
import { computed, inject, ref } from 'vue'

import Doctype from '../doctype'
import { Stonecrop } from '../stonecrop'
import type { LazyLink } from '../types/composable'

/**
 * Get the lazy link state for a specific link field on a doctype record.
 *
 * This composable provides reactive state for lazy-loaded links:
 * - `loading`: true while fetching
 * - `loaded`: true after successful fetch (permanent until reload)
 * - `error`: error state if any
 * - `reload()`: explicitly trigger a fetch
 * - `data`: computed from HST, or undefined if not loaded
 *
 * The reload() function respects the link's fetch strategy:
 * - `sync`: fetches via GraphQL query through fetchNestedData
 * - `lazy`: fetches via GraphQL query through fetchNestedData
 * - `custom`: invokes the serialized handler function directly
 *
 * @param doctype - The doctype instance
 * @param recordId - The record ID
 * @param linkFieldname - The link fieldname to load
 * @returns LazyLink with loading, loaded, error, reload, and data
 * @public
 */
export function useLazyLink(doctype: Doctype, recordId: string, linkFieldname: string): LazyLink {
	const stonecropInstance = inject<Stonecrop>('$stonecrop') || Stonecrop._root

	if (!stonecropInstance) {
		throw new Error('Stonecrop instance not available. Ensure useStonecrop() has been called first.')
	}

	const loading = ref(false)
	const loaded = ref(false)
	const error = ref<Error | null>(null)

	const hstStore = stonecropInstance.getStore()

	/**
	 * Build the HST path for a lazy link field
	 */
	const getLinkPath = (): string => {
		const slug = doctype.slug || doctype.doctype
		return `${slug}.${recordId}.${linkFieldname}`
	}

	/**
	 * Get the link declaration from the doctype schema
	 */
	const getLinkDeclaration = (): FetchStrategy | undefined => {
		return doctype.links?.[linkFieldname]?.fetch
	}

	/**
	 * Invoke a custom fetch handler
	 * The handler is a serialized function string that we execute via new Function()
	 */
	const invokeCustomHandler = async (handler: CustomFetch['handler']): Promise<any> => {
		try {
			// Create function from serialized string and invoke it
			// The function receives the stonecrop instance and path as parameters
			// eslint-disable-next-line @typescript-eslint/no-implied-eval
			const fn = new Function(
				'stonecrop',
				'path',
				'hst',
				`
				return (${handler})(stonecrop, path, hst)
			`
			)
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			return await fn(stonecropInstance, getLinkPath(), hstStore)
		} catch (err) {
			throw new Error(`Custom handler failed: ${err instanceof Error ? err.message : String(err)}`)
		}
	}

	/**
	 * Fetch the link data using the appropriate strategy
	 */
	const fetchLinkData = async (): Promise<void> => {
		const linkFetch = getLinkDeclaration()
		const ancestorPath = `${doctype.slug || doctype.doctype}.${recordId}`

		if (linkFetch?.method === 'custom') {
			// Ensure ancestor path exists before invoking custom handler
			if (!hstStore.has(ancestorPath)) {
				hstStore.set(ancestorPath, {}, 'system')
			}

			// Custom handler - invoke directly
			const result = await invokeCustomHandler(linkFetch.handler)

			// Store result in HST at the link path
			hstStore.set(getLinkPath(), result, 'system')
		} else {
			// sync or lazy (both use fetchNestedData but with different includeNested)
			// For lazy links, we still use fetchNestedData but only for this specific link
			await stonecropInstance.fetchNestedData(ancestorPath, doctype, recordId, { includeNested: [linkFieldname] })
		}
	}

	/**
	 * Explicitly reload the lazy link data
	 */
	const reload = async (): Promise<void> => {
		if (loading.value) return

		loading.value = true
		error.value = null

		try {
			await fetchLinkData()
			loaded.value = true
		} catch (err) {
			error.value = err instanceof Error ? err : new Error(String(err))
			throw err
		} finally {
			loading.value = false
		}
	}

	/**
	 * Computed property that returns the loaded data from HST
	 */
	const data = computed(() => {
		if (!loaded.value) return undefined
		return hstStore.get(getLinkPath())
	})

	return {
		// State
		loading,
		loaded,
		error,

		// Computed
		data,

		// Actions
		reload,
	}
}
