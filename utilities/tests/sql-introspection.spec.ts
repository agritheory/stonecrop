import { describe, it, expect } from 'vitest'
import {
	mapSQLTypeToFieldType,
	parseDDL,
	convertTableToSchema,
	introspectSQL,
	type SQLTable,
} from '../src/sql-introspection'

describe('SQL Introspection', () => {
	describe('mapSQLTypeToFieldType', () => {
		it('should map integer types to Int', () => {
			expect(mapSQLTypeToFieldType('INTEGER')).toBe('Int')
			expect(mapSQLTypeToFieldType('INT')).toBe('Int')
			expect(mapSQLTypeToFieldType('SMALLINT')).toBe('Int')
			expect(mapSQLTypeToFieldType('BIGINT')).toBe('Int')
			expect(mapSQLTypeToFieldType('SERIAL')).toBe('Int')
		})

		it('should map numeric types to Float', () => {
			expect(mapSQLTypeToFieldType('NUMERIC')).toBe('Float')
			expect(mapSQLTypeToFieldType('DECIMAL')).toBe('Float')
			expect(mapSQLTypeToFieldType('REAL')).toBe('Float')
			expect(mapSQLTypeToFieldType('FLOAT')).toBe('Float')
			expect(mapSQLTypeToFieldType('DOUBLE')).toBe('Float')
		})

		it('should map text types correctly', () => {
			expect(mapSQLTypeToFieldType('VARCHAR')).toBe('Data')
			expect(mapSQLTypeToFieldType('TEXT')).toBe('Text')
			expect(mapSQLTypeToFieldType('CHAR')).toBe('Data')
			expect(mapSQLTypeToFieldType('CHARACTER')).toBe('Data')
		})

		it('should map date/time types correctly', () => {
			expect(mapSQLTypeToFieldType('DATE')).toBe('Date')
			expect(mapSQLTypeToFieldType('TIMESTAMP')).toBe('Datetime')
			expect(mapSQLTypeToFieldType('TIME')).toBe('Time')
		})

		it('should map boolean to Check', () => {
			expect(mapSQLTypeToFieldType('BOOLEAN')).toBe('Check')
			expect(mapSQLTypeToFieldType('BOOL')).toBe('Check')
		})

		it('should map JSON types to Code', () => {
			expect(mapSQLTypeToFieldType('JSON')).toBe('Code')
			expect(mapSQLTypeToFieldType('JSONB')).toBe('Code')
		})

		it('should default to Data for unknown types', () => {
			expect(mapSQLTypeToFieldType('UNKNOWN_TYPE')).toBe('Data')
		})

		it('should map enum to Select', () => {
			expect(mapSQLTypeToFieldType('custom_enum', ['active', 'inactive'])).toBe('Select')
		})

		it('should map money to Currency', () => {
			expect(mapSQLTypeToFieldType('MONEY')).toBe('Currency')
		})
	})

	describe('parseDDL', () => {
		it('should parse simple CREATE TABLE statement', () => {
			const ddl = `
				CREATE TABLE users (
					id SERIAL PRIMARY KEY,
					name VARCHAR(255) NOT NULL,
					email VARCHAR(255) UNIQUE
				);
			`
			const result = parseDDL(ddl)

			expect(result).toHaveLength(1)
			expect(result[0].name).toBe('users')
			expect(result[0].columns).toHaveLength(2)
			expect(result[0].columns[0].name).toBe('name')
			expect(result[0].columns[1].name).toBe('email')
			expect(result[0].columns[1].unique).toBe(true)
		})

		it('should parse table with various field types', () => {
			const ddl = `
				CREATE TABLE posts (
					id SERIAL PRIMARY KEY,
					title VARCHAR(255) NOT NULL,
					content TEXT,
					published_date DATE,
					created_at TIMESTAMP,
					is_published BOOLEAN DEFAULT false
				);
			`
			const result = parseDDL(ddl)

			expect(result).toHaveLength(1)
			const columns = result[0].columns
			expect(columns.find(c => c.name === 'content')).toBeDefined()
			expect(columns.find(c => c.name === 'published_date')).toBeDefined()
			expect(columns.find(c => c.name === 'created_at')).toBeDefined()
			expect(columns.find(c => c.name === 'is_published')).toBeDefined()
		})

		it('should parse table with foreign keys', () => {
			const ddl = `
				CREATE TABLE comments (
					id SERIAL PRIMARY KEY,
					post_id INT REFERENCES posts(id),
					user_id INT REFERENCES users(id),
					content TEXT NOT NULL
				);
			`
			const result = parseDDL(ddl)

			expect(result).toHaveLength(1)
			const postIdCol = result[0].columns.find(c => c.name === 'post_id')
			expect(postIdCol?.foreignKey).toBeDefined()
			expect(postIdCol?.foreignKey?.table).toBe('posts')
			expect(postIdCol?.foreignKey?.column).toBe('id')
		})

		it('should handle IF NOT EXISTS', () => {
			const ddl = 'CREATE TABLE IF NOT EXISTS products (id INT);'
			const result = parseDDL(ddl)
			expect(result).toHaveLength(1)
			expect(result[0].name).toBe('products')
		})

		it('should handle multiple CREATE TABLE statements', () => {
			const ddl = `
				CREATE TABLE users (id INT);
				CREATE TABLE posts (id INT);
			`
			const result = parseDDL(ddl)
			expect(result).toHaveLength(2)
			expect(result[0].name).toBe('users')
			expect(result[1].name).toBe('posts')
		})

		it('should parse constraints', () => {
			const ddl = `
				CREATE TABLE products (
					id SERIAL PRIMARY KEY,
					name VARCHAR(255) NOT NULL UNIQUE,
					price NUMERIC(10,2),
					category_id INT REFERENCES categories(id)
				);
			`
			const result = parseDDL(ddl)
			const nameCol = result[0].columns.find(c => c.name === 'name')
			expect(nameCol?.notNull).toBe(true)
			expect(nameCol?.unique).toBe(true)

			// CHECK constraints are not yet parsed
			const priceCol = result[0].columns.find(c => c.name === 'price')
			expect(priceCol).toBeDefined()
		})
	})

	describe('convertTableToSchema', () => {
		it('should convert SQL table to Stonecrop schema', () => {
			const table: SQLTable = {
				name: 'users',
				columns: [
					{
						name: 'id',
						sqlType: 'SERIAL',
						notNull: true,
						primaryKey: true,
						unique: false,
					},
					{
						name: 'email',
						sqlType: 'VARCHAR(255)',
						notNull: true,
						primaryKey: false,
						unique: true,
					},
					{
						name: 'created_at',
						sqlType: 'TIMESTAMP',
						notNull: false,
						primaryKey: false,
						unique: false,
					},
				],
			}

			const result = convertTableToSchema(table)

			expect(result.doctype).toBe('users')
			expect(result.schema).toHaveLength(3)

			const emailField = result.schema.find(f => f.fieldname === 'email')
			expect(emailField?.fieldtype).toBe('Data')
			expect(emailField?.required).toBe(true)
		})

		it('should handle foreign keys as Link fields', () => {
			const table: SQLTable = {
				name: 'comments',
				columns: [
					{
						name: 'id',
						sqlType: 'SERIAL',
						notNull: true,
						primaryKey: true,
						unique: false,
					},
					{
						name: 'user_id',
						sqlType: 'INT',
						notNull: true,
						primaryKey: false,
						unique: false,
						foreignKey: { table: 'users', column: 'id' },
					},
				],
			}

			const result = convertTableToSchema(table)
			const userIdField = result.schema.find(f => f.fieldname === 'user_id')
			expect(userIdField?.fieldtype).toBe('Link')
			expect(userIdField?.options).toBe('users')
		})

		it('should handle with naming converter function', () => {
			const table: SQLTable = {
				name: 'blog_posts',
				columns: [
					{
						name: 'post_id',
						sqlType: 'INT',
						notNull: true,
						primaryKey: true,
						unique: false,
					},
				],
			}

			const result = convertTableToSchema(table, (name: string) => ({
				fieldname: name.toUpperCase(),
				label: name.replace('_', ' ').toUpperCase(),
			}))
			const field = result.schema.find(f => f.fieldname === 'POST_ID')
			expect(field).toBeDefined()
		})
	})

	describe('introspectSQL', () => {
		it('should introspect multiple tables and convert to schemas', () => {
			const ddl = `
				CREATE TABLE users (
					id SERIAL PRIMARY KEY,
					email VARCHAR(255) UNIQUE NOT NULL
				);

				CREATE TABLE posts (
					id SERIAL PRIMARY KEY,
					user_id INT REFERENCES users(id),
					title VARCHAR(255) NOT NULL
				);
			`

			const result = introspectSQL(ddl)

			expect(result).toHaveLength(2)
			expect(result[0].doctype).toBe('users')
			expect(result[1].doctype).toBe('posts')

			const usersSchema = result.find(s => s.doctype === 'users')
			expect(usersSchema).toBeDefined()
			expect(usersSchema?.schema.length).toBeGreaterThanOrEqual(1)

			const postsSchema = result.find(s => s.doctype === 'posts')
			expect(postsSchema).toBeDefined()
			const userIdField = postsSchema?.schema.find(f => f.fieldname === 'user_id')
			expect(userIdField?.fieldtype).toBe('Link')
			expect(userIdField?.options).toBe('users')
		})

		it('should apply naming conversions', () => {
			const ddl = `
				CREATE TABLE user_profiles (
					user_id INT PRIMARY KEY,
					first_name VARCHAR(255)
				);
			`

			const result = introspectSQL(ddl, (name: string) => ({
				fieldname: name.replace('_', ''),
				label: name.toUpperCase(),
			}))
			const schema = result[0]

			const firstNameField = schema.schema.find(f => f.fieldname === 'firstname')
			expect(firstNameField).toBeDefined()
			expect(firstNameField?.label).toBe('FIRST_NAME')
		})
	})
})
