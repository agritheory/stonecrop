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
						<div class="acurrency__currency">
							<AFormLink
								v-model="currency"
								:mode="mode"
								embedded
								:placeholder="currencyLabel"
								:aria-label="currencyLabel"
								:required="required"
								:formatter="currencySymbol"
								:doctype="options.doctype"
								:filter-function="options.filterFunction"
								:is-async="options.isAsync">
								<template #option="{ option }"
									>{{ option.symbol ? `${option.symbol} — ` : '' }}{{ option.displayText ?? option.id }}</template
								>
							</AFormLink>
						</div>
						<div class="acurrency__amount-wrap">
							<input
								:id="uuid"
								v-model.number="amount"
								class="acurrency__amount"
								type="number"
								:disabled="mode === 'read'"
								:required="required"
								@keydown="onAmountKeydown"
								@paste="onAmountPaste" />
							<label class="aform_field-label" :for="uuid">{{ label }}</label>
						</div>
					</div>
				</div>
			</div>
			<div class="acurrency__row acurrency__row--base">
				<div class="acurrency__field acurrency__field--base-currency">
					<input :value="baseCurrencyText" class="aform_input-field acurrency__base-field" type="text" disabled />
					<label class="aform_field-label">{{ baseCurrencyLabel }}</label>
				</div>
				<div class="acurrency__field acurrency__field--base-amount">
					<input
						:value="modelValue.baseAmount"
						class="aform_input-field acurrency__base-field"
						type="number"
						disabled />
					<label class="aform_field-label">{{ baseAmountLabel }}</label>
				</div>
				<div class="acurrency__field acurrency__field--exchange-rate">
					<input
						:value="modelValue.exchangeRate"
						class="aform_input-field acurrency__base-field"
						type="number"
						disabled />
					<label class="aform_field-label">{{ exchangeRateLabel }}</label>
				</div>
			</div>
			<p v-show="validation.errorMessage" class="aform_error" v-html="validation.errorMessage"></p>
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'

import type { AFormLinkValue, ComponentProps, CurrencyOptions, CurrencyValue } from '../../types'
import AFormLink from './AFormLink.vue'

const {
	label,
	required,
	mode,
	uuid,
	validation = { errorMessage: '&nbsp;' },
	options = {},
	currencyLabel = 'Currency',
	baseCurrencyLabel = 'Base Currency',
	baseAmountLabel = 'Base Amount',
	exchangeRateLabel = 'Exchange Rate',
} = defineProps<
	ComponentProps & {
		options?: CurrencyOptions
		currencyLabel?: string
		baseCurrencyLabel?: string
		baseAmountLabel?: string
		exchangeRateLabel?: string
	}
>()

// The merged currency prefix is compact by design, so it shows the symbol rather than the
// full currency name once a value is picked — falls back gracefully when a currency record
// (or the story/app data behind it) doesn't carry a `symbol`.
const currencySymbol = (value: AFormLinkValue): string => value.symbol ?? value.displayText ?? String(value.id)

const modelValue = defineModel<CurrencyValue>({
	default: () => ({
		amount: 0,
		currency: { id: '' },
		baseAmount: 0,
		baseCurrency: { id: '' },
		exchangeRate: 1,
	}),
})

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

const recompute = (amount: number, currencyValue: AFormLinkValue) => {
	const exchangeRate = resolveExchangeRate(currencyValue.id)
	modelValue.value = {
		amount,
		currency: currencyValue,
		exchangeRate,
		baseCurrency: resolvedBaseCurrency.value,
		baseAmount: roundAmount(amount * exchangeRate),
	}
}

const amount = computed({
	get: () => modelValue.value?.amount ?? 0,
	set: (value: number) => recompute(value, modelValue.value?.currency ?? { id: '' }),
})

const currency = computed<AFormLinkValue>({
	get: () => modelValue.value?.currency ?? { id: '' },
	set: (value: AFormLinkValue) => recompute(modelValue.value?.amount ?? 0, value),
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

const showBase = computed(() => {
	const v = modelValue.value
	return !!v?.baseCurrency?.id && (v.currency?.id !== v.baseCurrency?.id || v.amount !== v.baseAmount)
})

const displayText = computed(() => {
	const v = modelValue.value
	if (!v || !v.currency?.id) return '—'
	const currencyText = v.currency.displayText ?? String(v.currency.id)
	const base = `${v.amount} ${currencyText}`
	if (!showBase.value) return base
	const baseText = v.baseCurrency.displayText ?? String(v.baseCurrency.id)
	return `${base} (${v.baseAmount} ${baseText})`
})
</script>

<style scoped>
.acurrency__row {
	display: flex;
	gap: 1ch;
}

.acurrency__row--base {
	margin-top: 1.5rem;
}

.acurrency__field {
	position: relative;
	flex: 1;
	min-width: 0;
}

.acurrency__group {
	display: flex;
	align-items: stretch;
	width: 100%;
	border: 1px solid var(--sc-input-border-color);
	border-radius: 0.25rem;
}

.acurrency__group:focus-within {
	border-color: var(--sc-input-active-border-color);
}

/* Wraps just the amount input so its floating label (`left: 10px` of the nearest
   `position: relative` ancestor, per .aform_field-label) anchors above the amount box
   specifically, not the group's outer left edge — which is now the currency prefix. */
.acurrency__amount-wrap {
	position: relative;
	flex: 1;
	min-width: 0;
}

/* The amount label ("Total") is the primary label for the whole merged group — bumped up
   slightly from the shared .aform_field-label size so it reads as the group's main label. */
.acurrency__amount-wrap .aform_field-label {
	font-size: 0.85rem;
}

.acurrency__amount {
	width: 100%;
	box-sizing: border-box;
	border: none;
	outline: none;
	padding: 0.5ch 1ch;
	background: transparent;
	border-radius: 0 0.25rem 0.25rem 0;
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
   than an equal partner to the amount box: compact width (it shows a symbol once a value is
   picked, not the full name), tinted background, left-rounded to match the group's own
   corner so the tint doesn't overhang the border. The dropdown itself isn't bound by this
   width — see AFormLink's .autocomplete-results — so search results still show full names. */
.acurrency__currency {
	position: relative;
	flex: 0 0 auto;
	min-width: 4.5rem;
	background: var(--sc-gray-5);
	border-right: 1px solid var(--sc-input-border-color);
	border-radius: 0.25rem 0 0 0.25rem;
}

.acurrency__base-field {
	width: 100%;
	box-sizing: border-box;
	font-size: 1rem;
	padding: 0.5ch 1ch;
	border: 1px solid var(--sc-input-border-color);
	border-radius: 0.25rem;
	outline: none;
	appearance: textfield;
	-moz-appearance: textfield;
}

.acurrency__base-field:disabled {
	color: var(--sc-gray-50);
}

/* Base Amount and Exchange Rate are read-only — the number spinner offers nothing here. */
.acurrency__base-field::-webkit-outer-spin-button,
.acurrency__base-field::-webkit-inner-spin-button {
	appearance: none;
	-webkit-appearance: none;
	margin: 0;
}
</style>
