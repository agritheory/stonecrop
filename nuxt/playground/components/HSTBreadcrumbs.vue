<template>
	<nav class="breadcrumbs" aria-label="Breadcrumb navigation">
		<span v-for="(crumb, index) in breadcrumbs" :key="index" class="breadcrumb-item">
			<NuxtLink v-if="crumb.link" :to="crumb.link" class="breadcrumb-link">
				{{ crumb.label }}
			</NuxtLink>
			<span v-else class="breadcrumb-current">{{ crumb.label }}</span>
			<span v-if="index < breadcrumbs.length - 1" class="breadcrumb-separator">/</span>
		</span>
	</nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface BreadcrumbItem {
	label: string
	link?: string
}

interface Props {
	path?: string
	doctype?: string
	recordId?: string
	store?: any
}

const props = defineProps<Props>()

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
	const crumbs: BreadcrumbItem[] = [{ label: 'Home', link: '/' }]

	if (props.path && props.store) {
		// Use HST getBreadcrumbs if available
		try {
			const node = props.store.getNode(props.path)
			if (node && typeof node.getBreadcrumbs === 'function') {
				const hstCrumbs = node.getBreadcrumbs()
				return [
					{ label: 'Home', link: '/' },
					...hstCrumbs.map((crumb: any, index: number) => ({
						label: crumb.label || crumb.key,
						link: index < hstCrumbs.length - 1 ? crumb.link : undefined,
					})),
				]
			}
		} catch {
			// Fall through to manual breadcrumb construction
		}
	}

	// Manual breadcrumb construction
	if (props.doctype) {
		const doctypeLabel = props.doctype
			.split('-')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ')

		const doctypeMap: Record<string, string> = {
			user: 'users',
			role: 'roles',
			'role-profile': 'role-profiles',
			'ability-rule': 'ability-rules',
			doctype: 'doctypes',
		}

		const listPath = doctypeMap[props.doctype] || props.doctype + 's'
		crumbs.push({
			label: `${doctypeLabel}s`,
			link: `/${listPath}`,
		})

		if (props.recordId && props.recordId !== 'new') {
			crumbs.push({
				label: props.recordId === 'new' ? 'New' : `${doctypeLabel} ${props.recordId}`,
			})
		} else if (props.recordId === 'new') {
			crumbs.push({
				label: `New ${doctypeLabel}`,
			})
		}
	}

	return crumbs
})
</script>

<style scoped>
.breadcrumbs {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	margin-bottom: 1rem;
	font-size: 0.875rem;
	color: #6b7280;
	flex-wrap: wrap;
}

.breadcrumb-item {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.breadcrumb-link {
	color: #3b82f6;
	text-decoration: none;
	font-weight: 500;
	transition: color 0.2s ease;
}

.breadcrumb-link:hover {
	color: #2563eb;
	text-decoration: underline;
}

.breadcrumb-current {
	color: #1f2937;
	font-weight: 600;
}

.breadcrumb-separator {
	color: #d1d5db;
	font-weight: 400;
	user-select: none;
}
</style>
