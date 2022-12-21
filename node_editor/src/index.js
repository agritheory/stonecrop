// export install() that is plugin compatible

function install(app, options) {
	app.component('NodeEditor', NodeEditor)
}

export default {
	install,
}
