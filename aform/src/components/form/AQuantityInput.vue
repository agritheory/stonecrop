<template>
	<div class="aform_form-element aquantity">
		<template v-if="mode === 'display'">
			<span class="aform_display-value">{{ displayText }}</span>
			<label class="aform_field-label">{{ label }}</label>
		</template>
		<template v-else>
			<div class="aquantity__row">
				<div class="aquantity__field aquantity__field--qty">
					<div class="aquantity__group">
						<input
							:id="uuid"
							v-model.number="qty"
							class="aquantity__qty"
							type="number"
							:disabled="mode === 'read'"
							:required="required"
							@keydown="onQtyKeydown"
							@paste="onQtyPaste" />
						<div v-on-click-outside="closeDropdown" class="aquantity__uom">
							<button
								:id="`${uuid}-uom`"
								type="button"
								class="aquantity__uom-toggle"
								:disabled="mode === 'read'"
								aria-haspopup="listbox"
								:aria-expanded="dropdown.open"
								:aria-activedescendant="
									dropdown.open && dropdown.activeIndex >= 0 ? `${uuid}-uom-opt-${dropdown.activeIndex}` : undefined
								"
								@click="toggleDropdown"
								@keydown.down.prevent="moveActive(1)"
								@keydown.up.prevent="moveActive(-1)"
								@keydown.enter.prevent="selectActive"
								@keydown.esc="closeDropdown">
								<span class="aquantity__uom-value">{{ uom || uomLabel }}</span>
								<span class="aquantity__caret" aria-hidden="true"></span>
							</button>
							<ul v-show="dropdown.open" class="aquantity__uom-menu" role="listbox" :aria-label="uomLabel">
								<li
									v-for="(option, i) in uoms"
									:id="`${uuid}-uom-opt-${i}`"
									:key="option"
									role="option"
									:aria-selected="option === uom"
									class="aquantity__uom-option"
									:class="{ 'is-active': i === dropdown.activeIndex }"
									@mouseenter="dropdown.activeIndex = i"
									@click="selectUom(option)">
									{{ option }}
								</li>
							</ul>
						</div>
					</div>
					<label class="aform_field-label" :for="uuid">{{ label }}</label>
				</div>
			</div>
			<div class="aquantity__row aquantity__row--stock">
				<div class="aquantity__field aquantity__field--stock-uom">
					<input :value="modelValue.stockUom" class="aform_input-field aquantity__stock-field" type="text" disabled />
					<label class="aform_field-label">{{ stockUomLabel }}</label>
				</div>
				<div class="aquantity__field aquantity__field--stock-qty">
					<input :value="modelValue.stockQty" class="aform_input-field aquantity__stock-field" type="number" disabled />
					<label class="aform_field-label">{{ stockQtyLabel }}</label>
				</div>
				<div class="aquantity__field aquantity__field--conversion">
					<input
						:value="modelValue.conversionFactor"
						class="aform_input-field aquantity__stock-field"
						type="number"
						disabled />
					<label class="aform_field-label">{{ conversionFactorLabel }}</label>
				</div>
			</div>
			<p v-show="validation.errorMessage" class="aform_error" v-html="validation.errorMessage"></p>
		</template>
	</div>
</template>

<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components'
import { computed, reactive } from 'vue'

import type { ComponentProps, QuantityOptions, QuantityValue } from '../../types'

const {
	label,
	required,
	mode,
	uuid,
	validation = { errorMessage: '&nbsp;' },
	options = {},
	uomLabel = 'UOM',
	stockUomLabel = 'Stock UOM',
	stockQtyLabel = 'Stock Qty',
	conversionFactorLabel = 'Conversion Factor',
} = defineProps<
	ComponentProps & {
		options?: QuantityOptions
		uomLabel?: string
		stockUomLabel?: string
		stockQtyLabel?: string
		conversionFactorLabel?: string
	}
>()

const modelValue = defineModel<QuantityValue>({
	default: () => ({ qty: 0, uom: '', stockQty: 0, stockUom: '', conversionFactor: 1 }),
})

const uoms = computed(() => options.uoms ?? [])

// Round to shed binary floating-point noise (e.g. 0.1 * 3 → 0.30000000000000004) while
// preserving any legitimate decimal places.
const roundQty = (value: number): number => Number(value.toFixed(6))

const resolveConversionFactor = (uom: string): number => {
	const stockUom = options.stockUom ?? modelValue.value.stockUom
	if (!uom || uom === stockUom) return 1
	const mapped = options.conversionFactors?.[uom]
	if (mapped !== undefined) return mapped
	// UOM absent from the conversion map: keep the stored factor only when the unit is
	// unchanged (e.g. editing qty on a loaded value, so the factor round-trips). Switching
	// to a new, unmapped unit resets to 1 rather than silently reusing the previous factor.
	if (uom === modelValue.value.uom) return modelValue.value.conversionFactor ?? 1
	return 1
}

const recompute = (qty: number, uom: string) => {
	const conversionFactor = resolveConversionFactor(uom)
	modelValue.value = {
		qty,
		uom,
		conversionFactor,
		stockUom: options.stockUom ?? modelValue.value.stockUom,
		stockQty: roundQty(qty * conversionFactor),
	}
}

