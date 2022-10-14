import { ComponentOptions } from 'vue'
import { Router } from 'vue-router'

import { SchemaTypes } from '@agritheory/aform/types'

export type Meta = {
	schema: SchemaTypes[] | (() => SchemaTypes[] | Promise<SchemaTypes[]>)
	events: any // TODO: new Machine()
	hooks: Record<string, any>
}

export type Schema = {
	doctype: string
	schema: SchemaTypes[]
}

export type InstallOptions = {
	components: Record<string, ComponentOptions>
	router: Router
	schemaLoader: (doctype?: string) => Schema | Promise<Schema>
}
