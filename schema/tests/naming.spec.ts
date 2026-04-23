import { describe, it, expect } from 'vitest'
import {
	snakeToCamel,
	camelToSnake,
	snakeToLabel,
	camelToLabel,
	toPascalCase,
	toSlug,
	pascalToSnake,
} from '../src/naming'

describe('Naming Conventions', () => {
	describe('snakeToCamel', () => {
		it('should convert simple snake_case to camelCase', () => {
			expect(snakeToCamel('hello_world')).toBe('helloWorld')
		})

		it('should handle single word', () => {
			expect(snakeToCamel('hello')).toBe('hello')
		})

		it('should handle multiple underscores', () => {
			expect(snakeToCamel('first_middle_last_name')).toBe('firstMiddleLastName')
		})

		it('should handle empty string', () => {
			expect(snakeToCamel('')).toBe('')
		})

		it('should handle user_id', () => {
			expect(snakeToCamel('user_id')).toBe('userId')
		})
	})

	describe('camelToSnake', () => {
		it('should convert simple camelCase to snake_case', () => {
			expect(camelToSnake('helloWorld')).toBe('hello_world')
		})

		it('should handle single word', () => {
			expect(camelToSnake('hello')).toBe('hello')
		})

		it('should handle multiple capital letters', () => {
			expect(camelToSnake('firstMiddleLastName')).toBe('first_middle_last_name')
		})

		it('should handle consecutive capitals', () => {
			expect(camelToSnake('userID')).toBe('user_i_d')
		})

		it('should handle empty string', () => {
			expect(camelToSnake('')).toBe('')
		})

		it('should handle PascalCase', () => {
			expect(camelToSnake('HelloWorld')).toBe('_hello_world')
		})
	})

	describe('snakeToLabel', () => {
		it('should convert simple snake_case to Title Case', () => {
			expect(snakeToLabel('hello_world')).toBe('Hello World')
		})

		it('should handle single word', () => {
			expect(snakeToLabel('hello')).toBe('Hello')
		})

		it('should handle multiple underscores', () => {
			expect(snakeToLabel('first_middle_last_name')).toBe('First Middle Last Name')
		})

		it('should handle empty string', () => {
			expect(snakeToLabel('')).toBe('')
		})

		it('should handle user_email', () => {
			expect(snakeToLabel('user_email')).toBe('User Email')
		})
	})

	describe('camelToLabel', () => {
		it('should convert simple camelCase to Title Case', () => {
			expect(camelToLabel('helloWorld')).toBe('Hello World')
		})

		it('should handle single word', () => {
			expect(camelToLabel('hello')).toBe('Hello')
		})

		it('should handle multiple capital letters', () => {
			expect(camelToLabel('firstMiddleLastName')).toBe('First Middle Last Name')
		})

		it('should handle empty string', () => {
			expect(camelToLabel('')).toBe('')
		})

		it('should handle PascalCase', () => {
			expect(camelToLabel('HelloWorld')).toBe('Hello World')
		})
	})

	describe('pascalToSnake', () => {
		it('should convert PascalCase to snake_case', () => {
			expect(pascalToSnake('SalesOrder')).toBe('sales_order')
			expect(pascalToSnake('SalesOrderItem')).toBe('sales_order_item')
		})

		it('should handle single word', () => {
			expect(pascalToSnake('User')).toBe('user')
		})

		it('should handle already lowercase', () => {
			expect(pascalToSnake('user')).toBe('user')
		})

		it('should handle empty string', () => {
			expect(pascalToSnake('')).toBe('')
		})
	})

	describe('toPascalCase', () => {
		it('should convert snake_case to PascalCase', () => {
			expect(toPascalCase('sales_order')).toBe('SalesOrder')
			expect(toPascalCase('user')).toBe('User')
			expect(toPascalCase('sales_order_item')).toBe('SalesOrderItem')
		})

		it('should handle kebab-case', () => {
			expect(toPascalCase('sales-order')).toBe('SalesOrder')
		})

		it('should handle mixed separators', () => {
			expect(toPascalCase('sales_order-item')).toBe('SalesOrderItem')
		})
	})

	describe('toSlug', () => {
		it('should convert snake_case to kebab-case', () => {
			expect(toSlug('sales_order')).toBe('sales-order')
			expect(toSlug('user')).toBe('user')
		})

		it('should convert PascalCase to kebab-case', () => {
			expect(toSlug('SalesOrder')).toBe('sales-order')
			expect(toSlug('SalesOrderItem')).toBe('sales-order-item')
		})

		it('should convert camelCase to kebab-case', () => {
			expect(toSlug('salesOrder')).toBe('sales-order')
		})
	})

	describe('Round-trip conversions', () => {
		it('should maintain consistency: snake -> camel -> snake', () => {
			const original = 'hello_world_test'
			const camelCase = snakeToCamel(original)
			const backToSnake = camelToSnake(camelCase)
			expect(backToSnake).toBe(original)
		})

		it('should maintain consistency: snake -> label -> reconstruct', () => {
			const original = 'user_email'
			const label = snakeToLabel(original)
			expect(label).toBe('User Email')
		})
	})
})
