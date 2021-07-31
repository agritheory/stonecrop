import VueRouter from 'vue-router'

import Home from './components/Home.vue'
import TableView from './components/TableView.vue'
import FormView from './components/FormView.vue'

export const routes = [
  { 
		path: '/',
		component: {
			template: '<div><br>Login</div>'
		},
		props: true
	},
	{ 
		path: '/home',
		component: Home,
		props: true
	},
	{ 
		path: '/404',
		component: {template: '<h1>404</h1>'},
	},
	{
		path: '/:table',
		component: TableView,
	},
	{
		path: '/:table/:id',
		component: FormView,
	}
]

export const router = new VueRouter({
	mode: 'history',
  routes: routes,
})

// router.beforeResolve((to, from, next) => {
//   console.log(to, from, next)
// })


export const routerConfig = {
	mode: 'history',
  routes: routes,
}