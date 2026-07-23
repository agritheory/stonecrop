<template>
	<div class="aform_form-element acurrency">
		<template v-if="mode === 'display'">
			<span class="aform_display-value">{{ displayText }}</span>
			<label class="aform_field-label">{{ label }}</label>
		</template>
		<template v-else>
			<div class="acurrency__row">
				<div class="acurrency__field acurrency__field--amount">
					<input
						:id="uuid"
						v-model.number="amount"
						class="aform_input-field acurrency__amount"
						type="number"
						:disabled="mode === 'read'"
						:required="required"
						@keydown="onAmountKeydown"
						@paste="onAmountPaste" />
					<label class="aform_field-label" :for="uuid">{{ label }}</label>
				</div>
				<div class="acurrency__field acurrency__field--currency">
					<AFormLink
						v-model="currency"
						:mode="mode"
						:label="currencyLabel"
						:doctype="options.doctype"
						:filter-function="options.filterFunction"
						:is-async="options.isAsync" />
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

const modelValue = defineModel<CurrencyValue>({
	default: {
		amount: 0,
		currency: { id: '' },
		baseAmount: 0,
		baseCurrency: { id: '' },
		exchangeRate: 1,
	},
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
	return options.exchangeRates?.[String(currencyId)] ?? modelValue.value?.exchangeRate ?? 1
}

const recompute = (amount: number, currencyValue: AFormLinkValue) => {
	const exchangeRate = resolveExchangeRate(currencyValue.id)
	modelValue.value = {
		amount,
		currency: currencyValue,
		exchangeRate,
		baseCurrency: resolvedBaseCurrency.value,
		baseAmount: amount * exchangeRate,
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

const amountNavigationKeys = [
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
]

const onAmountKeydown = (event: KeyboardEvent) => {
	if (event.ctrlKey || event.metaKey || event.altKey) return
	if (amountNavigationKeys.includes(event.key)) return
	if (/^[0-9]$/.test(event.key)) return
	const input = event.target as HTMLInputElement
	if (event.key === '.' && !input.value.includes('.')) return
	event.preventDefault()
}

const onAmountPaste = (event: ClipboardEvent) => {
	const pasted = event.clipboardData?.getData('text') ?? ''
	if (!/^\d*\.?\d*$/.test(pasted)) event.preventDefault()
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

.acurrency__amount {
	width: 100%;
	appearance: textfield;
	-moz-appearance: textfield;
}

.acurrency__amount::-webkit-outer-spin-button,
.acurrency__amount::-webkit-inner-spin-button {
	appearance: none;
	-webkit-appearance: none;
	margin: 0;
}

.acurrency__base-field {
	width: 100%;
	font-size: 1rem;
	padding: 0.5ch 1ch;
	border: 1px solid var(--sc-input-border-color);
	border-radius: 0.25rem;
	outline: none;
}

.acurrency__base-field:disabled {
	color: var(--sc-gray-50, #888);
}
</style>
