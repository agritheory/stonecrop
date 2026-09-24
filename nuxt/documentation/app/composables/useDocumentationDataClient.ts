import { StonecropClient } from '@stonecrop/graphql-client'
import type {
	DataClient,
	DoctypeContext,
	DoctypeMeta,
	DoctypeRef,
	GetRecordResult,
	GetRecordsResult,
} from '@stonecrop/schema'

import { CountriesDataClient } from '~/composables/useCountriesDataClient'

const countriesClient = new CountriesDataClient()
const grafservClient = new StonecropClient({
	endpoint: '/graphql/',
})

const COUNTRIES_ROUTE_SLUGS = new Set([
	'country',
	'continent',
	'language',
	'state',
	'subdivision',
	'issue',
	'assignment',
])

function slugFor(doctype: DoctypeRef): string {
	return (doctype.slug ?? doctype.name).toLowerCase()
}

function clientForSlug(slug: string): DataClient {
	return COUNTRIES_ROUTE_SLUGS.has(slug) ? countriesClient : grafservClient
}

function clientFor(doctype: DoctypeRef): DataClient {
	return clientForSlug(slugFor(doctype))
}

export class DocumentationDataClient implements DataClient {
	getMeta(context: DoctypeContext): Promise<DoctypeMeta | null> {
		return clientForSlug(context.doctype.toLowerCase()).getMeta(context)
	}

	getRecords(doctype: DoctypeRef): Promise<GetRecordsResult> {
		return clientFor(doctype).getRecords(doctype)
	}

	getRecord(doctype: DoctypeRef, recordId: string): Promise<GetRecordResult> {
		return clientFor(doctype).getRecord(doctype, recordId)
	}

	runAction(doctype: DoctypeRef, action: string): Promise<{ success: boolean; data: unknown; error: string | null }> {
		return clientFor(doctype).runAction(doctype, action)
	}
}
