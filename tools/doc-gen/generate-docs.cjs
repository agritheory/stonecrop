#!/usr/bin/env node

'use strict'

const { ApiModel } = require('@microsoft/api-extractor-model')
const { writeFileSync } = require('fs')
const { join } = require('path')
const {
	collectComponents,
	renderComponentDocs,
	renderComponentReport,
	renderReExports,
	readEntrySurface,
} = require('./component-meta.cjs')

// Helper function to extract TSDoc summary text with better formatting
function extractTSDocSummary(tsdocComment, inlineMode = false) {
	if (!tsdocComment || !tsdocComment.summarySection) return ''

	if (inlineMode) {
		// For inline contexts like table cells, use simpler formatting
		return extractInlineTSDocContent(tsdocComment.summarySection).trim()
	} else {
		// For block contexts, preserve formatting
		return extractFormattedTSDocContent(tsdocComment.summarySection).trim()
	}
}

// Helper function to extract inline TSDoc content for table cells
function extractInlineTSDocContent(node) {
	if (!node) return ''

	// Handle different node types with inline formatting
	switch (node.constructor.name) {
		case 'DocPlainText':
			return node.text || ''

		case 'DocCodeSpan':
			// Use the code getter method to get the content
			const codeContent = node.code || ''
			return `\`${codeContent}\``

		case 'DocLinkTag': {
			const displayText =
				node.linkText || node.codeDestination?.memberReferences?.slice(-1)?.[0]?.memberIdentifier?.identifier || ''
			return displayText ? `\`${displayText}\`` : ''
		}

		case 'DocSoftBreak':
			return ' ' // Convert line breaks to spaces for inline mode

		case 'DocParagraph':
			// For paragraphs in inline mode, join with spaces and format bullet points
			if (node.nodes && Array.isArray(node.nodes)) {
				const content = node.nodes.map(extractInlineTSDocContent).join('')
				// Apply inline bullet point formatting
				return formatInlineBulletPoints(content)
			}
			if (node._nodes && Array.isArray(node._nodes)) {
				const content = node._nodes.map(extractInlineTSDocContent).join('')
				return formatInlineBulletPoints(content)
			}
			break

		case 'DocSection':
			// For sections, just recurse through children
			if (node.nodes && Array.isArray(node.nodes)) {
				return node.nodes.map(extractInlineTSDocContent).join(' ')
			}
			if (node._nodes && Array.isArray(node._nodes)) {
				return node._nodes.map(extractInlineTSDocContent).join(' ')
			}
			break

		default:
			// For unknown node types, try common properties
			if (node.text !== undefined) {
				return node.text
			}
			if (node.content !== undefined) {
				return node.content
			}
			if (node.value !== undefined) {
				return node.value
			}

			// Recurse through child nodes if available
			if (node.nodes && Array.isArray(node.nodes)) {
				return node.nodes.map(extractInlineTSDocContent).join(' ')
			}
			if (node._nodes && Array.isArray(node._nodes)) {
				return node._nodes.map(extractInlineTSDocContent).join(' ')
			}
	}

	return ''
}

// Helper function to format bullet points for inline display
function formatInlineBulletPoints(content) {
	if (!content) return content

	// Pattern to match bullet points with code spans: "- `code` - description"
	// For inline mode, format as: "`code` (description), `code2` (description2)"
	const bulletPattern = /\s*-\s*(`[^`]+`)\s*-\s*([^\n-]+?)(?=\s*-\s*`|\s*$)/g

	const matches = []
	let match
	while ((match = bulletPattern.exec(content)) !== null) {
		matches.push(`${match[1]} (${match[2].trim()})`)
	}

	if (matches.length > 0) {
		return matches.join(', ')
	}

	// If no bullet points found, just clean up the content
	return content.replace(/\s+/g, ' ').trim()
}

// Helper function to parse @param descriptions from TSDoc comments
function parseParamDescriptions(tsdocComment) {
	const paramDescriptions = {}

	if (!tsdocComment || !tsdocComment.params) {
		return paramDescriptions
	}

	// The params block contains @param tags
	for (const paramBlock of tsdocComment.params.blocks) {
		const parameterName = paramBlock.parameterName
		if (paramBlock.content && paramBlock.content.nodes) {
			// Extract the description text from the content nodes
			const description = extractInlineTSDocContent(paramBlock.content).trim()
			if (description) {
				paramDescriptions[parameterName] = description
			}
		}
	}

	return paramDescriptions
}

