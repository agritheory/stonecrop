import { InputHTMLAttributes } from 'vue'

export interface Quantity extends InputHTMLAttributes {
	quantity: number
	uoms?: string[]
	uom?: string
	stockUom?: string
	conversionFactor?: number
}
