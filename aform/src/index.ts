export type * from '@stonecrop/atable/types'
export { deserializeFunction } from './utils/deserialize'
export { badgeInputAccentStyle, resolveFieldBadge } from './utils/badge'
export type { BadgeFormatContext, BadgeFormatFn } from './utils/badge'
import { install as installATable } from '@stonecrop/atable'
import type { App } from 'vue'

import ACheckbox from './components/form/ACheckbox.vue'
import ACurrencyInput from './components/form/ACurrencyInput.vue'
import ADate from './components/form/ADate.vue'
import ADropdown from './components/form/ADropdown.vue'
import ASegmentedControl from './components/form/ASegmentedControl.vue'
import ABadge from './components/form/ABadge.vue'
import ADatePicker from './components/form/ADatePicker.vue'
import ADateTime from './components/form/ADateTime.vue'
import ADateTimeInput from './components/form/ADateTimeInput.vue'
import ADateSelection from './components/form/ADateSelection.vue'
import ADuration from './components/form/ADuration.vue'
import ADateRange from './components/form/ADateRange.vue'
import AFieldset from './components/form/AFieldset.vue'
import AFileAttach from './components/form/AFileAttach.vue'
import AForm from './components/AForm.vue'
import AFormLink from './components/form/AFormLink.vue'
import ANumericInput from './components/form/ANumericInput.vue'
import AQuantityInput from './components/form/AQuantityInput.vue'
import ATextInput from './components/form/ATextInput.vue'
import ATextboxInput from './components/form/ATextboxInput.vue'
import Login from './components/utilities/Login.vue'
import AFormLoading from './components/AFormLoading.vue'
import ExpandButton from './components/base/ExpandButton.vue'

export type * from './types'

/**
 * Install all AForm components
 * @param app - Vue app instance
 * @public
 */
function install(app: App /* options */) {
	app.use(installATable) // Install ATable components for use within AForm

	app.component('ACheckbox', ACheckbox)
	app.component('ACurrencyInput', ACurrencyInput)
	app.component('ADate', ADate)
	app.component('ADropdown', ADropdown)
	app.component('ASegmentedControl', ASegmentedControl)
	app.component('ABadge', ABadge)
	app.component('ADatePicker', ADatePicker)
	app.component('ADateTime', ADateTime)
	app.component('ADateTimeInput', ADateTimeInput)
	app.component('ADateRange', ADateRange)
	app.component('ADateSelection', ADateSelection)
	app.component('AFieldset', AFieldset)
	app.component('AFileAttach', AFileAttach)
	app.component('AForm', AForm)
	app.component('AFormLink', AFormLink)
	app.component('ANumericInput', ANumericInput)
	app.component('AQuantityInput', AQuantityInput)
	app.component('ATextInput', ATextInput)
	app.component('ATextboxInput', ATextboxInput)
	app.component('ADuration', ADuration)
	app.component('AFormLoading', AFormLoading)
	app.component('ExpandButton', ExpandButton)
}

export {
	ACheckbox,
	ACurrencyInput,
	ADate,
	ADropdown,
	ASegmentedControl,
	ABadge,
	ADatePicker,
	ADateRange,
	ADateSelection,
	ADuration,
	ADateTime,
	ADateTimeInput,
	AFieldset,
	AFileAttach,
	AForm,
	AFormLink,
	ANumericInput,
	AQuantityInput,
	ATextInput,
	ATextboxInput,
	Login,
	AFormLoading,
	ExpandButton,
	install,
}
