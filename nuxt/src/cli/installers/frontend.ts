/**
 * Frontend module installer
 * Installs @stonecrop/nuxt and configures nuxt.config.ts
 */

import { existsSync } from 'node:fs'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { join, dirname } from 'pathe'
import { fileURLToPath } from 'node:url'
import consola from 'consola'
import { addDependencies } from '../utils/package'
import { updateNuxtConfig } from '../utils/config'

const __dirname = dirname(fileURLToPath(import.meta.url))

export interface FrontendInstallerOptions {
	cwd: string
}

/**
 * Install the @stonecrop/nuxt frontend module
 */
export async function installFrontend(options: FrontendInstallerOptions): Promise<boolean> {
	const { cwd } = options

	consola.start('Installing @stonecrop/nuxt frontend module...')

	try {
		// Add @stonecrop/nuxt and its required peer dependencies
		// These packages are imported by the Nuxt module and need to be available at runtime
		await addDependencies(cwd, {
			'@stonecrop/nuxt': 'latest',
			'@stonecrop/aform': 'latest',
			'@stonecrop/atable': 'latest',
			'@stonecrop/stonecrop': 'latest',
			'@stonecrop/node-editor': 'latest',
			'@stonecrop/schema': 'latest',
			'@stonecrop/utilities': 'latest',
			'@stonecrop/desktop': 'latest',
			pinia: '^3.0.4',
		})

		// Update nuxt.config.ts with module and Nitro configuration
		await updateNuxtConfig(cwd, {
			module: "'@stonecrop/nuxt'",
			moduleOptions: {
				key: 'stonecrop',
				// routeStrategy registers a single catch-all route that handles both list and
				// detail views; import.meta.url refers to nuxt.config.ts at the project root.
				value: `{
		docbuilder: false,
		routeStrategy: () => [
			{
				name: 'stonecrop-catch-all',
				path: '/:pathMatch(.*)*',
				file: new URL('./app/pages/index.vue', import.meta.url).pathname,
			},
		],
	}`,
			},
			// Add Nitro configuration to handle CSS imports in Stonecrop packages
			// This is required because the packages use vite-plugin-lib-inject-css which adds
			// CSS imports to the JavaScript bundles. Node.js ESM loader doesn't understand .css files,
			// so we need Nitro to bundle these packages (allowing Vite to process the CSS)
			nitroConfig: {
				externalsInline: [
					'@stonecrop/aform',
					'@stonecrop/atable',
					'@stonecrop/stonecrop',
					'@stonecrop/node-editor',
					'@stonecrop/utilities',
					'@stonecrop/desktop',
				],
			},
			css: ["'@stonecrop/desktop/styles'"],
		})

		// Scaffold app/composables/useDoctypes.ts, app/composables/useRouteAdapter.ts,
		// app/plugins/stonecrop.client.ts, app/pages/index.vue, and fix app/app.vue
		await scaffoldAppFiles(cwd)

		consola.success('@stonecrop/nuxt installed successfully')
		consola.info('Added Nitro configuration for CSS handling')
		return true
	} catch (error) {
		consola.error('Failed to install @stonecrop/nuxt:', error)
		return false
	}
}

/**
 * Scaffold the app directory with Stonecrop client wiring and page component
 */
