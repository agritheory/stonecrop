import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, basename } from 'node:path'

import type { DoctypeMeta } from '../types'

const doctypeRegistry: Map<string, DoctypeMeta> = new Map()

export function loadDoctypes(dir: string): void {
	const entries = readdirSync(dir)

	for (const entry of entries) {
		const fullPath = join(dir, entry)
		const stat = statSync(fullPath)

		if (stat.isDirectory()) {
			loadDoctypes(fullPath)
		} else if (entry.endsWith('.json')) {
			const content = readFileSync(fullPath, 'utf-8')
			const doctype: DoctypeMeta = JSON.parse(content)

			if (!doctype.name) {
				throw new Error(`Doctype at ${fullPath} missing required 'name' field`)
			}

			doctypeRegistry.set(doctype.name, doctype)
		}
	}
}

export function loadDoctypesFromObject(doctypes: Record<string, DoctypeMeta>): void {
	for (const [name, doctype] of Object.entries(doctypes)) {
		doctypeRegistry.set(name, { ...doctype, name })
	}
}

export function getMeta(name: string): DoctypeMeta | undefined {
	return doctypeRegistry.get(name)
}

export function getAllMeta(): DoctypeMeta[] {
	return Array.from(doctypeRegistry.values())
}

export function hasMeta(name: string): boolean {
	return doctypeRegistry.has(name)
}

export function clearRegistry(): void {
	doctypeRegistry.clear()
}
