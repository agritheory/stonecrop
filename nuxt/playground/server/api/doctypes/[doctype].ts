import userJson from '~/doctypes/user.json'
import roleJson from '~/doctypes/role.json'
import roleProfileJson from '~/doctypes/role-profile.json'
import abilityRuleJson from '~/doctypes/ability-rule.json'
import doctypeJson from '~/doctypes/doctype.json'

export default defineEventHandler(async event => {
	const doctype = getRouterParam(event, 'doctype')

	// Map doctype names to their imported JSON schemas
	const doctypeSchemas: Record<string, any> = {
		user: userJson,
		role: roleJson,
		'role-profile': roleProfileJson,
		'ability-rule': abilityRuleJson,
		doctype: doctypeJson,
	}

	const doctypeSchema = doctypeSchemas[doctype || '']
	if (!doctypeSchema) {
		throw createError({
			statusCode: 404,
			message: `DocType '${doctype}' not found`,
		})
	}

	// Additional metadata for each doctype
	const doctypeMetadata: Record<string, any> = {
		user: {
			module: 'Core',
			description: 'User accounts with role-based access control',
			is_submittable: false,
			is_tree: false,
		},
		role: {
			module: 'Core',
			description: 'Roles for permission management with hierarchical support',
			is_submittable: false,
			is_tree: true,
		},
		'role-profile': {
			module: 'Core',
			description: 'Groups of roles assigned together as profiles',
			is_submittable: false,
			is_tree: false,
		},
		'ability-rule': {
			module: 'Core',
			description: 'Permission rules defining what actions roles can perform',
			is_submittable: false,
			is_tree: false,
		},
		doctype: {
			module: 'Core',
			description: 'Document type definitions for schema-driven entities',
			is_submittable: false,
			is_tree: false,
		},
	}

	const metadata = doctypeMetadata[doctype || ''] || {}

	return {
		name: doctype,
		label: doctype
			?.split('-')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' '),
		...metadata,
		fields: doctypeSchema.schema, // Map schema to fields for DocBuilder
		schema: doctypeSchema.schema, // Keep original schema for compatibility
	}
})
