import { onMounted, onUnmounted } from 'vue'

import { KeyboardHandlerConfig, KeyboardHandlerOptions, KeyboardNavigationOptions, KeypressHandlers } from 'types'

export const defaultKeyboardEvents: KeypressHandlers = {
	ArrowUp: (event: KeyboardEvent) => {
		const target = event.target as HTMLElement

		let $navCell: HTMLElement | undefined
		if (target instanceof HTMLTableCellElement) {
			const $prevRow = target.parentElement?.previousElementSibling
			if ($prevRow) {
				const $prevRowCells = Array.from($prevRow.children)
				const $prevCell = $prevRowCells[target.cellIndex] as HTMLElement
				if ($prevCell) {
					$navCell = $prevCell
				}
			}
		} else {
			// TODO: handle other contexts
		}

		if ($navCell) {
			event.preventDefault()
			event.stopPropagation()
			$navCell.focus()
		}
	},
	ArrowDown: (event: KeyboardEvent) => {
		const target = event.target as HTMLElement

		let $navCell: HTMLElement | undefined
		if (target instanceof HTMLTableCellElement) {
			const $nextRow = target.parentElement?.nextElementSibling
			if ($nextRow) {
				const $nextRowCells = Array.from($nextRow.children)
				const $nextCell = $nextRowCells[target.cellIndex] as HTMLElement
				if ($nextCell) {
					$navCell = $nextCell
				}
			}
		} else {
			// TODO: handle other contexts
		}

		if ($navCell) {
			event.preventDefault()
			event.stopPropagation()
			$navCell.focus()
		}
	},
	ArrowLeft: (event: KeyboardEvent) => {
		const target = event.target as HTMLElement
		const $prevCell = target.previousElementSibling as HTMLElement
		if ($prevCell) {
			event.preventDefault()
			event.stopPropagation()
			$prevCell.focus()
		}
	},
	ArrowRight: (event: KeyboardEvent) => {
		const target = event.target as HTMLElement
		const $nextCell = target.nextElementSibling as HTMLElement
		if ($nextCell) {
			event.preventDefault()
			event.stopPropagation()
			$nextCell.focus()
		}
	},
	End: (event: KeyboardEvent) => {
		const target = event.target as HTMLElement
		const $parent = target.parentElement
		const $navCell = $parent.lastElementChild as HTMLElement | null
		if ($navCell) {
			event.preventDefault()
			event.stopPropagation()
			$navCell.focus()
		}
	},
	Enter: (event: KeyboardEvent) => {
		const target = event.target as HTMLElement
		if (target instanceof HTMLTableCellElement) {
			if (event.shiftKey) {
				const handler = defaultKeyboardEvents['ArrowUp']
				if (handler) {
					handler(event)
				}
			} else {
				const handler = defaultKeyboardEvents['ArrowDown']
				if (handler) {
					handler(event)
				}
			}
		} else {
			// TODO: handle other contexts
		}
	},
	Home: (event: KeyboardEvent) => {
		const target = event.target as HTMLElement
		const $parent = target.parentElement
		const $navCell = $parent.firstElementChild as HTMLElement | null
		if ($navCell) {
			event.preventDefault()
			event.stopPropagation()
			$navCell.focus()
		}
	},
	Tab: (event: KeyboardEvent) => {
		const target = event.target as HTMLElement

		let $navCell: HTMLElement | undefined
		if (event.shiftKey) {
			const $prevCell = target.previousElementSibling as HTMLElement
			if ($prevCell) {
				$navCell = $prevCell
			} else {
				const $prevRow = target.parentElement?.previousElementSibling
				if ($prevRow) {
					const $prevRowCells = Array.from($prevRow.children)
					$prevRowCells.reverse()
					$navCell = $prevRowCells[0] as HTMLElement
				}
			}
		} else {
			const $nextCell = target.nextElementSibling as HTMLElement
			if ($nextCell) {
				$navCell = $nextCell
			} else {
				const $nextRow = target.parentElement?.nextElementSibling
				if ($nextRow) {
					const $nextRowCells = Array.from($nextRow.children)
					$navCell = $nextRowCells[0] as HTMLElement
				}
			}
		}

		if ($navCell) {
			event.preventDefault()
			event.stopPropagation()
			$navCell.focus()
		}
	},
}

export const defaultEventMap: KeyboardHandlerOptions = {
	focus: {
		listener: (event: FocusEvent) => {
			const target = event.target as HTMLElement
			target.tabIndex = 0
		},
	},
	blur: {
		listener: (event: FocusEvent) => {
			const target = event.target as HTMLElement
			target.tabIndex = -1
		},
	},
	keydown: {
		listener: (event: KeyboardEvent) => {
			const handler = defaultKeyboardEvents[event.key]
			if (handler) {
				handler(event)
			}
		},
	},
}

export function useKeyboardNav(options: KeyboardNavigationOptions[]) {
	const getSelectors = (option: KeyboardNavigationOptions) => {
		// get parent element
		let $parent: Element | null = null
		if (option.parent) {
			if (typeof option.parent === 'string') {
				$parent = document.querySelector(option.parent)
			} else if (option.parent instanceof Element) {
				$parent = option.parent
			} else {
				$parent = option.parent.value
			}
		}

		// generate a list of selector(s)
		let selectors: Element[] = []

		if (option.selectors) {
			if (typeof option.selectors === 'string') {
				selectors = $parent
					? Array.from($parent.querySelectorAll(option.selectors))
					: Array.from(document.querySelectorAll(option.selectors))
			} else if (option.selectors instanceof Element) {
				selectors.push(option.selectors)
			} else {
				if (Array.isArray(option.selectors.value)) {
					for (const element of option.selectors.value) {
						if (element instanceof Element) {
							selectors.push(element)
						} else {
							selectors.push(element.$el as Element)
						}
					}
				} else {
					selectors.push(option.selectors.value)
				}
			}
		} else {
			// TODO: get all visible elements under parent DOM tree
		}

		return selectors
	}

	const getEventListener = (event: string, config: KeyboardHandlerConfig) => {
		let eventListener: KeyboardHandlerConfig['listener'], eventOptions: KeyboardHandlerConfig['options']
		if (config.default !== true) {
			if (!config.listener) {
				throw new Error(`Missing listener for event: '${event}'`)
			}

			eventListener = config.listener
			eventOptions = config.options
		} else {
			const eventMap: KeyboardHandlerConfig | undefined = defaultEventMap[event]
			if (eventMap) {
				if (!eventMap.listener) {
					throw new Error(`Missing default event listener for event: '${event}'`)
				}

				eventListener = eventMap.listener
				eventOptions = eventMap.options
			} else {
				throw new Error(`Missing default event map for event: '${event}'`)
			}
		}

		return { eventListener, eventOptions }
	}

	onMounted(() => {
		for (const option of options) {
			const selectors = getSelectors(option)
			if (selectors.length === 0) {
				continue
			}

			for (const [event, config] of Object.entries(option.handlers)) {
				const { eventListener, eventOptions } = getEventListener(event, config)
				for (const element of selectors) {
					element.addEventListener(event, eventListener, eventOptions)
				}
			}
		}
	})

	onUnmounted(() => {
		for (const option of options) {
			const selectors = getSelectors(option)
			if (selectors.length === 0) {
				continue
			}

			for (const [event, config] of Object.entries(option.handlers)) {
				const { eventListener, eventOptions } = getEventListener(event, config)
				for (const element of selectors) {
					element.removeEventListener(event, eventListener, eventOptions)
				}
			}
		}
	})
}
