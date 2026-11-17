<template>
	<div class="aform_form-element aform_badge-field">
		<ABadge v-if="badge" class="aform_display-value" v-bind="badge" presentation="input-accent" />
		<span v-else class="aform_display-value" />
		<label v-if="label" class="aform_field-label">{{ label }}</label>
	</div>
</template>

<script setup lang="ts">
import type { BadgeDescriptor, FieldOptions } from '@stonecrop/schema'
import { computed } from 'vue'

import { resolveFieldBadge } from '../../utils/badge'
import ABadge from './ABadge.vue'

// The form field AForm draws for a field declaring `component: 'ABadge'`. It shows the value the record
// holds, as its options paint it, under the field's label. ABadge's own `label` stays the badge's text;
// here the field's label is this wrapper's, and the badge is handed only the value's descriptor.
const { label, modelValue, options, format } = defineProps<{
	/** The field's label */
	label?: string
	/** The value the record holds */
	modelValue?: unknown
	/** The field's options; a choice with a badge in them is painted with it */
	options?: FieldOptions
	/** The field's `format`, read before its options, as ADropdown reads it */
	format?: string
}>()

// One definition of a field's badge, shared with ADropdown: the field's `format` first, then its options.
const badge = computed((): BadgeDescriptor | undefined => {
	const resolved = resolveFieldBadge(modelValue, options, format)
	if (resolved) return resolved
	// A value without a badge of its own still shows, plainly.
	if (modelValue === null || modelValue === undefined || modelValue === '') return undefined
	return { label: typeof modelValue === 'string' ? modelValue : String(modelValue) }
})
</script>
