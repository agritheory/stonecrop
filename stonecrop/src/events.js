export default class Bloom {
	constructor(events=[], hooks={}){
		this.hooks = {
			'onAppLoad': [],
			'beforeRouteChange': [],
			'afterRouteChange': [],
		}
		events.forEach(eventName => {
			if(!this.hooks[eventName]){
				this.addEvent(eventName)
			}
		})
		for (const [hook, hookFunctions] of Object.entries(hooks)) {
			hookFunctions.forEach(hookFunction => {
				this.addHook(hook, hookFunction)
			})
		}
	}
	
	addEvent(eventName, doctype=null){
		if(doctype){
			if(!this.hooks[doctype][eventName]){
				this.hooks[doctype][eventName] = []
				this.prototype[doctype][eventName] = function() { this.on(`${eventName}`) }
			}	
		} else {
			if(!this.hooks[eventName]){
				this.hooks[eventName] = []
				this.prototype[eventName] = function() { this.on(`${eventName}`) }
			}
		}
	}

	addHook(hook, func, order=-1){
		if(this.hooks[hook]){
			this.hooks[hook].splice(order, 0, func)
		}
	}

	on(hook) {
		let result = Promise.resolve()
		this.hooks[hook].forEach(task => {
			if (task) {
				result = result.then ? result.then(task) : Promise.resolve()
			}
		})
		return result
	}
	
	onAppLoad(){
		on('onAppLoad')
	}

	beforeRouteChange(){
		on('beforeRouteChange')
	}

	afterRouteChange(){
		on('afterRouteChange')
	}
}