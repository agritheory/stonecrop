<!-- This serves as a wrapper component for ADatePicker and ADateTime in one component -->

<template>
	<div class="adate-selection">
		<ADatePicker v-if="showDate" :select-range="selectRange" @get-date="handleDate" />
		<ADateTime
			v-if="showTime"
			@get-time="handleTime"
			:allowMilitaryTime="allowMilitaryTime"
			:defaultHours="defaultHours"
			:defaultMinutes="defaultMinutes"
			:defaultSeconds="defaultSeconds"
			:defaultMeridiem="defaultMeridiem"
			:useSeconds="useSeconds" />
		<p v-if="!showTime && !showDate" class="empty">empty</p>
	</div>
</template>
<script setup lang="ts">
import { provide, defineProps, defineEmits, ref } from 'vue'

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

const emit = defineEmits(['get-date', 'get-time'])

//provides prop to datepicker child
provide('select-range', true)

const handleDate = data => {
	emit('get-date', data)
}

const handleTime = data => {
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
