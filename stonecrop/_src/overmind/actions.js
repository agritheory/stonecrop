export const routeChange = async ({ state, effects, actions }, data) => {
	let routeSplit = data.path.split('/')
	let view = data.query.view
	if (routeSplit.length == 1) {
		state.route.view = view || 'login'
		state.route.doctype = null
		state.route.document = null
	} else if (routeSplit.length == 2) {
		state.route.view = view || 'table' // provide logic for default view from user
		state.route.doctype = decodeURI(routeSplit[1])
		state.route.document = null
	} else if (routeSplit.length == 3) {
		state.route.view = view || 'form' // provide logic for default view from user
		state.route.doctype = decodeURI(routeSplit[1])
		state.route.document = decodeURI(routeSplit[2])
	}
}

export const loadRoutes = async ({ state, effects, actions }) => {
	state.route = await effects[state.user.adaptor].loadRoutes(state)
}

export const loadMeta = async ({ state, effects, actions }) => {
	if (state.route.doctype) {
		state.meta[state.route.doctype] = await effects[state.user.adaptor].loadMeta(state)
	}
}

export const loadData = async ({ state, effects, actions }, route) => {
	// parse route
	state.data = await effects[state.user.adaptor].loadData(state)
}

export const saveData = async ({ state, effects, actions }, data) => {
	state.data = await effects[state.user.adaptor].saveData(state)
}

export const pretend = async ({ state, effects, actions }, data) => {
	// console.log('pretend', data)
	state.user.server = effects['fetch'].ping()
}

export const onInitializeOvermind = async ({ state, localStorage }, overmind) => {
	// TODO: needs more design
	overmind.addMutationListener(mutation => {
		// console.log(mutation, state)
		let path = mutation.path.split('.')
		// if (mutation.path.indexOf('todos') === 0) {
		// 	localStorage.set('todos', state.todos)
		// }
	})
}
