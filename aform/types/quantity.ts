import { InputHTMLAttributes } from 'vue'

export interface Quantity extends InputHTMLAttributes {
	quantity: number
	uom?: string
	stockUom?: string
	conversionFactor?: number
}