async function scaffoldAppFiles(cwd: string): Promise<void> {
	const appDir = join(cwd, 'app')
	const composablesDir = join(appDir, 'composables')
	const pluginsDir = join(appDir, 'plugins')
	const pagesDir = join(appDir, 'pages')

	for (const dir of [appDir, composablesDir, pluginsDir, pagesDir]) {
		if (!existsSync(dir)) {
			await mkdir(dir, { recursive: true })
		}
	}

	// Replace nuxi's default app.vue (which renders <NuxtWelcome /> and disables routing)
	// with one that renders <NuxtPage /> so Stonecrop's registered routes are reachable.
	const appVuePath = join(appDir, 'app.vue')
	if (existsSync(appVuePath)) {
		const existing = await readFile(appVuePath, 'utf-8')
		if (existing.includes('NuxtWelcome')) {
			await writeFile(appVuePath, '<template>\n  <NuxtPage />\n</template>\n', 'utf-8')
			consola.info('Updated app/app.vue to use <NuxtPage />')
		}
	}

	const useDoctypesPath = join(composablesDir, 'useDoctypes.ts')
	if (!existsSync(useDoctypesPath)) {
		await writeFile(useDoctypesPath, await loadTemplate('useDoctypes.ts'), 'utf-8')
		consola.info('Created app/composables/useDoctypes.ts')
	} else {
		consola.info('app/composables/useDoctypes.ts already exists, skipping')
	}

	const useRouteAdapterPath = join(composablesDir, 'useRouteAdapter.ts')
	if (!existsSync(useRouteAdapterPath)) {
		await writeFile(useRouteAdapterPath, await loadTemplate('useRouteAdapter.ts'), 'utf-8')
		consola.info('Created app/composables/useRouteAdapter.ts')
	} else {
		consola.info('app/composables/useRouteAdapter.ts already exists, skipping')
	}

	const clientPluginPath = join(pluginsDir, 'stonecrop.client.ts')
	if (!existsSync(clientPluginPath)) {
		await writeFile(clientPluginPath, await loadTemplate('stonecrop.client.ts'), 'utf-8')
		consola.info('Created app/plugins/stonecrop.client.ts')
	} else {
		consola.info('app/plugins/stonecrop.client.ts already exists, skipping')
	}

	const indexPagePath = join(pagesDir, 'index.vue')
	if (!existsSync(indexPagePath)) {
		await writeFile(indexPagePath, await loadTemplate('index.vue'), 'utf-8')
		consola.info('Created app/pages/index.vue')
	} else {
		consola.info('app/pages/index.vue already exists, skipping')
	}
}

async function loadTemplate(filename: string): Promise<string> {
	const templatePath = join(__dirname, '..', '..', '..', 'templates', filename)
	if (existsSync(templatePath)) {
		return readFile(templatePath, 'utf-8')
	}
	return getInlineTemplate(filename)
}

