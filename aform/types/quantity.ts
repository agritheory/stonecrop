import { InputHTMLAttributes } from 'vue'

export interface Quantity extends InputHTMLAttributes {
	quantity: number

	conversionFactor?: number
	stockUom?: string
	uom?: string
	uoms?: string[]
}
