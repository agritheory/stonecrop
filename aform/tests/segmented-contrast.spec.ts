import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/*
The selected segment has to read as selected in the default theme: lighter than its track, as on
development (white on gray-5), at no less contrast than that, and on a track that is not simply the
form colour. Colours are resolved through the token floor, so a palette change is caught too.
*/

const FLOOR = join(__dirname, '..', '..', 'themes', 'default', 'default.css')
const SFC = join(__dirname, '..', 'src', 'components', 'form', 'ASegmentedControl.vue')

const withoutComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '')

const tokens = new Map(
	Array.from(withoutComments(readFileSync(FLOOR, 'utf8')).matchAll(/^\s*(--sc-[a-zA-Z0-9-]+)\s*:\s*([^;]+);/gm), m => [
		m[1],
		m[2].trim(),
	])
)

const resolve = (value: string): string => {
	const reference = /^var\(\s*(--sc-[a-zA-Z0-9-]+)\s*\)$/.exec(value)
	if (!reference) return value
	const next = tokens.get(reference[1])
	expect(next, `${reference[1]} is not on the floor`).toBeDefined()
	return resolve(next!)
}

/** The background a rule with exactly this selector declares, resolved to a colour. */
const background = (selector: string): string => {
	const css = withoutComments(readFileSync(SFC, 'utf8'))
	const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	const rule = new RegExp(`(?:^|\\})\\s*${escaped}\\s*\\{([^}]*)\\}`, 'm').exec(css)
	expect(rule, `no rule "${selector}"`).not.toBeNull()
	const declared = /(?:^|;)\s*background\s*:\s*([^;]+)/.exec(rule![1])
	expect(declared, `"${selector}" declares no background`).not.toBeNull()
	return resolve(declared![1].trim())
}

const luminance = (hex: string): number => {
	expect(hex).toMatch(/^#[0-9a-f]{6}$/i)
	const [r, g, b] = [1, 3, 5].map(i => {
		const channel = parseInt(hex.slice(i, i + 2), 16) / 255
		return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
	})
	return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const contrast = (a: string, b: string) => {
	const [light, dark] = [luminance(a), luminance(b)].toSorted((x, y) => y - x)
	return (light + 0.05) / (dark + 0.05)
}

describe('segmented control selection contrast', { tags: ['unit'] }, () => {
	const track = background('.aform_segmented-track')
	const selected = background(
		'.aform_segmented-segment:not(.aform_segmented-segment--badge):has(.aform_segmented-input:checked)'
	)

	it('keeps the track distinct from the form it sits on', () => {
		expect(track).not.toBe(resolve('var(--sc-form-background)'))
	})

	it('shows the selected segment lighter than its track', () => {
		expect(luminance(selected)).toBeGreaterThan(luminance(track))
	})

	it("separates the selected segment from its track at least as well as development's white on gray-5", () => {
		expect(contrast(selected, track)).toBeGreaterThanOrEqual(contrast('#ffffff', '#f2f2f2'))
	})
})
