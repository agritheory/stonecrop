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
							:aria-invalid="invalid"
							:aria-describedby="describedBy"
							@keydown="onQtyKeydown"
							@paste="onQtyPaste" />
						<div class="aquantity__uom">
							<ADropdown
								v-model="uom"
								embedded
								trigger="button"
								list-anchor="group"
								:options="uoms"
								:mode="mode"
								:uuid="`${uuid}-uom`"
								:aria-label="uomLabel"
								:placeholder="uomLabel" />
						</div>
						<label class="aform_field-label" :for="uuid">{{ label }}</label>
					</div>
				</div>
			</div>
			<p v-if="showStock && !errorText" :id="helperId" class="aquantity__helper">{{ conversionHelperText }}</p>
			<p v-show="errorText" :id="errorId" class="aform_error" role="alert">{{ errorText }}</p>
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { fieldErrorA11y } from '../../composables/fieldErrorA11y'
import type { ComponentProps, QuantityOptions, QuantityValue } from '../../types'
import { numberFromBox } from '../../utils/emptiedBox'
import { patchQuantityQty, patchQuantityUom } from '../../utils/quantityValue'
import ADropdown from './ADropdown.vue'

const {
	label,
	required,
	mode,
	uuid,
	errors,
	validation = { errorMessage: '' },
	options = {},
	uomLabel = 'UOM',
} = defineProps<
	ComponentProps & {
		options?: QuantityOptions
		uomLabel?: string
	}
>()

// Dynamic trigger errors take precedence over a static schema errorMessage; empty means the slot hides.
const errorText = computed(() => (errors?.length ? errors.join('; ') : (validation.errorMessage ?? '')))
const helperId = computed(() => (uuid ? `${uuid}-helper` : undefined))
const helperDescribedBy = computed(() => (showStock.value && !errorText.value ? helperId.value : undefined))
const { errorId, describedBy, invalid } = fieldErrorA11y(uuid, errorText, helperDescribedBy)

const modelValue = defineModel<QuantityValue | null>({
	default: () => ({ qty: null, uom: '', stockQty: null, stockUom: '', conversionFactor: 1 }),
})

const uoms = computed(() => options.uoms ?? [])

const qty = computed({
	get: () => modelValue.value?.qty ?? null,
	set: (value: number | '') => (modelValue.value = patchQuantityQty(modelValue.value, numberFromBox(value), options)),
})

const uom = computed({
	get: () => modelValue.value?.uom ?? '',
	set: (value: string) => (modelValue.value = patchQuantityUom(modelValue.value, value, options)),
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
	// Quantity is signed — returns, adjustments, and credit lines can be negative.
	const input = event.target as HTMLInputElement
	if (event.key === '.' && !input.value.includes('.')) return
	if (event.key === '-' && !input.value.includes('-')) return
	event.preventDefault()
}

const onQtyPaste = (event: ClipboardEvent) => {
	const pasted = event.clipboardData?.getData('text') ?? ''
	if (!/^-?\d*\.?\d*$/.test(pasted)) event.preventDefault()
}

const showStock = computed(() => {
	const v = modelValue.value
	return !!v?.stockUom && (v.uom !== v.stockUom || v.qty !== v.stockQty)
})

const conversionHelperText = computed(() => {
	const v = modelValue.value
	if (!v || v.stockQty === null || v.qty === null) return ''
	const factor = v.conversionFactor
	return `= ${v.stockQty} ${v.stockUom} · 1 ${v.uom} = ${factor} ${v.stockUom}`
})

const displayText = computed(() => {
	const v = modelValue.value
	if (!v || !v.uom || v.qty === null) return '—'
	const base = `${v.qty} ${v.uom}`
	return showStock.value ? `${base} (${v.stockQty} ${v.stockUom})` : base
})
</script>

<style scoped>
.aquantity__row {
	display: flex;
	gap: 1ch;
}

.aquantity__field {
	position: relative;
	flex: 1;
	min-width: 0;
}

.aquantity__group {
	position: relative;
	display: flex;
	align-items: stretch;
	box-sizing: border-box;
	width: 100%;
	background: var(--sc-input-field-background);
	border: 1px solid var(--sc-input-border-color);
	border-radius: var(--sc-border-radius);
}

.aquantity__group:focus-within {
	border-color: var(--sc-input-active-border-color);
}

.aquantity__group > .aform_field-label {
	background: var(--sc-form-background);
}

/* Focus ring lives on the merged group only (see AForm :focus-within label + group border). */
.aquantity__group :deep(.aform_dropdown-button:focus),
.aquantity__group :deep(.aform_dropdown-button:focus-visible) {
	outline: none;
	box-shadow: none;
}

.aquantity__qty {
	flex: 1 1 50%;
	min-width: 0;
	border: none;
	outline: none;
	padding: 0.5rem 1ch;
	font-size: 1rem;
	font-family: var(--sc-font-family);
	color: var(--sc-cell-text-color);
	text-align: right;
	background: transparent;
	border-radius: var(--sc-border-radius) 0 0 var(--sc-border-radius);
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
	position: static;
	flex: 1 1 50%;
	min-width: 0;
	display: flex;
	align-items: stretch;
	border-left: 1px solid var(--sc-input-border-color);
}

/* ADropdown list: anchor to merged group, not the UOM trigger column (see dropdowns.browser.spec). */
.aquantity__group :deep(.aform_form-element--embedded),
.aquantity__group :deep(.autocomplete) {
	position: static;
	align-self: stretch;
}

.aquantity__group :deep(.autocomplete-results--anchor-group) {
	left: -1px;
	right: -1px;
	box-sizing: border-box;
	width: auto;
	min-width: unset;
	max-width: none;
}

.aquantity__helper {
	margin: 0.5rem 0 0;
	font-size: 0.85rem;
	color: var(--sc-cell-text-color);
	opacity: 0.75;
}
</style>
