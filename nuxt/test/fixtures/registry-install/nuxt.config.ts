import NuxtStonecrop from '../../../src/module'

// An app that installs the module from the registry gets its runtime files under node_modules,
// where Nuxt never auto-imports. This fixture loads them from source, so it turns auto-imports
// off for them to match: a runtime file that calls a composable without importing it fails here.
export default defineNuxtConfig({
	modules: [NuxtStonecrop],
	pages: true,
	imports: {
		transform: {
			exclude: [/[\\/]src[\\/]runtime[\\/]/],
		},
	},
	stonecrop: {
		docbuilder: true,
		docbuilderPublic: true,
	},
})
