cat > ~/StoneCrop/stonecrop/aform/src/components/form/ALongText.vue << 'EOF'
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
	fieldname: string
	label?: string
	modelValue?: string | null
	placeholder?: string
	required?: boolean
	readOnly?: boolean
	disabled?: boolean
	hidden?: boolean
	rows?: number
	maxlength?: number
	mode?: 'display' | 'edit'
}

const props = withDefaults(defineProps<Props>(), {
	label: '',
	modelValue: null,
	placeholder: '',
	required: false,
	readOnly: false,
	disabled: false,
	hidden: false,
	rows: 4,
	mode: 'edit',
})

const emit = defineEmits<{
	(e: 'update:modelValue', value: string): void
	(e: 'change', value: string): void
}>()

const isReadOnly = computed(() => props.readOnly || props.mode === 'display')

function onInput(event: Event) {
	const value = (event.target as HTMLTextAreaElement).value
	emit('update:modelValue', value)
	emit('change', value)
}
</script>

<template>
	<div v-if="!hidden" class="a-long-text" :class="{ 'is-read-only': isReadOnly }">
		<label v-if="label" :for="fieldname" class="a-long-text__label">
			{{ label }}<span v-if="required" class="a-long-text__required" aria-hidden="true">*</span>
		</label>
		<textarea
			v-if="!isReadOnly"
			:id="fieldname"
			:name="fieldname"
			class="a-long-text__input"
			:value="modelValue ?? ''"
			:placeholder="placeholder"
			:required="required"
			:disabled="disabled"
			:rows="rows"
			:maxlength="maxlength"
			@input="onInput" />
		<span v-else class="a-long-text__display">{{ modelValue }}</span>
	</div>
</template>

<style scoped>
.a-long-text {
	display: flex;
	flex-direction: column;
	gap: var(--space-xs, 0.25rem);
}

.a-long-text__label {
	font-size: var(--font-size-sm, 0.875rem);
	color: var(--color-text-secondary, #666);
}

.a-long-text__required {
	color: var(--color-danger, #c00);
	margin-left: 2px;
}

.a-long-text__input {
	font-family: inherit;
	font-size: var(--font-size-base, 1rem);
	color: var(--color-text-primary, #111);
	background: var(--color-input-bg, #fff);
	border: 1px solid var(--color-border, #ccc);
	border-radius: var(--radius-sm, 4px);
	padding: var(--space-xs, 0.25rem) var(--space-sm, 0.5rem);
	resize: vertical;
	width: 100%;
	box-sizing: border-box;
	line-height: 1.5;
}

.a-long-text__input:focus {
	outline: none;
	border-color: var(--color-focus, #0066cc);
	box-shadow: 0 0 0 2px var(--color-focus-ring, rgba(0, 102, 204, 0.2));
}

.a-long-text__display {
	white-space: pre-wrap;
	font-size: var(--font-size-base, 1rem);
	color: var(--color-text-primary, #111);
}
</style>
EOF
