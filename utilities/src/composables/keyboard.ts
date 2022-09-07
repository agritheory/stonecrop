import { onMounted, onUnmounted } from 'vue'

import { KeyboardHandlerConfig, KeyboardNavigationOptions, KeypressHandlers } from 'types'

const getUpCell = (event: KeyboardEvent) => {
	const target = event.target as HTMLElement
	let $upCell: HTMLElement | undefined
	if (target instanceof HTMLTableCellElement) {
		const $prevRow = target.parentElement?.previousElementSibling
		if ($prevRow) {
			const $prevRowCells = Array.from($prevRow.children)
			const $prevCell = $prevRowCells[target.cellIndex] as HTMLElement
			if ($prevCell) {
				$upCell = $prevCell
			}
		}
	} else {
		// TODO: handle other contexts
	}
	return $upCell
}

const getDownCell = (event: KeyboardEvent) => {
	const target = event.target as HTMLElement
	let $downCell: HTMLElement | undefined
	if (target instanceof HTMLTableCellElement) {
		const $nextRow = target.parentElement?.nextElementSibling
		if ($nextRow) {
			const $nextRowCells = Array.from($nextRow.children)
			const $nextCell = $nextRowCells[target.cellIndex] as HTMLElement
			if ($nextCell) {
				$downCell = $nextCell
			}
		}
	} else {
		// TODO: handle other contexts
	}
	return $downCell
}

const getPrevCell = (event: KeyboardEvent) => {
	const target = event.target as HTMLElement
	let $prevCell: HTMLElement | undefined
	if (target.previousElementSibling) {
		$prevCell = target.previousElementSibling as HTMLElement
	} else {
		const $prevRow = target.parentElement?.previousElementSibling
		if ($prevRow) {
			const $prevRowCells = Array.from($prevRow.children)
			$prevRowCells.reverse()
			$prevCell = $prevRowCells[0] as HTMLElement
		}
	}
	return $prevCell
}

const getNextCell = (event: KeyboardEvent) => {
	const target = event.target as HTMLElement
	let $nextCell: HTMLElement | undefined
	if (target.nextElementSibling) {
		$nextCell = target.nextElementSibling as HTMLElement
	} else {
		const $nextRow = target.parentElement?.nextElementSibling
		if ($nextRow) {
			const $nextRowCells = Array.from($nextRow.children)
			$nextCell = $nextRowCells[0] as HTMLElement
		}
	}
	return $nextCell
}

const getFirstCell = (event: KeyboardEvent) => {
	const target = event.target as HTMLElement
	const $parent = target.parentElement
	const $firstCell = $parent.firstElementChild as HTMLElement | null
	return $firstCell
}

const getLastCell = (event: KeyboardEvent) => {
	const target = event.target as HTMLElement
	const $parent = target.parentElement
	const $lastCell = $parent.lastElementChild as HTMLElement | null
	return $lastCell
}

export const defaultKeypressHandlers: KeypressHandlers = {
	ArrowUp: {
		listener: (event: KeyboardEvent) => {
			if (event.key === 'ArrowUp') {
				const $upCell = getUpCell(event)
				if ($upCell) {
					event.preventDefault()
					event.stopPropagation()
					$upCell.focus()
				}
			}
		},
	},
	ArrowDown: {
		listener: (event: KeyboardEvent) => {
			if (event.key === 'ArrowDown') {
				const $downCell = getDownCell(event)
				if ($downCell) {
					event.preventDefault()
					event.stopPropagation()
					$downCell.focus()
				}
			}
		},
	},
	ArrowLeft: {
		listener: (event: KeyboardEvent) => {
			if (event.key === 'ArrowLeft') {
				const $prevCell = getPrevCell(event)
				if ($prevCell) {
					event.preventDefault()
					event.stopPropagation()
					$prevCell.focus()
				}
			}
		},
	},
	ArrowRight: {
		listener: (event: KeyboardEvent) => {
			if (event.key === 'ArrowRight') {
				const $nextCell = getNextCell(event)
				if ($nextCell) {
					event.preventDefault()
					event.stopPropagation()
					$nextCell.focus()
				}
			}
		},
	},
	End: {
		listener: (event: KeyboardEvent) => {
			if (event.key === 'End') {
				const $lastCell = getLastCell(event)
				if ($lastCell) {
					event.preventDefault()
					event.stopPropagation()
					$lastCell.focus()
				}
			}
		},
	},
	Enter: {
		listener: (event: KeyboardEvent) => {
			if (event.key === 'Enter') {
				const target = event.target as HTMLElement
				if (target instanceof HTMLTableCellElement) {
					let $navCell: HTMLElement | undefined
					if (event.shiftKey) {
						$navCell = getUpCell(event)
					} else {
						$navCell = getDownCell(event)
					}

					if ($navCell) {
						event.preventDefault()
						event.stopPropagation()
						$navCell.focus()
					}
				} else {
					// TODO: handle other contexts
				}
			}
		},
	},
	Home: {
		listener: (event: KeyboardEvent) => {
			if (event.key === 'Home') {
				const $firstCell = getFirstCell(event)
				if ($firstCell) {
					event.preventDefault()
					event.stopPropagation()
					$firstCell.focus()
				}
			}
		},
	},
	Tab: {
		listener: (event: KeyboardEvent) => {
			if (event.key === 'Tab') {
				let $navCell: HTMLElement | undefined
				if (event.shiftKey) {
					$navCell = getPrevCell(event)
				} else {
					$navCell = getNextCell(event)
				}

				if ($navCell) {
					event.preventDefault()
					event.stopPropagation()
					$navCell.focus()
				}
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

	const getEventListener = (key: string, config: KeyboardHandlerConfig) => {
		let eventListener: KeyboardHandlerConfig['listener'], eventOptions: KeyboardHandlerConfig['options']

		if (config.listener) {
			eventListener = config.listener
			eventOptions = config.options
		} else {
			const eventMap: KeyboardHandlerConfig | undefined = defaultKeypressHandlers[key]
			if (eventMap) {
				if (!eventMap.listener) {
					throw new Error(`Missing default event listener for keypress: '${key}'`)
				}

				eventListener = eventMap.listener
				eventOptions = eventMap.options
			} else {
				throw new Error(`Missing default event map for keypress: '${key}'`)
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

			for (const [key, config] of Object.entries(option.handlers)) {
				const { eventListener, eventOptions } = getEventListener(key, config)
				for (const element of selectors) {
					element.addEventListener('keydown', eventListener, eventOptions)
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

			for (const [key, config] of Object.entries(option.handlers)) {
				const { eventListener, eventOptions } = getEventListener(key, config)
				for (const element of selectors) {
					element.removeEventListener('keydown', eventListener, eventOptions)
				}
			}
		}
	})
}
