<template>
	<div class="aform_form-element" @focusout="leaveField" @keydown="closeOnEscape">
		<template v-if="mode === 'display'">
			<span class="aform_display-value">{{ displayValue }}</span>
			<label class="aform_field-label">{{ label }}</label>
		</template>
		<template v-else>
			<!-- `.prevent` and the calendar's keys keep the browser's own calendar shut: aform's is the only one this field opens.
			     A date input cannot take the combobox role, and `aria-expanded` is not allowed on it.
			     The day is the box's default (an attribute) and is otherwise set by hand, never bound as its value: Vue writes a
			     bound value back on every re-render, over a day the person is part way through typing. -->
			<!-- Sized to the box, so the clear button centres on the box and the message sits on its top border. -->
			<div class="adate-box">
				<input
					:id="uuid"
					ref="date"
					:value.attr="modelValue ?? ''"
					class="aform_input-field"
					type="date"
					aria-haspopup="dialog"
					:aria-controls="showPicker ? calendarId : undefined"
					:disabled="mode === 'read'"
					:required="required"
					:aria-invalid="invalid"
					:aria-describedby="describedBy"
					@input="takeTypedDay"
					@click.prevent="openPicker"
					@keydown="openFromKey" />
				<p v-show="message" :id="errorId" class="aform_error" role="alert">{{ message }}</p>
				<button
					v-if="!required && modelValue && mode !== 'read'"
					type="button"
					class="adate-clear"
					:aria-label="`Clear ${label}`"
					@click="clearDay">
					<svg class="adate-clear-icon" viewBox="3.25 3.25 9.5 9.5" aria-hidden="true" focusable="false">
						<path d="M4 4 12 12M12 4 4 12" />
					</svg>
				</button>
			</div>
			<label class="aform_field-label" :for="uuid">{{ label }}</label>
			<ADateSelection
				v-if="showPicker"
				:id="calendarId"
				ref="picker"
				class="adate-picker"
				role="dialog"
				:aria-label="label"
				:default-date="modelValue || undefined"
				:select-range="false"
				:show-time="false"
				@get-date="handleDate" />
		</template>
	</div>
</template>

<script setup lang="ts">
import { type ComponentPublicInstance, useTemplateRef, computed, ref, watch } from 'vue'
import { fromISODate } from '@stonecrop/utilities'

import { fieldErrorA11y, fieldErrorText } from '../../composables/fieldErrorA11y'
import ADateSelection from './ADateSelection.vue'
import type { ComponentProps } from '../../types'
import { focusLeavesField, useFieldCalendar } from '../../utils/fieldCalendar'

const { label = 'Date', required, mode, uuid, errors } = defineProps<ComponentProps>()

// The errors this field is handed, already worded by AForm. Empty hides the slot.
const errorText = computed(() => fieldErrorText(errors))
// What leaving the field did to a box it could not keep as it was. The field words this one itself: it reports the
// field's own action, not a validation.
const notice = ref('')
const message = computed(() => [errorText.value, notice.value].filter(Boolean).join('; '))
const { errorId, describedBy } = fieldErrorA11y(uuid, message)
// Only the errors it is handed make it invalid: after a put-back the box holds a day it can read.
const invalid = computed(() => (errorText.value ? true : undefined))

// The field holds a `YYYY-MM-DD` day, which is also the date input's own value; a Date would be an instant.
const modelValue = defineModel<string | null>()
const box = useTemplateRef<HTMLInputElement>('date')

const showDay = (day: string | null | undefined) => {
	if (box.value) box.value.value = day ?? ''
}

// The box reads as `''` both when it is empty and when the browser can't read what it shows (a part missing, or a day
// the month does not have), and clearing its last part fires no input event. So only a day it can read is taken as it
// is typed; anything else is decided once focus leaves the field.
const takeTypedDay = () => {
	notice.value = ''
	if (box.value?.value) modelValue.value = box.value.value
}

const shownDay = (day: string) =>
	fromISODate(day)?.toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }) ?? day

const leaveField = (event: FocusEvent) => {
	closeWhenFocusLeaves(event)
	const input = box.value
	if (!focusLeavesField(event) || !input || input.value || mode === 'read') return

	const day = modelValue.value || null
	if (!input.validity.badInput) {
		if (!required) {
			if (day) modelValue.value = null
			return
		}
		if (!day) return
		showDay(day)
		notice.value = `${label} is required, so ${shownDay(day)} was kept`
		return
	}
	showDay(day)
	notice.value = day
		? `${label}: not a date, so ${shownDay(day)} was kept`
		: `${label}: not a date, so it was left empty`
}

// A day set from outside (a load, an undo) replaces whatever the box shows, a part-typed day too.
watch(modelValue, day => {
	notice.value = ''
	const input = box.value
	if (input && (input.validity.badInput || input.value !== (day ?? ''))) showDay(day)
})

const clearDay = () => {
	showDay(null)
	modelValue.value = null
	box.value?.focus()
}

const displayValue = computed(() =>
	modelValue.value ? (fromISODate(modelValue.value)?.toLocaleString() ?? 'Invalid Date') : ''
)

const { showPicker, calendarId, closePicker, openFromKey, closeOnEscape, closeWhenFocusLeaves } = useFieldCalendar(
	box,
	useTemplateRef<ComponentPublicInstance>('picker'),
	uuid
)

const openPicker = () => {
	if (mode !== 'read') showPicker.value = !showPicker.value
}

const handleDate = (data: { selected: string }) => {
	showDay(data.selected)
	modelValue.value = data.selected
	notice.value = ''
	closePicker()
}
</script>

<style scoped>
.adate-picker {
	position: absolute;
	top: 100%;
	left: 0;
	width: max-content;
	max-width: 100%;
	box-sizing: border-box;
	z-index: 100;
	margin-top: 0.25rem;
}

/* Flex, so the wrapper is exactly the box's height: a block would add the gap below an inline input's text line. */
.adate-box {
	position: relative;
	display: flex;
}

/* The shared rule offsets the message from the field's top, past the label's padding; here it sits on the box. */
.adate-box > p.aform_error {
	top: 0;
}

/* Inside the box, centred on it and left of the browser's calendar icon, so the box keeps its width with or without it. */
.adate-clear {
	position: absolute;
	top: 50%;
	right: 2.25rem;
	transform: translateY(-50%);
	display: flex;
	align-items: center;
	appearance: none;
	border: none;
	background: none;
	padding: 0.25rem;
	cursor: pointer;
	font-size: 1rem;
	color: var(--sc-cell-text-color);
}

/* Drawn in the stroke of AFormLink's navigate icon, at capital height. */
.adate-clear-icon {
	height: 0.716em;
	width: auto;
	overflow: visible;
	fill: none;
	stroke: currentColor;
	stroke-width: 1.5;
	stroke-linecap: round;
	stroke-linejoin: round;
}
</style>
