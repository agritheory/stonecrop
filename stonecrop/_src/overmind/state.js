import { derived } from 'overmind'

export const state = {
	user: {
		adaptor: 'http', // or graphql or frappe
		server: '',
		username: '',
		token: '',
	},
	route: {
		view: 'login',
		module: '',
		doctype: '',
		document: '',
		breadcrumbs: derived((state, rootState) => {
			let crumbs = []
			if (rootState.route.view == 'login') {
				return crumbs
			}
			if (rootState.route.doctype) {
				crumbs.push({
					title: rootState.route.doctype,
					to: `/${rootState.route.doctype}`,
				})
			}
			if (rootState.route.document) {
				crumbs.push({
					title: rootState.route.document,
					to: `/${rootState.route.doctype}/${rootState.route.document}`,
				})
			}
			return crumbs
		}),
	},
	meta: {},
	data: {},
}
