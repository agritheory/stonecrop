import { describe, it, expect } from 'vitest'
import {
	CANONICAL_COMPONENTS,
	componentCategory,
	COMPONENT_CATEGORY,
	COMPONENT_LINK_EXPANSION,
	componentLinkExpansion,
	resolveLinkRenderMode,
} from '../src/component-meta'

describe('component-meta', { tags: ['unit'] }, () => {
	it('categorizes the canonical components', () => {
		expect(componentCategory('ATextInput')).toBe('text')
		expect(componentCategory('ATextarea')).toBe('text')
		expect(componentCategory('ANumericInput')).toBe('number')
		expect(componentCategory('ACheckbox')).toBe('boolean')
		expect(componentCategory('ADate')).toBe('date')
		expect(componentCategory('ADateTime')).toBe('datetime')
		expect(componentCategory('ADropdown')).toBe('select')
		expect(componentCategory('ACodeEditor')).toBe('code')
		expect(componentCategory('AFormLink')).toBe('link')
	})

	it('categorizes the date components that previously had no category', () => {
		// The component is the only thing that says what a field means, so an uncategorised
		// `ADatePicker` (e.g. Task.json.dueDate) would silently lose its date formatting.
		expect(componentCategory('ADatePicker')).toBe('date')
		expect(componentCategory('ADateSelection')).toBe('date')
	})

	it('returns undefined for unknown or absent components (so callers can fall back)', () => {
		expect(componentCategory('ASomethingCustom')).toBeUndefined()
		expect(componentCategory(undefined)).toBeUndefined()
		expect(componentCategory('')).toBeUndefined()
	})

	it('every canonical component maps to a category via the public helper', () => {
		for (const name of Object.keys(COMPONENT_CATEGORY)) {
			expect(componentCategory(name)).toBe(COMPONENT_CATEGORY[name])
		}
	})
})

describe('componentLinkExpansion', { tags: ['unit'] }, () => {
	it('maps the inline pair and the expanding pair', () => {
		expect(componentLinkExpansion('AFormLink')).toBe('inline')
		expect(componentLinkExpansion('AForm')).toBe('expand')
		expect(componentLinkExpansion('ATable')).toBe('expand')
	})

	it('returns undefined for unmapped or absent components (so callers can fall back)', () => {
		expect(componentLinkExpansion('MyCustomLink')).toBeUndefined()
		expect(componentLinkExpansion('ATextInput')).toBeUndefined()
		expect(componentLinkExpansion(undefined)).toBeUndefined()
	})
})

describe('resolveLinkRenderMode', { tags: ['unit'] }, () => {
	it('lets the component decide inline vs expand', () => {
		expect(resolveLinkRenderMode({ component: 'AFormLink', cardinality: 'one' })).toBe('inline')
		expect(resolveLinkRenderMode({ component: 'AForm', cardinality: 'one' })).toBe('record')
		expect(resolveLinkRenderMode({ component: 'ATable', cardinality: 'noneOrMany' })).toBe('table')
	})

	it('takes the component from the field when the declaration names none', () => {
		expect(resolveLinkRenderMode({ cardinality: 'noneOrMany' }, 'AFormLink')).toBe('inline')
		expect(resolveLinkRenderMode({ cardinality: 'one' }, 'AForm')).toBe('record')
	})

	it('prefers the declaration component over the field component', () => {
		expect(resolveLinkRenderMode({ component: 'AFormLink', cardinality: 'one' }, 'AForm')).toBe('inline')
		expect(resolveLinkRenderMode({ component: 'AForm', cardinality: 'one' }, 'AFormLink')).toBe('record')
	})

	it('lets cardinality — not the component — choose record vs table when expanding', () => {
		// `cardinality` states whether the value is a scalar or an array. That is a fact about the
		// data, so an expanding component must not override it: `AForm` over a many link would be
		// handed an array it cannot render. Only the inline/expand half of the name is honoured.
		expect(resolveLinkRenderMode({ component: 'AForm', cardinality: 'noneOrMany' })).toBe('table')
		expect(resolveLinkRenderMode({ component: 'ATable', cardinality: 'one' })).toBe('record')
	})

	it('treats an absent or unmapped component as expanding, then defers to cardinality', () => {
		expect(resolveLinkRenderMode({ cardinality: 'noneOrMany' })).toBe('table')
		expect(resolveLinkRenderMode({ cardinality: 'atLeastOne' })).toBe('table')
		expect(resolveLinkRenderMode({ cardinality: 'one' })).toBe('record')
		expect(resolveLinkRenderMode({ cardinality: 'atMostOne' })).toBe('record')
		// an unmapped custom component must never silently collapse a link to a picker
		expect(resolveLinkRenderMode({ component: 'MyCustomTable', cardinality: 'noneOrMany' })).toBe('table')
	})
})

describe('CANONICAL_COMPONENTS', { tags: ['unit'] }, () => {
	it('is the union of both maps, deduplicated and sorted', () => {
		const expected = [...new Set([...Object.keys(COMPONENT_CATEGORY), ...Object.keys(COMPONENT_LINK_EXPANSION)])]
		expect(CANONICAL_COMPONENTS.toSorted()).toEqual(expected.toSorted())
		expect([...CANONICAL_COMPONENTS]).toEqual(CANONICAL_COMPONENTS.toSorted())
		expect(new Set(CANONICAL_COMPONENTS).size).toBe(CANONICAL_COMPONENTS.length)
	})

	it('covers every link render mode an author can pick', () => {
		// The docbuilder suggests this list, and the component is what decides whether a link
		// expands (see resolveLinkRenderMode). If the expanding pair fell out, a link could only
		// ever be authored as an inline picker.
		expect(CANONICAL_COMPONENTS).toContain('AFormLink')
		expect(CANONICAL_COMPONENTS).toContain('AForm')
		expect(CANONICAL_COMPONENTS).toContain('ATable')
	})

	it('omits AFieldset, which is a container rather than a value field component', () => {
		expect(CANONICAL_COMPONENTS).not.toContain('AFieldset')
	})
})
