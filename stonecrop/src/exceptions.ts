export function NotImplementedError(message: string) {
	this.message = message || ''
}

NotImplementedError.prototype = Object.create(Error.prototype, {
	constructor: { value: NotImplementedError },
	name: { value: 'NotImplemented' },
	stack: {
		get: function () {
			return new Error().stack
		},
	},
})
