import { Router } from 'vue-router'

import { SchemaTypes } from '@agritheory/aform/types'

export type Schema = {
	doctype: string
	schema: SchemaTypes
}

export type InstallOptions = {
	router: Router
	schemaLoader: (doctype?: string) => Schema
}
