<template>
	<Story title="ADate">
		<Variant title="Time Picker">
			<template #controls>
				<HstText v-model="formattedTime" title="Time" />
			</template>
			<div class="story-field" style="width: fit-content">
				<ADateTimeInput ref="time-date" :use-seconds="true" @get-time="handleTime" />
			</div>
		</Variant>
		<Variant title="Time Picker (24-hour)">
			<template #controls>
				<HstText v-model="formattedTime24" title="Time" />
			</template>
			<div class="story-field" style="width: fit-content">
				<ADateTimeInput allow-military-time :use-seconds="true" :default-hours="14" @get-time="handleTime24" />
			</div>
		</Variant>
		<Variant title="Date Picker">
			<template #controls>
				<HstText v-model="state.selected" title="Selected Date" />
				<HstText v-model="state.start" title="Start Date" />
				<HstText v-model="state.end" title="End Date" />
			</template>
			<div class="story-field">
				<ADatePicker @get-date="handleDate" />
			</div>
		</Variant>
		<Variant title="Date Input with Picker">
			<div class="story-field story-field--with-picker">
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
			<div class="story-field">
				<ADateSelection :allow-military-time="state.militaryTime" @get-date="handleDate" @get-time="handleTime" />
			</div>
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
	time24: null,
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

const handleTime24 = data => {
	state.time24 = data
}

const formattedTime = computed(() => {
	if (state.time == null) return ''
	return [state.time.hours, state.time.minutes, state.time.seconds].join(':') + ' ' + state.time.meridiem
})

const formattedTime24 = computed(() => {
	if (state.time24 == null) return ''
	return [state.time24.hours, state.time24.minutes, state.time24.seconds].join(':')
})
</script>

<style scoped>
.story-field {
	padding: 1rem;
}

.story-field--with-picker {
	min-height: 22rem;
}
</style>
