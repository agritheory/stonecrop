import type {
	DataClient,
	DoctypeContext,
	DoctypeMeta,
	DoctypeRef,
	GetRecordOptions,
	GetRecordResult,
	GetRecordsOptions,
	GetRecordsResult,
} from '@stonecrop/schema'

export class RestDataClient implements DataClient {
	async getMeta(context: DoctypeContext): Promise<DoctypeMeta | null> {
		const route = context.recordId ? `/${context.doctype}/${context.recordId}` : `/${context.doctype}`
		const response = await fetch(`/api/meta?route=${encodeURIComponent(route)}`)
		if (!response.ok) return null
		return response.json() as Promise<DoctypeMeta>
	}

	async getRecord(doctype: DoctypeRef, recordId: string, _options?: GetRecordOptions): Promise<GetRecordResult> {
		const response = await fetch(`/api/${doctype.slug}/${recordId}`)
		if (!response.ok) return { record: null }
		const data = (await response.json()) as Record<string, unknown>
		return { record: data }
	}

	async getRecords(doctype: DoctypeRef, _options?: GetRecordsOptions): Promise<GetRecordsResult> {
		const response = await fetch(`/api/${doctype.slug}`)
		if (!response.ok) return { data: [], hasMore: false }
		const data = (await response.json()) as Record<string, unknown>[]
		// This endpoint takes no limit and returns the whole collection, so the page is the set.
		// `count` is left absent rather than set to data.length: the caller did not ask for a
		// total, and answering one anyway is what made a truncated list look complete elsewhere.
		return { data, hasMore: false }
	}

	async runAction(
		doctype: DoctypeRef,
		action: string,
		args?: unknown[]
	): Promise<{ success: boolean; data: unknown; error: string | null }> {
		const [recordId, data] = args ?? []
		if (!recordId) return { success: false, data: null, error: 'recordId required' }

		const response = await fetch(`/api/${doctype.slug}/${recordId as string}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ action, ...(data as Record<string, unknown>) }),
		})

		if (!response.ok) return { success: false, data: null, error: response.statusText }
		return response.json() as Promise<{ success: boolean; data: unknown; error: string | null }>
	}
}
