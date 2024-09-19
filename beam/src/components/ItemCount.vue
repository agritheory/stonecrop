<template>
	<div class="beam__itemcount">
		<span
			:contenteditable="editable"
			:class="{ alert: countColor === false }"
			@input="handleInput"
			@click="handleInput">
			{{ count }}
		</span>
		<span>/{{ denominator }}</span>
		<span v-if="uom">&nbsp; {{ uom }}</span>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const emit = defineEmits(['input'])
const {
	value = 0,
	denominator,
	uom = '',
	editable = true,
} = defineProps<{
	value?: number
	denominator: number
	uom?: string
	editable?: boolean
}>()

const count = ref(value)

const handleInput = (event: InputEvent | MouseEvent) => {
	event.preventDefault()
	event.stopPropagation()
	count.value = Number((event.target as HTMLElement).innerHTML.replace(/[^0-9]/g, ''))
	emit('input', count.value)
}

const countColor = computed(() => {
	return count.value === denominator
})
</script>
