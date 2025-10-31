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
export class NotImplementedError extends Error {
	constructor(message: string = '') {
		super(message)
		this.name = 'NotImplemented'
	}
}
