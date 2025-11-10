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
import { provide, defineProps, reactive, defineEmits } from 'vue'

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

const emit = defineEmits(['get-date'])

const date = reactive({
	start: new Date(),
	end: new Date(),
})
const time = reactive({
	hours: 0,
	minutes: 0,
	seconds: 0,
	meridiem: 'AM',
	militaryTime: 0,
})

//provides prop to datepicker child
provide('select-range', true)

const handleDate = data => {
	date.start = data.start
	date.end = data.end
	updateTime(date.start)
	if (date.end != null) updateTime(date.end)

	const dateObject = {
		date: date,
		time: time,
	}

	emit('get-date', dateObject)
}

const updateTime = date => {
	date.setHours(time.hours)
	date.setMinutes(time.minutes)
	date.setSeconds(time.seconds)
}

const handleTime = data => {
	time.hours = data.hours
	time.minutes = data.minutes
	time.seconds = data.seconds
	time.meridiem = data.meridiem

	updateTime(date.start)
	if (date.end != null) updateTime(date.end)

	const dateObject = {
		date: date,
		time: time,
	}

	emit('get-date', dateObject)
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
