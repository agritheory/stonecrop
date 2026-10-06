import { nextTick, onMounted, ref, watch, type Ref } from 'vue'

type TableModalDropdownListOptions = {
	panelRef: Readonly<Ref<HTMLElement | null>>
	isOpen: () => boolean
	optionCount: () => number
	selectAt: (index: number) => void
	onClose: () => void
}

/** Keyboard nav + focus for {@link ADropdownList} hosted in {@link ATableModal}. */
export function useTableModalDropdownList(options: TableModalDropdownListOptions) {
	const activeIndex = ref<number | null>(null)

	const focusPanel = () => {
		void nextTick(() => options.panelRef.value?.focus())
	}

	watch(
		() => options.isOpen(),
		open => {
			if (open) {
				activeIndex.value = null
				focusPanel()
			}
		}
	)

	onMounted(() => {
		if (options.isOpen()) focusPanel()
	})

	const onKeydown = (event: KeyboardEvent) => {
		const count = options.optionCount()
		if (!count) return

		if (event.key === 'ArrowDown') {
			event.preventDefault()
			event.stopPropagation()
			if (activeIndex.value != null) {
				activeIndex.value = (activeIndex.value + 1) % count
			} else {
				activeIndex.value = 0
			}
			return
		}

		if (event.key === 'ArrowUp') {
			event.preventDefault()
			event.stopPropagation()
			if (activeIndex.value != null) {
				activeIndex.value = activeIndex.value === 0 ? Math.max(count - 1, 0) : activeIndex.value - 1
			} else {
				activeIndex.value = Math.max(count - 1, 0)
			}
			return
		}

		if (event.key === 'Enter') {
			event.preventDefault()
			event.stopPropagation()
			const index = activeIndex.value ?? 0
			if (index >= 0 && index < count) options.selectAt(index)
			return
		}

		if (event.key === 'Escape') {
			event.preventDefault()
			event.stopPropagation()
			options.onClose()
		}
	}

	const onClickOutside = () => {
		options.onClose()
	}

	return { activeIndex, onKeydown, onClickOutside, focusPanel }
}
