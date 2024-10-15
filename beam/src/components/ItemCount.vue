<template>
	<div class="beam__itemcount">
		<span :contenteditable="editable" :class="{ alert: !isCountComplete }" @input="handleInput" @click="handleInput">
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
