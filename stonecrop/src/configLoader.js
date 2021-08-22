// import { resolve } from 'path'

export default class StonecropConfigLoader {
	constructor(configPath=undefined){
		if(configPath === undefined){
			// use cwd
			// import(resolve('./stonecrop.config.js'))
			// .then(config => {
			// 	console.log(config)
			// 	// this.config = {}
			// })
		} else {
			// use path provided
			import(resolve(configPath))
			.then(config => {
				console.log(config)
				// this.config = {}
			})
		}
	}
	loadRoutes(){

	}
	loadEvents(){

	}
	loadClient(){

	}
	loadCustomComponents(){

	}
}