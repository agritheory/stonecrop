import type { AFormLinkModelValue, AFormLinkValue } from '../types'

export function linkId(value: AFormLinkModelValue | null | undefined): string | undefined {
	if (value == null) return undefined
	if (typeof value === 'string') return value === '' ? undefined : value
	if (typeof value === 'number') return String(value)
	const id = value.id
	if (id === null || id === undefined || id === '') return undefined
	return String(id)
}

export function linkDisplayText(value: AFormLinkModelValue | null | undefined): string | undefined {
	if (value == null || typeof value !== 'object') return undefined
	const text = value.displayText
	if (typeof text === 'string') return text
	if (typeof text === 'number') return String(text)
	return undefined
}

export function asLinkValue(value: AFormLinkModelValue | null | undefined): AFormLinkValue {
	if (value != null && typeof value === 'object') return value
	const id = linkId(value)
	return id !== undefined ? { id } : { id: '' }
}
