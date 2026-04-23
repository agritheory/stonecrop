<!-- This serves as a wrapper component for ADatePicker and ADateTime in one component -->

<template>
	<div class="adate-selection">
		<ADatePicker v-if="showDate" :select-range="selectRange" @get-date="handleDate" />
		<ADateTime
			v-if="showTime"
			:allow-military-time="allowMilitaryTime"
			:default-hours="defaultHours"
			:default-minutes="defaultMinutes"
			:default-seconds="defaultSeconds"
			:default-meridiem="defaultMeridiem"
			:use-seconds="useSeconds"
			@get-time="handleTime" />
		<p v-if="!showTime && !showDate" class="empty">empty</p>
	</div>
</template>
<script setup lang="ts">
import { provide } from 'vue'

defineProps({
	showDate: {
		type: Boolean,
		default: true,
	},
	showTime: {
		type: Boolean,
		default: true,
	},
	selectRange: {
		type: Boolean,
		default: true,
	},
	allowMilitaryTime: {
		type: Boolean,
		default: false,
	},
	defaultHours: {
		type: Number,
		default: 12,
	},
	defaultMinutes: {
		type: Number,
		default: 0,
	},
	defaultSeconds: {
		type: Number,
		default: 0,
	},
	defaultMeridiem: {
		type: String,
		default: 'AM',
	},
	useSeconds: {
		type: Boolean,
		default: true,
	},
})

const emit = defineEmits<{
	'get-date': [{ selected: Date }]
	'get-time': [{ hours: number; minutes: number; seconds: number; meridiem: string }]
}>()

//provides prop to datepicker child
provide('select-range', true)

const handleDate = (data: { selected: Date }) => {
	emit('get-date', data)
}

const handleTime = (data: { hours: number; minutes: number; seconds: number; meridiem: string }) => {
	emit('get-time', data)
}
</script>
<style scoped>
.adate-selection {
	display: inline-block;
	border: 1px solid var(--sc-gray-80);
	padding: 10px;
	background: var(--sc-form-background);
}
.empty {
	color: #ccc;
	padding: 10px;
	text-align: center;
	border: 1px solid #ccc;
}
</style>
