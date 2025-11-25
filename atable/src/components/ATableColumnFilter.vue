<template>
	<div class="column-filter">
		<input
			v-if="(column.filterType || 'text') === 'text'"
			v-model="filterValue"
			type="text"
			class="filter-input"
			@input="updateFilter('text', filterValue)" />

		<input
			v-else-if="column.filterType === 'number'"
			v-model="filterValue"
			type="number"
			class="filter-input"
			@input="updateFilter('number', filterValue)" />

		<label v-else-if="column.filterType === 'checkbox'" class="checkbox-filter">
			<input
				v-model="filterValue"
				type="checkbox"
				class="filter-checkbox"
				@change="updateFilter('checkbox', filterValue)" />
			<span>{{ column.label }}</span>
		</label>

		<select
			v-else-if="column.filterType === 'select'"
			v-model="filterValue"
			class="filter-select"
			@change="updateFilter('select', filterValue)">
			<option value="">All</option>
			<option v-for="option in getSelectOptions(column)" :key="option.value || option" :value="option.value || option">
				{{ option.label || option }}
			</option>
		</select>

		<input
			v-else-if="column.filterType === 'date'"
			v-model="filterValue"
			type="date"
			class="filter-input"
			@input="updateFilter('date', filterValue)" />

		<div v-else-if="column.filterType === 'dateRange'" class="date-range-filter">
			<input
				v-model="dateFilter.startValue"
				type="date"
				class="filter-input"
				@input="updateDateRangeFilter('start', dateFilter.startValue)" />
			<span class="clear-btn"> - </span>
			<input
				v-model="dateFilter.endValue"
				type="date"
				class="filter-input"
				@input="updateDateRangeFilter('end', dateFilter.endValue)" />
		</div>

		<component
			v-else-if="column.filterType === 'component' && column.filterComponent"
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
import { ref, reactive, computed } from 'vue'
import { createTableStore } from '../stores/table'
import type { TableColumn } from '../types'

const { column, colIndex, store } = defineProps<{
	column: TableColumn
	colIndex: number
	store: ReturnType<typeof createTableStore>
}>()

const filterValue = ref<any>('')
const dateFilter = reactive({
	startValue: '' as string,
	endValue: '' as string,
})

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
	return !!(filterValue.value || dateFilter.startValue || dateFilter.endValue)
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
		dateFilter.startValue = value
	} else {
		dateFilter.endValue = value
	}

	if (!dateFilter.startValue && !dateFilter.endValue) {
		store.clearFilter(colIndex)
	} else {
		store.setFilter(colIndex, {
			type: 'dateRange',
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
