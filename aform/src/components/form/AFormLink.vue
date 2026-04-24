<template>
	<div class="aform_form-element"></div>
</template>

<script setup lang="ts">
import type { AFormLinkValue, ComponentProps } from '../../types'

defineProps<
	ComponentProps & {
		doctype?: string
		formatter?: (value: AFormLinkValue) => string
		icon?: 'arrow-right' | 'chevron-right'
		disabled?: boolean
		filterFunction?: (search: string) => AFormLinkValue[] | Promise<AFormLinkValue[]>
		isAsync?: boolean
	}
>()

defineModel<AFormLinkValue>({ default: { id: '', displayText: '' } })
</script>
