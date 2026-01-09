import { describe, it, expect } from 'vitest'
import { convertSchema, parseDDL, normalizeType, mapColumnToField, PG_TYPE_MAP, TYPE_ALIASES } from '../src/converter'
import type { ParsedColumn, ParsedTable } from '../src/converter'

describe('Schema Converter', () => {
	describe('normalizeType', () => {
		it('should normalize integer type aliases', () => {
			expect(normalizeType('int')).toBe('integer')
			expect(normalizeType('int2')).toBe('smallint')
			expect(normalizeType('int4')).toBe('integer')
			expect(normalizeType('int8')).toBe('bigint')
		})

		it('should normalize float type aliases', () => {
			expect(normalizeType('float')).toBe('real')
			expect(normalizeType('float4')).toBe('real')
			expect(normalizeType('float8')).toBe('double precision')
		})

		it('should normalize boolean alias', () => {
			expect(normalizeType('bool')).toBe('boolean')
		})

		it('should normalize character type aliases', () => {
			expect(normalizeType('character')).toBe('char')
			expect(normalizeType('character varying')).toBe('varchar')
		})

		it('should normalize timestamp aliases', () => {
			expect(normalizeType('timestamp without time zone')).toBe('timestamp')
			expect(normalizeType('timestamp with time zone')).toBe('timestamptz')
		})

		it('should return unknown for unrecognized types', () => {
			expect(normalizeType('custom_type')).toBe('unknown')
		})

		it('should handle case insensitivity', () => {
			expect(normalizeType('INTEGER')).toBe('integer')
			expect(normalizeType('VARCHAR')).toBe('varchar')
			expect(normalizeType('Boolean')).toBe('boolean')
		})

		it('should strip type parameters', () => {
			expect(normalizeType('varchar(255)')).toBe('varchar')
			expect(normalizeType('numeric(10,2)')).toBe('numeric')
		})
	})

	describe('PG_TYPE_MAP', () => {
		it('should map integer types to Int fieldtype', () => {
			expect(PG_TYPE_MAP.integer.fieldtype).toBe('Int')
			expect(PG_TYPE_MAP.smallint.fieldtype).toBe('Int')
			expect(PG_TYPE_MAP.bigint.fieldtype).toBe('Int')
			expect(PG_TYPE_MAP.serial.fieldtype).toBe('Int')
		})

		it('should map float types to Float fieldtype', () => {
			expect(PG_TYPE_MAP.real.fieldtype).toBe('Float')
			expect(PG_TYPE_MAP['double precision'].fieldtype).toBe('Float')
		})

		it('should map decimal types to Decimal fieldtype', () => {
			expect(PG_TYPE_MAP.numeric.fieldtype).toBe('Decimal')
			expect(PG_TYPE_MAP.decimal.fieldtype).toBe('Decimal')
			expect(PG_TYPE_MAP.money.fieldtype).toBe('Decimal')
		})

		it('should map text types correctly', () => {
			expect(PG_TYPE_MAP.varchar.fieldtype).toBe('Data')
			expect(PG_TYPE_MAP.text.fieldtype).toBe('Text')
			expect(PG_TYPE_MAP.char.fieldtype).toBe('Data')
		})

		it('should map date/time types correctly', () => {
			expect(PG_TYPE_MAP.date.fieldtype).toBe('Date')
			expect(PG_TYPE_MAP.timestamp.fieldtype).toBe('Datetime')
			expect(PG_TYPE_MAP.timestamptz.fieldtype).toBe('Datetime')
			expect(PG_TYPE_MAP.time.fieldtype).toBe('Time')
			expect(PG_TYPE_MAP.interval.fieldtype).toBe('Duration')
		})

		it('should map boolean to Check', () => {
			expect(PG_TYPE_MAP.boolean.fieldtype).toBe('Check')
		})

		it('should map JSON types to JSON fieldtype', () => {
			expect(PG_TYPE_MAP.json.fieldtype).toBe('JSON')
			expect(PG_TYPE_MAP.jsonb.fieldtype).toBe('JSON')
		})

		it('should include component mappings', () => {
			expect(PG_TYPE_MAP.integer.component).toBe('ANumericInput')
			expect(PG_TYPE_MAP.text.component).toBe('ATextInput')
			expect(PG_TYPE_MAP.boolean.component).toBe('ACheckbox')
			expect(PG_TYPE_MAP.date.component).toBe('ADatePicker')
		})
	})

	describe('parseDDL', () => {
		it('should parse simple CREATE TABLE statement', () => {
			const ddl = `
				CREATE TABLE users (
					id serial PRIMARY KEY,
					name varchar(255) NOT NULL,
					email varchar(255) UNIQUE
				);
			`
			const result = parseDDL(ddl)

			expect(result).toHaveLength(1)
			expect(result[0].name).toBe('users')
			expect(result[0].columns).toHaveLength(3)
			expect(result[0].columns.map(c => c.name)).toContain('id')
			expect(result[0].columns.map(c => c.name)).toContain('name')
			expect(result[0].columns.map(c => c.name)).toContain('email')
		})

		it('should parse table with various field types', () => {
			const ddl = `
				CREATE TABLE posts (
					id serial PRIMARY KEY,
					title varchar(255) NOT NULL,
					content text,
					published_date date,
					created_at timestamp,
					is_published boolean DEFAULT false
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
					id serial PRIMARY KEY,
					post_id integer REFERENCES posts(id),
					user_id integer REFERENCES users(id),
					content text NOT NULL
				);
			`
			const result = parseDDL(ddl)

			expect(result).toHaveLength(1)
			const postIdCol = result[0].columns.find(c => c.name === 'post_id')
			expect(postIdCol?.reference).toBeDefined()
			expect(postIdCol?.reference?.table).toBe('posts')
			expect(postIdCol?.reference?.column).toBe('id')
		})

		it('should handle IF NOT EXISTS', () => {
			const ddl = 'CREATE TABLE IF NOT EXISTS products (id integer);'
			const result = parseDDL(ddl)
			expect(result).toHaveLength(1)
			expect(result[0].name).toBe('products')
		})

		it('should handle multiple CREATE TABLE statements', () => {
			const ddl = `
				CREATE TABLE users (id integer);
				CREATE TABLE posts (id integer);
			`
			const result = parseDDL(ddl)
			expect(result).toHaveLength(2)
			expect(result[0].name).toBe('users')
			expect(result[1].name).toBe('posts')
		})

		it('should parse NOT NULL constraint', () => {
			const ddl = `
				CREATE TABLE products (
					id serial PRIMARY KEY,
					name varchar(255) NOT NULL,
					description text
				);
			`
			const result = parseDDL(ddl)
			const nameCol = result[0].columns.find(c => c.name === 'name')
			const descCol = result[0].columns.find(c => c.name === 'description')
			expect(nameCol?.nullable).toBe(false)
			expect(descCol?.nullable).toBe(true)
		})

		it('should parse default values', () => {
			const ddl = `
				CREATE TABLE settings (
					id serial PRIMARY KEY,
					enabled boolean DEFAULT true,
					count integer DEFAULT 0
				);
			`
			const result = parseDDL(ddl)
			const enabledCol = result[0].columns.find(c => c.name === 'enabled')
			const countCol = result[0].columns.find(c => c.name === 'count')
			// AST parser wraps expressions in parens
			expect(enabledCol?.defaultValue).toBe('(true)')
			expect(countCol?.defaultValue).toBe('(0)')
		})

		it('should parse table comments for doctype names', () => {
			const ddl = `
				CREATE TABLE sales_order (
					id serial PRIMARY KEY,
					customer_id integer
				);
				COMMENT ON TABLE sales_order IS '@doctype SalesOrder - Main sales document';
			`
			const result = parseDDL(ddl)
			expect(result).toHaveLength(1)
			expect(result[0].comment).toBe('@doctype SalesOrder - Main sales document')
			expect(result[0].doctypeName).toBe('SalesOrder')
		})

		it('should handle table inheritance', () => {
			const ddl = `
				CREATE TABLE base_entity (
					id serial PRIMARY KEY,
					created_at timestamp DEFAULT now()
				);
				CREATE TABLE products (
					name varchar(255) NOT NULL,
					price numeric(10,2)
				) INHERITS (base_entity);
			`
			const result = parseDDL(ddl)
			expect(result).toHaveLength(2)
			const products = result.find(t => t.name === 'products')
			expect(products?.inherits).toContain('base_entity')
		})
	})

	describe('mapColumnToField', () => {
		const emptyRegistry = new Map<string, ParsedTable>()

		it('should map a simple varchar column', () => {
			const column: ParsedColumn = {
				name: 'email',
				dataType: 'varchar',
				normalizedType: 'varchar',
				nullable: false,
				isGenerated: false,
				arrayDimensions: 0,
			}
			const field = mapColumnToField(column, emptyRegistry)

			expect(field.fieldname).toBe('email')
			expect(field.fieldtype).toBe('Data')
			expect(field.component).toBe('ATextInput')
			expect(field.required).toBe(true)
		})

		it('should map foreign key to Link field', () => {
			const column: ParsedColumn = {
				name: 'user_id',
				dataType: 'integer',
				normalizedType: 'integer',
				nullable: false,
				isGenerated: false,
				arrayDimensions: 0,
				reference: { table: 'users', column: 'id' },
			}
			const field = mapColumnToField(column, emptyRegistry)

			expect(field.fieldtype).toBe('Link')
			expect(field.component).toBe('ALink')
			expect(field.options).toBe('users')
		})

		it('should map array types to Doctype', () => {
			const column: ParsedColumn = {
				name: 'tags',
				dataType: 'text',
				normalizedType: 'text',
				nullable: true,
				isGenerated: false,
				arrayDimensions: 1,
			}
			const field = mapColumnToField(column, emptyRegistry)

			expect(field.fieldtype).toBe('Doctype')
			expect(field.component).toBe('ATable')
		})

		it('should mark generated columns as readOnly', () => {
			const column: ParsedColumn = {
				name: 'total',
				dataType: 'numeric',
				normalizedType: 'numeric',
				nullable: true,
				isGenerated: true,
				arrayDimensions: 0,
			}
			const field = mapColumnToField(column, emptyRegistry)

			expect(field.readOnly).toBe(true)
			expect(field.required).toBe(false)
		})

		it('should use camelCase when option is set', () => {
			const column: ParsedColumn = {
				name: 'user_email',
				dataType: 'varchar',
				normalizedType: 'varchar',
				nullable: true,
				isGenerated: false,
				arrayDimensions: 0,
			}
			const field = mapColumnToField(column, emptyRegistry, { useCamelCase: true })

			expect(field.fieldname).toBe('userEmail')
			expect(field.label).toBe('User Email')
		})

		it('should include precision for decimal types', () => {
			const column: ParsedColumn = {
				name: 'price',
				dataType: 'numeric',
				normalizedType: 'numeric',
				nullable: true,
				isGenerated: false,
				arrayDimensions: 0,
				precision: 10,
				scale: 2,
			}
			const field = mapColumnToField(column, emptyRegistry)

			expect(field.options).toEqual({ precision: 10, scale: 2 })
		})
	})

	describe('convertSchema', () => {
		it('should convert DDL to doctype schemas', () => {
			const ddl = `
				CREATE TABLE users (
					id serial PRIMARY KEY,
					email varchar(255) NOT NULL
				);
			`
			const result = convertSchema(ddl, { inheritanceMode: 'flatten' })

			expect(result).toHaveLength(1)
			expect(result[0].name).toBe('Users')
			expect(result[0].slug).toBe('users')
			expect(result[0].tableName).toBe('users')
			expect(result[0].fields.length).toBeGreaterThanOrEqual(1)
		})

		it('should use @doctype name from comment', () => {
			const ddl = `
				CREATE TABLE sales_order (
					id serial PRIMARY KEY
				);
				COMMENT ON TABLE sales_order IS '@doctype SalesOrder';
			`
			const result = convertSchema(ddl, { inheritanceMode: 'flatten' })

			expect(result[0].name).toBe('SalesOrder')
			expect(result[0].slug).toBe('sales-order')
		})

		it('should handle foreign keys as Link fields', () => {
			const ddl = `
				CREATE TABLE users (id serial PRIMARY KEY);
				CREATE TABLE posts (
					id serial PRIMARY KEY,
					user_id integer REFERENCES users(id)
				);
			`
			const result = convertSchema(ddl, { inheritanceMode: 'flatten' })

			const posts = result.find(d => d.tableName === 'posts')
			const userIdField = posts?.fields.find(f => f.fieldname === 'user_id')
			expect(userIdField?.fieldtype).toBe('Link')
			expect(userIdField?.options).toBe('users')
		})

		it('should flatten inherited fields', () => {
			const ddl = `
				CREATE TABLE base_entity (
					id serial PRIMARY KEY,
					created_at timestamp DEFAULT now()
				);
				CREATE TABLE products (
					name varchar(255) NOT NULL
				) INHERITS (base_entity);
			`
			const result = convertSchema(ddl, { inheritanceMode: 'flatten' })

			const products = result.find(d => d.tableName === 'products')
			expect(products?.fields.map(f => f.fieldname)).toContain('id')
			expect(products?.fields.map(f => f.fieldname)).toContain('created_at')
			expect(products?.fields.map(f => f.fieldname)).toContain('name')
		})

		it('should exclude specified tables', () => {
			const ddl = `
				CREATE TABLE users (id serial PRIMARY KEY);
				CREATE TABLE internal_logs (id serial PRIMARY KEY);
				CREATE TABLE posts (id serial PRIMARY KEY);
			`
			const result = convertSchema(ddl, {
				inheritanceMode: 'flatten',
				exclude: ['internal_logs'],
			})

			expect(result).toHaveLength(2)
			expect(result.map(d => d.tableName)).not.toContain('internal_logs')
		})

		it('should filter by schema', () => {
			const ddl = `
				CREATE TABLE public.users (id serial PRIMARY KEY);
				CREATE TABLE audit.logs (id serial PRIMARY KEY);
			`
			const result = convertSchema(ddl, {
				inheritanceMode: 'flatten',
				schema: 'public',
			})

			expect(result).toHaveLength(1)
			expect(result[0].tableName).toBe('users')
		})

		it('should apply type overrides', () => {
			const ddl = `
				CREATE TABLE products (
					id serial PRIMARY KEY,
					image_data bytea
				);
			`
			const result = convertSchema(ddl, {
				inheritanceMode: 'flatten',
				typeOverrides: {
					image_data: { fieldtype: 'Attach', component: 'AFileAttach' },
				},
			})

			const imageField = result[0].fields.find(f => f.fieldname === 'image_data')
			expect(imageField?.fieldtype).toBe('Attach')
			expect(imageField?.component).toBe('AFileAttach')
		})

		it('should use camelCase when option is set', () => {
			const ddl = `
				CREATE TABLE user_profiles (
					user_id serial PRIMARY KEY,
					first_name varchar(255),
					last_name varchar(255)
				);
			`
			const result = convertSchema(ddl, {
				inheritanceMode: 'flatten',
				useCamelCase: true,
			})

			const fields = result[0].fields
			expect(fields.map(f => f.fieldname)).toContain('userId')
			expect(fields.map(f => f.fieldname)).toContain('firstName')
			expect(fields.map(f => f.fieldname)).toContain('lastName')
		})
	})
})
