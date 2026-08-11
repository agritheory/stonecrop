import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { createPinia } from 'pinia'
import { install as installAform } from '@stonecrop/aform'

import './custom.css'
import './demo.css'
import DemoPanel from './demos/DemoPanel.vue'
import CheckboxDemo from './demos/CheckboxDemo.vue'
import CurrencyDemo from './demos/CurrencyDemo.vue'
import DateDemo from './demos/DateDemo.vue'
import DateRangeDemo from './demos/DateRangeDemo.vue'
import DateSelectionDemo from './demos/DateSelectionDemo.vue'
import DateTimeDemo from './demos/DateTimeDemo.vue'
import DatePickerDemo from './demos/DatePickerDemo.vue'
import DurationDemo from './demos/DurationDemo.vue'
import FieldsetDemo from './demos/FieldsetDemo.vue'
import DropdownDemo from './demos/DropdownDemo.vue'
import FileAttachDemo from './demos/FileAttachDemo.vue'
import FormLinkDemo from './demos/FormLinkDemo.vue'
import NumericInputDemo from './demos/NumericInputDemo.vue'
import QuantityInputDemo from './demos/QuantityInputDemo.vue'
import TextInputDemo from './demos/TextInputDemo.vue'
import TextboxInputDemo from './demos/TextboxInputDemo.vue'
import FormDemo from './demos/FormDemo.vue'
import FormModesDemo from './demos/FormModesDemo.vue'
import FormLoadingDemo from './demos/FormLoadingDemo.vue'
import LoginDemo from './demos/LoginDemo.vue'
import CollapseButtonDemo from './demos/CollapseButtonDemo.vue'
import CardGrid from './home/CardGrid.vue'
import CardGridItem from './home/CardGridItem.vue'

export default {
	...DefaultTheme,
	enhanceApp({ app }) {
		// AForm resolves schema fields by string name through Vue's dynamic-component registry,
		// which is only populated by this plugin (mirrors examples/histoire.setup.ts). Needed for
		// any demo that uses <AForm :schema="..."> rather than importing a field directly.
		app.use(createPinia())
		app.use(installAform)

		app.component('DemoPanel', DemoPanel)
		app.component('CheckboxDemo', CheckboxDemo)
		app.component('CurrencyDemo', CurrencyDemo)
		app.component('DateDemo', DateDemo)
		app.component('DateRangeDemo', DateRangeDemo)
		app.component('DateSelectionDemo', DateSelectionDemo)
		app.component('DateTimeDemo', DateTimeDemo)
		app.component('DatePickerDemo', DatePickerDemo)
		app.component('DurationDemo', DurationDemo)
		app.component('FieldsetDemo', FieldsetDemo)
		app.component('DropdownDemo', DropdownDemo)
		app.component('FileAttachDemo', FileAttachDemo)
		app.component('FormLinkDemo', FormLinkDemo)
		app.component('NumericInputDemo', NumericInputDemo)
		app.component('QuantityInputDemo', QuantityInputDemo)
		app.component('TextInputDemo', TextInputDemo)
		app.component('TextboxInputDemo', TextboxInputDemo)
		app.component('FormDemo', FormDemo)
		app.component('FormModesDemo', FormModesDemo)
		app.component('FormLoadingDemo', FormLoadingDemo)
		app.component('LoginDemo', LoginDemo)
		app.component('CollapseButtonDemo', CollapseButtonDemo)

		app.component('CardGrid', CardGrid)
		app.component('CardGridItem', CardGridItem)
	},
} satisfies Theme
