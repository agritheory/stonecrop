<template>
	<div class="column-filter">
		<input
			v-if="resolvedFilterType === 'text'"
			v-model="filterValue"
			type="text"
			class="filter-input"
			@input="updateFilter(filterValue)" />

		<input
			v-else-if="resolvedFilterType === 'number'"
			v-model="filterValue"
			type="number"
			class="filter-input"
			@input="updateFilter(filterValue)" />

		<label v-else-if="resolvedFilterType === 'checkbox'" class="checkbox-filter">
			<input v-model="filterValue" type="checkbox" class="filter-checkbox" @change="updateFilter(filterValue)" />
			<span>{{ column.label }}</span>
		</label>

		<select
			v-else-if="resolvedFilterType === 'select'"
			v-model="filterValue"
			class="filter-select"
			@change="updateFilter(filterValue)">
			<option value="">All</option>
			<option v-for="option in getSelectOptions(column)" :key="option.value || option" :value="option.value || option">
				{{ option.label || option }}
			</option>
		</select>

		<input
			v-else-if="resolvedFilterType === 'date'"
			v-model="filterValue"
			type="date"
			class="filter-input"
			@change="updateFilter(filterValue)" />

		<div v-else-if="resolvedFilterType === 'dateRange'" class="date-range-filter">
			<input
				v-model="dateFilter.startValue"
				type="date"
				class="filter-input"
				@change="updateDateRangeFilter('start', dateFilter.startValue)" />
			<span class="date-separator">-</span>
			<input
				v-model="dateFilter.endValue"
				type="date"
				class="filter-input"
				@change="updateDateRangeFilter('end', dateFilter.endValue)" />
		</div>

		<component
			:is="column.filterComponent"
			v-else-if="resolvedFilterType === 'component' && column.filterComponent"
			:value="filterValue"
			:column="column"
			:col-index="colIndex"
			:store="store"
			@update:value="updateFilter($event)" />

		<button v-if="hasActiveFilter" class="clear-btn" title="Clear" @click="clearFilter">×</button>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

import { createTableStore } from '../stores/table'
import { resolveFilterType } from '../resolveFilterType'
import type { TableColumn } from '../types'

const { column, colIndex, store } = defineProps<{
	column: TableColumn
	colIndex: number
	store: ReturnType<typeof createTableStore>
}>()

const filterValue = ref<any>('')
const dateFilter = reactive({
	startValue: '',
	endValue: '',
})

const resolvedFilterType = computed(() => resolveFilterType(column))

const getSelectOptions = (col: TableColumn): any[] => {
	if (col.filterOptions) return col.filterOptions

	// Auto-generate options from data
	const uniqueValues = new Set<any>()
	store.rows.forEach(row => {
		const value = row[col.name]
		if (value !== null && value !== undefined && value !== '') {
			uniqueValues.add(value)
		}
	})

	return Array.from(uniqueValues).map(value => ({
		value: value,
		label: String(value),
	}))
}

const hasActiveFilter = computed(() => {
	return !!(filterValue.value || dateFilter.startValue || dateFilter.endValue)
})

// Filter actions
const updateFilter = (value: any) => {
	if (!value && resolvedFilterType.value !== 'checkbox') {
		store.clearFilter(colIndex)
		filterValue.value = ''
	} else {
		filterValue.value = value
		store.setFilter(colIndex, { value })
	}
}

const updateDateRangeFilter = (rangeType: 'start' | 'end', value: any) => {
	if (rangeType === 'start') {
		dateFilter.startValue = value
	} else {
		dateFilter.endValue = value
	}

	if (!dateFilter.startValue && !dateFilter.endValue) {
		store.clearFilter(colIndex)
	} else {
		store.setFilter(colIndex, {
			value: null,
			startValue: dateFilter.startValue,
			endValue: dateFilter.endValue,
		})
	}
}

const clearFilter = () => {
	filterValue.value = ''
	dateFilter.startValue = ''
	dateFilter.endValue = ''
	store.clearFilter(colIndex)
}
</script>

<style scoped>
.column-filter {
	display: flex;
	align-items: center;
	gap: 0.25rem;
	width: 100%;
}

.filter-input,
.filter-select {
	background-color: var(--sc-form-background) !important;
	padding: 0.15rem 0.2rem;
	border: 1px solid var(--sc-form-border);
	border-radius: 3px;
	font-size: 0.875rem;
	color: var(--sc-cell-text-color);
	width: 100%;
	box-sizing: border-box;
}

.filter-input:focus,
.filter-select:focus {
	outline: none;
	border-color: var(--sc-input-active-border-color);
}

.checkbox-filter {
	display: flex;
	align-items: center;
	gap: 0.25rem;
	font-size: 0.875rem;
	color: var(--sc-cell-text-color);
	cursor: pointer;
}

.filter-checkbox {
	margin: 0;
}

.date-range-filter {
	display: flex;
	gap: 0.25rem;
	align-items: center;
	width: 100%;
}

.date-range-filter .filter-input {
	flex: 1;
	min-width: 0;
}

.date-separator {
	color: var(--sc-gray-50);
	font-weight: 500;
	padding: 0 0.25rem;
	flex-shrink: 0;
}

.clear-btn {
	background: var(--sc-gray-10);
	border: 1px solid var(--sc-form-border);
	border-radius: 3px;
	color: var(--sc-gray-70);
	cursor: pointer;
	font-size: 1rem;
	padding: 0.15rem 0.4rem;
	line-height: 1;
	flex-shrink: 0;
}
</style>
