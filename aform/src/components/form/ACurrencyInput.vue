<template>
	<div class="aform_form-element acurrency">
		<template v-if="mode === 'display'">
			<span class="aform_display-value">{{ displayText }}</span>
			<label class="aform_field-label">{{ label }}</label>
		</template>
		<template v-else>
			<div class="acurrency__row">
				<div class="acurrency__field acurrency__field--amount">
					<div class="acurrency__group">
						<div class="acurrency__currency" @click="focusCurrencyPicker">
							<ADropdown
								ref="currencyDropdownRef"
								v-model:link-value="currency"
								embedded
								list-anchor="group"
								:mode="mode"
								:placeholder="currencyLabel"
								:aria-label="currencyLabel"
								:formatter="currencySymbol"
								:doctype="options.doctype"
								:link-filter-function="options.filterFunction"
								:is-async="options.isAsync">
								<template #option="{ option }"
									>{{ option.symbol ? `${option.symbol} — ` : '' }}{{ option.displayText ?? option.id }}</template
								>
							</ADropdown>
						</div>
						<div class="acurrency__amount-wrap">
							<input
								v-if="amountMaskEnabled"
								:id="uuid"
								:value="amountText"
								class="acurrency__amount"
								type="text"
								inputmode="decimal"
								autocomplete="off"
								:disabled="mode === 'read'"
								:required="required"
								:aria-invalid="invalid"
								:aria-describedby="describedBy"
								@focus="onAmountFocus"
								@blur="onAmountBlur"
								@input="onAmountInput"
								@keydown="onAmountKeydownMasked"
								@paste="onAmountPasteMasked" />
							<input
								v-else
								:id="uuid"
								v-model.number="amount"
								class="acurrency__amount"
								type="number"
								:disabled="mode === 'read'"
								:required="required"
								:aria-invalid="invalid"
								:aria-describedby="describedBy"
								@keydown="onAmountKeydown"
								@paste="onAmountPaste" />
						</div>
						<label class="aform_field-label" :for="uuid">{{ label }}</label>
					</div>
				</div>
			</div>
			<p v-show="showBase && !errorText" :id="helperId" class="acurrency__helper">{{ conversionHelperText }}</p>
			<p v-show="errorText" :id="errorId" class="aform_error" role="alert">{{ errorText }}</p>
		</template>
	</div>
</template>

<script setup lang="ts">
import {
	currencyAmountEntryPattern,
	currencyInputFractionDigits,
	formatCurrencyAmount,
	formatCurrencyAmountInput,
	parseCurrencyAmountInput,
} from '@stonecrop/utilities'
import { computed, inject, ref, useTemplateRef, watch } from 'vue'

import type { AFormLinkValue, ComponentProps, CurrencyOptions, CurrencyValue } from '../../types'
import { numberFromBox } from '../../utils/emptiedBox'
import ADropdown from './ADropdown.vue'
import { fieldErrorA11y } from '../../composables/fieldErrorA11y'

const {
	label,
	required,
	mode,
	uuid,
	errors,
	validation = { errorMessage: '' },
	options = {},
	currencyLabel = 'Currency',
} = defineProps<
	ComponentProps & {
		options?: CurrencyOptions
		currencyLabel?: string
	}
>()

// Dynamic trigger errors take precedence over a static schema errorMessage; empty means the slot hides.
const errorText = computed(() => (errors?.length ? errors.join('; ') : (validation.errorMessage ?? '')))
const helperId = computed(() => (uuid ? `${uuid}-helper` : undefined))

const modelValue = defineModel<CurrencyValue | null>({
	default: () => ({
		amount: null,
		currency: { id: '' },
		baseAmount: null,
		baseCurrency: { id: '' },
		exchangeRate: 1,
	}),
})

const showBase = computed(() => {
	const v = modelValue.value
	return !!v?.baseCurrency?.id && (v.currency?.id !== v.baseCurrency?.id || v.amount !== v.baseAmount)
})

const helperDescribedBy = computed(() => (showBase.value && !errorText.value ? helperId.value : undefined))
const { errorId, describedBy, invalid } = fieldErrorA11y(uuid, errorText, helperDescribedBy)

// The merged currency prefix is compact by design, so it shows the symbol rather than the
// full currency name once a value is picked — falls back gracefully when a currency record
// (or the story/app data behind it) doesn't carry a `symbol`.
const currencySymbol = (value: AFormLinkValue): string => value.symbol ?? value.displayText ?? String(value.id)

