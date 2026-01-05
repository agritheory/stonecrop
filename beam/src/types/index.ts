import type { IClientOptions } from 'mqtt'
import { CSSProperties } from 'vue'

/**
 * Configuration object for a single item in a ListView component
 * @public
 */
export type ListViewItem = {
	/** Barcode identifier for the item */
	barcode?: string
	/** Whether the item is checked/selected */
	checked?: boolean
	/** Count information including current count and total */
	count?: {
		/** Current count value */
		count: number
		/** Total/target count value */
		of: number
		/** Unit of measurement */
		uom?: string
	}
	/** Date associated with the item */
	date?: string
	/** Format string for displaying the date */
	dateFormat?: string
	/** Debounce delay in milliseconds */
	debounce?: number
	/** Description text for the item */
	description?: string
	/** Display label for the item */
	label?: string
	/** Component name to use for the link */
	linkComponent?: string
	/** Route path for navigation */
	route?: string
}

/**
 * Color value that can be RGB, RGBA, HEX, HSL, HSLA, or any valid CSS color string
 * @public
 */
export type BeamColor = RGB | RGBA | HEX | HSL | HSLA | CSSProperties['color']

/**
 * Filter choice option with a label and value
 * @public
 */
export type BeamFilterChoice = {
	/** Display label for the filter option */
	label: string
	/** Value associated with the filter option */
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
 * MQTT stream configuration options extending MQTT client options
 * @public
 */
export interface IMqttStream extends IClientOptions {
	/** List of MQTT topics to subscribe to */
	topics?: string[]
}
