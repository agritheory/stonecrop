import { describe, expect, it } from 'vitest'
import { effectScope, ref } from 'vue'

import { useArithmeticInput, type ArithmeticInputOptions } from '../src/composables/arithmeticInput'

// A box over a model, as a form field binds one: each commit lands in `model`, and `commits` records them.
const setup = (initial: unknown, options: Partial<ArithmeticInputOptions> = {}) => {
	const model = ref<unknown>(initial)
	const commits: (number | null)[] = []
	const scope = effectScope()
	const box = scope.run(() =>
		useArithmeticInput({
			value: () => model.value,
			commit: value => {
				commits.push(value)
				model.value = value
			},
			...options,
		})
	)!
	return { box, model, commits }
}

describe('useArithmeticInput', () => {
	it('shows the model in the box', () => {
		expect(setup(40).box.text.value).toBe('40')
		expect(setup(null).box.text.value).toBe('')
	})

	it('commits nothing when the box is focused and left as it was', () => {
		const { box, commits } = setup(40)
		box.begin()
		box.end()
		expect(commits).toEqual([])
	})

	it('commits nothing for a value a record hands over as text', () => {
		const { box, commits, model } = setup('40')
		expect(box.text.value).toBe('40')
		box.begin()
		box.settle()
		box.end()
		expect(commits).toEqual([])
		expect(model.value).toBe('40')
	})

	// 9007199254740993 is past 2^53: as a number it can't be held exactly, and a commit would round it.
	it('leaves a value too large for a number untouched unless it is edited', () => {
		const { box, commits, model } = setup('9007199254740993')
		box.begin()
		box.end()
		expect(commits).toEqual([])
		expect(model.value).toBe('9007199254740993')
	})

	it('commits each well-formed result as it is typed, and settles the box to the result', () => {
		const { box, commits } = setup(5)
		box.begin()
		box.update('12*3')
		box.update('12*3+')
		box.update('12*3+4')
		expect(commits).toEqual([36, 40])
		expect(box.text.value).toBe('12*3+4')
		box.end()
		expect(box.text.value).toBe('40')
		expect(commits).toEqual([36, 40])
	})

	it('commits the original number when the text is typed back to it after a commit', () => {
		const { box, commits } = setup(4)
		box.begin()
		box.update('40')
		box.update('4')
		box.end()
		expect(commits).toEqual([40, 4])
	})

	it('commits only once the box settles when not live', () => {
		const { box, commits } = setup(5, { live: false })
		box.begin()
		box.update('2*3')
		expect(commits).toEqual([])
		box.settle()
		expect(commits).toEqual([6])
	})

	it('leaves the model at its last number for an unfinished expression', () => {
		const { box, commits } = setup(5)
		box.begin()
		box.update('12*')
		box.end()
		expect(commits).toEqual([])
		expect(box.text.value).toBe('5')
	})

	it('commits null once the box is emptied', () => {
		const { box, commits } = setup(5)
		box.begin()
		box.update('')
		box.end()
		expect(commits).toEqual([null])
	})

	it('rounds a result before committing it', () => {
		const { box, commits } = setup(1, {
			round: n => Number(n.toFixed(2)),
			format: n => (n === null ? '' : n.toFixed(2)),
		})
		box.begin()
		box.update('10/3')
		box.end()
		expect(commits).toEqual([3.33])
		expect(box.text.value).toBe('3.33')
	})

	it('rebases: text set this way is no edit', () => {
		const { box, commits } = setup(1000, { live: false })
		box.begin('1,000')
		box.settle()
		expect(commits).toEqual([])
	})

	it('leaves the text alone while disabled', () => {
		const text = ref('as typed')
		const { model } = setup(5, { text, enabled: () => false })
		model.value = 6
		expect(text.value).toBe('as typed')
	})

	it('accepts arithmetic and a leading = only', () => {
		const { box } = setup(0)
		expect(box.accepts('=12*3')).toBe(true)
		expect(box.accepts('12=3')).toBe(false)
		expect(box.accepts('1e3')).toBe(false)
	})
})
