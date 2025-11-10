<template>
	<Story title="ADate">
		<Variant title="Time Picker">
			<ADateTime
				ref="time-date"
				@get-time="handleTime"
				:allow-military-time="state.allowMilitaryTime"
				:use-seconds="state.useSeconds" />
			<h3>Time is:</h3>
			<p>{{ formattedTime }}</p>
		</Variant>
		<Variant title="Date Picker">
			<ADatePicker select-range />
		</Variant>
		<Variant title="Date Input with Picker">
			<ADate label="Date" v-model="defaultDate" />
		</Variant>
		<Variant title="Date Selection (Date Picker and Time)">
			<ADateSelection @get-date="handleDateTime" />
			<div v-if="start_date != null">
				<h2>Start Date</h2>
				<p>{{ formatStartDate }}</p>
			</div>
			<div v-if="end_date != null && !isNaN(end_date)">
				<h2>End Date</h2>
				<p>{{ formatEndDate }}</p>
			</div>
			<div>
				<h2>Time</h2>
				<p>{{ formatTime }}</p>
			</div>
		</Variant>
	</Story>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

const twoDaysAgo = new Date().setDate(new Date().getDate() - 2)
const defaultDate = ref(new Date(twoDaysAgo))

const state = reactive({
	allowMilitaryTime: false,
	useSeconds: true,
})

const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)
const meridiem = ref('')

const start_date = ref(null)
const end_date = ref(null)
const time = ref(null)

const formattedTime = computed(() => {
	return [hours.value, minutes.value, seconds.value].join(':') + meridiem.value
})

const handleTime = time_data => {
	hours.value = time_data.hours
	minutes.value = time_data.minutes
	seconds.value = time_data.seconds
	meridiem.value = time_data.meridiem
}
const handleDateTime = data => {
	start_date.value = data.date.start
	end_date.value = data.date.end
	time.value = data.time
}

const formatStartDate = computed(() => {
	return new Date(start_date.value).toLocaleDateString()
})
const formatEndDate = computed(() => {
	return end_date.value != null ? new Date(end_date.value).toLocaleDateString() : ''
})
const formatTime = computed(() => {
	return time.value != null
		? [time.value.hours, time.value.minutes, time.value.seconds].join(':') + ' ' + time.value.meridiem
		: ''
})
</script>
