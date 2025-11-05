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

const formattedTime = computed(() => {
	// return hours.value+":"+minutes.value+":"+seconds.value+meridiem.value
	return [hours.value, minutes.value, seconds.value].join(':') + meridiem.value
})

const handleTime = time_data => {
	hours.value = time_data.hours
	minutes.value = time_data.minutes
	seconds.value = time_data.seconds
	meridiem.value = time_data.meridiem
}
</script>
