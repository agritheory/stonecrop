import VueRouter from 'vue-router'

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
		component: '<div><h1>HOME</h1></div>',
		props: true
	},
	{ 
		path: '/404',
		component: {template: '<h1>404</h1>'},
	},
	{
		path: '/:table',
		component: '<div><h1>TABLE</h1></div>',
	},
	{
		path: '/:table/:id',
		component: '<div><h1>FORM</h1></div>',
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