function getInlineTemplate(filename: string): string {
	const templates: Record<string, string> = {
		'useDoctypes.ts': `import type { DoctypeRef } from '@stonecrop/schema'
import type { DoctypeConfig } from '@stonecrop/stonecrop'
import { useNuxtApp } from 'nuxt/app'

const modules = import.meta.glob<DoctypeConfig>('../../doctypes/*.json', { eager: true, import: 'default' })

export const doctypeMap = new Map<string, DoctypeConfig>()
for (const [path, doctype] of Object.entries(modules)) {
	const filename = path.split('/').pop()!.replace('.json', '')
	const slug = filename.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[\\s_]+/g, '-').toLowerCase()
	doctypeMap.set(slug, doctype)
}

export function useDoctypeConfig(slug: string): DoctypeConfig | undefined {
	return doctypeMap.get(slug)
}

export async function fetchDoctypeRecords(doctype: DoctypeRef, limit = 200): Promise<{ data: any[]; count: number }> {
	const { $stonecropClient } = useNuxtApp()
	const data = (await $stonecropClient.getRecords({ name: doctype.name }, { limit })) as any[]
	return { data, count: data.length }
}

export async function fetchDoctypeRecord(doctype: DoctypeRef, recordId: string): Promise<Record<string, unknown> | null> {
	const { $stonecropClient } = useNuxtApp()
	const result = await $stonecropClient.getRecord(doctype, recordId)
	return result.record
}

export interface ActionResult { success: boolean; data?: unknown; error?: string | null }

export async function runDoctypeAction(doctype: DoctypeConfig, action: string, args: { id: string; data?: Record<string, unknown> }): Promise<ActionResult> {
	const { $stonecropClient } = useNuxtApp()
	return $stonecropClient.runAction({ name: doctype.name }, action, [args])
}
`,
		'useRouteAdapter.ts': `import type { NavigationTarget, RouteAdapter } from '@stonecrop/desktop'
import { navigateTo, useRoute } from 'nuxt/app'

export function useRouteAdapter(): RouteAdapter {
	const route = useRoute()
	const getCurrentDoctype = (): string => {
		const pathMatch = route.params.pathMatch as string[] | undefined
		if (pathMatch && pathMatch.length > 0) return pathMatch[0] ?? ''
		return ''
	}
	const getCurrentRecordId = (): string => {
		const pathMatch = route.params.pathMatch as string[] | undefined
		if (pathMatch && pathMatch.length > 1) return pathMatch[1] ?? ''
		return ''
	}
	const getCurrentView = (): 'doctypes' | 'records' | 'record' => {
		if (!getCurrentDoctype()) return 'doctypes'
		if (getCurrentRecordId()) return 'record'
		return 'records'
	}
	const navigate = async (target: NavigationTarget): Promise<void> => {
		if (target.view === 'doctypes') await navigateTo('/')
		else if (target.view === 'records' && target.doctype) await navigateTo(\`/\${target.doctype}\`)
		else if (target.view === 'record' && target.doctype && target.recordId) await navigateTo(\`/\${target.doctype}/\${target.recordId}\`)
	}
	return { getCurrentDoctype, getCurrentRecordId, getCurrentView, navigate }
}
`,
		'stonecrop.client.ts': `import { StonecropClient } from '@stonecrop/graphql-client'
import { Doctype } from '@stonecrop/stonecrop'
import { doctypeMap } from '~/composables/useDoctypes'
export default defineNuxtPlugin({
	name: 'stonecrop-client',
	dependsOn: ['stonecrop'],
	setup() {
		const { registerClient, registerMeta, registry } = useStonecropSetup()
		const client = new StonecropClient({ endpoint: '/graphql/' })
		registerClient(client)
		registerMeta(async routeContext => {
			const slug = routeContext.segments?.[0] ?? ''
			if (!slug) throw new Error(\`Cannot resolve doctype from route context\`)
			const localDoctype = doctypeMap.get(slug)
			if (!localDoctype) throw new Error(\`No doctype registered for slug: \${slug}\`)
			return Doctype.fromObject(localDoctype)
		})
		for (const [slug, doctypeConfig] of doctypeMap.entries()) {
			const doctypeInstance = Doctype.fromObject(doctypeConfig)
			registry!.addDoctype(doctypeInstance)
			if (slug !== doctypeInstance.slug) registry!.registry[slug] = doctypeInstance
		}
		return { provide: { stonecropClient: client } }
	},
})
`,
		'index.vue': `<template>
	<ClientOnly>
		<Desktop
			:available-doctypes="availableDoctypes"
			:route-adapter="routeAdapter"
			@action="handleAction"
			@load-records="handleLoadRecords"
			@load-record="handleLoadRecord" />
		<template #fallback><div class="sc-loading"><p>Loading...</p></div></template>
	</ClientOnly>
</template>

<script setup lang="ts">
import { Desktop, type ActionEventPayload, type LoadRecordEventPayload, type LoadRecordsEventPayload } from '@stonecrop/desktop'
import { useStonecrop } from '@stonecrop/stonecrop'
import { useRouteAdapter } from '~/composables/useRouteAdapter'
import { doctypeMap, useDoctypeConfig, fetchDoctypeRecords, fetchDoctypeRecord, runDoctypeAction } from '~/composables/useDoctypes'

const routeAdapter = useRouteAdapter()
const { stonecrop } = useStonecrop()
const availableDoctypes = computed(() => Array.from(doctypeMap.keys()))

async function handleLoadRecords(payload: LoadRecordsEventPayload) {
	const doctypeConfig = useDoctypeConfig(payload.doctype)
	if (!doctypeConfig || !stonecrop.value) return
	try {
		const { data } = await fetchDoctypeRecords({ name: doctypeConfig.name })
		for (const record of data) {
			const recordId = record.id as string
			if (recordId) stonecrop.value.addRecord(payload.doctype, recordId, record)
		}
	} catch (error) { console.error('Failed to load records:', error) }
}

async function handleLoadRecord(payload: LoadRecordEventPayload) {
	if (!stonecrop.value || payload.recordId.startsWith('new-')) return
	const doctypeConfig = useDoctypeConfig(payload.doctype)
	if (!doctypeConfig) return
	try {
		const record = await fetchDoctypeRecord({ name: doctypeConfig.name }, payload.recordId)
		if (record) stonecrop.value.addRecord(payload.doctype, payload.recordId, record)
	} catch (error) { console.error('Failed to load record:', error) }
}

async function handleAction(payload: ActionEventPayload) {
	const doctypeConfig = useDoctypeConfig(payload.doctype)
	if (!doctypeConfig) return
	try {
		const result = await runDoctypeAction(doctypeConfig, payload.name, { id: payload.recordId, data: payload.data })
		if (result.success && result.data && stonecrop.value && payload.recordId)
			stonecrop.value.addRecord(payload.doctype, payload.recordId, result.data as Record<string, unknown>)
		if (!result.success) console.error('Action failed:', result.error)
	} catch (error) { console.error('Action error:', error) }
}
</script>

<style>.sc-loading { display: flex; align-items: center; justify-content: center; min-height: 50vh; color: #666; }</style>
`,
	}
	return templates[filename] || ''
}
