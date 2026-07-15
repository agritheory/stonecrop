import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, it, expect } from 'vitest'
import {
	COMPONENT_CATEGORY,
	COMPONENT_LINK_EXPANSION,
	TYPE_MAP,
	componentCategory,
	componentLinkExpansion,
	validateDoctype,
} from '@stonecrop/schema'

/**
 * Content-integrity gate for every doctype fixture folder this package ships.
 *
 * `playground/doctypes` already has its own generation + dangling-link oracle
 * (`playground-doctypes.test.ts`); the fullstack and templates fixtures had **none** — nothing
 * read them, nothing validated them, and the fullstack server plugin loads them with
 * `continueOnError: true`, so a broken fixture degrades silently at runtime. These checks are
 * the missing oracle: they are what would have caught `component` and `fieldtype` disagreeing.
 */

const FIXTURE_DIRS = [
	{ name: 'fullstack', dir: resolve(__dirname, '../fullstack/doctypes') },
	{ name: 'templates', dir: resolve(__dirname, '../templates') },
	{ name: 'playground', dir: resolve(__dirname, '../playground/doctypes') },
]

/** Component names Stonecrop knows — the canonical set, keyed off schema's own maps. */
const CANONICAL_COMPONENTS = new Set([...Object.keys(COMPONENT_CATEGORY), ...Object.keys(COMPONENT_LINK_EXPANSION)])

type Field = Record<string, unknown>

const loadAll = () =>
	FIXTURE_DIRS.flatMap(({ name, dir }) =>
		readdirSync(dir)
			.filter(f => f.endsWith('.json'))
			.map(file => ({
				file: `${name}/${file}`,
				doctype: JSON.parse(readFileSync(join(dir, file), 'utf-8')) as Record<string, unknown>,
			}))
	)

/** Every `kind: 'field'` entry, flattened through fieldset/table containers. */
const valueFields = (doctype: Record<string, unknown>): Field[] => {
	const out: Field[] = []
	const walk = (fields: unknown) => {
		if (!Array.isArray(fields)) return
		for (const f of fields as Field[]) {
			if (f.kind === undefined || f.kind === 'field') out.push(f)
			walk(f.schema)
			walk(f.columns)
		}
	}
	walk(doctype.fields)
	return out
}

const isLink = (f: Field) => Boolean(f.doctype) || f.fieldtype === 'Link'

describe('doctype fixtures', { tags: ['unit'] }, () => {
	it('every fixture passes schema validation', () => {
		for (const { file, doctype } of loadAll()) {
			const result = validateDoctype(doctype)
			expect(result.success, `${file}: ${JSON.stringify(!result.success && result.errors)}`).toBe(true)
		}
	})

	it('every authored component is a component Stonecrop knows', () => {
		// This catches names Vue cannot resolve, which render nothing at all: the fixtures carried
		// `ACombobox` and `ADatepicker`, neither of which was registered anywhere.
		const unknown: string[] = []
		for (const { file, doctype } of loadAll()) {
			for (const f of valueFields(doctype)) {
				if (typeof f.component === 'string' && !CANONICAL_COMPONENTS.has(f.component)) {
					unknown.push(`${file} :: ${String(f.fieldname)} → ${f.component}`)
				}
			}
		}
		expect(unknown).toEqual([])
	})

	// Migration-period invariant — delete with `fieldtype` in Phase 5.
	//
	// While both axes exist, every consumer prefers `component` and falls back to `fieldtype`. That
	// is only safe when the two agree: where they disagree, the component silently wins and the
	// fieldtype's behaviour (cell format, filter widget, record default) is lost with nothing
	// failing. These fixtures predate `component` mattering to atable, so several carried a lazy
	// `ATextInput` while `fieldtype` did the real work.
	it('every component agrees with its fieldtype', () => {
		const disagreements: string[] = []
		for (const { file, doctype } of loadAll()) {
			for (const f of valueFields(doctype)) {
				if (typeof f.component !== 'string' || typeof f.fieldtype !== 'string') continue
				const where = `${file} :: ${String(f.fieldname)}`

				if (isLink(f)) {
					// Link-ness is carried by `doctype`, not the component (D1b); what the component
					// must be is link-capable, since it decides expand-vs-inline (D1c).
					if (!componentLinkExpansion(f.component)) {
						disagreements.push(`${where} → ${f.component} is not a link component`)
					}
					continue
				}

				const canonical = TYPE_MAP[f.fieldtype as keyof typeof TYPE_MAP]?.component
				if (!canonical) continue
				const got = componentCategory(f.component)
				const want = componentCategory(canonical)
				if (got !== want) {
					disagreements.push(`${where} → ${f.component} (${got}) but fieldtype ${f.fieldtype} implies ${want}`)
				}
			}
		}
		expect(disagreements).toEqual([])
	})
})
