<template>
	<div v-if="filterableColumns.length > 0" class="atable-filters">
		<div class="filters-container">
			<div v-for="column in filterableColumns" :key="column.name" class="filter-item">
				<input
					v-if="getFilterType(column) === 'text'"
					v-model="filterValues[column.originalIndex]"
					type="text"
					class="filter-input"
					:placeholder="column.label || ''"
					@input="updateFilter(column.originalIndex, 'text', filterValues[column.originalIndex])" />

				<input
					v-else-if="getFilterType(column) === 'number'"
					v-model="filterValues[column.originalIndex]"
					type="number"
					class="filter-input"
					:placeholder="column.label || 'Número...'"
					@input="updateFilter(column.originalIndex, 'number', filterValues[column.originalIndex])" />

				<label v-else-if="getFilterType(column) === 'checkbox'" class="checkbox-filter">
					<input
						v-model="filterValues[column.originalIndex]"
						type="checkbox"
						class="filter-checkbox"
						@change="updateFilter(column.originalIndex, 'checkbox', filterValues[column.originalIndex])" />
					<span>{{ column.label }}</span>
				</label>

				<select
					v-else-if="getFilterType(column) === 'select'"
					v-model="filterValues[column.originalIndex]"
					class="filter-select"
					@change="updateFilter(column.originalIndex, 'select', filterValues[column.originalIndex])">
					<option value="">{{ column.label || 'Seleccionar...' }}</option>
					<option
						v-for="option in getSelectOptions(column)"
						:key="option.value || option"
						:value="option.value || option">
						{{ option.label || option }}
					</option>
				</select>

				<input
					v-else-if="getFilterType(column) === 'date'"
					v-model="filterValues[column.originalIndex]"
					type="date"
					class="filter-input"
					@input="updateFilter(column.originalIndex, 'date', filterValues[column.originalIndex])" />

				<div v-else-if="getFilterType(column) === 'dateRange'" class="date-range-filter">
					<input
						v-model="filterStartValues[column.originalIndex]"
						type="date"
						class="filter-input"
						@input="updateDateRangeFilter(column.originalIndex, 'start', filterStartValues[column.originalIndex])" />
					<input
						v-model="filterEndValues[column.originalIndex]"
						type="date"
						class="filter-input"
						@input="updateDateRangeFilter(column.originalIndex, 'end', filterEndValues[column.originalIndex])" />
				</div>

				<component
					v-else-if="getFilterType(column) === 'component' && column.filterComponent"
					:is="column.filterComponent"
					:value="filterValues[column.originalIndex]"
					:column="column"
					:colIndex="column.originalIndex"
					:store="store"
					@update:value="updateFilter(column.originalIndex, 'component', $event)" />

				<button
					v-if="hasActiveFilter(column.originalIndex)"
					@click="clearColumnFilter(column.originalIndex)"
					class="clear-btn"
					title="Clear">
					×
				</button>
			</div>

			<button v-if="hasAnyActiveFilter" @click="clearAllFilters">Clear All</button>
		</div>

		<!-- Custom filters slot -->
		<slot :store="store" :columns="columns" />
	</div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { createTableStore } from '../stores/table'
import type { TableColumn } from '../types'

const { columns, store } = defineProps<{
	columns: TableColumn[]
	store: ReturnType<typeof createTableStore>
}>()

const filterValues = reactive<Record<number, any>>({})
const filterStartValues = reactive<Record<number, any>>({})
const filterEndValues = reactive<Record<number, any>>({})

// Get only filterable columns with their original indices
const filterableColumns = computed(() => {
	return columns
		.filter(column => column.filterable)
		.map(column => {
			const originalIndex = columns.findIndex(col => col.name === column.name)
			return { ...column, originalIndex }
		})
})

const getFilterType = (column: TableColumn): string => column.filterType || 'text'

const getSelectOptions = (column: TableColumn): any[] => {
	if (column.filterOptions) return column.filterOptions

	// Auto-generate options from data
	const uniqueValues = new Set<any>()
	store.rows.forEach(row => {
		const value = row[column.name]
		if (value !== null && value !== undefined && value !== '') {
			uniqueValues.add(value)
		}
	})

	return Array.from(uniqueValues).map(value => ({
		value: value,
		label: String(value),
	}))
}

const hasActiveFilter = (originalIndex: number): boolean => {
	return !!(filterValues[originalIndex] || filterStartValues[originalIndex] || filterEndValues[originalIndex])
}

const hasAnyActiveFilter = computed(() => {
	return (
		Object.keys(filterValues).some(key => filterValues[parseInt(key)]) ||
		Object.keys(filterStartValues).some(key => filterStartValues[parseInt(key)]) ||
		Object.keys(filterEndValues).some(key => filterEndValues[parseInt(key)])
	)
})

// Filter actions
const updateFilter = (originalIndex: number, type: string, value: any) => {
	if (!value && type !== 'checkbox') {
		store.clearFilter(originalIndex)
		delete filterValues[originalIndex]
	} else {
		filterValues[originalIndex] = value
		store.setFilter(originalIndex, { type, value })
	}
}

const updateDateRangeFilter = (originalIndex: number, rangeType: 'start' | 'end', value: any) => {
	if (rangeType === 'start') {
		filterStartValues[originalIndex] = value
	} else {
		filterEndValues[originalIndex] = value
	}

	const startValue = filterStartValues[originalIndex]
	const endValue = filterEndValues[originalIndex]

	if (!startValue && !endValue) {
		store.clearFilter(originalIndex)
	} else {
		store.setFilter(originalIndex, {
			type: 'dateRange',
			value: null,
			startValue,
			endValue,
		})
	}
}

const clearColumnFilter = (originalIndex: number) => {
	delete filterValues[originalIndex]
	delete filterStartValues[originalIndex]
	delete filterEndValues[originalIndex]
	store.clearFilter(originalIndex)
}

const clearAllFilters = () => {
	Object.keys(filterValues).forEach(key => delete filterValues[parseInt(key)])
	Object.keys(filterStartValues).forEach(key => delete filterStartValues[parseInt(key)])
	Object.keys(filterEndValues).forEach(key => delete filterEndValues[parseInt(key)])
	store.clearAllFilters()
}
</script>

<style scoped>
.atable-filters {
	padding: 0.5rem;
	border-bottom: 1px solid var(--sc-row-border-color);
}

.filters-container {
	display: flex;
	gap: 0.5rem;
	align-items: center;
	flex-wrap: wrap;
}

.filter-item {
	display: flex;
	align-items: center;
	gap: 0.25rem;
}

.filter-input,
.filter-select {
	padding: 0.25rem 0.5rem;
	border: 1px solid var(--sc-form-border);
	border-radius: 3px;
	font-size: 0.875rem;
	background-color: var(--sc-background-color);
	color: var(--sc-text-color);
	min-width: 120px;
}

.filter-input:focus,
.filter-select:focus {
	outline: none;
	border-color: var(--sc-primary-color);
}

.checkbox-filter {
	display: flex;
	align-items: center;
	gap: 0.25rem;
	font-size: 0.875rem;
	color: var(--sc-text-color);
	cursor: pointer;
}

.filter-checkbox {
	margin: 0;
}

.date-range-filter {
	display: flex;
	gap: 0.25rem;
	align-items: center;
}
</style>
