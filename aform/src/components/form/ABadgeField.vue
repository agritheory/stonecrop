<template>
	<div class="aform_form-element aform_badge-field">
		<ABadge v-if="badge" class="aform_display-value" v-bind="badge" presentation="input-accent" />
		<span v-else class="aform_display-value" />
		<label v-if="label" class="aform_field-label">{{ label }}</label>
	</div>
</template>

<script setup lang="ts">
import type { BadgeDescriptor, FieldOptions } from '@stonecrop/schema'
import { lookupBadge } from '@stonecrop/schema'
import { computed } from 'vue'

import ABadge from './ABadge.vue'

// The form field AForm draws for a field declaring `component: 'ABadge'`. It shows the value the record
// holds, as its options paint it, under the field's label. ABadge's own `label` stays the badge's text;
// here the field's label is this wrapper's, and the badge is handed only the value's descriptor.
const { label, modelValue, options } = defineProps<{
	/** The field's label */
	label?: string
	/** The value the record holds */
	modelValue?: unknown
	/** The field's options; a choice with a badge in them is painted with it */
	options?: FieldOptions
}>()

const badge = computed((): BadgeDescriptor | undefined => {
	if (modelValue === null || modelValue === undefined || modelValue === '') return undefined
	const key = typeof modelValue === 'string' ? modelValue : String(modelValue)
	// A value without a badge of its own still shows, plainly.
	return lookupBadge(options, key) ?? { label: key }
})
</script>