// Helper function to extract formatted TSDoc content preserving structure
function extractFormattedTSDocContent(node) {
	if (!node) return ''

	// Handle different node types with appropriate formatting
	switch (node.constructor.name) {
		case 'DocPlainText':
			return node.text || ''

		case 'DocCodeSpan':
			// Use the code getter method to get the content
			const codeContent = node.code || ''
			return `\`${codeContent}\``

		case 'DocLinkTag': {
			const displayText =
				node.linkText || node.codeDestination?.memberReferences?.slice(-1)?.[0]?.memberIdentifier?.identifier || ''
			return displayText ? `\`${displayText}\`` : ''
		}

		case 'DocSoftBreak':
			return '\n' // Preserve line breaks for formatting

		case 'DocParagraph':
			// For paragraphs, extract content and apply special formatting for lists
			if (node.nodes && Array.isArray(node.nodes)) {
				const content = node.nodes.map(extractFormattedTSDocContent).join('')
				// Post-process to clean up bullet point formatting
				const formatted = formatBulletPoints(content)
				return formatted + '\n\n'
			}
			if (node._nodes && Array.isArray(node._nodes)) {
				const content = node._nodes.map(extractFormattedTSDocContent).join('')
				// Post-process to clean up bullet point formatting
				const formatted = formatBulletPoints(content)
				return formatted + '\n\n'
			}
			break

		case 'DocSection':
			// For sections, just recurse through children
			if (node.nodes && Array.isArray(node.nodes)) {
				return node.nodes.map(extractFormattedTSDocContent).join('')
			}
			if (node._nodes && Array.isArray(node._nodes)) {
				return node._nodes.map(extractFormattedTSDocContent).join('')
			}
			break

		default:
			// For unknown node types, try common properties
			if (node.text !== undefined) {
				return node.text
			}
			if (node.content !== undefined) {
				return node.content
			}
			if (node.value !== undefined) {
				return node.value
			}

			// Recurse through child nodes if available
			if (node.nodes && Array.isArray(node.nodes)) {
				return node.nodes.map(extractFormattedTSDocContent).join('')
			}
			if (node._nodes && Array.isArray(node._nodes)) {
				return node._nodes.map(extractFormattedTSDocContent).join('')
			}
	}

	return ''
}

// Helper function to format bullet points properly
function formatBulletPoints(content) {
	if (!content) return content

	// Pattern to match bullet points with code spans: "- `code` - description"
	// Replace with proper markdown list format
	const bulletPattern = /\s*-\s*(`[^`]+`)\s*-\s*([^\n-]+?)(?=\s*-\s*`|\s*$)/g

	let formatted = content.replace(bulletPattern, (match, codeSpan, description) => {
		return `\n- ${codeSpan} - ${description.trim()}`
	})

	// Clean up multiple newlines and trim
	formatted = formatted.replace(/\n{3,}/g, '\n\n').trim()

	return formatted
}

// Helper function to normalize type text for markdown tables
function normalizeTypeForTable(typeText) {
	if (!typeText) return ''

	// Replace newlines and excessive whitespace with single spaces
	// Escape pipe characters to prevent breaking markdown table structure
	return typeText.replace(/\n/g, ' ').replace(/\s+/g, ' ').replace(/\|/g, '\\|').trim()
}

// Get project name from command line arguments
const projectName = process.argv[2]
if (!projectName) {
	console.error('❌ Usage: node generate-docs.mjs <project-name>')
	console.error('   Example: node generate-docs.mjs atable')
	process.exit(1)
}

// Normalize project name for API files (convert underscores to hyphens)
// Package folders may use underscores (casl_middleware) but API Extractor uses hyphens (casl-middleware)
const normalizedProjectName = projectName.replace(/_/g, '-')

// Path to the API model files (relative to monorepo root from autoinstaller)
const rootDir = join(__dirname, '../..')
const apiModelPath = join(rootDir, `${projectName}/temp/${normalizedProjectName}.api.json`)
const componentReportPath = join(rootDir, `common/reviews/api/${normalizedProjectName}.components.api.md`)
const outputPath = join(rootDir, `${projectName}/api.md`)

