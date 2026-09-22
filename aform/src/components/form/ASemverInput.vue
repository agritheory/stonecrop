<template>
	<ATextInput
		v-model="draft"
		:label="label"
		:mask="resolvedMask"
		:required="required"
		:mode="mode"
		:uuid="uuid"
		:validation="validation"
		:errors="errors" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import type { ComponentProps, SemverValue } from '../../types'
import { emptySemverValue, recomputeSemver, SEMVER_MASK } from '../../utils/semver'
import ATextInput from './ATextInput.vue'

const { label, mask, required, mode, uuid, errors, validation = { errorMessage: '' } } = defineProps<ComponentProps>()

const resolvedMask = computed(() => mask ?? SEMVER_MASK)

const modelValue = defineModel<SemverValue>({
	default: () => emptySemverValue(),
})

const draft = ref('')

const resolveRawFromValue = (value: SemverValue | undefined): string => {
	if (!value) return ''
	if (value.raw) return value.raw
	if (value.major !== undefined && value.minor !== undefined && value.patch !== undefined) {
		return `${value.major}.${value.minor}.${value.patch}`
	}
	return ''
}

watch(
	modelValue,
	value => {
		const raw = resolveRawFromValue(value)
		if (draft.value !== raw) draft.value = raw
	},
	{ immediate: true, deep: true }
)

watch(draft, raw => {
	if (!raw) {
		modelValue.value = emptySemverValue()
		return
	}
	const next = recomputeSemver(raw)
	if (next) modelValue.value = next
})
</script>
