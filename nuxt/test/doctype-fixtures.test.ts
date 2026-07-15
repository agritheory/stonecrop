import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, it, expect } from 'vitest'
import { CANONICAL_COMPONENTS, componentLinkExpansion, validateDoctype } from '@stonecrop/schema'

/**
 * Content-integrity gate for every doctype fixture folder this package ships.
 *
 * `playground/doctypes` has its own generation + dangling-link oracle (`playground-doctypes.test.ts`);
 * the fullstack and templates fixtures had none — nothing read them, nothing validated them, and the
 * fullstack server plugin loads them with `continueOnError: true`, so a broken fixture degrades
 * silently at runtime with nothing failing.
 */

const FIXTURE_DIRS = [
	{ name: 'fullstack', dir: resolve(__dirname, '../fullstack/doctypes') },
	{ name: 'templates', dir: resolve(__dirname, '../templates') },
	{ name: 'playground', dir: resolve(__dirname, '../playground/doctypes') },
]

/** Component names Stonecrop knows — schema owns the list; the docbuilder suggests the same one. */
const KNOWN_COMPONENTS = new Set(CANONICAL_COMPONENTS)

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

/**
 * Mirrors the loader's structural kind inference (`schema/src/field.ts`): authored JSON may omit
 * `kind`, in which case a `schema` key means fieldset and `columns` means table. Treating a
 * kind-less container as a value field would flag its `AFieldset`/`ATable` component as unknown.
 */
const kindOf = (f: Field): string =>
	(f.kind as string) ?? ('schema' in f ? 'fieldset' : 'columns' in f ? 'table' : 'field')

/** Every value field, flattened through fieldset/table containers. */
const valueFields = (doctype: Record<string, unknown>): Field[] => {
	const out: Field[] = []
	const walk = (fields: unknown) => {
		if (!Array.isArray(fields)) return
		for (const f of fields as Field[]) {
			if (kindOf(f) === 'field') out.push(f)
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
				if (typeof f.component === 'string' && !KNOWN_COMPONENTS.has(f.component)) {
					unknown.push(`${file} :: ${String(f.fieldname)} → ${f.component}`)
				}
			}
		}
		expect(unknown).toEqual([])
	})

	it('every field carries a component', () => {
		// `component` is the primary axis — a field without one has nothing to render it once the
		// legacy `fieldtype` derivation is gone.
		const missing: string[] = []
		for (const { file, doctype } of loadAll()) {
			for (const f of valueFields(doctype)) {
				if (typeof f.component !== 'string') missing.push(`${file} :: ${String(f.fieldname)}`)
			}
		}
		expect(missing).toEqual([])
	})

	it('no fixture carries the legacy fieldtype axis', () => {
		// `component` is the only field axis. Once `fieldtype` leaves the Zod shape it is silently
		// stripped rather than rejected, so the guard against it creeping back has to live on the data.
		const stragglers: string[] = []
		for (const { file, doctype } of loadAll()) {
			for (const f of valueFields(doctype)) {
				if (f.fieldtype !== undefined) stragglers.push(`${file} :: ${String(f.fieldname)} → ${String(f.fieldtype)}`)
			}
		}
		expect(stragglers).toEqual([])
	})

	it('every link field uses a link-capable component', () => {
		// Link-ness is carried by `doctype`; the component decides whether the target is expanded, so an
		// unmapped component on a link silently falls through to the cardinality default.
		const bad: string[] = []
		for (const { file, doctype } of loadAll()) {
			const declaredLinks = Object.values((doctype.links ?? {}) as Record<string, { fieldname?: string }>)
			for (const f of valueFields(doctype)) {
				if (!isLink(f)) continue
				if (typeof f.component === 'string' && !componentLinkExpansion(f.component)) {
					bad.push(`${file} :: ${String(f.fieldname)} → ${f.component}`)
				}
			}
			// A declared link that names a field must name one that exists: the resolver iterates
			// fields, so a declaration pointing at a missing field is inert and never resolves.
			for (const link of declaredLinks) {
				if (!link.fieldname) continue
				if (!valueFields(doctype).some(f => f.fieldname === link.fieldname)) {
					bad.push(`${file} :: links → "${link.fieldname}" has no matching field`)
				}
			}
		}
		expect(bad).toEqual([])
	})
})
