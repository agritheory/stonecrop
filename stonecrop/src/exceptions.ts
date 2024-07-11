/**
 * NotImplementedError
 * @param message {string} - The error message
 * @class
 * @description This error is thrown when a method has not been implemented
 * @example
 * throw new NotImplementedError('Method not implemented')
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error|Error}
 * @public
 */
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