const currencyDropdownRef = useTemplateRef<{ openCurrencyList?: () => void }>('currencyDropdownRef')

const openCurrencyList = () => {
	currencyDropdownRef.value?.openCurrencyList?.()
}

const focusCurrencyPicker = (event: MouseEvent) => {
	const root = event.currentTarget as HTMLElement
	if ((event.target as HTMLElement).closest('input')) {
		openCurrencyList()
		return
	}
	const input = root.querySelector<HTMLInputElement>('input[role="combobox"]')
	input?.focus()
	openCurrencyList()
}

const amountMaskEnabled = computed(() => options.amountMask !== false)
const amountFocused = ref(false)
const amountText = ref('')

const selectedCurrencyId = computed(() => String(modelValue.value?.currency?.id ?? ''))

const syncAmountTextFromModel = () => {
	amountText.value = formatCurrencyAmountInput(modelValue.value?.amount ?? null, selectedCurrencyId.value)
}

watch(selectedCurrencyId, () => {
	if (!amountFocused.value) syncAmountTextFromModel()
})

watch(
	() => modelValue.value?.amount,
	() => {
		if (!amountFocused.value) syncAmountTextFromModel()
	},
	{ immediate: true }
)

// The base currency is fixed configuration, not user-editable. It may be supplied as a bare id
// (resolved to displayText below via the same `aformLinkResolver` injection AFormLink uses) or
// as a full AFormLinkValue that already carries displayText.
const normalizedBaseCurrency = computed<AFormLinkValue>(() => {
	const base = options.baseCurrency ?? modelValue.value?.baseCurrency
	if (!base) return { id: '' }
	return typeof base === 'string' ? { id: base } : base
})

type ResolverFn = (doctype: string, id: string) => string | undefined | Promise<string | undefined>
const resolver = inject<ResolverFn | null>('aformLinkResolver', null)

const resolvedBaseCurrency = ref<AFormLinkValue>(normalizedBaseCurrency.value)

watch(
	normalizedBaseCurrency,
	async base => {
		if (!base.id || base.displayText || !resolver || !options.doctype) {
			resolvedBaseCurrency.value = base
			return
		}
		try {
			const displayText = await resolver(options.doctype, String(base.id))
			resolvedBaseCurrency.value = displayText ? { ...base, displayText } : base
		} catch {
			resolvedBaseCurrency.value = base
		}
	},
	{ immediate: true }
)

const baseCurrencyText = computed(() => {
	const base = resolvedBaseCurrency.value
	if (!base?.id) return ''
	return base.displayText ?? String(base.id)
})

const resolveExchangeRate = (currencyId: string | number | undefined): number => {
	const baseId = resolvedBaseCurrency.value.id
	if (!currencyId || String(currencyId) === String(baseId)) return 1
	// The rate the value was booked at wins for as long as the currency is unchanged. Rates are
	// time-varying in a way conversion factors are not (see AQuantityInput), so `exchangeRates`
	// carries *today's* rates: preferring it here would silently re-rate a stored line to the
	// current rate on any touch — including the write-back AFormLink does when it resolves the
	// currency's display text, i.e. on mere render.
	if (String(currencyId) === String(modelValue.value?.currency?.id)) {
		return modelValue.value?.exchangeRate ?? options.exchangeRates?.[String(currencyId)] ?? 1
	}
	// Switching to a currency absent from the rate map resets to 1 rather than silently reusing
	// the outgoing currency's rate.
	return options.exchangeRates?.[String(currencyId)] ?? 1
}

// Enough decimal places to shed floating-point noise from the multiplication (e.g. 4 * 1.1 → 4.4
// rather than 4.4000000000000004) without discarding a digit the rate actually produced. Matches
// AQuantityInput's roundQty.
const FLOAT_NOISE_DECIMALS = 6

