import type { IClientOptions } from 'mqtt'

/**
 * @public
 */
export type ListViewItem = {
	barcode?: string
	checked?: boolean
	count?: {
		count: number
		of: number
		uom?: string
	}
	date?: string
	dateFormat?: string
	debounce?: number
	description?: string
	label?: string
	linkComponent?: string
	route?: string
}

// TODO: the `string` at the end should be replaced by `DataType.Color`
// in the `csstype` lib but import seems to be missing
/**
 * @public
 */
export type BeamColor = RGB | RGBA | HEX | HSL | HSLA | string

/**
 * @public
 */
export type BeamFilterChoice = {
	label: string
	value: string
}

/**
 * RGB color string representation
 * @public
 */
export type RGB = `rgb(${number}, ${number}, ${number})`

/**
 * RGBA color string representation
 * @public
 */
export type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`

/**
 * HSL color string representation
 * @public
 */
export type HSL = `hsl(${number}, ${number}%, ${number}%)`

/**
 * HSLA color string representation
 * @public
 */
export type HSLA = `hsl(${number}, ${number}%, ${number}%), ${number}`

/**
 * HEX color string representation
 * @public
 */
export type HEX = `#${string}`

/**
 * MQTT stream options
 * @public
 */
export interface IMqttStream extends IClientOptions {
	topics?: string[]
}
