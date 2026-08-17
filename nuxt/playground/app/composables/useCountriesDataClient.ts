import type {
	DataClient,
	DoctypeContext,
	DoctypeMeta,
	DoctypeRef,
	GetRecordResult,
	GetRecordsResult,
} from '@stonecrop/schema'

/**
 * A `DataClient` over the public countries GraphQL API.
 *
 * This is the seam a host implements to say *how* to reach its backend. Stonecrop decides when to
 * read and where the result lands; everything backend-shaped lives here. Nothing about that seam
 * assumes Stonecrop's own GraphQL contract — this API is a third party with a completely different
 * schema, which is the point: it is what makes the adapter boundary real rather than nominal.
 *
 * Playground previously fetched from the page's `@load-records` / `@load-record` handlers, which
 * meant re-deriving how to key a row every time. Every one of those rules now lives once, upstream.
 */

// The API's ID scalar generates as `string | number`
type DoctypeRecord = { code: string | number }

const LIST_LOADERS: Record<string, () => Promise<readonly DoctypeRecord[]>> = {
	country: async () => (await useGraphqlQuery('Countries', {})).data?.countries ?? [],
	continent: async () => (await useGraphqlQuery('Continents', {})).data?.continents ?? [],
	language: async () => (await useGraphqlQuery('Languages', {})).data?.languages ?? [],
}

const DETAIL_LOADERS: Record<string, (code: string) => Promise<DoctypeRecord | null>> = {
	country: async code => (await useGraphqlQuery('Country', { code })).data?.country ?? null,
	continent: async code => (await useGraphqlQuery('Continent', { code })).data?.continent ?? null,
	language: async code => (await useGraphqlQuery('Language', { code })).data?.language ?? null,
}

/** Loaders are keyed by slug; a `DoctypeRef` carries the canonical name, so fall back to it. */
const loaderKey = (doctype: DoctypeRef): string => (doctype.slug ?? doctype.name).toLowerCase()

export class CountriesDataClient implements DataClient {
	/**
	 * Metadata does not come from this client. Playground's doctypes are local JSON, resolved by
	 * the `registerMeta` callback in the same plugin that registers this — so nothing routes a meta
	 * lookup here.
	 *
	 * It rejects rather than answering `null`, which would claim the doctype does not exist, and
	 * rather than converting the local `DoctypeConfig`: that type admits a raw XState machine for
	 * `workflow`, which `DoctypeMeta` cannot represent, so the conversion would quietly drop it.
	 */
	getMeta(context: DoctypeContext): Promise<DoctypeMeta | null> {
		return Promise.reject(
			new Error(
				`CountriesDataClient serves records only; "${context.doctype}" metadata comes from local JSON via registerMeta.`
			)
		)
	}

	async getRecords(doctype: DoctypeRef): Promise<GetRecordsResult> {
		const load = LIST_LOADERS[loaderKey(doctype)]
		if (!load) {
			// The docbuilder sample fixtures (issue, assignment, user) model authoring only and have
			// no data source at all. An empty list is the honest answer; a throw would read as an
			// outage on a doctype that was never backed by anything.
			console.info(`[playground] "${doctype.name}" has no GraphQL data source — it is a docbuilder sample doctype`)
			return { data: [], hasMore: false }
		}
		// The countries API paginates nothing — every query returns the full collection.
		return { data: [...(await load())] as Record<string, unknown>[], hasMore: false }
	}

	async getRecord(doctype: DoctypeRef, recordId: string): Promise<GetRecordResult> {
		const load = DETAIL_LOADERS[loaderKey(doctype)]
		if (!load) return { record: null }
		return { record: (await load(recordId)) as Record<string, unknown> | null }
	}

	runAction(doctype: DoctypeRef, action: string): Promise<{ success: boolean; data: unknown; error: string | null }> {
		// The countries API is read-only, so this reports rather than pretends. Answering
		// `success: true` would let a Save look like it persisted.
		return Promise.resolve({
			success: false,
			data: null,
			error: `The countries API is read-only — cannot run "${action}" on ${doctype.name}.`,
		})
	}
}
