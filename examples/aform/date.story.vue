<template>
	<Story title="ADate">
		<Variant title="Time Picker">
			<template #controls>
				<HstText v-model="formattedTime" title="Time" />
				<HstCheckbox
					@click="() => (state.militaryTime = !state.militaryTime)"
					v-model="state.militaryTime"
					title="Military Time" />
			</template>
			<div style="width: fit-content">
				<ADateTimeInput
					ref="time-date"
					@get-time="handleTime"
					:allowMilitaryTime="state.militaryTime"
					:use-seconds="true" />
			</div>
		</Variant>
		<Variant title="Date Picker">
			<template #controls>
				<HstText v-model="state.selected" title="Selected Date" />
				<HstText v-model="state.start" title="Start Date" />
				<HstText v-model="state.end" title="End Date" />
			</template>
			<ADatePicker @get-date="handleDate" />
		</Variant>
		<Variant title="Date Input with Picker">
			<div class="adate-story-field">
				<ADate v-model="state.dateField" label="Date" />
			</div>
		</Variant>
		<Variant title="Date Selection (Date Picker and Time)">
			<template #controls>
				<HstText v-model="state.selected" title="Selected Date" />
				<HstText v-model="state.start" title="Start Date" />
				<HstText v-model="state.end" title="End Date" />
				<HstText v-model="formattedTime" title="Time" />
				<HstCheckbox
					@click="() => (state.militaryTime = !state.militaryTime)"
					v-model="state.militaryTime"
					title="Military Time" />
			</template>
			<ADateSelection @get-date="handleDate" @get-time="handleTime" />
		</Variant>
	</Story>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ADate } from '@stonecrop/aform'

const start = ref(new Date())
const state = reactive({
	selected: new Date().toLocaleDateString(),
	start: null,
	end: null,
	time: null,
	militaryTime: false,
	dateField: null,
})

const handleDate = data => {
	state.selected = data.selected.toLocaleDateString()
	state.start = data.start != null ? data.start.toLocaleDateString() : null
	state.end = data.end != null ? data.end.toLocaleDateString() : null
}

const handleTime = data => {
	state.time = data
}

const formattedTime = computed(() => {
	if (state.time == null) return ''
	return [state.time.hours, state.time.minutes, state.time.seconds].join(':') + state.time.meridiem
})
</script>

<style scoped>
.adate-story-field {
	padding: 1rem;
}
</style>