// A missing api.json means the build stopped before API Extractor. Guarding that case wrote a "no
// API documentation available" placeholder over `api.md`, replacing a committed file with less than
// it held; loadPackage below throws instead, which is the loud failure it deserves.
try {
	// Load the API model
	const apiModel = new ApiModel()
	const apiPackage = apiModel.loadPackage(apiModelPath)

	// The component surface comes from vue-component-meta, which reads the SFCs themselves. This
	// used to regex `export { Name }` out of the API report and call every PascalCase match a
	// component, which put 7 raw SVG strings and 2 re-exported types under "Vue Components" with an
	// import example that does not describe them. Resolving each name to a `.vue` file answers the
	// question the regex was standing in for.
	const componentExports = collectComponents(join(rootDir, projectName))

	// Start building the consolidated documentation
	const displayName = projectName.charAt(0).toUpperCase() + projectName.slice(1)
	let markdown = `# ${displayName} API Reference\n\n`
	markdown += `> This documentation is automatically generated from the TypeScript API.\n\n`

	// Get all entry points
	const entryPoint = apiPackage.entryPoints[0]
	if (!entryPoint) {
		throw new Error('No entry point found in the API package')
	}

	// Group members by type
	const components = []
	const functions = []
	const interfaces = []
	const types = []
	const variables = []
	const enums = []
	const classes = []

	for (const member of entryPoint.members) {
		switch (member.kind) {
			case 'Class':
				classes.push(member)
				break
			case 'Function':
				functions.push(member)
				break
			case 'Interface':
				interfaces.push(member)
				break
			case 'TypeAlias':
				types.push(member)
				break
			case 'Variable':
				// Vue plugins and component wrappers (PascalCase, type is Plugin or Component)
				// are rendered under "Other Components"; everything else is a plain variable.
				if (member.displayName.match(/^[A-Z]/) && member.variableTypeExcerpt?.text?.match(/\bPlugin\b|\bComponent\b/)) {
					components.push(member)
				} else {
					variables.push(member)
				}
				break
			case 'Enum':
				enums.push(member)
				break
		}
	}

	// Generate sections
	if (componentExports.length > 0) {
		markdown += renderComponentDocs(componentExports, normalizedProjectName)
	}

	if (components.length > 0) {
		markdown += `## Other Components\n\n`
		components.forEach(component => {
			markdown += `### ${component.displayName}\n\n`
			markdown += `\`\`\`typescript\n`
			markdown += `export { ${component.displayName} }\n`
			markdown += `\`\`\`\n\n`
		})
	}

	if (functions.length > 0) {
		markdown += `## Functions\n\n`
		functions.forEach(func => {
			markdown += `### ${func.displayName}\n\n`

			// Function description from TSDoc comments
			const funcDoc = extractTSDocSummary(func.tsdocComment)
			if (funcDoc) {
				markdown += `${funcDoc}\n\n`
			}

			// Add signature
			if (func.excerpt) {
				markdown += `**Signature:**\n\n`
				markdown += `\`\`\`typescript\n`
				markdown += `${func.getExcerptWithModifiers()}\n`
				markdown += `\`\`\`\n\n`
			}

			// Add parameters if any
			if (func.parameters && func.parameters.length > 0) {
				markdown += `**Parameters:**\n\n`
				markdown += `| Parameter | Type | Description |\n`
				markdown += `|-----------|------|-------------|\n`

				// Parse @param descriptions from the function's TSDoc comment
				const paramDescriptions = parseParamDescriptions(func.tsdocComment)

				func.parameters.forEach(param => {
					// Try to get description from parsed @param tags, fall back to param's tsdocComment
					const description = paramDescriptions[param.name] || extractTSDocSummary(param.tsdocComment, true) || ''
					const normalizedType = normalizeTypeForTable(param.parameterTypeExcerpt.text)
					markdown += `| ${param.name} | \`${normalizedType}\` | ${description} |\n`
				})
				markdown += `\n`
			}
		})
	}

	if (interfaces.length > 0) {
		markdown += `## Interfaces\n\n`
		interfaces.forEach(iface => {
			markdown += `### ${iface.displayName}\n\n`

			// Interface description from TSDoc comments
			const interfaceDoc = extractTSDocSummary(iface.tsdocComment)
			if (interfaceDoc) {
				markdown += `${interfaceDoc}\n\n`
			}

			// Add interface signature
			markdown += `**Definition:**\n\n`
			markdown += `\`\`\`typescript\n`
			markdown += `export interface ${iface.displayName} {\n`

			// Add properties
			if (iface.members) {
				iface.members.forEach(member => {
					if (member.kind === 'PropertySignature') {
						const optional = member.isOptional ? '?' : ''
						markdown += `  ${member.displayName}${optional}: ${member.propertyTypeExcerpt.text};\n`
					} else if (member.kind === 'MethodSignature') {
						markdown += `  ${member.displayName}(${
							member.parameters?.map(p => `${p.name}: ${p.parameterTypeExcerpt.text}`).join(', ') || ''
						}): ${member.returnTypeExcerpt.text};\n`
					}
				})
			}

			markdown += `}\n`
			markdown += `\`\`\`\n\n`

			// Add property descriptions if available
			if (iface.members && iface.members.some(m => m.kind === 'PropertySignature')) {
				markdown += `**Properties:**\n\n`
				markdown += `| Property | Type | Description |\n`
				markdown += `|----------|------|-------------|\n`
				iface.members.forEach(member => {
					if (member.kind === 'PropertySignature') {
						const description = extractTSDocSummary(member.tsdocComment, true) || ''
						const optional = member.isOptional ? '?' : ''
						const normalizedType = normalizeTypeForTable(member.propertyTypeExcerpt.text)
						markdown += `| ${member.displayName}${optional} | \`${normalizedType}\` | ${description} |\n`
					}
				})
				markdown += `\n`
			}
		})
	}

	if (types.length > 0) {
		markdown += `## Type Aliases\n\n`
		types.forEach(type => {
			markdown += `### ${type.displayName}\n\n`

			// Type alias description from TSDoc comments
			const typeDoc = extractTSDocSummary(type.tsdocComment)
			if (typeDoc) {
				markdown += `${typeDoc}\n\n`
			}

			markdown += `**Definition:**\n\n`
			markdown += `\`\`\`typescript\n`
			markdown += `export type ${type.displayName} = ${type.typeExcerpt.text};\n`
			markdown += `\`\`\`\n\n`
		})
	}

	if (classes.length > 0) {
		markdown += `## Classes\n\n`
		classes.forEach(cls => {
			markdown += `### ${cls.displayName}\n\n`

			// Class description from TSDoc comments
			const clsDoc = extractTSDocSummary(cls.tsdocComment)
			if (clsDoc) {
				markdown += `${clsDoc}\n\n`
			}

			// Add constructor if available
			const constructor = cls.members.find(m => m.kind === 'Constructor')
			if (constructor) {
				markdown += `**Constructor:**\n\n`
				markdown += `\`\`\`typescript\n`
				markdown += `new ${cls.displayName}(${
					constructor.parameters?.map(p => `${p.name}: ${p.parameterTypeExcerpt.text}`).join(', ') || ''
				})\n`
				markdown += `\`\`\`\n\n`

				// Add parameter descriptions if constructor has parameters
				if (constructor.parameters && constructor.parameters.length > 0) {
					// Parse @param descriptions from the constructor's TSDoc comment
					const paramDescriptions = parseParamDescriptions(constructor.tsdocComment)

					// Only show parameter table if we have descriptions
					const hasDescriptions = constructor.parameters.some(
						p => paramDescriptions[p.name] || extractTSDocSummary(p.tsdocComment, true)
					)

					if (hasDescriptions) {
						markdown += `**Parameters:**\n\n`
						markdown += `| Parameter | Type | Description |\n`
						markdown += `|-----------|------|-------------|\n`

						constructor.parameters.forEach(param => {
							// Try to get description from parsed @param tags, fall back to param's tsdocComment
							const description = paramDescriptions[param.name] || extractTSDocSummary(param.tsdocComment, true) || ''
							const normalizedType = normalizeTypeForTable(param.parameterTypeExcerpt.text)
							markdown += `| ${param.name} | \`${normalizedType}\` | ${description} |\n`
						})
						markdown += `\n`
					}
				}
			}

			// Add methods and properties
			const methods = cls.members.filter(m => m.kind === 'Method')
			const properties = cls.members.filter(m => m.kind === 'Property')

			if (properties.length > 0) {
				markdown += `**Properties:**\n\n`
				markdown += `| Property | Type | Description |\n`
				markdown += `|----------|------|-------------|\n`
				properties.forEach(prop => {
					const description = extractTSDocSummary(prop.tsdocComment, true) || ''
					const normalizedType = normalizeTypeForTable(prop.propertyTypeExcerpt.text)
					markdown += `| ${prop.displayName} | \`${normalizedType}\` | ${description} |\n`
				})
				markdown += `\n`
			}

			if (methods.length > 0) {
				markdown += `**Methods:**\n\n`
				methods.forEach(method => {
					markdown += `#### ${method.displayName}\n\n`

					// Method description from TSDoc comments
					const methodDoc = extractTSDocSummary(method.tsdocComment)
					if (methodDoc) {
						markdown += `${methodDoc}\n\n`
					}

					markdown += `\`\`\`typescript\n`
					markdown += `${method.displayName}(${
						method.parameters?.map(p => `${p.name}: ${p.parameterTypeExcerpt.text}`).join(', ') || ''
					}): ${method.returnTypeExcerpt.text}\n`
					markdown += `\`\`\`\n\n`

					// Add parameter descriptions if method has parameters
					if (method.parameters && method.parameters.length > 0) {
						// Parse @param descriptions from the method's TSDoc comment
						const paramDescriptions = parseParamDescriptions(method.tsdocComment)

						// Only show parameter table if we have descriptions
						const hasDescriptions = method.parameters.some(
							p => paramDescriptions[p.name] || extractTSDocSummary(p.tsdocComment, true)
						)

						if (hasDescriptions) {
							markdown += `**Parameters:**\n\n`
							markdown += `| Parameter | Type | Description |\n`
							markdown += `|-----------|------|-------------|\n`

							method.parameters.forEach(param => {
								// Try to get description from parsed @param tags, fall back to param's tsdocComment
								const description = paramDescriptions[param.name] || extractTSDocSummary(param.tsdocComment, true) || ''
								const normalizedType = normalizeTypeForTable(param.parameterTypeExcerpt.text)
								markdown += `| ${param.name} | \`${normalizedType}\` | ${description} |\n`
							})
							markdown += `\n`
						}
					}
				})
			}
		})
	}

	if (variables.length > 0) {
		markdown += `## Variables\n\n`
		variables.forEach(variable => {
			markdown += `### ${variable.displayName}\n\n`

			// Variable description from TSDoc comments
			const varDoc = extractTSDocSummary(variable.tsdocComment)
			if (varDoc) {
				markdown += `${varDoc}\n\n`
			}

			markdown += `**Type:**\n\n`
			markdown += `\`\`\`typescript\n`
			markdown += `export const ${variable.displayName}: ${variable.variableTypeExcerpt.text}\n`
			markdown += `\`\`\`\n\n`
		})
	}

	if (enums.length > 0) {
		markdown += `## Enums\n\n`
		enums.forEach(enumItem => {
			markdown += `### ${enumItem.displayName}\n\n`

			// Enum description from TSDoc comments
			const enumDoc = extractTSDocSummary(enumItem.tsdocComment)
			if (enumDoc) {
				markdown += `${enumDoc}\n\n`
			}

			markdown += `**Members:**\n\n`
			markdown += `\`\`\`typescript\n`
			markdown += `export enum ${enumItem.displayName} {\n`
			enumItem.members.forEach(member => {
				markdown += `  ${member.displayName} = ${member.initializerExcerpt?.text || ''},\n`
			})
			markdown += `}\n`
			markdown += `\`\`\`\n\n`
		})
	}

	// Anything the entry point exports that no section above rendered is declared in another package
	// and has no member in this one's doc model. Computed last, against what was actually written, so
	// a name cannot fall between two sections.
	const documented = new Set([
		...componentExports.map(component => component.name),
		...[...components, ...functions, ...interfaces, ...types, ...variables, ...enums, ...classes].map(
			member => member.displayName
		),
	])
	const reExports = [...readEntrySurface(join(rootDir, projectName)).names]
		.filter(([name]) => !documented.has(name))
		.map(([name, from]) => ({ name, from }))
	if (reExports.length > 0) {
		markdown += renderReExports(reExports)
	}

	// Write the consolidated documentation
	writeFileSync(outputPath, markdown, 'utf8')

	// Sits beside the API Extractor report and is covered by the same `git diff --exit-code` gate, so
	// a changed prop type or a dropped emit surfaces on the pull request that causes it. The
	// Extractor report cannot show that: it renders a component as `typeof __VLS_export`.
	if (componentExports.length > 0) {
		writeFileSync(componentReportPath, renderComponentReport(componentExports, normalizedProjectName), 'utf8')
	}

	// One line, because `vp run` already prints which package is running this and the counts are
	// only ever read when one looks wrong. Anything abnormal above still prints in full.
	const tally = [
		[componentExports.length, 'components'],
		[components.length, 'other'],
		[functions.length, 'functions'],
		[interfaces.length, 'interfaces'],
		[types.length, 'types'],
		[classes.length, 'classes'],
		[variables.length, 'variables'],
		[enums.length, 'enums'],
	]
		.filter(([n]) => n > 0)
		.map(([n, label]) => `${n} ${label}`)
		.join(', ')
	console.log(`${displayName} api.md: ${tally || 'no documented exports'}`)
} catch (error) {
	console.error(`❌ Error consolidating ${projectName} documentation:`, error.message)
	process.exit(1)
}
