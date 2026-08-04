import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'

import './custom.css'
import './demo.css'
import CheckboxDemo from './demos/CheckboxDemo.vue'
import CurrencyDemo from './demos/CurrencyDemo.vue'
import DemoPanel from './demos/DemoPanel.vue'
import CardGrid from './home/CardGrid.vue'
import CardGridItem from './home/CardGridItem.vue'

export default {
	...DefaultTheme,
	enhanceApp({ app }) {
		app.component('CheckboxDemo', CheckboxDemo)
		app.component('CurrencyDemo', CurrencyDemo)
		app.component('DemoPanel', DemoPanel)
		app.component('CardGrid', CardGrid)
		app.component('CardGridItem', CardGridItem)
	},
} satisfies Theme
