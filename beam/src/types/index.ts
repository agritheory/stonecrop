import type { IClientOptions } from 'mqtt'

/**
 * @beta
 */
export type ListViewItem = {
	description: string
	label: string

	checked?: boolean
	count?: {
		count: number
		of: number
		uom: string
	}
	date?: string
	dateFormat?: string
	debounce?: number
	linkComponent?: string
	route?: string
}

type RGB = `rgb(${number}, ${number}, ${number})`
type HSL = `hsl(${number}, ${number}%, ${number}%)`
type HSLA = `hsl(${number}, ${number}%, ${number}%), ${number}`
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`
type HEX = `#${string}`

export type Color = RGB | RGBA | HEX | HSL | HSLA | string
/**
 * MQTT stream options
 * @public
 */
export interface IMqttStream extends IClientOptions {
	topics?: string[]
}
