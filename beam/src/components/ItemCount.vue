<template>
	<div class="beam_item-count">
		<span
			:contenteditable="editable"
			:class="{ 'beam--alert': !isCountComplete }"
			@input="handleInput"
			@click="handleInput">
			{{ count }}
		</span>
		<span>/{{ denominator }}</span>
		<span v-if="uom">&nbsp; {{ uom }}</span>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const count = defineModel<number>({ required: true })
const {
	denominator,
	uom = '',
	editable = true,
} = defineProps<{
	denominator: number
	uom?: string
	editable?: boolean
}>()

const isCountComplete = computed(() => count.value === denominator)

const handleInput = (event: InputEvent | MouseEvent) => {
	event.preventDefault()
	event.stopPropagation()
	const newValue = Number((event.target as HTMLElement).innerHTML) || 0
	count.value = Math.min(newValue, denominator)
}
</script>

<style scoped>
.beam_item-count {
	font-size: 1.3125rem;
	color: var(--sc-primary-text-color);
}

.beam_item-count span {
	margin: 0;
	padding: 0;
	outline: none;
}
</style>
