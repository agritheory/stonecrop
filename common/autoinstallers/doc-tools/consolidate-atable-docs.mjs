#!/usr/bin/env node

import { ApiModel } from '@microsoft/api-extractor-model'
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load the raw JSON to access docComment fields (for future enhancement)
let rawApiData = null

// Helper function to normalize type text for markdown tables
function normalizeTypeForTable(typeText) {
	if (!typeText) return ''

	// Replace newlines and excessive whitespace with single spaces
	// Escape pipe characters to prevent breaking markdown table structure
	return typeText.replace(/\n/g, ' ').replace(/\s+/g, ' ').replace(/\|/g, '\\|').trim()
} // Path to the API model file for ATable (relative to monorepo root from autoinstaller)
const rootDir = join(__dirname, '../../..')
const apiModelPath = join(rootDir, 'atable/temp/atable.api.json')
const apiMarkdownPath = join(rootDir, 'common/reviews/api/atable.api.md')
const outputPath = join(rootDir, 'docs/atable/README.md')

try {
	console.log('Loading API model from:', apiModelPath)

	// Load the raw API data to access docComment fields (for future enhancement)
	rawApiData = JSON.parse(readFileSync(apiModelPath, 'utf-8'))

	// Load the API model
	const apiModel = new ApiModel()
	const apiPackage = apiModel.loadPackage(apiModelPath)

	console.log('Package loaded:', apiPackage.displayName)

	// Also read the API markdown to extract component exports
	const apiMarkdown = readFileSync(apiMarkdownPath, 'utf8')

	// Extract Vue component exports from the markdown
	const componentExports = []
	const exportMatches = apiMarkdown.match(/export \{ ([A-Z][a-zA-Z]*) \}/g)
	if (exportMatches) {
		exportMatches.forEach(match => {
			const componentName = match.match(/export \{ ([A-Z][a-zA-Z]*) \}/)[1]
			if (componentName.startsWith('A')) {
				componentExports.push({
					name: componentName,
					displayName: componentName,
				})
			}
		})
	}

	// Start building the consolidated documentation
	let markdown = `# ATable Documentation\n\n`
	markdown += `> This documentation is automatically generated from the TypeScript API.\n\n`

	// Package description (for future enhancement)
	// const packageDoc = extractDocComment(findDocComment(apiPackage.canonicalReference));
	// if (packageDoc) {
	//   markdown += `## Overview\n\n`;
	//   markdown += `${packageDoc}\n\n`;
	// }

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
				// Check if this is likely a Vue component (exported with capital letter)
				if (member.displayName.match(/^A[A-Z]/)) {
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
		markdown += `<details>\n<summary><h2>Vue Components</h2></summary>\n\n`
		componentExports.forEach(component => {
			markdown += `### ${component.displayName}\n\n`
			markdown += `Vue component exported from @stonecrop/atable.\n\n`
			markdown += `\`\`\`typescript\n`
			markdown += `import { ${component.displayName} } from '@stonecrop/atable'\n`
			markdown += `\`\`\`\n\n`
		})
		markdown += `</details>\n\n`
	}

	if (components.length > 0) {
		markdown += `<details>\n<summary><h2>Other Components</h2></summary>\n\n`
		components.forEach(component => {
			markdown += `### ${component.displayName}\n\n`
			// Component description (for future enhancement)
			// const componentDoc = extractDocComment(findDocComment(component.canonicalReference));
			// if (componentDoc) {
			//   markdown += `${componentDoc}\n\n`;
			// }
			markdown += `\`\`\`typescript\n`
			markdown += `export { ${component.displayName} }\n`
			markdown += `\`\`\`\n\n`
		})
		markdown += `</details>\n\n`
	}

	if (functions.length > 0) {
		markdown += `<details>\n<summary><h2>Functions</h2></summary>\n\n`
		functions.forEach(func => {
			markdown += `### ${func.displayName}\n\n`
			// Function description (for future enhancement)
			// const funcDoc = extractDocComment(findDocComment(func.canonicalReference));
			// if (funcDoc) {
			//   markdown += `${funcDoc}\n\n`;
			// }

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
				func.parameters.forEach(param => {
					const description = '' // TODO: Extract parameter descriptions from JSDoc comments
					const normalizedType = normalizeTypeForTable(param.parameterTypeExcerpt.text)
					markdown += `| ${param.name} | \`${normalizedType}\` | ${description} |\n`
				})
				markdown += `\n`
			}
		})
		markdown += `</details>\n\n`
	}

	if (interfaces.length > 0) {
		markdown += `<details>\n<summary><h2>Interfaces</h2></summary>\n\n`
		interfaces.forEach(iface => {
			markdown += `### ${iface.displayName}\n\n`
			// Interface description (for future enhancement)
			// const ifaceDoc = extractDocComment(findDocComment(iface.canonicalReference));
			// if (ifaceDoc) {
			//   markdown += `${ifaceDoc}\n\n`;
			// }

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
						const description = '' // TODO: Extract descriptions from JSDoc comments
						const optional = member.isOptional ? '?' : ''
						const normalizedType = normalizeTypeForTable(member.propertyTypeExcerpt.text)
						markdown += `| ${member.displayName}${optional} | \`${normalizedType}\` | ${description} |\n`
					}
				})
				markdown += `\n`
			}
		})
		markdown += `</details>\n\n`
	}

	if (types.length > 0) {
		markdown += `<details>\n<summary><h2>Type Aliases</h2></summary>\n\n`
		types.forEach(type => {
			markdown += `### ${type.displayName}\n\n`
			// Type alias description (for future enhancement)
			// const typeDoc = extractDocComment(findDocComment(type.canonicalReference));
			// if (typeDoc) {
			//   markdown += `${typeDoc}\n\n`;
			// }

			markdown += `**Definition:**\n\n`
			markdown += `\`\`\`typescript\n`
			markdown += `export type ${type.displayName} = ${type.typeExcerpt.text};\n`
			markdown += `\`\`\`\n\n`
		})
		markdown += `</details>\n\n`
	}

	if (classes.length > 0) {
		markdown += `<details>\n<summary><h2>Classes</h2></summary>\n\n`
		classes.forEach(cls => {
			markdown += `### ${cls.displayName}\n\n`
			// Class description (for future enhancement)
			// const clsDoc = extractDocComment(findDocComment(cls.canonicalReference));
			// if (clsDoc) {
			//   markdown += `${clsDoc}\n\n`;
			// }

			// Add constructor if available
			const constructor = cls.members.find(m => m.kind === 'Constructor')
			if (constructor) {
				markdown += `**Constructor:**\n\n`
				markdown += `\`\`\`typescript\n`
				markdown += `new ${cls.displayName}(${
					constructor.parameters?.map(p => `${p.name}: ${p.parameterTypeExcerpt.text}`).join(', ') || ''
				})\n`
				markdown += `\`\`\`\n\n`
			}

			// Add methods and properties
			const methods = cls.members.filter(m => m.kind === 'Method')
			const properties = cls.members.filter(m => m.kind === 'Property')

			if (properties.length > 0) {
				markdown += `**Properties:**\n\n`
				markdown += `| Property | Type | Description |\n`
				markdown += `|----------|------|-------------|\n`
				properties.forEach(prop => {
					const description = '' // TODO: Extract property descriptions from JSDoc comments
					const normalizedType = normalizeTypeForTable(prop.propertyTypeExcerpt.text)
					markdown += `| ${prop.displayName} | \`${normalizedType}\` | ${description} |\n`
				})
				markdown += `\n`
			}

			if (methods.length > 0) {
				markdown += `**Methods:**\n\n`
				methods.forEach(method => {
					markdown += `#### ${method.displayName}\n\n`
					// Method description (for future enhancement)
					// const methodDoc = extractDocComment(findDocComment(method.canonicalReference));
					// if (methodDoc) {
					//   markdown += `${methodDoc}\n\n`;
					// }

					markdown += `\`\`\`typescript\n`
					markdown += `${method.displayName}(${
						method.parameters?.map(p => `${p.name}: ${p.parameterTypeExcerpt.text}`).join(', ') || ''
					}): ${method.returnTypeExcerpt.text}\n`
					markdown += `\`\`\`\n\n`
				})
			}
		})
		markdown += `</details>\n\n`
	}

	if (variables.length > 0) {
		markdown += `<details>\n<summary><h2>Variables</h2></summary>\n\n`
		variables.forEach(variable => {
			markdown += `### ${variable.displayName}\n\n`
			// Variable description (for future enhancement)
			// const varDoc = extractDocComment(findDocComment(variable.canonicalReference));
			// if (varDoc) {
			//   markdown += `${varDoc}\n\n`;
			// }

			markdown += `**Type:**\n\n`
			markdown += `\`\`\`typescript\n`
			markdown += `export const ${variable.displayName}: ${variable.variableTypeExcerpt.text}\n`
			markdown += `\`\`\`\n\n`
		})
		markdown += `</details>\n\n`
	}

	if (enums.length > 0) {
		markdown += `<details>\n<summary><h2>Enums</h2></summary>\n\n`
		enums.forEach(enumItem => {
			markdown += `### ${enumItem.displayName}\n\n`
			// Enum item description (for future enhancement)
			// const enumItemDoc = extractDocComment(findDocComment(enumItem.canonicalReference));
			// if (enumItemDoc) {
			//   markdown += `${enumItemDoc}\n\n`;
			// }      markdown += `**Members:**\n\n`;
			markdown += `\`\`\`typescript\n`
			markdown += `export enum ${enumItem.displayName} {\n`
			enumItem.members.forEach(member => {
				markdown += `  ${member.displayName} = ${member.initializerExcerpt?.text || ''},\n`
			})
			markdown += `}\n`
			markdown += `\`\`\`\n\n`
		})
		markdown += `</details>\n\n`
	}

	// Write the consolidated documentation
	writeFileSync(outputPath, markdown, 'utf8')

	console.log(`\n✅ Consolidated ATable documentation written to: ${outputPath}`)
	console.log(`📊 Documentation includes:`)
	console.log(`   - ${componentExports.length} Vue components`)
	console.log(`   - ${components.length} other components`)
	console.log(`   - ${functions.length} functions`)
	console.log(`   - ${interfaces.length} interfaces`)
	console.log(`   - ${types.length} type aliases`)
	console.log(`   - ${classes.length} classes`)
	console.log(`   - ${variables.length} variables`)
	console.log(`   - ${enums.length} enums`)
} catch (error) {
	console.error('❌ Error consolidating documentation:', error.message)
	process.exit(1)
}