const qty = computed({
	get: () => modelValue.value?.qty ?? 0,
	set: (value: number) => recompute(value, modelValue.value?.uom ?? ''),
})

const uom = computed({
	get: () => modelValue.value?.uom ?? '',
	set: (value: string) => recompute(modelValue.value?.qty ?? 0, value),
})

const qtyNavigationKeys = new Set([
	'Backspace',
	'Delete',
	'Tab',
	'Escape',
	'Enter',
	'ArrowLeft',
	'ArrowRight',
	'ArrowUp',
	'ArrowDown',
	'Home',
	'End',
])

const onQtyKeydown = (event: KeyboardEvent) => {
	if (event.ctrlKey || event.metaKey || event.altKey) return
	if (qtyNavigationKeys.has(event.key)) return
	if (/^[0-9]$/.test(event.key)) return
	const input = event.target as HTMLInputElement
	if (event.key === '.' && !input.value.includes('.')) return
	event.preventDefault()
}

const onQtyPaste = (event: ClipboardEvent) => {
	const pasted = event.clipboardData?.getData('text') ?? ''
	if (!/^\d*\.?\d*$/.test(pasted)) event.preventDefault()
}

const dropdown = reactive({ open: false, activeIndex: -1 })

const openDropdown = () => {
	dropdown.activeIndex = Math.max(uoms.value.indexOf(uom.value), 0)
	dropdown.open = true
}

const closeDropdown = () => {
	dropdown.open = false
}

const toggleDropdown = () => {
	if (dropdown.open) closeDropdown()
	else openDropdown()
}

const selectUom = (value: string) => {
	uom.value = value
	closeDropdown()
}

const moveActive = (delta: number) => {
	if (!dropdown.open) {
		openDropdown()
		return
	}
	const length = uoms.value.length
	if (!length) return
	dropdown.activeIndex = (dropdown.activeIndex + delta + length) % length
}

const selectActive = () => {
	if (!dropdown.open) {
		openDropdown()
		return
	}
	const option = uoms.value[dropdown.activeIndex]
	if (option !== undefined) selectUom(option)
}

const showStock = computed(() => {
	const v = modelValue.value
	return !!v?.stockUom && (v.uom !== v.stockUom || v.qty !== v.stockQty)
})

const displayText = computed(() => {
	const v = modelValue.value
	if (!v || !v.uom) return '—'
	const base = `${v.qty} ${v.uom}`
	return showStock.value ? `${base} (${v.stockQty} ${v.stockUom})` : base
})
</script>

<style scoped>
.aquantity__row {
	display: flex;
	gap: 1ch;
}

.aquantity__row--stock {
	margin-top: 1.5rem;
}

.aquantity__field {
	position: relative;
	flex: 1;
	min-width: 0;
}

.aquantity__group {
	display: flex;
	align-items: stretch;
	width: 100%;
	border: 1px solid var(--sc-input-border-color);
	border-radius: 0.25rem;
}

.aquantity__group:focus-within {
	border-color: var(--sc-input-active-border-color);
}

.aquantity__qty {
	flex: 1;
	min-width: 0;
	border: none;
	outline: none;
	padding: 0.5ch 1ch;
	background: transparent;
	border-radius: 0.25rem 0 0 0.25rem;
	appearance: textfield;
	-moz-appearance: textfield;
}

.aquantity__qty::-webkit-outer-spin-button,
.aquantity__qty::-webkit-inner-spin-button {
	appearance: none;
	-webkit-appearance: none;
	margin: 0;
}

.aquantity__uom {
	position: relative;
	flex: 0 0 auto;
	border-left: 1px solid var(--sc-input-border-color);
}

.aquantity__uom-toggle {
	display: flex;
	align-items: center;
	gap: 0.75ch;
	height: 100%;
	padding: 0.5ch 1ch;
	background: var(--sc-gray-5);
	border: none;
	border-radius: 0 0.25rem 0.25rem 0;
	white-space: nowrap;
	cursor: pointer;
}

.aquantity__uom-toggle:disabled {
	cursor: not-allowed;
	color: var(--sc-gray-50);
}

.aquantity__caret {
	display: inline-block;
	width: 0;
	height: 0;
	border-left: 0.3em solid transparent;
	border-right: 0.3em solid transparent;
	border-top: 0.3em solid currentColor;
}

.aquantity__uom-menu {
	position: absolute;
	top: 100%;
	right: 0;
	z-index: 100;
	min-width: 100%;
	margin: 0.15rem 0 0 0;
	padding: 0.25rem 0;
	list-style: none;
	background: var(--sc-input-field-background);
	border: 1px solid var(--sc-input-active-border-color);
	border-radius: 0.25rem;
}

.aquantity__uom-option {
	padding: 0.4ch 1ch;
	white-space: nowrap;
	cursor: pointer;
}

.aquantity__uom-option.is-active,
.aquantity__uom-option:hover {
	background-color: var(--sc-row-color-zebra-light);
}

.aquantity__stock-field {
	width: 100%;
	font-size: 1rem;
	padding: 0.5ch 1ch;
	border: 1px solid var(--sc-input-border-color);
	border-radius: 0.25rem;
	outline: none;
}

.aquantity__stock-field:disabled {
	color: var(--sc-gray-50);
}
</style>