// How far to round the base amount is the *base currency's* business, and only the app knows what
// that is — so it says so via `precision` (JPY carries 0 decimals, most currencies 2, KWD 3).
// Unset stays deliberately loose rather than defaulting to 2: hard-rounding every currency to
// cents destroys value outright, e.g. 50 IDR at 0.000063 rounds to a base amount of 0. A garbage
// precision (non-integer, negative, or past toFixed's 100 ceiling) falls back rather than throwing
// inside the setter and breaking the field.
const baseDecimals = computed(() => {
	const { precision } = options
	if (precision === undefined) return FLOAT_NOISE_DECIMALS
	return Number.isInteger(precision) && precision >= 0 && precision <= 100 ? precision : FLOAT_NOISE_DECIMALS
})

const roundAmount = (value: number): number => Number(value.toFixed(baseDecimals.value))

const recompute = (amount: number | null, currencyValue: AFormLinkValue) => {
	const exchangeRate = resolveExchangeRate(currencyValue.id)
	modelValue.value = {
		amount,
		currency: currencyValue,
		exchangeRate,
		baseCurrency: resolvedBaseCurrency.value,
		baseAmount: amount === null ? null : roundAmount(amount * exchangeRate),
	}
}

const amount = computed({
	get: () => modelValue.value?.amount ?? null,
	set: (value: number | '') => recompute(numberFromBox(value), modelValue.value?.currency ?? { id: '' }),
})

const currency = computed<AFormLinkValue>({
	get: () => modelValue.value?.currency ?? { id: '' },
	set: (value: AFormLinkValue) => recompute(modelValue.value?.amount ?? null, value),
})

