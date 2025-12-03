export default defineEventHandler(async event => {
	const query = getQuery(event)
	const doctype = query.doctype as string

	// Mock data - would query database for ability_rule table
	const allRules = [
		{ id: '1', role_id: '1', doctype: 'user', action: 'create', subject: 'all', inverted: false, active: true },
		{ id: '2', role_id: '1', doctype: 'user', action: 'read', subject: 'all', inverted: false, active: true },
		{ id: '3', role_id: '1', doctype: 'user', action: 'update', subject: 'all', inverted: false, active: true },
		{ id: '4', role_id: '1', doctype: 'user', action: 'delete', subject: 'all', inverted: false, active: true },
		{ id: '5', role_id: '2', doctype: 'role', action: 'read', subject: 'all', inverted: false, active: true },
		{ id: '6', role_id: '3', doctype: 'user', action: 'read', subject: 'own', inverted: false, active: true },
		{ id: '7', role_id: '1', doctype: 'role-profile', action: 'manage', subject: 'all', inverted: false, active: true },
		{ id: '8', role_id: '1', doctype: 'ability-rule', action: 'manage', subject: 'all', inverted: false, active: true },
	]

	// Filter by doctype if provided (case-insensitive)
	if (doctype) {
		return allRules.filter(rule => rule.doctype.toLowerCase() === doctype.toLowerCase())
	}

	return allRules
})
