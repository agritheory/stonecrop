import { ComponentOptions } from 'vue'
import { Router } from 'vue-router'

import { SchemaTypes } from '@agritheory/aform/types'

export type Schema = {
	doctype: string
	schema: SchemaTypes[]
}

export type InstallOptions = {
	components: Record<string, ComponentOptions>
	router: Router
	schemaLoader: (doctype?: string) => Schema | Promise<Schema>
}
