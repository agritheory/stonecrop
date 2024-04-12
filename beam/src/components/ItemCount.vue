<template>
	<div class="beam__itemcount">
		<span
			:contenteditable="editable"
			:style="{ color: countColor === true ? '#3c5014' : '#e63c28' }"
			@input="handleInput"
			@click="handleInput">
			{{ count }}
		</span>
		<span>/{{ denominator }} </span>
		<span v-if="uom">&nbsp; {{ uom }}</span>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const emit = defineEmits(['input'])
const props = withDefaults(
	defineProps<{
		value?: number
		denominator: number
		uom?: string
		editable?: boolean
	}>(),
	{ value: 0, editable: true, uom: '' }
)

const count = ref(props.value)

const handleInput = (event: InputEvent | MouseEvent) => {
	event.preventDefault()
	event.stopPropagation()
	count.value = Number(event.target.innerHTML.replace(/[^0-9]/g, ''))
	emit('input', count.value)
}

const countColor = computed(() => {
	return count.value === props.denominator
})
</script>
