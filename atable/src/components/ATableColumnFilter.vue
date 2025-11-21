<template>
	<div class="column-filter">
		<input
			v-if="getFilterType(column) === 'text'"
			v-model="filterValue"
			type="text"
			class="filter-input"
			@input="updateFilter('text', filterValue)" />

		<input
			v-else-if="getFilterType(column) === 'number'"
			v-model="filterValue"
			type="number"
			class="filter-input"
			@input="updateFilter('number', filterValue)" />

		<label v-else-if="getFilterType(column) === 'checkbox'" class="checkbox-filter">
			<input
				v-model="filterValue"
				type="checkbox"
				class="filter-checkbox"
				@change="updateFilter('checkbox', filterValue)" />
			<span>{{ column.label }}</span>
		</label>

		<select
			v-else-if="getFilterType(column) === 'select'"
			v-model="filterValue"
			class="filter-select"
			@change="updateFilter('select', filterValue)">
			<option value="">All</option>
			<option v-for="option in getSelectOptions(column)" :key="option.value || option" :value="option.value || option">
				{{ option.label || option }}
			</option>
		</select>

		<input
			v-else-if="getFilterType(column) === 'date'"
			v-model="filterValue"
			type="date"
			class="filter-input"
			@input="updateFilter('date', filterValue)" />

		<div v-else-if="getFilterType(column) === 'dateRange'" class="date-range-filter">
			<input
				v-model="filterStartValue"
				type="date"
				class="filter-input"
				@input="updateDateRangeFilter('start', filterStartValue)" />
			<span class="clear-btn"> - </span>
			<input
				v-model="filterEndValue"
				type="date"
				class="filter-input"
				@input="updateDateRangeFilter('end', filterEndValue)" />
		</div>

		<component
			v-else-if="getFilterType(column) === 'component' && column.filterComponent"
			:is="column.filterComponent"
			:value="filterValue"
			:column="column"
			:colIndex="colIndex"
			:store="store"
			@update:value="updateFilter('component', $event)" />

		<button v-if="hasActiveFilter" @click="clearFilter" class="clear-btn" title="Clear">×</button>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { createTableStore } from '../stores/table'
import type { TableColumn } from '../types'

const { column, colIndex, store } = defineProps<{
	column: TableColumn
	colIndex: number
	store: ReturnType<typeof createTableStore>
}>()

const filterValue = ref<any>('')
const filterStartValue = ref<any>('')
const filterEndValue = ref<any>('')

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

const hasActiveFilter = computed(() => {
	return !!(filterValue.value || filterStartValue.value || filterEndValue.value)
})

// Filter actions
const updateFilter = (type: string, value: any) => {
	if (!value && type !== 'checkbox') {
		store.clearFilter(colIndex)
		filterValue.value = ''
	} else {
		filterValue.value = value
		store.setFilter(colIndex, { type, value })
	}
}

const updateDateRangeFilter = (rangeType: 'start' | 'end', value: any) => {
	if (rangeType === 'start') {
		filterStartValue.value = value
	} else {
		filterEndValue.value = value
	}

	const startValue = filterStartValue.value
	const endValue = filterEndValue.value

	if (!startValue && !endValue) {
		store.clearFilter(colIndex)
	} else {
		store.setFilter(colIndex, {
			type: 'dateRange',
			value: null,
			startValue,
			endValue,
		})
	}
}

const clearFilter = () => {
	filterValue.value = ''
	filterStartValue.value = ''
	filterEndValue.value = ''
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
	color: var(--sc-text-color);
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
	width: 100%;
}

.date-range-filter .filter-input {
	flex: 1;
	min-width: 0;
}

.clear-btn {
	background: none;
	border: none;
	color: var(--sc-primary-text-color);
	cursor: pointer;
	font-size: 1.25rem;
	padding: 0 0.25rem;
	line-height: 1;
	flex-shrink: 0;
}
</style>
