// http adaptor
export const http = {
	loadRoutes: async function (state) {
		let routes = {}
		await fetch(`${state.user.server}/load_routes`)
			.then(response => {
				routes = response.json()
			})
			.then(data => console.log(data))
		return routes
	},
	loadMeta: async function (state) {
		let meta = {}
		// console.log(`${state.user.server}/api/load_meta?doctype=${state.route.doctype}`)
		await fetch(`${state.user.server}/api/load_meta?doctype=${state.route.doctype}`).then(response => {
			meta = response.json()
		})
		// .then(data => console.log(data))
		return meta
	},
	loadData: async function (state) {
		let query = `${state.user.server}/api/load_data?doctype=${state.routes.currentDoctype}`
		if (state.route.document) {
			query += `&document=${state.routes.currentDocument}`
		}
		let data = {}
		console.log(query)
		await fetch(query)
			.then(response => {
				data = response.json()
			})
			.then(data => console.log(data))
		return data
	},
	saveData: function (state) {
		let data = {}
	},
	ping: function () {
		console.log('ping')
		return 'http://localhost:3000'
	},
	//uploadFiles?
}

// graphql adaptor
export const graphql = {
	loadRoutes: function (user) {
		let routes = {}
		fetch(`${user.server}/load_routes`).then(response => {
			routes = response.json()
		})
		// .then(data => console.log(data))
		return routes
	},
	loadMeta: function (state) {
		let meta = {}
	},
	loadData: function (state) {
		let data = {}
	},
	saveData: function (state) {
		let data = {}
	},
	//uploadFiles?
}

export const frappe = {
	loadRoutes: function (state) {
		let routes = {}
		fetch(`${user.server}/load_routes`)
			.then(response => {
				routes = response.json()
			})
			.then(data => console.log(data))
		return routes
	},
	loadMeta: function (state) {
		let meta = {}
	},
	loadData: function (state) {
		let data = {}
	},
	saveData: function (state) {
		let data = {}
	},
	//uploadFiles?
}
