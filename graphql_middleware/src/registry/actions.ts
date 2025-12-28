import type { ActionHandler } from '../types'

const handlerRegistry: Map<string, ActionHandler> = new Map()

export function registerHandler(name: string, handler: ActionHandler): void {
	handlerRegistry.set(name, handler)
}

export function getHandler(name: string): ActionHandler | undefined {
	return handlerRegistry.get(name)
}

export function hasHandler(name: string): boolean {
	return handlerRegistry.has(name)
}

export function clearHandlers(): void {
	handlerRegistry.clear()
}

// Built-in handlers

export const builtinHandlers: Record<string, ActionHandler> = {
	validateRequiredFields: async (args, context) => {
		const [record] = args as [Record<string, unknown>]
		const { doctype } = context

		const missing: string[] = []
		for (const field of doctype.fields) {
			if (field.required && (record[field.fieldname] === undefined || record[field.fieldname] === null)) {
				missing.push(field.label ?? field.fieldname)
			}
		}

		if (missing.length > 0) {
			throw new Error(`Missing required fields: ${missing.join(', ')}`)
		}

		return { valid: true }
	},

	noop: async () => {
		return { ok: true }
	},
}

export function registerBuiltinHandlers(): void {
	for (const [name, handler] of Object.entries(builtinHandlers)) {
		registerHandler(name, handler)
	}
}
