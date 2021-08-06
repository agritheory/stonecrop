import Vue from 'vue'
import App from './App.vue'
// import PortalVue from 'portal-vue'
import Beam from './../src/index.js'

Vue.use(Beam)
new Vue(App).$mount('#app')
