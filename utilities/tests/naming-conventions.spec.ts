import { describe, it, expect } from 'vitest'
import {
	snakeToCamel,
	camelToSnake,
	snakeToLabel,
	camelToLabel,
	convertSQLName,
	convertSQLNames,
	createNameMapping,
} from '../src/naming-conventions'

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

	describe('convertSQLName', () => {
		it('should convert SQL column name to field name and label', () => {
			const result = convertSQLName('user_email')
			expect(result.fieldname).toBe('userEmail')
			expect(result.label).toBe('User Email')
			expect(result.originalName).toBe('user_email')
		})

		it('should handle ID suffix', () => {
			const result = convertSQLName('user_id')
			expect(result.fieldname).toBe('userId')
			expect(result.label).toBe('User')
		})

		it('should handle created_at timestamp', () => {
			const result = convertSQLName('created_at')
			expect(result.fieldname).toBe('createdAt')
			expect(result.label).toBe('Created At')
			expect(result.originalName).toBe('created_at')
		})
	})

	describe('convertSQLNames', () => {
		it('should convert multiple SQL names', () => {
			const names = ['user_id', 'first_name', 'email_address']
			const results = convertSQLNames(names)

			expect(results).toHaveLength(3)
			expect(results[0].fieldname).toBe('userId')
			expect(results[1].fieldname).toBe('firstName')
			expect(results[2].fieldname).toBe('emailAddress')
		})

		it('should handle empty array', () => {
			const results = convertSQLNames([])
			expect(results).toEqual([])
		})
	})

	describe('createNameMapping', () => {
		it('should create mapping from SQL names to camelCase', () => {
			const names = ['user_id', 'first_name', 'email_address']
			const mapping = createNameMapping(names)

			expect(mapping.sqlToFieldname.get('user_id')).toBe('userId')
			expect(mapping.sqlToFieldname.get('first_name')).toBe('firstName')
			expect(mapping.sqlToFieldname.get('email_address')).toBe('emailAddress')

			expect(mapping.fieldnameToSQL.get('userId')).toBe('user_id')
			expect(mapping.fieldnameToSQL.get('firstName')).toBe('first_name')
			expect(mapping.fieldnameToSQL.get('emailAddress')).toBe('email_address')
		})

		it('should handle empty array', () => {
			const mapping = createNameMapping([])
			expect(mapping.sqlToFieldname.size).toBe(0)
			expect(mapping.fieldnameToSQL.size).toBe(0)
			expect(mapping.conversions).toHaveLength(0)
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
			// Label back to snake would require custom function
		})
	})
})