const amountNavigationKeys = new Set([
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

const onAmountKeydown = (event: KeyboardEvent) => {
	if (event.ctrlKey || event.metaKey || event.altKey) return
	if (amountNavigationKeys.has(event.key)) return
	if (/^[0-9]$/.test(event.key)) return
	// A currency amount is signed — credit notes, refunds and adjustments are negative.
	//
	// Both dedup checks below are best-effort: a `type="number"` input reports `value` as `''`
	// whenever its content isn't a valid number, so mid-entry states like "1." or "-" read as
	// empty and a second separator can slip through. The browser rejects the resulting value
	// anyway; this guard exists to stop the obviously-wrong keys (letters, 'e', '+'), not to be
	// the sole arbiter of well-formedness.
	const input = event.target as HTMLInputElement
	if (event.key === '.' && !input.value.includes('.')) return
	if (event.key === '-' && !input.value.includes('-')) return
	event.preventDefault()
}

const onAmountPaste = (event: ClipboardEvent) => {
	const pasted = event.clipboardData?.getData('text') ?? ''
	if (!/^-?\d*\.?\d*$/.test(pasted)) event.preventDefault()
}

const onAmountFocus = (event: FocusEvent) => {
	amountFocused.value = true
	const input = event.target as HTMLInputElement | null
	if (input) requestAnimationFrame(() => input.select())
}

const onAmountBlur = () => {
	amountFocused.value = false
	const parsed = parseCurrencyAmountInput(amountText.value, selectedCurrencyId.value)
	recompute(parsed, modelValue.value?.currency ?? { id: '' })
	syncAmountTextFromModel()
}

const onAmountInput = (event: Event) => {
	const input = event.target as HTMLInputElement
	amountText.value = input.value
	const parsed = parseCurrencyAmountInput(amountText.value, selectedCurrencyId.value)
	if (amountText.value.trim() === '' || amountText.value.trim() === '-' || parsed !== null) {
		recompute(parsed, modelValue.value?.currency ?? { id: '' })
	}
}

const onAmountKeydownMasked = (event: KeyboardEvent) => {
	if (event.ctrlKey || event.metaKey || event.altKey) return
	if (amountNavigationKeys.has(event.key)) return
	if (/^[0-9]$/.test(event.key)) return
	if (event.key === '-') {
		const input = event.target as HTMLInputElement
		if (!input.value.includes('-') && input.selectionStart === 0) return
	}
	if (event.key === '.' || event.key === ',') {
		if (currencyInputFractionDigits(selectedCurrencyId.value) === 0) {
			event.preventDefault()
			return
		}
		const input = event.target as HTMLInputElement
		if (!input.value.includes('.') && !input.value.includes(',')) return
	}
	const pattern = currencyAmountEntryPattern(selectedCurrencyId.value)
	const input = event.target as HTMLInputElement
	const { selectionStart, selectionEnd, value } = input
	if (selectionStart === null || selectionEnd === null) {
		event.preventDefault()
		return
	}
	const next = value.slice(0, selectionStart) + event.key + value.slice(selectionEnd)
	if (event.key.length === 1 && !pattern.test(next)) event.preventDefault()
}

const onAmountPasteMasked = (event: ClipboardEvent) => {
	const pasted = event.clipboardData?.getData('text') ?? ''
	if (!currencyAmountEntryPattern(selectedCurrencyId.value).test(pasted.trim())) event.preventDefault()
}

const conversionHelperText = computed(() => {
	const v = modelValue.value
	if (!v || v.baseAmount === null || v.amount === null) return ''
	const baseLabel = baseCurrencyText.value || String(v.baseCurrency?.id ?? '')
	const enteredId = String(v.currency?.id ?? '')
	const rate = v.exchangeRate
	return `≈ ${formatCurrencyAmount(v.baseAmount, v.baseCurrency)} · 1 ${enteredId} = ${rate} ${baseLabel}`
})

const displayText = computed(() => {
	const v = modelValue.value
	if (!v || !v.currency?.id || v.amount === null) return '—'
	const base = formatCurrencyAmount(v.amount, v.currency)
	if (!showBase.value) return base
	return `${base} (≈ ${formatCurrencyAmount(v.baseAmount, v.baseCurrency)})`
})
</script>

<style scoped>
.acurrency__row {
	display: flex;
	gap: 1ch;
}

.acurrency__field {
	position: relative;
	flex: 1;
	min-width: 0;
}

.acurrency__group {
	position: relative;
	display: flex;
	align-items: stretch;
	box-sizing: border-box;
	width: 100%;
	background: var(--sc-input-field-background);
	border: 1px solid var(--sc-input-border-color);
	border-radius: var(--sc-border-radius);
}

.acurrency__group:focus-within {
	border-color: var(--sc-input-active-border-color);
}

/* Solid form surface behind long labels; the shared gradient only masks the top half and reads
   poorly over the merged prefix + amount backgrounds. Matches the field's page/form parent. */
.acurrency__group > .aform_field-label {
	background: var(--sc-form-background);
}

.acurrency__amount-wrap {
	flex: 1;
	min-width: 0;
}

.acurrency__amount {
	width: 100%;
	box-sizing: border-box;
	border: none;
	outline: none;
	padding: 0.5rem 1ch;
	font-size: 1rem;
	font-family: var(--sc-font-family);
	color: var(--sc-cell-text-color);
	background: transparent;
	border-radius: 0 var(--sc-border-radius) var(--sc-border-radius) 0;
	text-align: right;
	appearance: textfield;
	-moz-appearance: textfield;
}

.acurrency__amount::-webkit-outer-spin-button,
.acurrency__amount::-webkit-inner-spin-button {
	appearance: none;
	-webkit-appearance: none;
	margin: 0;
}

/* The currency picker reads as a simple prefix addon (like Bootstrap's "$" prepend) rather
   than an equal partner to the amount box: fixed compact width (symbol or short code like NZD),
   tinted background, left-rounded to match the group's own
   corner so the tint doesn't overhang the border. The dropdown itself isn't bound by this
   width — ADropdown list spans the group — so search results still show full names. */
.acurrency__currency {
	/* Fixed minimum prefix: 3rem content band + 1ch inset each side (fits NZD without shifting). */
	flex: 0 0 calc(3rem + 2ch);
	width: calc(3rem + 2ch);
	min-width: calc(3rem + 2ch);
	max-width: calc(3rem + 2ch);
	box-sizing: border-box;
	cursor: pointer;
	background: var(--sc-input-addon-background);
	border-right: 1px solid var(--sc-input-border-color);
	border-radius: var(--sc-border-radius) 0 0 var(--sc-border-radius);
}

.acurrency__currency :deep(.aform_input-field--embedded) {
	padding-left: 1ch;
	padding-right: 1ch;
	text-align: right;
}

.acurrency__currency :deep(.aform_form-element--embedded),
.acurrency__currency :deep(.autocomplete) {
	position: static;
}

.acurrency__group :deep(.autocomplete-results--anchor-group) {
	left: -1px;
	right: -1px;
	box-sizing: border-box;
	width: auto;
	min-width: unset;
	max-width: none;
}

.acurrency__helper {
	margin: 0.5rem 0 0;
	font-size: 0.85rem;
	color: var(--sc-cell-text-color);
	opacity: 0.75;
}
</style>
