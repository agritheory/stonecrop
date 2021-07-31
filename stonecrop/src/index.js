import VueRouter from 'vue-router'
import { createOvermind } from 'overmind'
import { createPlugin } from 'overmind-vue'
import { config } from './overmind'
import { router, routerConfig } from './routes.js'

// import {
// 	aform,
// 	AComboBox,
// 	FormulaTable,
// 	AChart,
// 	AHyperlink,
// 	ADatePicker
// } from 'aform'

// import Rathad from './rathad'
// import { hooks } from './hooks'

// let rathad = new Rathad(hooks)

const install = function (Vue, opts = {}) {
	const overmind = createOvermind(config)
	const OvermindPlugin = createPlugin(overmind)
	Vue.use(OvermindPlugin)
	Vue.use(VueRouter)
	// Vue.component('AComboBox', AComboBox)
	// Vue.component('FormulaTable', FormulaTable)
	// Vue.component('AChart', AChart)
	// Vue.component('AHyperlink', AHyperlink)
	// Vue.component('ADatePicker', ADatePicker)
	// Vue.use(VueFormulate, {
	// 	library: {
	// 		...aform
	// 	}
	// })
}

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue)
}

export {
	install,
	router
}

export default {
  version: "0.1.0",
  install,
}
